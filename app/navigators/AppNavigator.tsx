/**
 * The app navigator (formerly "AppNavigator" and "MainNavigator") is used for the primary
 * navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow which the user will use once logged in.
 */
import { NavigationContainer, RouteProp } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import { TextStyle, View, ViewStyle } from "react-native"
import * as Screens from "app/screens"
import Config from "../config"
import { navigationRef, useBackButtonHandler } from "./navigationUtilities"
import { useColors, spacing } from "app/theme"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Icon, Text } from "app/components"
import { useSettingsStore } from "app/models"
import { TxKeyPath } from "app/i18n"

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

export type AppScreensParamList = {
  Welcome: undefined
  Settings: undefined
  Home: undefined
}

export type AllScreensParamList = AppScreensParamList & ExpenseScreensParamList
/**
 * This is a list of all the route names that will exit the app if the back button
 * is pressed while in that screen. Only affects Android.
 */
const exitRoutes = Config.exitRoutes

export type AppStackScreenProps<T extends keyof AllScreensParamList> = NativeStackScreenProps<
  AllScreensParamList,
  T
>

const Tab = createBottomTabNavigator<ExpenseScreensParamList>()
const Stack = createNativeStackNavigator<AllScreensParamList>()

const ExpenseTabs = function ExpenseTabs() {
  const colors = useColors()
  return (
    <Tab.Navigator
      initialRouteName="ExpenseList"
      screenOptions={({ route }) => ({
        tabBarIcon: createExpenseTabIcon(route),
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textDim,
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: colors.backgroundHighlight,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
      })}
    >
      <Tab.Screen name="ExpenseList" component={Screens.ExpenseListScreen} />
      <Tab.Screen name="ExpenseReport" component={Screens.ExpenseReportScreen} />
      <Tab.Screen name="ExpenseSettings" component={Screens.ExpenseSettingsScreen} />
    </Tab.Navigator>
  )

  type TabBarIconProps = {
    focused: boolean
    color: string
    size: number
  }

  function createExpenseTabIcon(
    route: RouteProp<ExpenseScreensParamList, keyof ExpenseScreensParamList>,
  ): (props: TabBarIconProps) => React.ReactNode {
    return ExpenseTabIcon

    interface ExpenseTabIconProps {
      focused: boolean
      color: string
      size: number
    }
    function ExpenseTabIcon({ focused, color, size }: ExpenseTabIconProps) {
      const colors = useColors()
      const iconStyle: ViewStyle = {
        opacity: focused ? 1 : 0.9,
        marginTop: spacing.xs,
      }
      const tabIcons: Record<string, string> = {
        ExpenseList: "list",
        ExpenseReport: "pie-chart",
        ExpenseSettings: "gear",
      }
      const tabNames: Record<string, TxKeyPath> = {
        ExpenseList: "expense.tabs.expenses",
        ExpenseReport: "expense.tabs.report",
        ExpenseSettings: "expense.tabs.settings",
      }
      const $textStyle: TextStyle = { textAlign: "center", color: colors.textDim }
      const $iconContainerStyle: ViewStyle = { flexDirection: "column", alignItems: "center" }
      return (
        <View style={$iconContainerStyle}>
          <Icon
            type="FontAwesome"
            name={tabIcons[route.name]}
            color={color}
            size={size}
            containerStyle={iconStyle}
          />
          <Text
            tx={tabNames[route.name]}
            preset={focused ? "bold" : "default"}
            size="xxxs"
            style={$textStyle}
          />
        </View>
      )
    }
  }
}

function renderSignedInStack() {
  const isInitialSetupComplete = useSettingsStore((state) => state.isInitialSetupComplete)
  return (
    <Stack.Group>
      <Stack.Screen
        name="Home"
        component={Screens.HomeScreen}
        navigationKey={isInitialSetupComplete ? "user" : "guest"}
      />
      <Stack.Screen name="ExpenseTabs" component={ExpenseTabs} />
      <Stack.Screen
        name="ExpenseEditor"
        component={Screens.ExpenseEditorScreen}
        initialParams={{ expenseId: "" }}
      />
      <Stack.Screen
        name="Settings"
        component={Screens.SettingsScreen}
        navigationKey={isInitialSetupComplete ? "user" : "guest"}
      />
    </Stack.Group>
  )
}

function renderSignedOutStack() {
  const isInitialSetupComplete = useSettingsStore((state) => state.isInitialSetupComplete)
  return (
    <Stack.Group navigationKey={isInitialSetupComplete ? "user" : "guest"}>
      <Stack.Screen name="Welcome" component={Screens.WelcomeScreen} />
      <Stack.Screen name="Settings" component={Screens.SettingsScreen} />
    </Stack.Group>
  )
}

const AppStack = function AppStack() {
  const colors = useColors()
  const isInitialSetupComplete = useSettingsStore((state) => state.isInitialSetupComplete)
  return (
    <Stack.Navigator
      initialRouteName={isInitialSetupComplete ? "Home" : "Welcome"}
      screenOptions={{ headerShown: false, navigationBarColor: colors.backgroundHighlight }}
    >
      {isInitialSetupComplete ? renderSignedInStack() : renderSignedOutStack()}
    </Stack.Navigator>
  )
}

export interface NavigationProps
  extends Partial<React.ComponentProps<typeof NavigationContainer>> {}

export const AppNavigator = function AppNavigator(props: NavigationProps) {
  useBackButtonHandler((routeName) => exitRoutes.includes(routeName))

  return (
    <NavigationContainer ref={navigationRef} {...props}>
      <AppStack />
    </NavigationContainer>
  )
}
