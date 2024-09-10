import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { AppleAuthButton, Button, Input, Text, Walkthrough } from "app/components"
import { isRTL } from "../i18n"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { supabase } from "app/supbase/supabase"
import Toast from "react-native-toast-message"
import { useStores } from "app/models"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const $ContainerInsets = useSafeAreaInsetsStyle(["bottom", "top"])
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const {
    auth: { revalidateAuthStatus },
  } = useStores()
  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      })
    } else {
      revalidateAuthStatus()
      console.log(data)
    }
  }
  async function handleSignUp() {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    })
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      })
    } else {
      // revalidateAuthStatus()
      await supabase.auth.signOut()
      console.log(data)
    }
  }

  return (
    <View style={[$container, $ContainerInsets]}>
      <Text tx="welcomeScreen.login" preset="heading" style={$loginText} />
      <Input onChangeText={setEmail} placeholder="Username" placeholderTextColor={colors.tint} />
      <Input onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.tint} />
      <View style={$buttonsView}>
        <Button style={$button} text="Sign Up" onPress={handleSignUp} textStyle={$buttonText} />
        <Walkthrough name="a" onClose={() => console.log("sheest")}>
          <Button
            style={$button}
            tx="welcomeScreen.login"
            onPress={handleLogin}
            textStyle={$buttonText}
          />
        </Walkthrough>
      </View>
      <AppleAuthButton />
    </View>
  )
})

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
  gap: spacing.sm,
  padding: spacing.md,
}
const $loginText: TextStyle = {
  color: colors.text,
  textAlign: "center",
}
const $button: ViewStyle = {
  borderRadius: 8,
}
const $buttonText: TextStyle = {}
const $buttonsView: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
}
