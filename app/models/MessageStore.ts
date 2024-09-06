import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { Message, MessageModel } from "./Message"

/**
 * Model description here for TypeScript hints.
 */
export const MessageStoreModel = types
  .model("MessageStore")
  .props({
    messages: types.array(MessageModel)
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    addMessage(mess:Message){
      self.messages.push(mess)
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface MessageStore extends Instance<typeof MessageStoreModel> {}
export interface MessageStoreSnapshotOut extends SnapshotOut<typeof MessageStoreModel> {}
export interface MessageStoreSnapshotIn extends SnapshotIn<typeof MessageStoreModel> {}
export const createMessageStoreDefaultModel = () => types.optional(MessageStoreModel, {})
