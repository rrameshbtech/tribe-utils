import React from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Card, Text, TrasWithComponents } from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { Expense, useRootStore } from "app/models"
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
  const expenseSummaryCardMode = useRootStore((state) => state.expenseSummaryCardMode)

  return expenseSummaryCardMode === "card" ? (
    <CardExpenseSummary {...{ expense, onExpenseDetailPress, editField }} />
  ) : (
    <VerboseExpenseSummary {...{ expense, onExpenseDetailPress, editField }} />
  )
}
const $expenseSummaryCard: ViewStyle = {
  margin: spacing.md,
}

interface ExpenseSummaryProps {
  expense: Expense
  editField?: ExpenseInput
  onExpenseDetailPress?: (detailName: ExpenseInput) => void
}
function VerboseExpenseSummary({
  expense,
  editField,
  onExpenseDetailPress,
}: Readonly<ExpenseSummaryProps>) {
  function onDetailPress(detailName: ExpenseInput) {
    onExpenseDetailPress?.(detailName)
  }
  const verboseSummary = (
    <View>
      <TrasWithComponents
        containerStyles={{ padding: spacing.sm }}
        tx="expense.new.verbose"
        txOptions={{
          payee: (
            <PayeeLabel
              name={expense.payee}
              onPress={onDetailPress}
              isHighlighted={editField === "payee"}
            />
          ),
          amount: (
            <ExpenseAmountLabel
              amount={expense.amount}
              onPress={onDetailPress}
              isHighlighted={editField === "amount"}
            />
          ),
          spender: <SpenderLabel name={expense.spender} />,
          category: (
            <CategoryLabel
              name={expense.category}
              onPress={onDetailPress}
              isHighlighted={editField === "category"}
            />
          ),
          mode: (
            <ModeLabel
              mode={expense.mode}
              onPress={onDetailPress}
              isHighlighted={editField === "mode"}
            />
          ),
          date: (
            <DateLabel
              date={expense.date}
              onPress={onDetailPress}
              isHighlighted={editField === "date"}
            />
          ),
          location: <LocationLabel location={expense.location} onPress={onDetailPress} />,
        }}
      />
    </View>
  )

  return <Card style={$expenseSummaryCard} ContentComponent={verboseSummary} />
}

function CardExpenseSummary({
  expense,
  editField,
  onExpenseDetailPress,
}: Readonly<ExpenseSummaryProps>) {
  function onDetailPress(detailName: ExpenseInput) {
    onExpenseDetailPress?.(detailName)
  }
  const ModeAndCategory = () => (
    <TrasWithComponents
      tx="expense.new.card.modeAndCategoryLabel"
      containerStyles={{ flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}
      txOptions={{
        category: (
          <CategoryLabel
            name={expense.category}
            onPress={onDetailPress}
            isHighlighted={editField === "category"}
          />
        ),
        mode: (
          <ModeLabel
            mode={expense.mode}
            onPress={onDetailPress}
            isHighlighted={editField === "mode"}
          />
        ),
      }}
    />
  )

  const HeadingComponent = (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        columnGap: spacing.sm,
      }}
    >
      <DateLabel date={expense.date} onPress={onDetailPress} isHighlighted={editField === "date"} />
      <ModeAndCategory />
    </View>
  )

  const PayeeSummaryLabel = () => (
    <TrasWithComponents
      tx="expense.new.card.payeeLabel"
      containerStyles={{ flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }}
      txOptions={{
        payee: (
          <PayeeLabel
            name={expense.payee}
            onPress={onDetailPress}
            isHighlighted={editField === "payee"}
          />
        ),
      }}
    />
  )

  const SpenderSummaryLabel = () => (
    <TrasWithComponents
      tx="expense.new.card.spenderLabel"
      txOptions={{
        spender: <SpenderLabel name={expense.spender.split(" ")[0]} />,
      }}
    />
  )
  const FooterComponent = (
    <View style={{ flexDirection: "row", justifyContent: "space-between", columnGap: spacing.sm }}>
      <SpenderSummaryLabel />
      <PayeeSummaryLabel />
    </View>
  )

  const ContentComponent = (
    <View style={{ alignItems: "center" }}>
      <ExpenseAmountLabel
        amount={expense.amount}
        onPress={onDetailPress}
        isHighlighted={editField === "amount"}
      />
    </View>
  )

  return (
    <View style={$shadowBoxStyle}>
      {HeadingComponent}
      {ContentComponent}
      {FooterComponent}
    </View>
  )
}

const $shadowBoxStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral100,
  borderColor: colors.palette.neutral300,
  margin: spacing.md,
  flexDirection: "column",
  rowGap: spacing.md,
  justifyContent: "space-between",
  borderRadius: spacing.md,
  padding: spacing.xs,
  borderWidth: 1,
  shadowColor: colors.palette.neutral800,
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.08,
  shadowRadius: 12.81,
  elevation: 16,
}

const $highlightStyle: TextStyle = { color: colors.palette.accent500 }
interface PressableLabelProps {
  onPress?: (name: ExpenseInput) => void
  isHighlighted?: boolean
}
interface ExpenseAmountLabelProps extends PressableLabelProps {
  amount: number
}
function ExpenseAmountLabel({
  amount,
  onPress,
  isHighlighted,
  ...pressableProps
}: Readonly<ExpenseAmountLabelProps>) {
  const style: TextStyle = {
    fontSize: sizing.xxl,
    lineHeight: sizing.xxl,
    ...(isHighlighted ? $highlightStyle : {}),
  }
  return (
    <Pressable onPress={() => onPress?.("amount")} {...pressableProps}>
      <MoneyLabel amount={amount} style={style} subTextSymbol={true} />
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
      <Text
        text={name.toLocaleLowerCase()}
        preset="bold"
        style={isHighlighted && $highlightStyle}
      />
    </Pressable>
  )
}

interface CategoryLabelProps extends PressableLabelProps {
  name: string
}
function CategoryLabel({ name, onPress, isHighlighted }: Readonly<CategoryLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("category")}>
      <Text
        text={name.toLocaleLowerCase()}
        preset="bold"
        style={isHighlighted && $highlightStyle}
      />
    </Pressable>
  )
}

interface ModeLabelProps extends PressableLabelProps {
  mode: string
}
function ModeLabel({ mode, onPress, isHighlighted }: Readonly<ModeLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("mode")}>
      <Text preset="bold" style={isHighlighted && $highlightStyle}>
        {t(`expense.paymentModes.${mode}`, { defaultValue: mode }).toLocaleLowerCase()}
      </Text>
    </Pressable>
  )
}

interface DateLabelProps extends PressableLabelProps {
  date: Date
}
function DateLabel({ date, onPress, isHighlighted }: Readonly<DateLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("date")}>
      <Text
        text={date.toLocaleDateString()}
        preset="bold"
        style={isHighlighted && $highlightStyle}
      />
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
