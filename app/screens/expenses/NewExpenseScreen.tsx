import React, { FC, useEffect } from "react"
import { Alert, View, ViewStyle } from "react-native"
import { AppStackScreenProps, goBack, navigate } from "app/navigators"
import { Icon, Screen, Text } from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { Expense, initExpense, useRootStore } from "app/models"
import { ExpenseSummaryCard } from "./ExpenseSummary"
import { ExpenseForm } from "./ExpenseForm"
import { TouchableOpacity } from "react-native-gesture-handler"
import { translate } from "app/i18n"
import { useNavigation } from "@react-navigation/native"

interface NewExpenseScreenProps extends AppStackScreenProps<"NewExpense"> {}
export type ExpenseInput =
  | "amount"
  | "category"
  | "payee"
  | "spender"
  | "date"
  | "mode"
  | "location"

export const NewExpenseScreen: FC<NewExpenseScreenProps> = function NewExpenseScreen() {
  const [editField, setEditField] = React.useState<ExpenseInput>("amount")
  const [expense, setExpense] = React.useState<Expense>(initExpense())
  const [isDirty, setIsDirty] = React.useState(false)
  const navigation = useNavigation()

  const addExpense = useRootStore((state) => state.addExpense)
  function onExpenseChange(changedValue: Partial<Expense>) {
    setExpense({
      ...expense,
      ...changedValue,
    })
    setIsDirty(true)
  }

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!isDirty) {
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
    [isDirty, navigation],
  )

  function onSave() {
    if (expense.amount === 0) {
      Alert.alert(translate("expense.new.error.title"), translate("expense.new.error.amountZero"), [
        { text: translate("common.ok"), onPress: () => setEditField("amount") },
      ])
      return
    }
    addExpense(expense)
    navigate("ExpenseList")
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
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <NewExpenseHeader onClose={goBack} />
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

function NewExpenseHeader({ onClose }: { onClose?: () => void }) {
  return (
    <View style={$headerContainerStyles}>
      <View style={$titleContainerStyles}>
        <TouchableOpacity accessibilityRole="button" onPress={onClose}>
          <Icon
            name="close"
            type="Material"
            style={{ marginLeft: spacing.xs }}
            size={24}
            color={colors.palette.neutral300}
          />
        </TouchableOpacity>
        <Text
          preset="subheading"
          style={{ color: colors.palette.neutral200 }}
          tx="expense.new.heading"
        />
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
  backgroundColor: colors.tint,
  alignItems: "center",
  alignContent: "space-between",
  flexBasis: "auto",
  height: 64,
  padding: spacing.md,
}
const $titleContainerStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  alignContent: "flex-start",
  alignItems: "center",
  gap: spacing.sm,
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
  const mode = useRootStore((state) => state.expenseSummaryCardMode)
  const setExpenseSummaryCardMode = useRootStore((state) => state.setExpenseSummaryCardMode)

  if (mode === "details") {
    return (
      <Icon
        type="FontAwesome"
        name="align-left"
        size={sizing.md}
        color={colors.palette.neutral300}
        onPress={() => setExpenseSummaryCardMode("card")}
      />
    )
  }
  return (
    <Icon
      type="FontAwesome"
      name="vcard-o"
      size={sizing.md}
      color={colors.palette.neutral300}
      onPress={() => setExpenseSummaryCardMode("details")}
    />
  )
}
