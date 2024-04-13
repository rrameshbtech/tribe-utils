import { create } from "zustand"
import { MemberSlice, createMemberSlice } from "./member"
import { ExpenseSlice, createExpenseSlice } from "./expense"
import { immer } from "zustand/middleware/immer"

export const useRootStore = create<MemberSlice & ExpenseSlice>()(immer((...a) => ({
  ...createMemberSlice(...a),
  ...createExpenseSlice(...a),
})))

export * from "./expense"
export * from "./member"
export * from "./icon"