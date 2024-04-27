import React from "react"
import { Icon as IconComponent, ListItem, Text, MoneyLabel } from "app/components"
import { format } from "date-fns"
import { Alert, Pressable, View, ViewStyle } from "react-native"
import { colors, sizing, spacing } from "app/theme"
import { Expense, useExpenseStore, Icon } from "app/models"
import { TxKeyPath, translate } from "app/i18n"
import Toast from "react-native-toast-message"
import { navigate } from "app/navigators"

interface ExpenseListItemProps {
  expense: Expense
  isExpanded?: boolean
  onPress?: (expenseId: string) => void
}
export function ExpenseListItem({ expense, isExpanded, onPress }: Readonly<ExpenseListItemProps>) {
  return (
    <View style={[$expenseItemBoxStyle, isExpanded && $expandedExpenseListItemStyle]}>
      <ListItem
        LeftComponent={<ExpenseCategoryIcon category={expense.category} />}
        style={$expenseListItemStyle}
        onPress={() => onPress?.(expense.id)}
      >
        <ExpenseDate date={expense.date} />
        <View style={$expenseContentStyle}>
          <ExpenseNarration expense={expense} />
          <ExpenseAmount amount={expense.amount} />
        </View>
      </ListItem>
      {isExpanded && <ExpenseItemControls expense={expense} />}
    </View>
  )
}
const $expenseItemBoxStyle: ViewStyle = {
  marginBottom: spacing.xs,
  marginHorizontal: spacing.xxs,
  borderWidth: 1,
  borderRadius: sizing.xs,
  borderColor: colors.background,
}
const $expenseListItemStyle = {
  paddingVertical: spacing.xs,
  gap: spacing.xs,
  paddingHorizontal: spacing.xs,
}
const $expandedExpenseListItemStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral400,
}
const $expenseContentStyle: ViewStyle = { justifyContent: "space-between", flexDirection: "row" }

interface ExpenseCategoryIconProps {
  category: string
}
function ExpenseCategoryIcon({ category }: Readonly<ExpenseCategoryIconProps>) {
  const expenseCategories = useExpenseStore((state) => state.expenseCategories)
  const categoryIcon = expenseCategories[category]?.icon || {
    name: "question",
    type: "FontAwesome",
  }

  return (
    <IconComponent
      {...categoryIcon}
      size={sizing.lg}
      color={colors.tint}
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
  const paymentModes = useExpenseStore((state) => state.paymentModes)
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

interface ExpenseItemControlsProps {
  expense: Expense
}
function ExpenseItemControls({ expense }: Readonly<ExpenseItemControlsProps>) {
  const removeExpense = useExpenseStore((state) => state.removeExpense)
  function deleteExpense() {
    Alert.alert(
      translate("expense.delete.confirmTitle"),
      translate("expense.delete.confirmMessage", {
        category: expense.category,
        payee: expense.payee,
      }),
      [
        {
          text: translate("common.cancel"),
          style: "cancel",
        },
        {
          text: translate("common.delete"),
          onPress: () => {
            removeExpense(expense.id)
            Toast.show({
              text1: translate("expense.delete.successMessage"),
              position: "bottom",
            })
          },
          style: "destructive",
        },
      ],
      { cancelable: true },
    )
  }
  function editExpense() {
    navigate("ExpenseEditor", { expenseId: expense.id })
  }

  return (
    <View style={$expenseControlsStyle}>
      <FlatIconButton
        icon={{ name: "delete", type: "Material" }}
        tx="common.delete"
        onPress={deleteExpense}
      />
      <FlatIconButton
        icon={{ name: "edit", type: "FontAwesome" }}
        tx="common.edit"
        onPress={editExpense}
      />
    </View>
  )
}
const $expenseControlsStyle: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  justifyContent: "space-around",
  padding: spacing.xs,
  borderTopWidth: 1,
  borderTopColor: colors.palette.neutral300,
}

interface FlatIconButtonProps {
  icon: Icon
  tx: TxKeyPath
  onPress?: () => void
}
function FlatIconButton({ icon, tx, onPress }: Readonly<FlatIconButtonProps>) {
  const $iconWrapperStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    columnGap: spacing.xxxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  }
  return (
    <Pressable
      accessibilityRole="button"
      style={$iconWrapperStyle}
      android_ripple={{ color: colors.palette.neutral300 }}
      onPress={onPress}
    >
      <IconComponent {...icon} color={colors.textDim} />
      <Text tx={tx}></Text>
    </Pressable>
  )
}
