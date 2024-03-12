import React, { useEffect } from "react"
import { View, ViewStyle, TextInput } from "react-native"
import { Button, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { ExpenseInput } from "./NewExpenseScreen"
import { Expense } from "app/models"
import MoneyInput from "./MoneyInput"

interface ExpenseFormProps {
  visibleField: ExpenseInput
  value: Expense
  onChange: (changedValue: Partial<Expense>) => void
  onSave?: () => void
}
export function ExpenseForm({
  visibleField,
  value: expense,
  onChange,
  onSave,
}: Readonly<ExpenseFormProps>) {
  return (
    <View style={$formContainerStyles}>
      {renderVisibleField(visibleField, expense, onChange)}
      <View style={$controlBarStyles}>
        <Button
          tx="expense.new.save"
          style={{ ...$buttonStyles, backgroundColor: colors.palette.secondary300 }}
          onPress={onSave}
        />
        <Button tx="expense.new.next" style={$buttonStyles} />
      </View>
    </View>
  )
}
function renderVisibleField(
  field: ExpenseInput,
  expense: Expense,
  onChange: (changedValue: Partial<Expense>) => void,
) {
  switch (field) {
    case "amount":
      return <ExpenseAmountInput amount={expense.amount} onChange={onChange} />
    case "category":
      return <ExpenseCategoryInput />
    case "payee":
      return <ExpensePayeeInput />
    case "spender":
      return <ExpenseSpenderInput />
    case "date":
      return <ExpenseDateInput />
    case "mode":
      return <ExpenseModeInput />
    case "location":
      return <ExpenseLocationInput />
    default:
      return null
  }
}
const $formContainerStyles: ViewStyle = {
  flex: 1,
  padding: spacing.lg,
  rowGap: spacing.md,
}
const $controlBarStyles: ViewStyle = {
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  columnGap: spacing.md,
}
const $buttonStyles: ViewStyle = {
  flex: 1,
}

interface ExpenseAmountInputProps {
  amount: number
  onChange: (changed: Partial<Expense>) => void
}
function ExpenseAmountInput({ amount, onChange }: Readonly<ExpenseAmountInputProps>) {
  const ref = React.useRef<TextInput>(null)
  const [amountText, setAmountText] = React.useState(amount.toString())
  useEffect(() => {
    ref.current?.focus()
  }, [])

  return <MoneyInput ref={ref} value={amountText} onChangeText={handleAmountChange} />

  function handleAmountChange(newAmountText: string) {
    setAmountText(newAmountText)
    onChange({ amount: parseFloat(newAmountText) ? parseFloat(newAmountText) : 0 })
  }
}

function ExpenseCategoryInput() {
  return (
    <TextField placeholderTx="expense.new.placeholder.category" labelTx="expense.new.category" />
  )
}

function ExpensePayeeInput() {
  return <TextField placeholderTx="expense.new.placeholder.payee" labelTx="expense.new.payee" />
}

function ExpenseSpenderInput() {
  return <TextField placeholderTx="expense.new.placeholder.spender" labelTx="expense.new.spender" />
}

function ExpenseDateInput() {
  return <TextField placeholderTx="expense.new.placeholder.date" labelTx="expense.new.date" />
}
function ExpenseModeInput() {
  return <TextField placeholderTx="expense.new.placeholder.mode" labelTx="expense.new.mode" />
}
function ExpenseLocationInput() {
  return (
    <TextField placeholderTx="expense.new.placeholder.location" labelTx="expense.new.location" />
  )
}
