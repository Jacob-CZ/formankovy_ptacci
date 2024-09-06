import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { MessageStoreModel } from "./MessageStore"
import { AuthModel } from "./Auth"
import { RecordingModel } from "./Recording"
import { UserModel } from "./User"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  messageStore: types.optional(MessageStoreModel, {} as any),
  auth: types.optional(AuthModel, {}),
  recording: types.optional(RecordingModel, {}),
  user: types.optional(UserModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
