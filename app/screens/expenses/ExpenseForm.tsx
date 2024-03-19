import React, { useEffect } from "react"
import { View, ViewStyle, TextInput } from "react-native"
import {
  Button,
  AutoComplete,
  TextField,
} from "app/components"
import { colors, spacing } from "app/theme"
import { ExpenseInput } from "./NewExpenseScreen"
import { Expense, useRootStore } from "app/models"
import MoneyInput from "./MoneyInput"
import DatePicker from "react-native-date-picker"
import { useLocale } from "app/utils/useLocale"
import { SelectableList } from "app/components/SelectableList"

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
      return <ExpenseCategoryInput onChange={onChange} value={expense.category} />
    case "payee":
      return <ExpensePayeeInput value={expense.payee} onChange={onChange} />
    case "spender":
      return <ExpenseSpenderInput />
    case "date":
      return <ExpenseDateInput date={expense.date} onChange={onChange} />
    case "mode":
      return <PaymentModeInput value={expense.mode} onChange={onChange} />
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

interface ExpenseLocationInputProps {
  value: string
  onChange: (changed: Partial<Expense>) => void
}
function ExpensePayeeInput({ value, onChange }: Readonly<ExpenseLocationInputProps>) {
  const payees = useRootStore((state) => state.payees)
  const ref = React.useRef<TextInput>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  function handleLocationChange(newLocation: string) {
    onChange({ payee: newLocation })
  }

  return <AutoComplete {...{ value, ref }} onChange={handleLocationChange} options={payees} />
}

function ExpenseSpenderInput() {
  return <TextField placeholderTx="expense.new.placeholder.spender" labelTx="expense.new.spender" />
}

interface PaymentModeInputProps {
  onChange: (changed: Partial<Expense>) => void
  value: string
}
function PaymentModeInput({ value, onChange }: Readonly<PaymentModeInputProps>) {
  const paymentModes = useRootStore((state) => Object.values(state.paymentModes))
  const handlePaymentModeChange = (newMode: string) => {
    onChange({ mode: newMode })
  }
  return (
    <SelectableList
      options={paymentModes}
      value={value}
      onChange={handlePaymentModeChange}
      translationScope="expense.paymentModes"
    />
  )
}

interface ExpenseCategoryInputProps {
  onChange: (changed: Partial<Expense>) => void
  value: string
}
function ExpenseCategoryInput({
  onChange,
  value: selectedCategory,
}: Readonly<ExpenseCategoryInputProps>) {
  const handleCategorySelection = (newCategory: string) => {
    onChange({ category: newCategory })
  }
  const expenseCategories = useRootStore((state) => Object.values(state.expenseCategories))
  return (
    <SelectableList
      value={selectedCategory}
      onChange={handleCategorySelection}
      options={expenseCategories}
    />
  )
}

function ExpenseLocationInput() {
  return (
    <TextField
      autoComplete="postal-address-locality"
      placeholderTx="expense.new.placeholder.location"
      labelTx="expense.new.location"
    />
  )
}
