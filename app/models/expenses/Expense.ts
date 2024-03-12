import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"
import { convertToMutable } from 'app/utils/typeConverters'

const expenseCategories = [
  "Mobile",
  "Grocery",
  "Clothes",
  "Entertainment",
  "Travel",
  "Books",
  "Education",
  "Food",
  "Others",
  "Medical",
  "Household",
  "Personal Care",
  "Gifts",
  "Fuel",
  "Electronics",
  "Rent",
  "Insurance",
  "Donation",
  "Taxes",
  "Loan",
  "Bank Charges",
  "Taxes",
  "Salary",
  "Interest"
] as const
export type ExpenseCategories = (typeof expenseCategories)[number]

const paymentModes = ["Cash", "Wallet", "UPI", "BankTransfer", "Credit", "BankCard"] as const
export type PaymentModes = (typeof paymentModes)[number]

const expenseSources = ["Self", "OCR", "SMS"] as const
export type ExpenseSources = (typeof expenseSources)[number]
/**
 * Model description here for TypeScript hints.
 */
export const ExpenseModel = types
  .model("Expense")
  .props({
    id: types.optional(types.identifier, () => Math.random().toString(36).substring(2, 9)),
    category: types.optional(types.enumeration("ExpenseCategory", convertToMutable(expenseCategories)), "Others"),
    amount: types.optional(types.number, 55.23),
    date: types.optional(types.Date, () => new Date()),
    spender: types.optional(types.string, "test"),
    source: types.optional(types.enumeration("ExpenseSource", convertToMutable(expenseSources)), "Self"),
    mode: types.optional(types.enumeration("PaymentMode", convertToMutable(paymentModes)), "Cash"),
    location: types.optional(types.string, "Coimbatore"),
    payee: types.optional(types.string, "Local Store"),
    notes: types.optional(types.string, ""),
    createdAt: types.optional(types.Date, () => new Date()),
    updatedAt: types.optional(types.Date, () => new Date()),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Expense extends Instance<typeof ExpenseModel> {}
export interface ExpenseSnapshotOut extends SnapshotOut<typeof ExpenseModel> {}
export interface ExpenseSnapshotIn extends SnapshotIn<typeof ExpenseModel> {}

// export const createExpenseDefaultModel = () => types.optional(ExpenseModel, {})