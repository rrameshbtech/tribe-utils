import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "../helpers/withSetPropAction"

/**
 * UserStore model
 * Base model for the user store to manage the logged user and user related data
 */
export const UserStoreModel = types
  .model("UserStore")
  .props({
    currentUserId: types.optional(types.identifier, "1"),
    currentUserName: types.optional(types.string, "Unkonwn"),
  })
  .actions(withSetPropAction)
  .views(() => ({
  }))
  .actions((store) => ({
    init() {
      store.setProp("currentUserName", "Ramesh R")
    },
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface UserStore extends Instance<typeof UserStoreModel> {}
export interface UserStoreSnapshotOut extends SnapshotOut<typeof UserStoreModel> {}
export interface UserStoreSnapshotIn extends SnapshotIn<typeof UserStoreModel> {}
export const createUserStoreDefaultModel = () => types.optional(UserStoreModel, {})
