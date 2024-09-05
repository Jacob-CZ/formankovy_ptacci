import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { is } from "date-fns/locale"
import { revalidateAuthStatus } from "app/supbase/auth"

/**
 * Model description here for TypeScript hints.
 */
export const AuthModel = types
  .model("Auth")
  .props({
    isSignedIn: types.optional(types.boolean, false),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    async revalidateAuthStatus() {
      this.signIn(await revalidateAuthStatus())
    },
    signIn(e:boolean){
      self.isSignedIn = e
    }
  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Auth extends Instance<typeof AuthModel> {}
export interface AuthSnapshotOut extends SnapshotOut<typeof AuthModel> {}
export interface AuthSnapshotIn extends SnapshotIn<typeof AuthModel> {}
export const createAuthDefaultModel = () => types.optional(AuthModel, {})
