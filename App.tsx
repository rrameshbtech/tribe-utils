import App from "./app/app"
import React from "react"
import * as SplashScreen from "expo-splash-screen"

SplashScreen.preventAutoHideAsync()

function TribeApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

export default TribeApp
