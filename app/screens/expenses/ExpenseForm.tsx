import React, { useEffect } from "react"
import { View, ViewStyle, TextInput } from "react-native"
import { Button, AutoComplete, TextField } from "app/components"
import { colors, spacing } from "app/theme"
import { ExpenseInput } from "./NewExpenseScreen"
import { Expense } from "app/models"
import MoneyInput from "./MoneyInput"
import DatePicker from "react-native-date-picker"
import { useLocale } from 'app/utils/useLocale'

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
      return <ExpenseDateInput date={expense.date} onChange={onChange} />
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

interface ExpenseDateInputProps {
  date: Date
  onChange: (changed: Partial<Expense>) => void
}
function ExpenseDateInput({ date, onChange }: Readonly<ExpenseDateInputProps>) {
  const { languageTag } = useLocale()
  // TODO: change this if we want to allow users to select past month expenses
  const firstDayOfCurrentMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const handleDateChange = (newDate: Date) => {
    onChange({ date: newDate })
  }
  
  return (
    <DatePicker
      date={date}
      onDateChange={handleDateChange}
      minimumDate={firstDayOfCurrentMonth}
      maximumDate={new Date()}
      fadeToColor={colors.background}
      locale={languageTag}
    />
  )
}

function ExpenseCategoryInput() {
  return (
    <TextField placeholderTx="expense.new.placeholder.category" labelTx="expense.new.category" />
  )
}

function ExpensePayeeInput() {
  const ref = React.useRef<TextInput>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])

  return <AutoComplete ref={ref} />
}

function ExpenseSpenderInput() {
  return <TextField placeholderTx="expense.new.placeholder.spender" labelTx="expense.new.spender" />
}

function ExpenseModeInput() {
  return <TextField placeholderTx="expense.new.placeholder.mode" labelTx="expense.new.mode" />
}
function ExpenseLocationInput() {
  return (
    <TextField autoComplete="postal-address-locality" placeholderTx="expense.new.placeholder.location" labelTx="expense.new.location" />
  )
}
