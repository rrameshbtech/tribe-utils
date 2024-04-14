import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps, navigate } from "../navigators"
import { colors, spacing } from "../theme"
import { Member, getSelf, useRootStore } from "app/models"
import { getUniqueId } from "app/utils/generators"
import { useIsSignedIn } from "./auth"

interface SettingsScreenProps extends AppStackScreenProps<"Settings"> {}

export const SettingsScreen: FC<SettingsScreenProps> = function SettingsScreen() {
  const isSignedIn = useIsSignedIn()
  return (
    <Screen
      style={$container}
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <View>
        <SettingsHeader />
        <AuthUserConfiguration />
      </View>
    </Screen>
  )
}

function SettingsHeader() {
  return (
    <View style={{ backgroundColor: colors.tint }}>
      <Text
        tx="settingsScreen.title"
        preset="subheading"
        style={{ color: colors.background, padding: spacing.xs }}
      ></Text>
    </View>
  )
}

function AuthUserConfiguration() {
  const upsertAuthUser = useRootStore((state) => state.upsertMember)
  const updateSelf = useRootStore((state) => state.updateSelf)
  const [user, setUser] = useState((useRootStore(getSelf) ?? { id: getUniqueId() }) as Member)

  function onUserNameChange(name: string) {
    setUser({ ...user, name })
  }
  function onUserEmailChange(email: string) {
    setUser({ ...user, email })
  }
  function saveAuthUser() {
    upsertAuthUser(user)
    updateSelf(user.id)
  }
  function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  function isValidName(name: string) {
    return name && name.length > 1
  }

  const $formRowStyle: ViewStyle = {
    marginVertical: spacing.sm,
  }

  return (
    <View style={{ padding: spacing.sm }}>
      <Text tx="settingsScreen.authUser.title" preset="bold" />
      <View style={$formRowStyle}>
        <Text tx="settingsScreen.authUser.name" preset="formLabel" />
        <TextField
          placeholderTx="settingsScreen.authUser.namePlaceholder"
          value={user.name}
          status={!isValidName(user.name) ? "error" : undefined}
          onChangeText={onUserNameChange}
          inputMode="text"
          onSubmitEditing={saveAuthUser}
        />
      </View>
      <Text tx="settingsScreen.authUser.email" preset="formLabel" />
      <TextField
        placeholderTx="settingsScreen.authUser.emailPlaceholder"
        value={user.email}
        status={!isValidEmail(user.email) ? "error" : undefined}
        helperTx="settingsScreen.authUser.emailHelper"
        onChangeText={onUserEmailChange}
        inputMode="email"
        onSubmitEditing={saveAuthUser}
      />
      <Button
          tx="settingsScreen.finishSetup"
          onPress={saveAuthUser}
          style={{ marginTop: spacing.xl, marginHorizontal: spacing.sm }}
          disabled={!isValidName(user.name) || !isValidEmail(user.email)}
          preset={"filled"}
        />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
