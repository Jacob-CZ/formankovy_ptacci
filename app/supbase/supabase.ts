import { createClient } from "@supabase/supabase-js"
import { Database } from "./database.types"
import AsyncStorage from "@react-native-async-storage/async-storage"
const supabase = createClient<Database>(process.env.EXPO_PUBLIC_SUPABASE_URL as string, process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,  {auth: {
    storage: AsyncStorage,
    detectSessionInUrl: false,
  }},)
export { supabase }
