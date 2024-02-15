import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { ExpenseStoreModel } from "./ExpenseStore"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  expenseStore: types.optional(ExpenseStoreModel, {} as any),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
