import { create } from "zustand"
import { MemberSlice, createMemberSlice } from "./member"
import { ExpenseSlice, createExpenseSlice } from "./expense"
import { SettingsSlice, createSettingsSlice } from "./settings"
import { immer } from "zustand/middleware/immer"

export const useRootStore = create<MemberSlice & ExpenseSlice & SettingsSlice>()(
  immer((...a) => ({
    ...createMemberSlice(...a),
    ...createExpenseSlice(...a),
    ...createSettingsSlice(...a),
  })),
)

export * from "./expense"
export * from "./member"
export * from "./icon"
