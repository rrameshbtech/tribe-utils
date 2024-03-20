import React from "react"
import { Icon as IconComponent, ListItem, Text } from "app/components"
import { format } from "date-fns"
import { View, ViewStyle } from "react-native"
import { colors, sizing, spacing } from "app/theme"
import { MoneyLabel } from "./MoneyLabel"
import { Expense, useRootStore } from "app/models"

interface ExpenseListItemProps {
  expense: Expense
}
export function ExpenseListItem({ expense }: Readonly<ExpenseListItemProps>) {
  return (
    <ListItem
      LeftComponent={<ExpenseCategoryIcon category={expense.category} />}
      style={$expenseListItemStyles}
      containerStyle={$expenseContainerStyles}
    >
      <ExpenseDate date={expense.date} />
      <View style={$expenseContentStyles}>
        <ExpenseNarration expense={expense} />
        <ExpenseAmount amount={expense.amount} />
      </View>
    </ListItem>
  )
}
const $expenseContainerStyles: ViewStyle = {
  marginBottom: spacing.xs,
  marginHorizontal: spacing.sm,
}
const $expenseListItemStyles = { paddingVertical: spacing.xs, gap: spacing.xs }
const $expenseContentStyles: ViewStyle = { justifyContent: "space-between", flexDirection: "row" }

interface ExpenseCategoryIconProps {
  category: string
}
function ExpenseCategoryIcon({ category }: Readonly<ExpenseCategoryIconProps>) {
  const expenseCategories = useRootStore((state) => state.expenseCategories)
  const categoryIcon = expenseCategories[category]?.icon || { name: "question", type: "FontAwesome" }

  return (
    <IconComponent
      {...categoryIcon}
      size={sizing.lg}
      color={colors.palette.primary500}
      shape="circle"
    />
  )
}

interface ExpenseDateProps {
  date: Date
}
function ExpenseDate({ date }: Readonly<ExpenseDateProps>) {
  const expenseDateFormat = "do eee p"
  const timeandDayWithOrdinal = format(date, expenseDateFormat)
  return <Text preset="default" text={timeandDayWithOrdinal} />
}

interface ExpenseNarrationProps {
  expense: Expense
}
function ExpenseNarration({ expense }: Readonly<ExpenseNarrationProps>) {
  const spentAt = expense.payee || expense.location || null
  return (
    <View style={$expenseNarrationStyles}>
      <View>
        {spentAt ? (
          <Text
            size="xs"
            style={$expenseNarrationTextStyle}
            tx="expense.list.spentAt"
            txOptions={{ spentAt }}
          />
        ) : (
          <Text size="xs" style={$expenseNarrationTextStyle} tx="expense.list.unknownSpentAt" />
        )}
      </View>
      <PaymentModeIcon mode={expense.mode} />
    </View>
  )
}
const $expenseNarrationStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
  columnGap: spacing.sm,
}
const $expenseNarrationTextStyle = { color: colors.palette.neutral600 }

interface PaymentModeIconProps {
  mode: string
}
function PaymentModeIcon({ mode }: Readonly<PaymentModeIconProps>) {
  const paymentModes = useRootStore((state) => state.paymentModes)
  const color = colors.palette.neutral500
  const size = sizing.md
  const icon = paymentModes[mode]?.icon || { name: mode, type: "initials" }

  return <IconComponent {...icon} {...{ size, color }} />
}

interface ExpenseAmountProps {
  amount: number
}
function ExpenseAmount({ amount }: Readonly<ExpenseAmountProps>) {
  return <MoneyLabel amount={amount} style={$expenseAmountStyles} />
}
const $expenseAmountStyles = { color: colors.palette.secondary500 }
