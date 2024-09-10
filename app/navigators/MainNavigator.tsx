import React, { lazy } from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { WelcomeScreen } from "app/screens"
import { CompositeScreenProps } from "@react-navigation/native"
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { AppStackParamList, AppStackScreenProps } from "./AppNavigator"
import { View } from "react-native"
import * as Screens from "app/screens"
import { MaterialCommunityIcons, Entypo } from "@expo/vector-icons"
import { colors } from "app/theme"

export type MainNavigatorParamList = {
  recording: undefined
  viewRecording: undefined
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
const size = 36
const Tab = createBottomTabNavigator<MainNavigatorParamList>()
export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "white" },
        tabBarShowLabel: false,
        tabBarIconStyle: { marginTop: 10 },
        lazy: true,
      }}
    >
      <Tab.Screen
        name="recording"
        component={Screens.RecordingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Entypo name="camera" size={size} color={focused ? colors.tint : "black"} />
          ),
        }}
      />
      <Tab.Screen
        name="viewRecording"
        component={Screens.ViewRecordingScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="bird"
              size={size}
              color={focused ? colors.tint : "black"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  )
}
