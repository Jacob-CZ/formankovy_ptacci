import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { set } from "date-fns"

/**
 * Model description here for TypeScript hints.
 */
export const RecordingModel = types
  .model("Recording")
  .props({
    imageUri: types.maybeNull(types.string),
    imageBase64: types.maybeNull(types.string),
    soundUri: types.maybeNull(types.string),
    soundBase64:types.maybeNull(types.string)
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setSoundUri(soundUri: string) {
      self.soundUri = soundUri
    },
    setImageUri(imageUri: string) { 
      self.imageUri = imageUri
    },
    setSoundBase64(soundBase64: string) {
      self.soundBase64 = soundBase64
    },
    setImageBase64(imageBase64: string) {
      self.imageBase64 = imageBase64
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Recording extends Instance<typeof RecordingModel> {}
export interface RecordingSnapshotOut extends SnapshotOut<typeof RecordingModel> {}
export interface RecordingSnapshotIn extends SnapshotIn<typeof RecordingModel> {}
export const createRecordingDefaultModel = () => types.optional(RecordingModel, {})
