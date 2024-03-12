import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ExpenseStoreModel } from "./expenses/ExpenseStore"
import { UserStoreModel } from './users/UserStore'

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  expenseStore: types.optional(ExpenseStoreModel, {} as any),
  userStore: types.optional(UserStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
