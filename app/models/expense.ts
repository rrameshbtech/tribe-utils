import { StateCreator } from "zustand"
import { Icon } from "./icon"
import { format, startOfDay, startOfMonth, startOfWeek } from "date-fns"

export type ExpenseSource = "Self" | "OCR" | "SMS"
export const EXPENSE_MONTH_IDENTIFIER_FORMAT = "yyyyMM"
export interface PaymentMode {
  name: string
  aliases?: string[]
  icon: Icon
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseCategory {
  name: string
  aliases?: string[]
  icon: Icon
  createdAt: Date
  updatedAt: Date
}
export interface BasicGeoLocation {
  latitude: number
  longitude: number
}
export type ExpenseLocation = string | BasicGeoLocation

export interface Expense {
  id: string
  category: string
  amount: number
  date: Date
  spender: string
  source: ExpenseSource
  mode: string
  location?: ExpenseLocation
  payee: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseConfigs {
  captureLocation: boolean
  defaultPaymentMode: string
  defaultCategory: string
  defaultPayee: string
  defaultSpender: string
}

export type FilterDuration = "Day" | "Week" | "Month"
export type ExpenseSummaryCardMode = "card" | "details"

type Year = `${number}${number}${number}${number}`
type Month = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10" | "11" | "12"
export type MonthIdentifier = `${Year}${Month}`

export interface MonthlyExpenses {
  month: MonthIdentifier
  data: Record<string, Expense>
}

type ExpensesByMonth = {
  [month: MonthIdentifier]: MonthlyExpenses
}

export interface ExpenseSlice {
  expensesByMonth: ExpensesByMonth

  selectedMonth: MonthIdentifier
  expenseFilter: FilterDuration
  searchTerm: string
  expenseSummaryCardMode: ExpenseSummaryCardMode
  configs: ExpenseConfigs

  selectedExpenses: () => MonthlyExpenses
  expensesOf: (month: MonthIdentifier) => MonthlyExpenses
  upsertExpense: (expense: Expense) => void
  getExpense: (id: string) => Expense | undefined
  removeExpense: (id: string) => void
  setSearchTerm: (searchTerm: string) => void
  setSelectedMonth: (month: MonthIdentifier) => void
  resetSelectedMonth: () => void
  setExpenseSummaryCardMode: (mode: ExpenseSummaryCardMode) => void
  toggleExpenseFilter: () => void
  updateConfigs: (configs: Partial<ExpenseConfigs>) => void

