/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import { ViewStyle, useColorScheme } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { colors, spacing } from "app/theme"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon } from "app/components"

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

export type ExpenseScreensParamList = {
  ExpenseList: undefined
  ExpenseReport: undefined
  ExpenseEditor: { expenseId: string }
  ExpenseTabs: undefined
  ExpenseSettings: undefined
}

/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof ExpenseScreensParamList> = NativeStackScreenProps<
  ExpenseScreensParamList,
  T
>

const Tab = createBottomTabNavigator<ExpenseScreensParamList>()
const Stack = createNativeStackNavigator<ExpenseScreensParamList>()

const ExpenseTabs = function ExpenseTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const containerStyle:ViewStyle = {
            opacity: focused ? 1 : 0.5,
            backgroundColor: focused ? colors.palette.primary400 : colors.tint,
            borderRadius: size / 2,
            paddingVertical: spacing.xxs,
            paddingHorizontal: spacing.md,
          }
          const tabIcons: Record<string, string> = {
            ExpenseList: "list",
            ExpenseReport: "pie-chart",
            ExpenseSettings: "gear",
          }
          return (
            <Icon
              type="FontAwesome"
              name={tabIcons[route.name]}
              color={color}
              size={size}
              containerStyle={containerStyle}
            />
          )
        },
        tabBarActiveTintColor: colors.background,
        tabBarInactiveTintColor: colors.background,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: { backgroundColor: colors.tint },
      })}
    >
      <Tab.Screen
        name="ExpenseList"
        component={Screens.ExpenseListScreen}
      />
      <Tab.Screen
        name="ExpenseReport"
        component={Screens.ExpenseReportScreen}
      />
      <Tab.Screen
        name="ExpenseSettings"
        component={Screens.ExpenseSettingsScreen}
      />
    </Tab.Navigator>
  )
}

const AppStack = function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, navigationBarColor: colors.background }}>
      <Stack.Screen name="ExpenseTabs" component={ExpenseTabs} />
      <Stack.Screen
        name="ExpenseEditor"
        component={Screens.ExpenseEditorScreen}
        initialParams={{ expenseId: "" }}
      />
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = function AppNavigator(props: NavigationProps) {
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
}
