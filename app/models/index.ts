import { create } from "zustand"
import { UserSlice, createUserSlice } from "./user"
import { ExpenseSlice, createExpenseSlice } from "./expense"

export const useRootStore = create<UserSlice & ExpenseSlice>((...a) => ({
  ...createUserSlice(...a),
  ...createExpenseSlice(...a),
}))

export * from "./expense"
export * from "./user"