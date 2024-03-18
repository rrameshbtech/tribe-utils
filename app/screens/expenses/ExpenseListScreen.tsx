import React, { FC } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, FlatList, TouchableOpacity } from "react-native"
import { AppStackScreenProps, navigate } from "app/navigators"
import { Icon, Screen, Text, TextField } from "app/components"
import { ExpenseListItem } from "./ExpenseListItem"
// import { EXPENSE_FILTER_DURATIONS, Expense, ExpenseFilterDurations, useStores } from "app/models"
import { colors, spacing } from "app/theme"
import { MoneyLabel } from "./MoneyLabel"
import { useRootStore, getVisibleExpenses,
  Expense, getVisibleExpenseTotal
 } from "app/states"


interface ExpenseListScreenProps extends AppStackScreenProps<"ExpenseList"> {}
export const ExpenseListScreen: FC<ExpenseListScreenProps> = observer(function ExpenseListScreen() {
  // const { expenseStore, userStore } = useStores()
  // useEffect(() => {
  //   expenseStore.init()
  //   userStore.init()
  // }, [expenseStore, userStore])

  const expenses =  useRootStore(getVisibleExpenses)

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
          data={expenses}
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
  const setSearchTerm = useRootStore(state => state.setSearchTerm)
  const searchTerm = useRootStore(state => state.searchTerm)
  
  return (
    <View style={$expenseListHeaderStyles}>
      <TextField
        placeholderTx="expense.list.searchPlaceholder"
        LeftAccessory={(props) => <SearchIcon containerStyle={props.style} />}
        RightAccessory={(props) => <ExpenseFilterIcon containerStyle={props.style} />}
        inputWrapperStyle={$expenseSearchInputWrapperStyles}
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
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
  const durationFilter = useRootStore(state => state.expenseFilter)
  const toggleFilter = useRootStore(state => state.toggleExpenseFilter)

  const $filterIconWrapperStyles: ViewStyle = {
    ...containerStyle,
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }
  const $iconTextStyles = { color: colors.palette.neutral600, lineHeight: 8 }

  return (
    <TouchableOpacity onPress={() => toggleFilter()} style={$filterIconWrapperStyles}>
      <Icon type="image" icon="calendarFilter" size={24} color={colors.palette.neutral600} />
      <Text
        size="xxxs"
        style={$iconTextStyles}
        tx={`expense.list.filter.${durationFilter}`}
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
  const totalExpenses = useRootStore(getVisibleExpenseTotal)
  return (
    <View style={$expenseSummaryStyles}>
      <Text style={{ color: colors.palette.neutral200 }} tx="expense.list.totalExpenses" />
      <MoneyLabel amount={totalExpenses} styles={{ color: colors.palette.neutral200 }} />
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
    <TouchableOpacity
      style={{ ...$rightBottomStyles, ...$circleStyles }}
      accessibilityRole="button"
      onPress={navigateToAddExpense}
    >
      <Icon type="FontAwesome5" icon="plus-circle" size={48} color={colors.tint} />
    </TouchableOpacity>
  )
}
