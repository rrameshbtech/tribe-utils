import React, { FC } from "react"
import { Image, ImageStyle, TextStyle, View, ViewStyle } from "react-native"
import { Button, Screen, Text } from "app/components"
import { AppStackScreenProps, navigate } from "../navigators"
import { useColors, spacing } from "../theme"
import { useSafeAreaInsetsStyle } from "../utils/useSafeAreaInsetsStyle"

const welcomeLogo = require("../../assets/images/tribal-women-celebrate.png")

interface WelcomeScreenProps extends AppStackScreenProps<"Welcome"> {}

export const WelcomeScreen: FC<WelcomeScreenProps> = function WelcomeScreen() {
  const colors = useColors()
  const $bottomContainerInsets = useSafeAreaInsetsStyle(["bottom"])

  const $container: ViewStyle = {
    flex: 1,
    backgroundColor: colors.background,
  }

  const $topContainer: ViewStyle = {
    flexShrink: 1,
    flexGrow: 1,
    flexBasis: "57%",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
  }

  const $bottomContainer: ViewStyle = {
    flexShrink: 1,
    flexGrow: 0,
    flexBasis: "43%",
    backgroundColor: colors.backgroundHighlight,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: spacing.lg,
    justifyContent: "space-around",
  }
  const $welcomeLogo: ImageStyle = {
    height: 150,
    width: "100%",
  }

  const $welcomeHeading: TextStyle = {
    marginBottom: spacing.md,
  }

  return (
    <Screen
      contentContainerStyle={$container}
      safeAreaEdges={["top"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
    >
      <View style={$topContainer}>
        <Image style={$welcomeLogo} source={welcomeLogo} resizeMode="contain" />
        <Text
          testID="welcome-heading"
          style={$welcomeHeading}
          tx="welcomeScreen.welcomeTitle"
          preset="heading"
        />
        <Text tx="welcomeScreen.privateSpace" preset="subheading" />
      </View>

      <View style={[$bottomContainer, $bottomContainerInsets]}>
        <Text tx="welcomeScreen.postscript" size="md" />
        <Button
          tx="common.getStarted"
          onPress={() => {
            navigate("Settings")
          }}
          preset="reversed"
        />
      </View>
    </Screen>
  )
}
