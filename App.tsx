import "@expo/metro-runtime"
import React from "react"
import * as SplashScreen from "expo-splash-screen"
import App from "./app/app"
import Toast from "react-native-toast-message"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return (
    <>
      <App hideSplashScreen={SplashScreen.hideAsync} />
      <Toast />
    </>
  )
}

export default IgniteApp
