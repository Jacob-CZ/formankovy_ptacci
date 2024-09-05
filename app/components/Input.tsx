import * as React from "react"
import { StyleProp, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"

export interface InputProps extends TextInputProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
}

/**
 * Describe your component here
 */
export const Input = observer(function Input(props: InputProps) {
  const { style, ..._props } = props
  const $styles = [$input, style]

  return <TextInput style={$styles} {..._props} />
})

const $input: TextStyle = {
  color: colors.text,
  fontSize: 26,
  height: 50,
  padding: 10,
  borderWidth: 1,
  borderColor: colors.border,
  borderRadius: 8,
}
