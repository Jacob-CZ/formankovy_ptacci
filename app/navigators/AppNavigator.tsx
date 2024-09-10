/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { useColorScheme } from "react-native"
import * as Screens from "app/screens"
import * as Navigators from "app/navigators"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors } from "app/theme"
import { UserModel, useStores } from "app/models"
import { supabase } from "app/supbase/supabase"
import { types } from "mobx-state-tree"
import Toast from "react-native-toast-message"
import * as Notifications from 'expo-notifications';

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * If no params are allowed, pass through `undefined`. Generally speaking, we
 * recommend using your MobX-State-Tree store(s) to keep application state
 * rather than passing state through navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 *   https://reactnavigation.org/docs/typescript/#organizing-types
 */
export type AppStackParamList = {
  Welcome: undefined
  Main: undefined
  // 🔥 Your screens go here
  Recording: undefined
  ViewRecording: undefined
  SupportMessaging: undefined
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
  // IGNITE_GENERATOR_ANCHOR_APP_STACK_PARAM_LIST
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AppStackParamList> = NativeStackScreenProps<
  AppStackParamList,
  T
>

// Documentation: https://reactnavigation.org/docs/stack-navigator/
const Stack = createNativeStackNavigator<AppStackParamList>()
// Step 2: Import Notifications from expo-notifications

const AppStack = observer(function AppStack() {
  const {
    auth: { isSignedIn, revalidateAuthStatus, user },
  } = useStores();

  useEffect(() => {
    revalidateAuthStatus();
    registerForPushNotificationsAsync();
    // Step 4: Handle incoming notifications
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    // Step 5: Clean up
    return () => Notifications.removeNotificationSubscription(subscription);
  }, []);

  // Step 3: Request Permissions
  async function registerForPushNotificationsAsync() {
    let token;
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);

    // Here you might want to send the token to your backend to send push notifications to this device
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      {isSignedIn ? (
        <Stack.Screen name="Main" component={Navigators.MainNavigator} />
      ) : (
        <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      )}
      {/* Your screens go here */}
      <Stack.Screen
        name="SupportMessaging"
        component={Screens.SupportMessagingScreen}
        options={{ presentation: "modal" }}
      />
      {/* IGNITE_GENERATOR_ANCHOR_APP_STACK_SCREENS */}
    </Stack.Navigator>
  );
});

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = observer(function AppNavigator(props: NavigationProps) {
  const colorScheme = useColorScheme()

  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer
      ref={navigationRef}
      theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
      {...props}
    >
      <AppStack />
    </NavigationContainer>
  )
})
