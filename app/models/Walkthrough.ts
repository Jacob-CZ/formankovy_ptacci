import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"

const test ={
  a:1,
  b:2
}
export type WalkthroughNames = keyof typeof test;
/**
 * Model description here for TypeScript hints.
 */
const tipOrder = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"]
export const WalkthroughModel = types
  .model("Walkthrough")
  .props({
    currentTip: types.optional(types.frozen<WalkthroughNames>(), "a"),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    setWakthroughTip(tip: WalkthroughNames) {
      self.currentTip = tip
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Walkthrough extends Instance<typeof WalkthroughModel> {}
export interface WalkthroughSnapshotOut extends SnapshotOut<typeof WalkthroughModel> {}
export interface WalkthroughSnapshotIn extends SnapshotIn<typeof WalkthroughModel> {}
export const createWalkthroughDefaultModel = () => types.optional(WalkthroughModel, {})
