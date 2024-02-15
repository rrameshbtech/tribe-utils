import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { Card, Icon, Screen, Text, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { Expense, ExpenseModel } from "app/models"

interface NewExpenseScreenProps extends AppStackScreenProps<"NewExpense"> {}

export const NewExpenseScreen: FC<NewExpenseScreenProps> = observer(function NewExpenseScreen() {
  const [expense] = React.useState<Expense>(ExpenseModel.create({}))
  return (
    <Screen
      style={$root}
      preset="auto"
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <NewExpenseHeader />
      <ExpenseSummaryCard expense={expense} />
      <NewExpenseForm />
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
        <Icon
          icon="close"
          type="Material"
          style={{ marginLeft: spacing.xs }}
          size={24}
          color={colors.palette.neutral300}
        />
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

function NewExpenseForm() {
  return (
    <View style={$formContainerStyles}>
      <TextField placeholderTx="expense.new.placeholder.amount" labelTx="expense.new.amount" />
      <TextField placeholderTx="expense.new.placeholder.category" labelTx="expense.new.category" />
      <TextField placeholderTx="expense.new.placeholder.payee" labelTx="expense.new.payee" />
    </View>
  )
}

const $formContainerStyles: ViewStyle = {
  flex: 1,
  padding: spacing.lg,
  rowGap: spacing.md,
}

interface ExpenseSummaryCardProps {
  expense: Expense
}
function ExpenseSummaryCard({ expense }: ExpenseSummaryCardProps) {
  return (
    <Card
      style={$expenseSummaryCard}
      ContentComponent={<VerboseExpenseSummary expense={expense} />}
    />
  )
}
const $expenseSummaryCard: ViewStyle = {
  margin: spacing.md,
}

interface VerboseExpenseSummaryProps {
  expense: Expense
}
function VerboseExpenseSummary({ expense }: VerboseExpenseSummaryProps) {
  return (
    <View>
      <Text
        preset="subheading"
        tx="expense.new.verbose"
        txOptions={{ amount: <Text>{expense.amount.toLocaleString()}</Text> }}
      />
    </View>
  )
}
