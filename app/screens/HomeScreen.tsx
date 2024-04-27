import React, { FC } from "react"
import { Pressable, View, ViewStyle } from "react-native"
import { CommonIconProps, Icon, Screen, Text } from "app/components"
import { AppStackScreenProps, navigate } from "../navigators"
import { colors, sizing, spacing } from "../theme"
import { TxKeyPath } from "app/i18n"

interface HomeScreenProps extends AppStackScreenProps<"Home"> {}

export const HomeScreen: FC<HomeScreenProps> = function HomeScreen() {
  return (
    <Screen
      contentContainerStyle={$contentContainer}
      safeAreaEdges={["top"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
    >
      <View style={{ backgroundColor: colors.backgroundHighlight, padding: spacing.sm }}>
        <Text preset="subheading" style={{ color: colors.tint }} tx="homeScreen.title" />
      </View>
      <View style={$toolsContainerStyle}>
        <BigIconButton
          renderIcon={(props) => <Icon type="image" name="expense" {...props} />}
          onPress={() => navigate("ExpenseTabs")}
          tx="homeScreen.expenses"
        />
        <BigIconButton
          renderIcon={(props) => <Icon type="FontAwesome" name="gear" {...props} />}
          tx="homeScreen.settings"
          onPress={() => navigate("Settings")}
        />
      </View>
    </Screen>
  )
}

interface IconButtonProps {
  renderIcon: (props: Partial<CommonIconProps>) => JSX.Element
  onPress: () => void
  tx: TxKeyPath
}
function BigIconButton({ tx, renderIcon, onPress }: IconButtonProps) {
  const Icon = renderIcon({
    color: colors.tint,
    size: sizing.xxxl,
  })
  return (
    <Pressable style={$buttonContainer} onPress={onPress}>
      {Icon}
      <Text tx={tx} style={{ color: colors.tint }} />
    </Pressable>
  )
}

const $buttonContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  backgroundColor: colors.backgroundHighlight,
  borderRadius: sizing.md,
  borderWidth: 1,
  borderColor: colors.border,
  padding: spacing.sm,
}
const $toolsContainerStyle: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "flex-start",
  justifyContent: "center",
  backgroundColor: colors.background,
  padding: spacing.md,
  gap: spacing.md,
}
const $contentContainer: ViewStyle = {
  flex: 1,
  backgroundColor: colors.background,
}
