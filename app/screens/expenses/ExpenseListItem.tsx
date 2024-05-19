import React from "react"
import { Icon as IconComponent, ListItem, Text, MoneyLabel } from "app/components"
import { format } from "date-fns"
import { Alert, Pressable, View, ViewStyle } from "react-native"
import { useColors, sizing, spacing } from "app/theme"
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
  const colors = useColors()
  const $expenseItemBoxStyle: ViewStyle = {
    marginBottom: spacing.xs,
    marginHorizontal: spacing.xxs,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundHighlight,
    borderStyle: "dashed",
  }
  const $expenseListItemStyle = {
    paddingVertical: spacing.xs,
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
  }
  const $expandedExpenseListItemStyle: ViewStyle = {
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: sizing.xs,
    borderStyle: "solid",
    overflow: "hidden",
  }
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

const $expenseContentStyle: ViewStyle = { justifyContent: "space-between", flexDirection: "row" }

interface ExpenseCategoryIconProps {
  category: string
}
function ExpenseCategoryIcon({ category }: Readonly<ExpenseCategoryIconProps>) {
  const colors = useColors()
  const expenseCategories = useExpenseStore((state) => state.expenseCategories)
  const categoryIcon = expenseCategories[category]?.icon || {
    name: "question",
    type: "FontAwesome",
  }

  return <IconComponent {...categoryIcon} size={sizing.lg} color={colors.tint} shape="circle" />
}

interface ExpenseDateProps {
  date: Date
}
function ExpenseDate({ date }: Readonly<ExpenseDateProps>) {
  const colors = useColors()
  const expenseDateFormat = "do eee p"
  const timeandDayWithOrdinal = format(date, expenseDateFormat)
  return <Text preset="default" style={{color: colors.text}} text={timeandDayWithOrdinal} />
}

interface ExpenseNarrationProps {
  expense: Expense
}
function ExpenseNarration({ expense }: Readonly<ExpenseNarrationProps>) {
  const colors = useColors()
  const spentAt = expense.payee || expense.location || null
  const $expenseNarrationStyles: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    columnGap: spacing.sm,
  }
  const $expenseNarrationTextStyle = { color: colors.textDim }

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
interface PaymentModeIconProps {
  mode: string
}
function PaymentModeIcon({ mode }: Readonly<PaymentModeIconProps>) {
  const colors = useColors()
  const paymentModes = useExpenseStore((state) => state.paymentModes)
  const color = colors.textDim
  const size = sizing.md
  const icon = paymentModes[mode]?.icon || { name: mode, type: "initials" }

  return <IconComponent {...icon} {...{ size, color }} />
}

interface ExpenseAmountProps {
  amount: number
}
function ExpenseAmount({ amount }: Readonly<ExpenseAmountProps>) {
  const colors = useColors()
  const $expenseAmountStyles = { color: colors.secondaryTint }

  return <MoneyLabel amount={amount} style={$expenseAmountStyles} />
}

interface ExpenseItemControlsProps {
  expense: Expense
}
function ExpenseItemControls({ expense }: Readonly<ExpenseItemControlsProps>) {
  const colors = useColors()
  const $expenseControlsStyle: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    padding: spacing.xs,
    borderTopWidth: 1,
    backgroundColor: colors.backgroundHighlight,
    borderTopColor: colors.border,
  }
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
              position: "top",
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

interface FlatIconButtonProps {
  icon: Icon
  tx: TxKeyPath
  onPress?: () => void
}
function FlatIconButton({ icon, tx, onPress }: Readonly<FlatIconButtonProps>) {
  const colors = useColors()
  const $iconWrapperStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "center",
    columnGap: spacing.xxxs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    flex: 1,
  }
  return (
    <Pressable
      accessibilityRole="button"
      style={$iconWrapperStyle}
      android_ripple={{ color: colors.background }}
      onPress={onPress}
    >
      <IconComponent {...icon} color={colors.textDim} />
      <Text tx={tx}></Text>
    </Pressable>
  )
}
