import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps, navigate } from "app/navigators"
import { Icon, Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
import {Expense, initExpense, useRootStore } from "app/states"
import { ExpenseSummaryCard } from "./ExpenseSummary"
import { ExpenseForm } from "./ExpenseForm"
import { TouchableOpacity } from "react-native-gesture-handler"

interface NewExpenseScreenProps extends AppStackScreenProps<"NewExpense"> {}
export type ExpenseInput =
  | "amount"
  | "category"
  | "payee"
  | "spender"
  | "date"
  | "mode"
  | "location"

export const NewExpenseScreen: FC<NewExpenseScreenProps> = observer(function NewExpenseScreen() {
  const [currentInput, setCurrentInput] = React.useState<ExpenseInput>("amount")
  const [expense, setExpense] = React.useState<Expense>(
    initExpense()
  )
  const addExpense = useRootStore(state => state.addExpense)
  function onExpenseChange(changedValue: Partial<Expense>) {
    setExpense({
      ...expense,
      ...changedValue,
    })
  }
  function onSave() {
    addExpense(expense)
    navigate("ExpenseList")
  }

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <NewExpenseHeader />
      <View style={$pageContentStyles} >
        <ExpenseSummaryCard
          expense={expense}
          onExpenseDetailPress={(fieldName: ExpenseInput) => setCurrentInput(fieldName)}
        />
        <ExpenseForm
          visibleField={currentInput}
          value={expense}
          onChange={onExpenseChange}
          onSave={onSave}
        />
      </View>
    </Screen>
  )
})
const $root: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}

function NewExpenseHeader() {
  return (
    <View style={$headerContainerStyles}>
      <View style={$titleContainerStyles}>
        <TouchableOpacity accessibilityRole="button" onPress={() => navigate("ExpenseList")}>
          <Icon
            icon="close"
            type="Material"
            style={{ marginLeft: spacing.xs }}
            size={24}
            color={colors.palette.neutral300}
          />
        </TouchableOpacity>
        <Text
          preset="subheading"
          style={{ color: colors.palette.neutral200 }}
          tx="expense.new.heading"
        />
      </View>
    </View>
  )
}
const $headerContainerStyles: ViewStyle = {
  flex: 0,
  backgroundColor: colors.tint,
  alignItems: "flex-start",
  alignContent: "space-between",
  flexBasis: "auto",
  height: 64,
  padding: spacing.md,
}
const $titleContainerStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignContent: "flex-start",
  alignItems: "center",
  gap: spacing.sm,
  flexBasis: "auto",
}

const $screenContentContainer = {
  flex: 1,
  flexDirection: "column",
  paddingTop: 0,
} as ViewStyle

const $pageContentStyles: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  padding: 0,
}
