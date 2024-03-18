import { StateCreator } from "zustand"
import { Icon } from "./icon"
import { startOfDay, startOfMonth, startOfWeek, sub } from "date-fns"

export type ExpenseCategory =
  | "Mobile"
  | "Grocery"
  | "Clothes"
  | "Entertainment"
  | "Travel"
  | "Books"
  | "Education"
  | "Food"
  | "Others"
  | "Medical"
  | "Household"
  | "Personal Care"
  | "Gifts"
  | "Fuel"
  | "Electronics"
  | "Rent"
  | "Insurance"
  | "Donation"
  | "Taxes"
  | "Loan"
  | "Bank Charges"
  | "Taxes"
  | "Salary"
  | "Interest"
export type ExpenseSource = "Self" | "OCR" | "SMS"

export interface PaymentMode {
  id: string
  name: string
  icon: Icon
  createdAt: Date
  updatedAt: Date
}

export interface Expense {
  id: string
  category: ExpenseCategory
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

export interface ExpenseSlice {
  expenses: Record<string, Expense>
  expenseFilter: FilterDuration
  searchTerm: string
  addExpense: (expense: Expense) => void
  setSearchTerm: (searchTerm: string) => void
  toggleExpenseFilter: () => void
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

  addExpense: (expense: Expense) =>
    set((state) => ({ expenses: { ...state.expenses, [expense.id]: expense } })),
  toggleExpenseFilter: () => {
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
  },
  setSearchTerm: (searchTerm: string) => set({ searchTerm }),
})

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
    category: "Mobile",
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
    category: "Clothes",
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
