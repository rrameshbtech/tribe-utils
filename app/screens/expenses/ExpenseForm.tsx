import React, { useEffect } from "react"
import { View, ViewStyle, TextInput, AppState, Platform, Pressable, TextStyle } from "react-native"
import {
  AutoComplete,
  TextField,
  Icon,
  Text,
  MoneyInput,
  SelectableList,
  SelectableListOption,
} from "app/components"
import { useColors, sizing, spacing } from "app/theme"
import { ExpenseInputName } from "./ExpenseEditorScreen"
import { Expense, ExpenseCategory, PaymentMode, useExpenseStore } from "app/models"
import DatePicker from "react-native-date-picker"
import { useLocale } from "app/utils/useLocale"
import { TxKeyPath } from "app/i18n"
import { pipe } from "app/utils/fns"
import { formatMonthId } from "app/utils/formatDate"
import { lastDayOfMonth } from "date-fns"

interface ExpenseFormProps {
  field: ExpenseInputName
  value: Expense
  isEditing?: boolean
  onChange: (changedValue: Partial<Expense>) => void
  onSave?: () => void
  onNext?: () => void
}
export function ExpenseForm({
  field: visibleField,
  value: expense,
  isEditing = false,
  onChange,
  onSave,
  onNext,
}: Readonly<ExpenseFormProps>) {
  const colors = useColors()
  const $saveIconStyle = { backgroundColor: colors.tint, opacity: 0.9 }
  return (
    <View style={$formContainerStyles}>
      <ExpenseInput field={visibleField} {...{ expense, onChange, onNext, isEditing }} />
      <View style={$controlBarStyles}>
        <Pressable onPressIn={onSave}>
          <Icon
            type="FontAwesome"
            name="check"
            shape="square"
            size={sizing.xl}
            color={colors.background}
            containerStyle={$saveIconStyle}
          />
        </Pressable>
      </View>
    </View>
  )
}

