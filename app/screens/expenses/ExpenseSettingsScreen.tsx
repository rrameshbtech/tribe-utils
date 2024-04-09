import React, { FC } from "react"

import { ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text } from "app/components"

interface ExpenseSettingsScreenProps extends AppStackScreenProps<"ExpenseSettings"> {}

export const ExpenseSettingsScreen: FC<ExpenseSettingsScreenProps> = function SettingsScreen() {
  return (
    <Screen style={$root} preset="scroll">
      <Text text="settings" />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
