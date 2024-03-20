import { StateCreator } from "zustand"
import { Icon } from "./icon"
import { startOfDay, startOfMonth, startOfWeek, sub } from "date-fns"

export type ExpenseSource = "Self" | "OCR" | "SMS"

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

export interface Expense {
  id: string
  category: string
  amount: number
  date: Date
  spender: string
  source: ExpenseSource
  mode: string
  location?: string
  payee: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export type FilterDuration = "Day" | "Week" | "Month"
export type ExpenseSummaryCardMode = "card" | "details"

export interface ExpenseSlice {
  expenses: Record<string, Expense>
  expenseFilter: FilterDuration
  searchTerm: string
  expenseSummaryCardMode: ExpenseSummaryCardMode
  addExpense: (expense: Expense) => void
  setSearchTerm: (searchTerm: string) => void
  setExpenseSummaryCardMode: (mode: ExpenseSummaryCardMode) => void
  toggleExpenseFilter: () => void

  paymentModes: Record<string, PaymentMode>
  expenseCategories: Record<string, ExpenseCategory>
  payees: string[]
}

export const initExpense = (): Expense => ({
  id: Math.random().toString(36).substring(2, 9),
  category: "Others",
  amount: 0,
  date: new Date(),
  spender: "Ramesh Ramalingam",
  source: "Self",
  mode: "Cash",
  location: "",
  payee: "Local Store",
  notes: "",
  createdAt: new Date(),
  updatedAt: new Date(),
})

export const createExpenseSlice: StateCreator<ExpenseSlice, [], [], ExpenseSlice> = (set) => ({
  expenses: defaultExpenses(),
  expenseFilter: "Day",
  searchTerm: "",
  expenseSummaryCardMode: "card",

  addExpense: addExpenseFn(set),
  toggleExpenseFilter: toggleExpenseFilterFn(set),
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
  setExpenseSummaryCardMode: (mode: ExpenseSummaryCardMode) => set({ expenseSummaryCardMode: mode }),

  paymentModes: defaultPaymentModes(),
  expenseCategories: defaultExpenseCategories(),
  payees: defaultPayees(),
})

type ExpenseSliceSetType = (
  partial:
    | ExpenseSlice
    | Partial<ExpenseSlice>
    | ((state: ExpenseSlice) => ExpenseSlice | Partial<ExpenseSlice>),
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
    return {
      expenseFilter: getNextDuration(state.expenseFilter),
    }
  })
}
const addExpenseFn = (set: ExpenseSliceSetType) => (expense: Expense) => {
  set((state) => {
    return { expenses: { ...state.expenses, [expense.id]: expense } }
  })
  upsertPayees(set)(expense)
}
const upsertPayees = (set: ExpenseSliceSetType) => (expense: Expense) => {
  set((state) => {
    const payees = [...new Set([...state.payees, expense.payee])]
    return { payees }
  })
}

export const getVisibleExpenses = (state: ExpenseSlice) => {
  const { expenses, expenseFilter, searchTerm } = state
  return Object.values(expenses).filter(byDuration()).filter(byTerm()).sort(decendingByDate())

  function decendingByDate(): ((a: Expense, b: Expense) => number) | undefined {
    return (prev, next) => next.date.getTime() - prev.date.getTime()
  }

  function byTerm(): (value: Expense, index: number, array: Expense[]) => unknown {
    return (expense) =>
      expense.payee.toLowerCase().includes(searchTerm) ||
      expense.category.toLowerCase().includes(searchTerm) ||
      expense.mode.toLowerCase().includes(searchTerm) ||
      expense.location?.toLowerCase().includes(searchTerm) ||
      expense.notes?.toLowerCase().includes(searchTerm)
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

export const getVisibleExpenseTotal = (state: ExpenseSlice) => {
  return getVisibleExpenses(state).reduce((acc, expense) => acc + expense.amount, 0)
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

const defaultExpenses = (): Record<string, Expense> => ({
  "1": {
    id: "1",
    amount: 2300.4,
    date: new Date("2024-02-19 23:59:59+5:30"),
    spender: "Ramesh Ramalingam",
    mode: "Cash",
    category: "Grocery",
    payee: "Local Store",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "2": {
    id: "2",
    amount: 300,
    date: new Date("2024-02-20 00:00:00+5:30"),
    spender: "Ramesh Ramalingam",
    mode: "UPI",
    category: "Communication",
    payee: "Airtel",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "3": {
    id: "3",
    amount: 150,
    date: new Date("2024-02-20 00:00:01+5:30"),
    spender: "Ramesh Ramalingam",
    mode: "UPI",
    payee: "Amazon",
    category: "Entertainment",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "4": {
    id: "4",
    amount: 550,
    date: sub(Date.now(), { days: 1, seconds: 1000 }),
    spender: "Ramesh Ramalingam",
    mode: "Cash",
    payee: "Store",
    category: "Sports",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "5": {
    id: "5",
    amount: 300,
    date: sub(Date.now(), { days: 2, minutes: 100 }),
    spender: "Ramesh Ramalingam",
    mode: "Credit",
    payee: "Petrol Bunk",
    category: "Travel",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "6": {
    id: "6",
    amount: 15000,
    date: sub(Date.now(), { days: 7, seconds: 100 }),
    spender: "Ramesh Ramalingam",
    mode: "BankTransfer",
    payee: "School",
    category: "Education",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "7": {
    id: "7",
    amount: 10,
    date: sub(Date.now(), { days: 10, seconds: 100 }),
    spender: "Ramesh Ramalingam",
    mode: "UPI",
    location: "Chennai",
    category: "Food",
    payee: "Local Store",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "8": {
    id: "8",
    amount: 350,
    date: sub(Date.now(), { days: 8, seconds: 100 }),
    spender: "Ramesh Ramalingam",
    mode: "BankCard",
    payee: "Book Store",
    category: "Books",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "9": {
    id: "9",
    amount: 200,
    date: sub(Date.now(), { days: 9, seconds: 100 }),
    spender: "Ramesh Ramalingam",
    mode: "UPI",
    payee: "Netflix",
    category: "Entertainment",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  "10": {
    id: "10",
    amount: 300,
    date: sub(Date.now(), { seconds: 1000 }),
    spender: "Ramesh Ramalingam",
    mode: "Wallet",
    payee: "Flipkart",
    category: "Entertainment",
    source: "Self",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
})
