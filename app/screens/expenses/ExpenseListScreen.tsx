import React, { FC, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, FlatList, TouchableOpacity } from "react-native"
import { AppStackScreenProps, navigate } from "app/navigators"
import { Icon, Screen, Text, TextField } from "app/components"
import { ExpenseListItem } from "./ExpenseListItem"
import { EXPENSE_FILTER_DURATIONS, Expense, ExpenseFilterDurations, useStores } from "app/models"
import { colors, spacing } from "app/theme"
import { AmountLabel } from "./AmountLabel"

interface ExpenseListScreenProps extends AppStackScreenProps<"ExpenseList"> {}
export const ExpenseListScreen: FC<ExpenseListScreenProps> = observer(function ExpenseListScreen() {
  const { expenseStore } = useStores()
  useEffect(() => {
    expenseStore.init()
  }, [expenseStore])

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <View style={$listView}>
        <FlatList<Expense>
          renderItem={({ item }) => <ExpenseListItem expense={item} />}
          data={expenseStore.visibleExpenses}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<ExpenseListHeader />}
          stickyHeaderIndices={[0]}
        />
      </View>
      <AddExpenseButton />
    </Screen>
  )
})

const $root: ViewStyle = {
  flex: 1,
}
const $screenContentContainer: ViewStyle = {
  paddingBottom: spacing.md,
  flexGrow: 1,
}

const $listView: ViewStyle = {
  minHeight: 2,
  flex: 0.9,
  flexGrow: 1,
}

function ExpenseListHeader() {
  // Todo - search should have cancel button & filter should have a dropdown
  const { expenseStore } = useStores()
  return (
    <View style={$expenseListHeaderStyles}>
      <TextField
        placeholderTx="expense.list.searchPlaceholder"
        LeftAccessory={(props) => <SearchIcon containerStyle={props.style} />}
        RightAccessory={(props) => <ExpenseFilterIcon containerStyle={props.style} />}
        inputWrapperStyle={$expenseSearchInputWrapperStyles}
        onChangeText={(text) => expenseStore.setSearchTerm(text)}
        value={expenseStore.searchTerm}
      />
      <ExpenseSummary />
    </View>
  )
}
const $expenseSearchInputWrapperStyles = { borderRadius: 24 }
const $expenseListHeaderStyles: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: colors.palette.primary500,
  padding: spacing.xs,
}

interface SearchIconProps {
  containerStyle?: ViewStyle
}
function SearchIcon({ containerStyle }: Readonly<SearchIconProps>) {
  return (
    <Icon
      type="FontAwesome5"
      icon="search-dollar"
      size={24}
      color={colors.palette.neutral600}
      containerStyle={containerStyle}
    />
  )
}

interface ExpenseFilterIconProps {
  containerStyle?: ViewStyle
}
function ExpenseFilterIcon({ containerStyle }: Readonly<ExpenseFilterIconProps>) {
  const { expenseStore } = useStores()
  const toggle = () => {
    const currentIndex = EXPENSE_FILTER_DURATIONS.indexOf(expenseStore.durationFilter)
    const nextIndex = (currentIndex + 1) % EXPENSE_FILTER_DURATIONS.length
    const nextDuration = EXPENSE_FILTER_DURATIONS[nextIndex]

    expenseStore.setDurationFilter(nextDuration)
  }

  const $filterIconWrapperStyles: ViewStyle = {
    ...containerStyle,
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }
  const $iconTextStyles = { color: colors.palette.neutral600, lineHeight: 8 }

  return (
    <TouchableOpacity onPress={toggle} style={$filterIconWrapperStyles}>
      <Icon type="image" icon="calendarFilter" size={24} color={colors.palette.neutral600} />
      <Text
        size="xxxs"
        style={$iconTextStyles}
        tx={`expense.list.filter.${expenseStore.durationFilter as ExpenseFilterDurations}`}
      />
    </TouchableOpacity>
  )
}

const $expenseSummaryStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  columnGap: spacing.xs,
  justifyContent: "flex-end",
  backgroundColor: colors.palette.primary500,
  padding: spacing.xs,
}
function ExpenseSummary() {
  const { expenseStore } = useStores()
  const totalExpenses = expenseStore.visibleExpenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  )
  return (
    <View style={$expenseSummaryStyles}>
      <Text style={{ color: colors.palette.neutral200 }} tx="expense.list.totalExpenses" />
      <AmountLabel amount={totalExpenses} styles={{ color: colors.palette.neutral200 }} />
    </View>
  )
}

function AddExpenseButton() {
  const $rightBottomStyles: ViewStyle = {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
  }
  const $circleStyles = {
    backgroundColor: colors.background,
    borderRadius: 50,
  }
  function navigateToAddExpense() {
    navigate("NewExpense")
  }

  return (
    <TouchableOpacity style={{ ...$rightBottomStyles, ...$circleStyles}} accessibilityRole="button" onPress={navigateToAddExpense} >
      <Icon type="FontAwesome5" icon="plus-circle" size={48} color={colors.tint}/>
    </TouchableOpacity>
  )
}