type ExpenseInputProps = {
  field: ExpenseInputName
  expense: Expense
  isEditing?: boolean
  onChange: (changedValue: Partial<Expense>) => void
  onNext?: () => void
}
function ExpenseInput({
  field,
  expense,
  isEditing,
  onChange,
  onNext,
}: Readonly<ExpenseInputProps>) {
  function updateAndMoveToNext(changedValue: Partial<Expense>) {
    onChange(changedValue)
    onNext?.()
  }
  switch (field) {
    case "amount":
      return (
        <ExpenseAmountInput
          amount={expense.amount}
          onChange={onChange}
          onSubmitEditing={() => onNext?.()}
        />
      )
    case "category":
      return <ExpenseCategoryInput onChange={updateAndMoveToNext} value={expense.category} />
    case "payee":
      return (
        <ExpensePayeeInput value={expense.payee} onChange={onChange} onSubmitEditing={onNext} />
      )
    case "spender":
      return <ExpenseSpenderInput />
    case "date":
      return <ExpenseDateInput date={expense.date} onChange={onChange} isEditing={isEditing} />
    case "mode":
      return <PaymentModeInput value={expense.mode} onChange={updateAndMoveToNext} />
    case "location":
      return <ExpenseLocationInput />
    default:
      return <></>
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
  onSubmitEditing?: () => void
}
function ExpenseAmountInput({
  amount,
  onChange,
  onSubmitEditing,
}: Readonly<ExpenseAmountInputProps>) {
  const ref = React.useRef<TextInput>(null)
  const [amountText, setAmountText] = React.useState(amount.toString())

  useEffect(() => {
    ref.current?.focus()
    if (Platform.OS === "android") {
      return AppState.addEventListener("focus", () => ref.current?.focus()).remove
    }
  }, [])

  return (
    <>
      <InputLabel tx="expense.new.label.amount" />
      <MoneyInput
        ref={ref}
        value={amountText}
        onChangeText={handleAmountChange}
        styles={{ fontSize: sizing.xxl }}
        onSubmitEditing={onSubmitEditing}
        returnKeyType="next"
      />
    </>
  )

  function handleAmountChange(newAmountText: string) {
    setAmountText(newAmountText)
    onChange({ amount: parseFloat(newAmountText) ? parseFloat(newAmountText) : 0 })
  }
}

interface ExpenseDateInputProps {
  date: Date
  isEditing?: boolean
  onChange: (changed: Partial<Expense>) => void
}
function ExpenseDateInput({ date, isEditing, onChange }: Readonly<ExpenseDateInputProps>) {
  const colors = useColors()
  const selectedMonth = useExpenseStore((state) => state.selectedMonth)
  const { languageTag } = useLocale()
  const minSelectableDate = new Date(formatMonthId(selectedMonth))
  const maxSelectableDate = isEditing ? lastDayOfMonth(date) : new Date()
  const handleDateChange = (newDate: Date) => {
    onChange({ date: newDate })
  }

  return (
    <>
      <InputLabel tx="expense.new.label.date" />
      <DatePicker
        date={date}
        onDateChange={handleDateChange}
        minimumDate={minSelectableDate}
        maximumDate={maxSelectableDate}
        fadeToColor={colors.background}
        locale={languageTag}
      />
    </>
  )
}

function InputLabel({ tx }: { tx: TxKeyPath }) {
  const colors = useColors()
  const $labelStyle: TextStyle = { color: colors.textDim, alignSelf: "center" }
  return <Text tx={tx} style={$labelStyle}></Text>
}

interface ExpenseLocationInputProps {
  value: string
  onChange: (changed: Partial<Expense>) => void
  onSubmitEditing?: () => void
}
function ExpensePayeeInput({
  value,
  onChange,
  onSubmitEditing,
}: Readonly<ExpenseLocationInputProps>) {
  const payees = useExpenseStore((state) => state.payees)
  const ref = React.useRef<TextInput>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [])
  function handlePayeeChange(payee: string) {
    onChange({ payee })
  }
  function updateAndMoveToNext(selectedPayee: string) {
    onChange({ payee: selectedPayee })
    onSubmitEditing?.()
  }

  return (
    <>
      <InputLabel tx="expense.new.label.payee" />
      <AutoComplete
        {...{ value, ref }}
        onChangeText={handlePayeeChange}
        onSelection={updateAndMoveToNext}
        onSubmitEditing={onSubmitEditing}
        options={payees}
        inputMode="text"
        clearButtonMode="always"
        returnKeyType="next"
      />
    </>
  )
}

function ExpenseSpenderInput() {
  return <TextField placeholderTx="expense.new.label.spender" labelTx="expense.new.spender" />
}

interface PaymentModeInputProps {
  onChange: (changed: Partial<Expense>) => void
  value: string
}
function PaymentModeInput({ value, onChange }: Readonly<PaymentModeInputProps>) {
  const paymentModes = useExpenseStore((state) => Object.values(state.paymentModes))
  const handlePaymentModeChange = (newMode: string) => {
    onChange({ mode: newMode })
  }
  return (
    <>
      <InputLabel tx="expense.new.label.mode" />
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(paymentModes)}
        value={value}
        onChange={handlePaymentModeChange}
        translationScope="expense.paymentModes"
      />
    </>
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
  const expenseCategories = useExpenseStore((state) => Object.values(state.expenseCategories))
  return (
    <>
      <InputLabel tx="expense.new.label.category" />
      <SelectableList
        value={selectedCategory}
        onChange={handleCategorySelection}
        options={pipe(Object.values, convertToSelectableListOptions)(expenseCategories)}
        translationScope="expense.categories"
      />
    </>
  )
}

function convertToSelectableListOptions(items: PaymentMode[] | ExpenseCategory[]) {
  return items.map(
    (mode) =>
      ({
        value: mode.name,
        name: mode.name,
        icon: mode.icon,
      } as SelectableListOption),
  )
}

function ExpenseLocationInput() {
  return (
    <TextField
      autoComplete="postal-address-locality"
      placeholderTx="expense.new.label.location"
      labelTx="expense.new.location"
    />
  )
}
