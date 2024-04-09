import React, { FC } from "react"

import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Screen, Text, Toggle } from "app/components"
import { colors, spacing } from "app/theme"
import { useRootStore } from "app/models"

interface ExpenseSettingsScreenProps extends AppStackScreenProps<"ExpenseSettings"> {}

export const ExpenseSettingsScreen: FC<ExpenseSettingsScreenProps> = function SettingsScreen() {
  const configs = useRootStore((s) => s.configs)
  const updateConfigs = useRootStore((s) => s.updateConfigs)

  function updateCaptureLocation(value: boolean) {
    updateConfigs({ captureLocation: value })
  }

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainerStyle}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <ExpenseSettingsHeader />
      <View style={{ padding: spacing.xs }}>
        <LocationToggle value={configs.captureLocation} onChange={updateCaptureLocation} />
      </View>
    </Screen>
  )
}

function ExpenseSettingsHeader() {
  return (
    <Text
      tx="expense.settings.title"
      preset="subheading"
      style={{ color: colors.background, backgroundColor: colors.tint, padding: spacing.xs }}
    />
  )
}

interface LocationToggleProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

function LocationToggle({ value, onChange }: LocationToggleProps) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text tx="expense.settings.location" />
      <Toggle value={value} variant="switch" onValueChange={onChange}></Toggle>
    </View>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
const $screenContentContainerStyle: ViewStyle = {
  flexGrow: 1,
}
