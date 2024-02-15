import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Expense, ExpenseModel } from "./Expense"
import { startOfDay, startOfMonth, startOfWeek, sub } from "date-fns"
import { convertToMutable } from "app/utils/typeConverters"

export const EXPENSE_FILTER_DURATIONS = ["day", "week", "month"] as const
export type ExpenseFilterDurations = (typeof EXPENSE_FILTER_DURATIONS)[number]
/**
 * ExpenseStore model
 * Base model for the expense store to manage the expenses & filter the expenses based on the duration
 */
export const ExpenseStoreModel = types
  .model("ExpenseStore")
  .props({
    expenses: types.array(ExpenseModel),
    durationFilter: types.optional(
      types.enumeration("ExpenseFilterDurations", convertToMutable(EXPENSE_FILTER_DURATIONS)),
      "month",
    ),
    searchTerm: types.optional(types.string, ""),
  })
  .actions(withSetPropAction)
  .views((self) => ({
    get visibleExpenses() {
      // Todo - refactor to make it more FP style, search only when there is a search term and fetch searchable term from expense model
      const searchTerm = self.searchTerm.toLowerCase()
      const startDateByDuration = getFilterStartDate()

      return self.expenses.filter(byDurationAndSearchTerm).sort(byDateDescending)

      function getFilterStartDate(): Date {
        const startOfIntervalMapper: Record<ExpenseFilterDurations, (date: Date | number) => Date> =
          {
            day: startOfDay,
            week: startOfWeek,
            month: startOfMonth,
          }
        return startOfIntervalMapper[self.durationFilter as ExpenseFilterDurations](Date.now())
      }
      function byDateDescending(current: Expense, next: Expense) {
        return next.date.getTime() - current.date.getTime()
      }
      function byDurationAndSearchTerm(expense: Expense) {
        return (
          expense.date >= startDateByDuration &&
          (
            // expense.spender.toLowerCase().includes(searchTerm) ||
            expense.payee.toLowerCase().includes(searchTerm) ||
            expense.category.toLowerCase().includes(searchTerm) ||
            expense.mode.toLowerCase().includes(searchTerm) ||
            expense.location.toLowerCase().includes(searchTerm) ||
            expense.notes.toLowerCase().includes(searchTerm))
        )
      }
    },
  }))
  .actions((store) => ({
    setDurationFilter(duration: ExpenseFilterDurations) {
      store.setProp("durationFilter", duration)
    },
    setSearchTerm(searchTerm: string) {
      store.setProp("searchTerm", searchTerm)
    },
    addExpense(expense: Expense) {
      store.expenses.push(expense)
    },
    init() {
      if (store.expenses.length > 0) {
        store.setProp("expenses", [])
      }
      store.setProp(
        "expenses",
        store.expenses.concat([
          {
            id: "1",
            amount: 2300.4,
            date: new Date("2024-02-19 23:59:59+5:30"),
            spender: "Ramesh Ramalingam",
            mode: "Cash",
            category: "Grocery",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "2",
            amount: 300,
            date: new Date("2024-02-20 00:00:00+5:30"),
            spender: "Ramesh Ramalingam",
            mode: "UPI",
            category: "Mobile",
            payee: "Airtel",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "3",
            amount: 150,
            date: new Date("2024-02-20 00:00:01+5:30"),
            spender: "Ramesh Ramalingam",
            mode: "UPI",
            payee: "Amazon",
            category: "Entertainment",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "4",
            amount: 550,
            date: sub(Date.now(), { days: 1, seconds: 1000 }),
            spender: "Ramesh Ramalingam",
            mode: "Cash",
            payee: "Store",
            category: "Clothes",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "5",
            amount: 300,
            date: sub(Date.now(), { days: 2, minutes: 100 }),
            spender: "Ramesh Ramalingam",
            mode: "Credit",
            payee: "Petrol Bunk",
            category: "Travel",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "6",
            amount: 15000,
            date: sub(Date.now(), { days: 7, seconds: 100 }),
            spender: "Ramesh Ramalingam",
            mode: "BankTransfer",
            payee: "School",
            category: "Education",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "7",
            amount: 10,
            date: sub(Date.now(), { days: 10, seconds: 100 }),
            spender: "Ramesh Ramalingam",
            mode: "UPI",
            location: "Chennai",
            category: "Food",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "8",
            amount: 350,
            date: sub(Date.now(), { days: 8, seconds: 100 }),
            spender: "Ramesh Ramalingam",
            mode: "BankCard",
            payee: "Book Store",
            category: "Books",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "9",
            amount: 200,
            date: sub(Date.now(), { days: 9, seconds: 100 }),
            spender: "Ramesh Ramalingam",
            mode: "UPI",
            payee: "Netflix",
            category: "Entertainment",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          {
            id: "10",
            amount: 300,
            date: sub(Date.now(), { seconds: 1000 }),
            spender: "Ramesh Ramalingam",
            mode: "Wallet",
            payee: "Flipkart",
            category: "Entertainment",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ]),
      )
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface ExpenseStore extends Instance<typeof ExpenseStoreModel> {}
export interface ExpenseStoreSnapshotOut extends SnapshotOut<typeof ExpenseStoreModel> {}
export interface ExpenseStoreSnapshotIn extends SnapshotIn<typeof ExpenseStoreModel> {}
export const createExpenseStoreDefaultModel = () => types.optional(ExpenseStoreModel, {})
