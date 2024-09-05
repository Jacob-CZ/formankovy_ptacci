import { supabase } from "./supabase";

async function getAuthStatus() {
  const user = await supabase.auth.getUser()
  return !!user.data.user
}
let isLoggedIn:boolean;
getAuthStatus().then((status) => {
  isLoggedIn = status
})
export async function revalidateAuthStatus() {
  isLoggedIn = await getAuthStatus()
  console.log("revalidateAuthStatus", isLoggedIn)
  return isLoggedIn
}
export { isLoggedIn }