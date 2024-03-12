import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps, navigate } from "app/navigators"
import { Icon, Screen, Text } from "app/components"
import { colors, spacing } from "app/theme"
import { Expense, ExpenseModel, useStores } from "app/models"
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
  const { userStore, expenseStore } = useStores()
  const [expense, setExpense] = React.useState<Expense>(
    ExpenseModel.create({ spender: userStore.currentUserName }),
  )
  function onExpenseChange(changedValue: Partial<Expense>) {
    setExpense({
      ...expense,
      ...changedValue,
    })
  }
  function onSave() {
    expenseStore.addExpense(expense)
    navigate("ExpenseList")
  }
  return (
    <Screen
      style={$root}
      preset="auto"
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <NewExpenseHeader />
      <ExpenseSummaryCard
        expense={expense}
        onExpenseDetailPress={(fieldName: ExpenseInput) => setCurrentInput(fieldName)}
      />
      <ExpenseForm visibleField={currentInput} value={expense} onChange={onExpenseChange} onSave={onSave} />
    </Screen>
  )
})
const $root: ViewStyle = {
  flex: 1,
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
  flex: 1,
  backgroundColor: colors.tint,
  alignItems: "flex-start",
  alignContent: "space-between",
  height: spacing.xxl,
}
const $titleContainerStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignContent: "flex-start",
  alignItems: "center",
  gap: spacing.sm,
}
