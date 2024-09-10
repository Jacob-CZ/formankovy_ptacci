import { Instance, SnapshotOut, types, walk } from "mobx-state-tree"
import { MessageStoreModel } from "./MessageStore"
import { AuthModel } from "./Auth"
import { RecordingModel } from "./Recording"
import { UserModel } from "./User"
import { WalkthroughModel } from "./Walkthrough"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  messageStore: types.optional(MessageStoreModel, {} as any),
  auth: types.optional(AuthModel, {}),
  recording: types.optional(RecordingModel, {}),
  user: types.optional(UserModel, {}),
  walkThrough: types.optional(WalkthroughModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
