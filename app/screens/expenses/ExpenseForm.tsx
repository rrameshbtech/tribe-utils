import React, { useEffect } from "react"
import { View, ViewStyle, TextInput } from "react-native"
import { AutoComplete, TextField, Icon } from "app/components"
import { colors, sizing, spacing } from "app/theme"
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
  onNext?: () => void
}
export function ExpenseForm({
  visibleField,
  value: expense,
  onChange,
  onSave,
  onNext
}: Readonly<ExpenseFormProps>) {
  return (
    <View style={$formContainerStyles}>
      {renderVisibleField(visibleField, expense, onChange, onNext)}
      <View style={$controlBarStyles}>
        <Icon
          type="FontAwesome"
          name="check"
          shape="square"
          size={sizing.xl}
          color={colors.background}
          containerStyle={{ backgroundColor: colors.palette.secondary400, opacity: 0.9 }}
          onPress={onSave}
        />
      </View>
    </View>
  )
}
function renderVisibleField(
  field: ExpenseInput,
  expense: Expense,
  onChange: (changedValue: Partial<Expense>) => void,
  onNext?: () => void
) {
  function updateAndMoveToNext(changedValue: Partial<Expense>) {
    onChange(changedValue)
    onNext?.()
  }
  switch (field) {
    case "amount":
      return <ExpenseAmountInput amount={expense.amount} onChange={onChange} onEndEditing={onNext} />
    case "category":
      return <ExpenseCategoryInput onChange={updateAndMoveToNext} value={expense.category} />
    case "payee":
      return <ExpensePayeeInput value={expense.payee} onChange={onChange} onEndEditing={onNext} />
    case "spender":
      return <ExpenseSpenderInput />
    case "date":
      return <ExpenseDateInput date={expense.date} onChange={onChange} />
    case "mode":
      return <PaymentModeInput value={expense.mode} onChange={updateAndMoveToNext} />
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
  position: "absolute",
  bottom: spacing.lg,
  right: spacing.lg,
  flexDirection: "row",
  justifyContent: "flex-end",
  alignItems: "center",
  columnGap: spacing.md,
}

interface ExpenseAmountInputProps {
  amount: number
  onChange: (changed: Partial<Expense>) => void
  onEndEditing?: () => void
}
function ExpenseAmountInput({ amount, onChange, onEndEditing }: Readonly<ExpenseAmountInputProps>) {
  const ref = React.useRef<TextInput>(null)
  const [amountText, setAmountText] = React.useState(amount.toString())
  useEffect(() => {
    ref.current?.focus()
  }, [])

  return (
    <MoneyInput ref={ref} value={amountText} onChangeText={handleAmountChange} onEndEditing={onEndEditing} />
  )

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
  onEndEditing?: () => void
}
function ExpensePayeeInput({ value, onChange, onEndEditing }: Readonly<ExpenseLocationInputProps>) {
  const payees = useRootStore((state) => state.payees)
  const ref = React.useRef<TextInput>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  function handleLocationChange(newLocation: string) {
    onChange({ payee: newLocation })
  }
  function updateAndMoveToNext(selectedPayee: string) {
    onChange({ payee: selectedPayee })
    onEndEditing?.()
  }

  return <AutoComplete {...{ value, ref }} onChangeText={handleLocationChange} onSelection={updateAndMoveToNext} onEndEditing={onEndEditing} options={payees} />
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
