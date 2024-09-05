import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { AuthModel } from "./Auth"
import { RecordingModel } from "./Recording"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  auth: types.optional(AuthModel, {}),
  recording: types.optional(RecordingModel, {}),
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}
