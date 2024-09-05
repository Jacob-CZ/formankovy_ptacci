import { observer } from "mobx-react-lite"
import React, { FC } from "react"
import { Image, ImageStyle, TextInput, TextStyle, View, ViewStyle } from "react-native"
import { AppleAuthButton, Button, Input, Text } from "app/components"
import { isRTL } from "../i18n"
import { AppStackScreenProps } from "../navigators"
import { colors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"
import { supabase } from "app/supbase/supabase"

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = observer(function WelcomeScreen() {
  const $ContainerInsets = useSafeAreaInsetsStyle(["bottom", "top"])
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })
    if (error) {
      console.log(error.message)
    } else {
      // revalidateAuthStatus()
      console.log(data)
    }
  }

  return (
    <View style={[$container, $ContainerInsets]}>
      <Text tx="welcomeScreen.login" preset="heading" style={$loginText} />
      <Input onChangeText={setEmail} placeholder="Username" placeholderTextColor={colors.tint} />
      <Input onChangeText={setPassword} placeholder="Password" placeholderTextColor={colors.tint} />
      <Button
        style={$button}
        tx="welcomeScreen.login"
        onPress={handleLogin}
        textStyle={$buttonText}
      />
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
