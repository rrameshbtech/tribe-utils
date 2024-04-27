import React, { FC, useEffect, useState } from "react"
import { Alert, PermissionsAndroid, View, ViewStyle } from "react-native"
import { AppStackScreenProps, goBack } from "app/navigators"
import { Icon, Screen, Text } from "app/components"
import { colors, sizing, spacing } from "app/theme"
import {
  Expense,
  getCreateExpenseFnFor,
  getSelf,
  useExpenseStore,
  useMemberStore,
} from "app/models"
import { ExpenseSummaryCard } from "./ExpenseSummary"
import { ExpenseForm } from "./ExpenseForm"
import { TouchableOpacity } from "react-native-gesture-handler"
import { translate } from "app/i18n"
import Toast from "react-native-toast-message"
import { useNavigation } from "@react-navigation/native"
import Geolocation from "@react-native-community/geolocation"

interface ExpenseEditorScreenProps extends AppStackScreenProps<"ExpenseEditor"> {}
export type ExpenseInput =
  | "amount"
  | "category"
  | "payee"
  | "spender"
  | "date"
  | "mode"
  | "location"

type FormState = "fresh" | "changed" | "saved"
export const ExpenseEditorScreen: FC<ExpenseEditorScreenProps> = function ExpenseEditorScreen({
  route,
}) {
  const getExpense = useExpenseStore((state) => state.getExpense)
  const upsertExpense = useExpenseStore((state) => state.upsertExpense)
  const currentMember = useMemberStore(getSelf)
  const newExpense = useExpenseStore(getCreateExpenseFnFor(currentMember.id))
  const captureLocation = useExpenseStore((state) => state.configs.captureLocation)

  const { expenseId } = route.params
  const [editField, setEditField] = useState<ExpenseInput>("amount")
  const [expense, setExpense] = useState<Expense>(getExpense(expenseId) ?? newExpense)
  const [formState, setFormState] = useState<FormState>("fresh")
  const navigation = useNavigation()

  function onExpenseChange(changedValue: Partial<Expense>) {
    setExpense({
      ...expense,
      ...changedValue,
    })
    setFormState("changed")
  }

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (formState === "fresh" || formState === "saved") {
          return
        }

        e.preventDefault()
        Alert.alert(
          translate("expense.new.error.title"),
          translate("expense.new.error.forgotToSave"),
          [
            { text: translate("common.no"), style: "cancel", isPreferred: true },
            {
              text: translate("common.yes"),
              style: "destructive",
              onPress: () => navigation.dispatch(e.data.action),
            },
          ],
        )
      }),
    [formState, navigation],
  )

  useEffect(() => {
    if (formState === "saved") {
      goBack()
    }
  }, [formState])

  function onSave() {
    if (expense.amount === 0) {
      Toast.show({
        position: "top",
        text1: translate("expense.new.error.title"),
        text2: translate("expense.new.error.amountZero"),
        type: "error",
      })
      setEditField("amount")
      return
    }
    if (expense.location || !captureLocation) {
      saveExpense(expense)
      return
    }

    // Todo: Move this logic to a hook and in editor and make it async
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(
      (locationAllowed) => {
        if (locationAllowed) {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              expense.location = { latitude, longitude }
              saveExpense(expense)
            },
            (error) => {
              console.warn("Unexpected error when getting location for expense", error)
              saveExpense(expense)
            },
          )
        }
      },
    )
  }

  function saveExpense(expense: Expense) {
    upsertExpense(expense)
    setFormState("saved")
    Toast.show({
      text1: translate("expense.new.savedMessage"),
      position: "top",
    })
  }

  function toggleEditingField() {
    if (editField === "amount") {
      setEditField("category")
    } else if (editField === "category") {
      setEditField("mode")
    } else if (editField === "mode") {
      setEditField("payee")
    } else if (editField === "payee") {
      setEditField("date")
    }
  }

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
    >
      <ExpenseEditorHeader onClose={goBack} />
      <View style={$pageContentStyles}>
        <ExpenseSummaryCard
          {...{ expense, editField }}
          onExpenseDetailPress={(fieldName: ExpenseInput) => setEditField(fieldName)}
        />
        <ExpenseForm
          visibleField={editField}
          value={expense}
          onChange={onExpenseChange}
          onSave={onSave}
          onNext={toggleEditingField}
        />
      </View>
    </Screen>
  )
}
const $root: ViewStyle = {
  flex: 1,
  flexDirection: "column",
}

function ExpenseEditorHeader({ onClose }: { onClose?: () => void }) {
  return (
    <View style={$headerContainerStyles}>
      <View style={$titleContainerStyles}>
        <TouchableOpacity accessibilityRole="button" onPress={onClose}>
          <Icon name="close" type="Material" size={sizing.lg} />
        </TouchableOpacity>
        <Text preset="subheading" tx="expense.new.heading" style={{ color: colors.tint }} />
      </View>
      <View>
        <ExpenseSummaryModeToggle />
      </View>
    </View>
  )
}
const $headerContainerStyles: ViewStyle = {
  flex: 0,
  flexDirection: "row",
  justifyContent: "space-between",
  backgroundColor: colors.backgroundHighlight,
  borderBottomColor: colors.border,
  borderBottomWidth: 1,
  alignItems: "center",
  alignContent: "space-between",
  flexBasis: "auto",
  padding: spacing.md,
}
const $titleContainerStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignContent: "flex-start",
  alignItems: "center",
  gap: spacing.xxs,
  flexBasis: "auto",
}

const $screenContentContainer = {
  flex: 1,
  flexDirection: "column",
  paddingTop: 0,
} as ViewStyle

const $pageContentStyles: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  padding: 0,
}

function ExpenseSummaryModeToggle() {
  const mode = useExpenseStore((state) => state.expenseSummaryCardMode)
  const setExpenseSummaryCardMode = useExpenseStore((state) => state.setExpenseSummaryCardMode)

  if (mode === "details") {
    return (
      <Icon
        type="FontAwesome"
        name="align-left"
        size={sizing.lg}
        color={colors.text}
        onPress={() => setExpenseSummaryCardMode("card")}
      />
    )
  }
  return (
    <Icon
      type="FontAwesome"
      name="vcard-o"
      size={sizing.lg}
      color={colors.text}
      onPress={() => setExpenseSummaryCardMode("details")}
    />
  )
}
