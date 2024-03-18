import React from "react"
import { Icon, IconSpecifier, ListItem, Text } from "app/components"
import { format } from "date-fns"
import { View, ViewStyle } from "react-native"
import { colors, spacing } from "app/theme"
import { MoneyLabel } from "./MoneyLabel"
import { Expense } from "app/states"

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
  const iconMap: Record<string, IconSpecifier> = {
    Mobile: { type: "FontAwesome5", name: "phone-alt" },
    Grocery: { type: "FontAwesome", name: "shopping-basket" },
    Entertainment: { type: "FontAwesome", name: "film" },
    Books: { type: "Material", name: "bookshelf" },
    Education: { type: "FontAwesome5", name: "user-graduate" },
    Food: { type: "FontAwesome", name: "cutlery" },
    Travel: { type: "FontAwesome", name: "plane" },
    Sports: { type: "FontAwesome", name: "futbol-o" },
  }
  const categoryIcon = iconMap[category] || { name: "question", type: "FontAwesome" }
  if (categoryIcon.type === "image") {
    return (
      <Icon
        type="image"
        icon={categoryIcon.name}
        size={24}
        color={colors.palette.primary500}
        containerStyle={$expenseCategoryIconStyles}
      />
    )
  }
  return (
    <Icon
      type={categoryIcon.type}
      icon={categoryIcon.name}
      size={24}
      color={colors.palette.primary500}
      containerStyle={$expenseCategoryIconStyles}
    />
  )
}
const $expenseCategoryIconStyles: ViewStyle = {
  flex: 0,
  alignItems: "center",
  minWidth: 48,
  minHeight: 48,
  padding: spacing.sm,
  backgroundColor: colors.palette.primary100,
  borderRadius: 48,
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
      <ExpenseModeIcon mode={expense.mode} />
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

interface ExpenseModeIconProps {
  mode: string
}
function ExpenseModeIcon({ mode }: Readonly<ExpenseModeIconProps>) {
  const color = colors.palette.neutral500
  const size = 16
  const iconMap: Record<string, IconSpecifier> = {
    Cash: { type: "FontAwesome", name: "money" },
    Wallet: { type: "image", name: "mobileWallet" },
    UPI: { type: "image", name: "mobilePay" },
    BankTransfer: { type: "FontAwesome", name: "bank" },
    Credit: { type: "image", name: "loan" },
    BankCard: { type: "FontAwesome", name: "credit-card" },
  }
  const { name: icon, type } = iconMap[mode] || { name: "question", type: "FontAwesome" }

  if (type === "image") {
    return <Icon type="image" {...{ icon, size, color }} />
  } else {
    return <Icon {...{ icon, type, size, color }} />
  }
}

interface ExpenseAmountProps {
  amount: number
}
function ExpenseAmount({ amount }: Readonly<ExpenseAmountProps>) {
  return <MoneyLabel amount={amount} styles={$expenseAmountStyles} />
}
const $expenseAmountStyles = { color: colors.palette.secondary500 }
