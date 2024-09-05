import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle, Platform } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import { supabase } from "app/supbase/supabase"
import * as AppleAuthentication from "expo-apple-authentication"
import { revalidateAuthStatus } from "app/supbase/auth"
import { useStores } from "app/models"
export interface AppleAuthButtonProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const AppleAuthButton = observer(function AppleAuthButton(props: AppleAuthButtonProps) {
  const { style } = props
  const $styles = [$container, style]
  const { auth } = useStores()
  if (Platform.OS === "ios")
    return (
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={5}
        style={{ width: 200, height: 64 }}
        onPress={async () => {
          try {
            const credential = await AppleAuthentication.signInAsync({
              requestedScopes: [
                AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                AppleAuthentication.AppleAuthenticationScope.EMAIL,
              ],
            })
            // Sign in via Supabase Auth.
            if (credential.identityToken) {
              const { error, data } = await supabase.auth.signInWithIdToken({
                provider: "apple",
                token: credential.identityToken,
              })
              auth.revalidateAuthStatus()
              console.log(JSON.stringify({ error, data }, null, 2))
              if (!error) {
                // User is signed in.
              }
            } else {
              throw new Error("No identityToken.")
            }
          } catch (e: any) {
            if (e.code === "ERR_REQUEST_CANCELED") {
              // handle that the user canceled the sign-in flow
            } else {
              // handle other errors
            }
          }
        }}
      />
    )
  return <>{/* Implement Android Auth options. */}</>
})

const $container: ViewStyle = {
  justifyContent: "center",
}

const $text: TextStyle = {
  fontFamily: typography.primary.normal,
  fontSize: 14,
  color: colors.palette.primary500,
}
