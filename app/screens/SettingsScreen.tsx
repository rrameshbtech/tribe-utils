import React, { FC, useState } from "react"
import { View, ViewStyle } from "react-native"
import { Button, Icon, Screen, Text, TextField } from "app/components"
import { AppStackScreenProps, goBack } from "../navigators"
import { colors, spacing } from "../theme"
import { Member, getSelf, useMemberStore, useSettingsStore } from "app/models"
import { getUniqueId } from "app/utils/generators"

interface SettingsScreenProps extends AppStackScreenProps<"Settings"> {}

export const SettingsScreen: FC<SettingsScreenProps> = function SettingsScreen() {
  return (
    <Screen
      style={$container}
      preset="scroll"
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
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
    <View
      style={{
        backgroundColor: colors.backgroundHighlight,
        flexDirection: "row",
        padding: spacing.sm,
        alignItems: "center",
      }}
    >
      <Icon type="image" name="back" onPress={() => goBack()} />
      <Text
        tx="settingsScreen.title"
        preset="subheading"
        style={{ color: colors.tint, padding: spacing.xs }}
      ></Text>
    </View>
  )
}

function AuthUserConfiguration() {
  const upsertAuthUser = useMemberStore((state) => state.upsertMember)
  const updateSelf = useMemberStore((state) => state.updateSelf)
  const setIsInitialSetupComplete = useSettingsStore((state) => state.setIsInitialSetupComplete)
  const [user, setUser] = useState((useMemberStore(getSelf) ?? { id: getUniqueId() }) as Member)

  function onUserNameChange(name: string) {
    setUser({ ...user, name })
  }
  function onUserEmailChange(email: string) {
    setUser({ ...user, email })
  }
  function saveAuthUser() {
    upsertAuthUser(user)
    updateSelf(user.id)
    setIsInitialSetupComplete(true)
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
        tx="common.save"
        onPress={saveAuthUser}
        style={{ marginTop: spacing.xl, marginHorizontal: spacing.sm }}
        disabled={!isValidName(user.name) || !isValidEmail(user.email)}
        preset="reversed"
      />
    </View>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
