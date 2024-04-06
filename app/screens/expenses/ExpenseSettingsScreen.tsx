import React, { FC } from "react"

import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"
// import { useNavigation } from "@react-navigation/native"
// import { useStores } from "app/models"

interface ExpenseSettingsScreenProps extends AppStackScreenProps<"ExpenseSettings"> {}

export const ExpenseSettingsScreen: FC<ExpenseSettingsScreenProps> = function SettingsScreen() {
  // Pull in one of our MST stores
  // const { someStore, anotherStore } = useStores()

  // Pull in navigation via hook
  // const navigation = useNavigation()
  return (
    <Screen style={$root} preset="scroll">
      <Text text="settings" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
