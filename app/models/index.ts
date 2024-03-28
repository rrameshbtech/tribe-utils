import { create } from "zustand"
import { UserSlice, createUserSlice } from "./user"
import { ExpenseSlice, createExpenseSlice } from "./expense"
import { immer } from "zustand/middleware/immer"

export const useRootStore = create<UserSlice & ExpenseSlice>()(immer((...a) => ({
  ...createUserSlice(...a),
  ...createExpenseSlice(...a),
})))

export * from "./expense"
export * from "./user"