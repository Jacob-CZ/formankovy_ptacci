import * as React from "react"
import { StyleProp, TextStyle, View, ViewStyle } from "react-native"
import { observer } from "mobx-react-lite"
import { colors, typography } from "app/theme"
import { Text } from "app/components/Text"
import Tooltip, { TooltipProps } from "react-native-walkthrough-tooltip"
import { useStores, WalkthroughNames } from "app/models"

export interface WalkthroughProps extends TooltipProps {
  /**
   * An optional style override useful for padding & margin.
   */
  style?: StyleProp<ViewStyle>
  name: WalkthroughNames
}

/**
 * Describe your component here
 */
export const Walkthrough = observer(function Walkthrough(props: WalkthroughProps) {
  const { style, children, name, ..._props } = props
  const $styles = [$container, style]
  const {
    walkThrough: { currentTip },
  } = useStores()

  return (
    <Tooltip isVisible={name === currentTip} content={<Text>Check this out!</Text>} {..._props}>
      {children}
    </Tooltip>
  )
})

const $container: ViewStyle = {
  justifyContent: "center",
}