  paymentModes: Record<string, PaymentMode>
  expenseCategories: Record<string, ExpenseCategory>
  payees: string[]
}

export const getCreateExpenseFnFor =
  (spender: string) =>
  (state: ExpenseSlice): Expense => ({
    id: Math.random().toString(36).substring(2, 9),
    category: state.configs.defaultCategory,
    amount: 0,
    date: new Date(),
    spender,
    source: "Self",
    mode: state.configs.defaultPaymentMode,
    location: "",
    payee: state.configs.defaultPayee,
    notes: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  })
export function getMonthId(date: Date) {
  return format(date, EXPENSE_MONTH_IDENTIFIER_FORMAT) as MonthIdentifier
}
export const createExpenseSlice: StateCreator<
  ExpenseSlice,
  [["zustand/immer", never]],
  [],
  ExpenseSlice
> = (set, get) => ({
  expensesByMonth: {},

  selectedMonth: getMonthId(new Date()),
  expenseFilter: "Day",
  searchTerm: "",
  expenseSummaryCardMode: "card",
  configs: {
    captureLocation: false,
    defaultPaymentMode: "Cash",
    defaultCategory: "Others",
    defaultPayee: "Local Store",
    defaultSpender: "",
  },

  selectedExpenses: () => get().expensesOf(get().selectedMonth),
  expensesOf: (month: MonthIdentifier) => {
    return get().expensesByMonth[month] ?? ({ data: {} } as MonthlyExpenses)
  },
  upsertExpense: upsertExpenseFn(set),
  getExpense: (id: string) => get().selectedExpenses().data[id],
  removeExpense: removeExpenseFn(set),
  toggleExpenseFilter: toggleExpenseFilterFn(set),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setSelectedMonth: (month: MonthIdentifier) => set({ selectedMonth: month }),
  resetSelectedMonth: () => set({ selectedMonth: getMonthId(new Date()) }),
  setExpenseSummaryCardMode: (mode: ExpenseSummaryCardMode) =>
    set({ expenseSummaryCardMode: mode }),
  updateConfigs: (configs: Partial<ExpenseConfigs>) =>
    set({ configs: { ...get().configs, ...configs } }),

  paymentModes: defaultPaymentModes(),
  expenseCategories: defaultExpenseCategories(),
  payees: defaultPayees(),
})

type ExpenseSliceSetType = (
  partial:
    | ExpenseSlice
    | Partial<ExpenseSlice>
    | ((state: ExpenseSlice) => ExpenseSlice | Partial<ExpenseSlice> | void),
  replace?: boolean | undefined,
) => void

const toggleExpenseFilterFn = (set: ExpenseSliceSetType) => () => {
  const getNextDuration = (currentDuration: FilterDuration) => {
    const toggleMap: Record<FilterDuration, FilterDuration> = {
      Day: "Week",
      Week: "Month",
      Month: "Day",
    }
    return toggleMap[currentDuration]
  }

  set((state) => {
    state.expenseFilter = getNextDuration(state.expenseFilter)
  })
}

const upsertExpenseFn = (set: ExpenseSliceSetType) => (expense: Expense) => {
  set((state) => {
    if (!state.expensesByMonth[state.selectedMonth]) {
      state.expensesByMonth[state.selectedMonth] = {
        month: state.selectedMonth,
        data: {},
      }
    }
    state.expensesByMonth[state.selectedMonth].data[expense.id] = expense
  })
  upsertPayees(set)(expense)
}
const removeExpenseFn = (set: ExpenseSliceSetType) => (id: string) => {
  set((state) => {
    const { [id]: _, ...remaingExpenses } = state.selectedExpenses().data
    state.expensesByMonth[state.selectedMonth].data = remaingExpenses
  })
}

const upsertPayees = (set: ExpenseSliceSetType) => (expense: Expense) => {
  set((state) => {
    state.payees.includes(expense.payee) || state.payees.push(expense.payee)
  })
}

export const getVisibleExpenses = (state: ExpenseSlice) => {
  const { expenseFilter, searchTerm } = state
  const currentExpenses = state.selectedExpenses().data

  return Object.values(currentExpenses)
    .filter(byDuration())
    .filter(byTerm())
    .sort(decendingByDate())

  function decendingByDate(): ((a: Expense, b: Expense) => number) | undefined {
    return (prev, next) => next.date.getTime() - new Date(prev.date).getTime()
  }

  function byTerm(): (value: Expense, index: number, array: Expense[]) => unknown {
    return (expense) =>
      expense.payee.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      expense.category.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      expense.mode.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
      expense.notes?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  }

  function byDuration(): (value: Expense, index: number, array: Expense[]) => unknown {
    return (expense) => expense.date >= filterStartDate()
  }

  function filterStartDate(): Date {
    const startOfIntervalMapper: Record<FilterDuration, (date: Date | number) => Date> = {
      Day: startOfDay,
      Week: startOfWeek,
      Month: startOfMonth,
    }
    return startOfIntervalMapper[expenseFilter](Date.now())
  }
}

export const getVisibleExpenseTotal = (state: ExpenseSlice) =>
  getVisibleExpenses(state).reduce((acc, expense) => acc + expense.amount, 0)
export interface ExpenseSummary {
  total: number
  largest?: Expense
  byCategory: Record<string, number>
  byPaymentMode: Record<string, number>
  byPayee: Record<string, number>
  byDate: Record<string, number>
}
export const getExpenseSummary =
  (month = getMonthId(new Date())) =>
  (state: ExpenseSlice): ExpenseSummary => {
    const initialSummary: ExpenseSummary = {
      total: 0,
      largest: undefined,
      byCategory: {},
      byPaymentMode: {},
      byPayee: {},
      byDate: {},
    }

    return Object.values(state.expensesOf(month).data).reduce((summary, expense) => {
      return {
        total: summary.total + expense.amount,
        largest: getLargest(expense, summary.largest),
        byCategory: addToGroup(summary.byCategory, expense.category, expense.amount),
        byPayee: addToGroup(summary.byPayee, expense.payee, expense.amount),
        byPaymentMode: addToGroup(summary.byPaymentMode, expense.mode, expense.amount),
        byDate: addToGroup(summary.byDate, expense.date.getDate().toString(), expense.amount),
      } as ExpenseSummary

      function addToGroup(
        group: Record<string, number>,
        groupName: string,
        amount: number,
      ): Record<string, number> {
        return {
          ...group,
          [groupName]: (group[groupName] ?? 0) + amount,
        }
      }
      function getLargest(prev: Expense, next?: Expense): Expense {
        return !next || prev.amount > next.amount ? prev : next
      }
    }, initialSummary)
  }

const defaultPaymentModes = (): Record<string, PaymentMode> => ({
  Cash: {
    name: "Cash",
    icon: { type: "FontAwesome", name: "money" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Wallet: {
    name: "Wallet",
    icon: { type: "image", name: "mobileWallet" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  UPI: {
    name: "UPI",
    icon: { type: "image", name: "mobilePay" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  BankTransfer: {
    name: "BankTransfer",
    icon: { type: "FontAwesome", name: "bank" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Credit: {
    name: "Credit",
    icon: { type: "image", name: "loan" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  BankCard: {
    name: "BankCard",
    icon: { type: "FontAwesome", name: "credit-card" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
})

const defaultExpenseCategories = (): Record<string, ExpenseCategory> => ({
  Grocery: {
    name: "Grocery",
    icon: { type: "FontAwesome", name: "shopping-basket" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Communication: {
    name: "Communication",
    icon: { type: "FontAwesome5", name: "phone-alt" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Entertainment: {
    name: "Entertainment",
    icon: { type: "FontAwesome", name: "film" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Books: {
    name: "Books",
    icon: { type: "Material", name: "bookshelf" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Education: {
    name: "Education",
    icon: { type: "FontAwesome5", name: "user-graduate" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Food: {
    name: "Food",
    icon: { type: "FontAwesome", name: "cutlery" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Travel: {
    name: "Travel",
    icon: { type: "FontAwesome", name: "plane" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Sports: {
    name: "Sports",
    icon: { type: "FontAwesome", name: "futbol-o" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  Others: {
    name: "Others",
    icon: { type: "initials", name: "Others" },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
})

const defaultPayees = (): string[] => [
  "Local Store",
  "Amazon",
  "Flipkart",
  "Book My Show",
  "Online Shopping",
  "Swiggy",
  "Zomato",
  "Food App",
  "School",
  "Local Cafe",
]

