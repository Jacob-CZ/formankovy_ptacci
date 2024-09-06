import { Instance, SnapshotIn, SnapshotOut, types } from "mobx-state-tree"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { is } from "date-fns/locale"
import { revalidateAuthStatus } from "app/supbase/auth"
import { supabase } from "app/supbase/supabase"
import { set } from "date-fns"

/**
 * Model description here for TypeScript hints.
 */
export const AuthModel = types
  .model("Auth")
  .props({
    isSignedIn: types.optional(types.boolean, false),
    user: types.optional(types.model({
      id: types.optional(types.string, ""),
      email: types.optional(types.string, ""),
      name: types.optional(types.string, ""),
      avatar: types.optional(types.string, ""),
    }), {}),
  })
  .actions(withSetPropAction)
  .views((self) => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions((self) => ({
    signIn(e:boolean){
      self.isSignedIn = e
    },
    setUser(user: any) {
        self.user = user
    },
    async revalidateAuthStatus() {
      const status = await revalidateAuthStatus()
      this.signIn(status)
      if (status) {
        this.getUserData()
      }
    },

    async getUserData () {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.log(error.message)
      } else {
        const newUser = {
          id: data.user.id,
          email: data.user.email,
        }
        this.setUser(newUser)
    }},

  })) // eslint-disable-line @typescript-eslint/no-unused-vars

export interface Auth extends Instance<typeof AuthModel> {}
export interface AuthSnapshotOut extends SnapshotOut<typeof AuthModel> {}
export interface AuthSnapshotIn extends SnapshotIn<typeof AuthModel> {}
export const createAuthDefaultModel = () => types.optional(AuthModel, {})
