import React from "react"
import { Pressable, View, ViewStyle } from "react-native"
import { Card, Text, TrasWithComponents } from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { Expense } from "app/models"
import { MoneyLabel } from "./MoneyLabel"
import { ExpenseInput } from "./NewExpenseScreen"
import { t } from "i18n-js"

interface ExpenseSummaryCardProps {
  expense: Expense
  editField?: ExpenseInput
  onExpenseDetailPress?: (detailName: ExpenseInput) => void
}
export function ExpenseSummaryCard({
  expense,
  editField,
  onExpenseDetailPress,
}: Readonly<ExpenseSummaryCardProps>) {
  return <VerboseExpenseSummary {...{ expense, onExpenseDetailPress, editField }} />
}
const $expenseSummaryCard: ViewStyle = {
  margin: spacing.md,
}

interface VerboseExpenseSummaryProps {
  expense: Expense
  editField?: ExpenseInput
  onExpenseDetailPress?: (detailName: ExpenseInput) => void
}
function VerboseExpenseSummary({
  expense,
  editField,
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
          payee: <PayeeLabel name={expense.payee} onPress={onDetailPress} isHighlighted={editField === "payee"} />,
          amount: (
            <ExpenseAmountLabel
              amount={expense.amount}
              onPress={onDetailPress}
              isHighlighted={editField === "amount"}
            />
          ),
          spender: <SpenderLabel name={expense.spender} onPress={onDetailPress} />,
          category: <CategoryLabel name={expense.category} onPress={onDetailPress} isHighlighted={editField === "category"}/>,
          mode: <ModeLabel mode={expense.mode} onPress={onDetailPress} isHighlighted={editField === "mode"} />,
          date: <DateLabel date={expense.date} onPress={onDetailPress} isHighlighted={editField === "date"} />,
          location: <LocationLabel location={expense.location} onPress={onDetailPress} />,
        }}
      />
    </View>
  )

  return <Card style={$expenseSummaryCard} ContentComponent={verboseSummary} />
}
const $highlightStyle = { color: colors.palette.accent500, fontSize: sizing.lg }
interface PressableLabelProps {
  onPress?: (name: ExpenseInput) => void
  isHighlighted?: boolean
}
interface ExpenseAmountLabelProps extends PressableLabelProps {
  amount: number
}
function ExpenseAmountLabel({ amount, onPress, isHighlighted }: Readonly<ExpenseAmountLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("amount")}>
      <MoneyLabel amount={amount} preset="bold" style={isHighlighted && $highlightStyle} />
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
function PayeeLabel({ name, onPress, isHighlighted }: Readonly<PayeeLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("payee")}>
      <Text text={name} preset="bold" style={isHighlighted && $highlightStyle} />
    </Pressable>
  )
}

interface CategoryLabelProps extends PressableLabelProps {
  name: string
}
function CategoryLabel({ name, onPress, isHighlighted }: Readonly<CategoryLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("category")}>
      <Text text={name} preset="bold" style={isHighlighted && $highlightStyle}  />
    </Pressable>
  )
}

interface ModeLabelProps extends PressableLabelProps {
  mode: string
}
function ModeLabel({ mode, onPress, isHighlighted }: Readonly<ModeLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("mode")}>
      <Text preset="bold" style={isHighlighted && $highlightStyle} >{t(`expense.paymentModes.${mode}`, { defaultValue: mode })}</Text>
    </Pressable>
  )
}

interface DateLabelProps extends PressableLabelProps {
  date: Date
}
function DateLabel({ date, onPress, isHighlighted }: Readonly<DateLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("date")}>
      <Text text={date.toLocaleDateString()} preset="bold"  style={isHighlighted && $highlightStyle} />
    </Pressable>
  )
}

interface LocationLabelProps extends PressableLabelProps {
  location?: string
}
function LocationLabel({ location, onPress }: Readonly<LocationLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("location")}>
      <Text text={location} preset="bold" />
    </Pressable>
  )
}
