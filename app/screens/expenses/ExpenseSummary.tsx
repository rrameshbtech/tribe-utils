import React from "react"
import { Pressable, View, ViewStyle } from "react-native"
import { Card, Text, TrasWithComponents } from "app/components"
import { spacing } from "app/theme"
import { Expense } from "app/states"
import { MoneyLabel } from "./MoneyLabel"
import { ExpenseInput } from "./NewExpenseScreen"

interface ExpenseSummaryCardProps {
  expense: Expense
  onExpenseDetailPress?: (detailName: ExpenseInput) => void
}
export function ExpenseSummaryCard({
  expense,
  onExpenseDetailPress,
}: Readonly<ExpenseSummaryCardProps>) {
  return <VerboseExpenseSummary expense={expense} onExpenseDetailPress={onExpenseDetailPress} />
}
const $expenseSummaryCard: ViewStyle = {
  margin: spacing.md,
}

interface VerboseExpenseSummaryProps {
  expense: Expense
  onExpenseDetailPress?: (detailName: ExpenseInput) => void
}
function VerboseExpenseSummary({
  expense,
  onExpenseDetailPress,
}: Readonly<VerboseExpenseSummaryProps>) {
  function onDetailPress(detailName: ExpenseInput) {
    onExpenseDetailPress?.(detailName)
  }
  const verboseSummary = (
    <View>
      <TrasWithComponents
        containerStyles={{ padding: spacing.sm }}
        tx="expense.new.verbose"
        txOptions={{
          payee: <PayeeLabel name={expense.payee} onPress={onDetailPress} />,
          amount: <ExpenseAmountLabel amount={expense.amount} onPress={onDetailPress} />,
          spender: <SpenderLabel name={expense.spender} onPress={onDetailPress} />,
          category: <CategoryLabel name={expense.category} onPress={onDetailPress} />,
          mode: <ModeLabel mode={expense.mode} onPress={onDetailPress} />,
          date: <DateLabel date={expense.date} onPress={onDetailPress} />,
          location: <LocationLabel location={expense.location} onPress={onDetailPress} />,
        }}
      />
    </View>
  )

  return <Card style={$expenseSummaryCard} ContentComponent={verboseSummary} />
}

interface PressableLabelProps {
  onPress?: (name: ExpenseInput) => void
}
interface ExpenseAmountLabelProps extends PressableLabelProps {
  amount: number
}
function ExpenseAmountLabel({ amount, onPress }: Readonly<ExpenseAmountLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("amount")}>
      <MoneyLabel amount={amount} preset="bold" />
    </Pressable>
  )
}

interface SpenderLabelProps extends PressableLabelProps {
  name: string
}
function SpenderLabel({ name, onPress }: Readonly<SpenderLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("spender")}>
      <Text text={name} preset="bold" />
    </Pressable>
  )
}

interface PayeeLabelProps extends PressableLabelProps {
  name: string
}
function PayeeLabel({ name, onPress }: Readonly<PayeeLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("payee")}>
      <Text text={name} preset="bold" />
    </Pressable>
  )
}

interface CategoryLabelProps extends PressableLabelProps {
  name: string
}
function CategoryLabel({ name, onPress }: Readonly<CategoryLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("category")}>
      <Text text={name} preset="bold" />
    </Pressable>
  )
}

interface ModeLabelProps extends PressableLabelProps{
  mode: string
}
function ModeLabel({ mode, onPress }: Readonly<ModeLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("mode")}>
      <Text text={mode} preset="bold" />
    </Pressable>
  )
}

interface DateLabelProps extends PressableLabelProps{
  date: Date
}
function DateLabel({ date, onPress }: Readonly<DateLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("date")}>
      <Text text={date.toLocaleDateString()} preset="bold" />
    </Pressable>
  )
}

interface LocationLabelProps extends PressableLabelProps  {
  location?: string
}
function LocationLabel({ location, onPress }: Readonly<LocationLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("location")}>
      <Text text={location} preset="bold" />
    </Pressable>
  )
}