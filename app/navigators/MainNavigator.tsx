import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen } from "app/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { View } from "react-native"
import * as Screens from "app/screens"

export type MainNavigatorParamList = {
  recording: undefined
}

/**
 * Helper for automatically generating navigation prop types for each route.
 *
 * More info: https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type MainTabScreenProps<T extends keyof MainNavigatorParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainNavigatorParamList, T>,
  AppStackScreenProps<keyof AppStackParamList>
>

const Tab = createBottomTabNavigator<MainNavigatorParamList>()
export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: "white" } }}
    >
      <Tab.Screen name="recording" component={Screens.RecordingScreen} />
    </Tab.Navigator>
  )
}
