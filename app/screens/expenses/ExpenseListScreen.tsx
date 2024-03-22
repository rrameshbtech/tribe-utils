import React, { FC } from "react"
import { ViewStyle, View, FlatList, TouchableOpacity } from "react-native"
import { AppStackScreenProps, navigate } from "app/navigators"
import { EmptyState, Icon, Screen, Text, TextField } from "app/components"
import { ExpenseListItem } from "./ExpenseListItem"
import { colors, sizing, spacing } from "app/theme"
import { MoneyLabel } from "./MoneyLabel"
import { useRootStore, getVisibleExpenses, Expense, getVisibleExpenseTotal } from "app/models"

interface ExpenseListScreenProps extends AppStackScreenProps<"ExpenseList"> {}
export const ExpenseListScreen: FC<ExpenseListScreenProps> = function ExpenseListScreen() {
  const expenses = useRootStore(getVisibleExpenses)
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const toggleExpandedItem = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null)
    } else {
      setExpandedItem(id)
    }
  }
  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <View style={$listView}>
        <FlatList<Expense>
          renderItem={({ item: expense }) => (
            <ExpenseListItem
              {...{ expense }}
              onPress={toggleExpandedItem}
              isExpanded={expandedItem === expense.id}
            />
          )}
          data={expenses}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={<ExpenseListHeader />}
          stickyHeaderIndices={[0]}
          ListEmptyComponent={<EmptyState preset="noExpenses" />}
        />
      </View>
      <AddExpenseButton />
    </Screen>
  )
}

const $root: ViewStyle = {
  flex: 1,
}
const $screenContentContainer: ViewStyle = {
  flexGrow: 1,
}

const $listView: ViewStyle = {
  minHeight: 2,
  flex: 0.9,
  flexGrow: 1,
}

function ExpenseListHeader() {
  // Todo - search should have cancel button & filter should have a dropdown
  const setSearchTerm = useRootStore((state) => state.setSearchTerm)
  const searchTerm = useRootStore((state) => state.searchTerm)
  const durationFilter = useRootStore((state) => state.expenseFilter)

  const $expenseReportIconContainerStyle: ViewStyle = {
    alignSelf: "center",
    padding: sizing.xxs,
    marginLeft: sizing.xs,
    borderRadius: sizing.xxs,
    backgroundColor: colors.background
  }
  const $expenseSearchBarContainerStyle: ViewStyle = { flexDirection: "row" }
  const $expenseSearchBarStyle = { flex: 1 }
  return (
    <View style={$expenseListHeaderStyles}>
      <View style={$expenseSearchBarContainerStyle}>
        <TextField
          placeholderTx={`expense.list.searchPlaceholder.${durationFilter}`}
          LeftAccessory={(props) => <SearchIcon containerStyle={props.style} />}
          RightAccessory={(props) => <ExpenseFilterIcon containerStyle={props.style} />}
          inputWrapperStyle={$expenseSearchInputWrapperStyles}
          onChangeText={(text) => setSearchTerm(text)}
          value={searchTerm}
          containerStyle={$expenseSearchBarStyle}
        />
        <Icon
          type="FontAwesome"
          name="area-chart"
          color={colors.tint}
          containerStyle={$expenseReportIconContainerStyle}
          onPress={()=> navigate("ExpenseReport")}
        />
      </View>
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
  marginBottom: spacing.xxs,
}

interface SearchIconProps {
  containerStyle?: ViewStyle
}
function SearchIcon({ containerStyle }: Readonly<SearchIconProps>) {
  return (
    <Icon
      type="FontAwesome5"
      name="search-dollar"
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
  const durationFilter = useRootStore((state) => state.expenseFilter)
  const toggleFilter = useRootStore((state) => state.toggleExpenseFilter)

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
      <Icon type="image" name="calendarFilter" size={24} color={colors.palette.neutral600} />
      <Text size="xxxs" style={$iconTextStyles} tx={`expense.list.filter.${durationFilter}`} />
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
      <MoneyLabel amount={totalExpenses} style={{ color: colors.palette.neutral200 }} />
    </View>
  )
}

function AddExpenseButton() {
  const $rightBottomStyles: ViewStyle = {
    position: "absolute",
    bottom: spacing.xl,
    right: spacing.xl,
  }

  function goToAddExpenseScreen() {
    navigate("ExpenseEditor")
  }

  const $addExpenseButtonContainerStyle: ViewStyle = { backgroundColor: colors.tint, opacity: 0.9 }
  return (
    <TouchableOpacity
      style={$rightBottomStyles}
      accessibilityRole="button"
      onPress={goToAddExpenseScreen}
    >
      <Icon
        type="FontAwesome5"
        name="plus"
        shape="circle"
        size={sizing.xl}
        color={colors.background}
        containerStyle={$addExpenseButtonContainerStyle}
      />
    </TouchableOpacity>
  )
}
