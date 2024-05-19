import React from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { Card, Text, TrasWithComponents, MoneyLabel } from "app/components"
import { useColors, sizing, spacing, Colors } from "app/theme"
import { Expense, ExpenseLocation, useExpenseStore, useMemberStore } from "app/models"
import { ExpenseInputName } from "./ExpenseEditorScreen"
import { t } from "i18n-js"

interface ExpenseSummaryCardProps {
  expense: Expense
  editField?: ExpenseInputName
  onExpenseDetailPress?: (detailName: ExpenseInputName) => void
}
export function ExpenseSummaryCard({
  expense,
  editField,
  onExpenseDetailPress,
}: Readonly<ExpenseSummaryCardProps>) {
  const expenseSummaryCardMode = useExpenseStore((state) => state.expenseSummaryCardMode)

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
  editField?: ExpenseInputName
  onExpenseDetailPress?: (detailName: ExpenseInputName) => void
}
function VerboseExpenseSummary({
  expense,
  editField,
  onExpenseDetailPress,
}: Readonly<ExpenseSummaryProps>) {
  function onDetailPress(detailName: ExpenseInputName) {
    onExpenseDetailPress?.(detailName)
  }
  const verboseSummary = (
    <View>
      <TrasWithComponents
        containerStyle={{ padding: spacing.sm }}
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
          spender: <SpenderLabel value={expense.spender} />,
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
  const colors = useColors()
  const $shadowBoxStyle: ViewStyle = {
    backgroundColor: colors.background,
    borderColor: colors.border,
    margin: spacing.md,
    flexDirection: "column",
    rowGap: spacing.md,
    justifyContent: "space-between",
    borderRadius: spacing.md,
    padding: spacing.xs,
    borderWidth: 1,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 12.81,
    elevation: 16,
  }

  function onDetailPress(detailName: ExpenseInputName) {
    onExpenseDetailPress?.(detailName)
  }
  const $modeAndCategoryContainerStyle: ViewStyle = {
    flexWrap: "wrap",
    flex: 1,
    justifyContent: "flex-end",
  }
  const ModeAndCategory = () => (
    <TrasWithComponents
      tx="expense.new.card.modeAndCategoryLabel"
      containerStyle={$modeAndCategoryContainerStyle}
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

  const $headingStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: spacing.sm,
  }
  const HeadingComponent = (
    <View style={$headingStyle}>
      <DateLabel date={expense.date} onPress={onDetailPress} isHighlighted={editField === "date"} />
      <ModeAndCategory />
    </View>
  )

  const $payeeContainerStyle: ViewStyle = { flexWrap: "wrap", flex: 1, justifyContent: "flex-end" }
  const PayeeSummaryLabel = () => (
    <TrasWithComponents
      tx="expense.new.card.payeeLabel"
      containerStyle={$payeeContainerStyle}
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
        spender: <SpenderLabel value={expense.spender.split(" ")[0]} />,
      }}
    />
  )
  const $footerStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: spacing.sm,
  }
  const FooterComponent = (
    <View style={$footerStyle}>
      <SpenderSummaryLabel />
      <PayeeSummaryLabel />
    </View>
  )

  const $contentStyle: ViewStyle = { alignItems: "center" }
  const ContentComponent = (
    <View style={$contentStyle}>
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

interface PressableLabelProps {
  onPress?: (name: ExpenseInputName) => void
  isHighlighted?: boolean
}
const $highlightStyle = (colors: Colors) => ({ color: colors.highlight })
interface ExpenseAmountLabelProps extends PressableLabelProps {
  amount: number
}
function ExpenseAmountLabel({
  amount,
  onPress,
  isHighlighted,
  ...pressableProps
}: Readonly<ExpenseAmountLabelProps>) {
  const colors = useColors()

  const style: TextStyle = {
    fontSize: sizing.xxl,
    lineHeight: sizing.xxl,
    ...(isHighlighted ? $highlightStyle(colors) : {}),
  }
  return (
    <Pressable onPress={() => onPress?.("amount")} {...pressableProps}>
      <MoneyLabel amount={amount} style={style} subTextSymbol={true} />
    </Pressable>
  )
}

interface SpenderLabelProps extends PressableLabelProps {
  value: string
}
function SpenderLabel({ value, onPress }: Readonly<SpenderLabelProps>) {
  const spender = useMemberStore((state) => state.allMembers[value] ?? { name: value })
  return (
    <Pressable onPress={() => onPress?.("spender")}>
      <Text text={spender.name} preset="bold" />
    </Pressable>
  )
}

interface PayeeLabelProps extends PressableLabelProps {
  name: string
}
function PayeeLabel({ name, onPress, isHighlighted }: Readonly<PayeeLabelProps>) {
  const colors = useColors()
  return (
    <Pressable onPress={() => onPress?.("payee")}>
      <Text
        text={name.toLocaleLowerCase()}
        preset="bold"
        style={isHighlighted && $highlightStyle(colors)}
      />
    </Pressable>
  )
}

interface CategoryLabelProps extends PressableLabelProps {
  name: string
}
function CategoryLabel({ name, onPress, isHighlighted }: Readonly<CategoryLabelProps>) {
  const colors = useColors()
  return (
    <Pressable onPress={() => onPress?.("category")}>
      <Text preset="bold" style={isHighlighted && $highlightStyle(colors)}>
        {t(`expense.categories.${name}`, { defaultValue: name }).toLocaleLowerCase()}
      </Text>
    </Pressable>
  )
}

interface ModeLabelProps extends PressableLabelProps {
  mode: string
}
function ModeLabel({ mode, onPress, isHighlighted }: Readonly<ModeLabelProps>) {
  const colors = useColors()
  return (
    <Pressable onPress={() => onPress?.("mode")}>
      <Text preset="bold" style={isHighlighted && $highlightStyle(colors)}>
        {t(`expense.paymentModes.${mode}`, { defaultValue: mode }).toLocaleLowerCase()}
      </Text>
    </Pressable>
  )
}

interface DateLabelProps extends PressableLabelProps {
  date: Date
}
function DateLabel({ date, onPress, isHighlighted }: Readonly<DateLabelProps>) {
  const colors = useColors()
  return (
    <Pressable onPress={() => onPress?.("date")}>
      <Text
        text={date.toLocaleDateString()}
        preset="bold"
        style={isHighlighted && $highlightStyle(colors)}
      />
    </Pressable>
  )
}

interface LocationLabelProps extends PressableLabelProps {
  location?: ExpenseLocation
}
function LocationLabel({ location, onPress }: Readonly<LocationLabelProps>) {
  return (
    <Pressable onPress={() => onPress?.("location")}>
      <Text text={location?.toString()} preset="bold" />
    </Pressable>
  )
}
