import React, { FC } from "react"
import { ViewStyle, View, FlatList, TouchableOpacity } from "react-native"
import { AppStackScreenProps, navigate } from "app/navigators"
import {
  EmptyState,
  Icon,
  Screen,
  Text,
  TextField,
  MoneyLabel,
  TextFieldAccessoryProps,
  TrasWithComponents,
} from "app/components"
import { ExpenseListItem } from "./ExpenseListItem"
import { colors, sizing, spacing } from "app/theme"
import {
  useExpenseStore,
  getVisibleExpenses,
  Expense,
  getVisibleExpenseTotal,
  isCurrentMonthSelected,
} from "app/models"
import { ExpenseMonthSelector } from "./ExpenseMonthSelector"

interface ExpenseListScreenProps extends AppStackScreenProps<"ExpenseList"> {}
export const ExpenseListScreen: FC<ExpenseListScreenProps> = function ExpenseListScreen() {
  const expenses = useExpenseStore(getVisibleExpenses)

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
      safeAreaEdges={["top"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
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
  const [isSearchActive, setIsSearchActive] = React.useState(false)
  return (
    <View style={$expenseListHeaderStyles}>
      {isSearchActive && <ExpenseListSearchInput onBackPress={() => setIsSearchActive(false)} />}
      {!isSearchActive && <ExpenseFilter onSearchPress={() => setIsSearchActive(true)} />}
      <ExpenseSummary />
    </View>
  )
}

const $expenseSearchInputWrapperStyles = { borderRadius: 24 }

function ExpenseFilter({ onSearchPress }: { onSearchPress: () => void }) {
  const setSelectedMonth = useExpenseStore((state) => state.setSelectedMonth)
  const selectedMonth = useExpenseStore((state) => state.selectedMonth)
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <TrasWithComponents
        tx="expense.list.title"
        preset="subheading"
        style={{ color: colors.tint }}
        txOptions={{
          month: (
            <ExpenseMonthSelector
              value={selectedMonth}
              onChange={setSelectedMonth}
              color={colors.tint}
            />
          ),
        }}
      />
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.sm }}>
        <SearchIcon onPress={onSearchPress} />
        <ExpenseFilterIcon />
      </View>
    </View>
  )
}
const $expenseListHeaderStyles: ViewStyle = {
  flex: 1,
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundColor: colors.backgroundHighlight,
  padding: spacing.xs,
  marginBottom: spacing.xxs,
  borderBottomColor: colors.border,
  borderBottomWidth: 1,
}

interface SearchIconProps {
  onPress?: () => void
  containerStyle?: ViewStyle
}
function ExpenseListSearchInput({ onBackPress }: { onBackPress: () => void }) {
  // TODO: filter should have a dropdown
  const setSearchTerm = useExpenseStore((state) => state.setSearchTerm)
  const searchTerm = useExpenseStore((state) => state.searchTerm)
  const durationFilter = useExpenseStore((state) =>
    isCurrentMonthSelected(state) ? state.expenseFilter : "Month",
  )

  const $expenseSearchBarStyle = { flex: 1 }
  return (
    <View style={{ flexDirection: "row" }}>
      <TextField
        placeholderTx={`expense.list.searchPlaceholder.${durationFilter}`}
        LeftAccessory={(props) => <BackIcon containerStyle={props.style} onPress={onBackPress} />}
        RightAccessory={(props) => <RightsideAction props={props} />}
        inputWrapperStyle={$expenseSearchInputWrapperStyles}
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
        containerStyle={$expenseSearchBarStyle}
        inputMode="search"
      />
    </View>
  )
  function BackIcon({ containerStyle, onPress }: Readonly<SearchIconProps> = {}) {
    return <Icon type="image" name="back" onPress={onPress} containerStyle={containerStyle} />
  }
  function ClearSearchIcon({ containerStyle }: Readonly<SearchIconProps> = {}) {
    return (
      <TouchableOpacity onPress={() => setSearchTerm("")} style={containerStyle}>
        <Icon
          type="Material"
          name="close"
          size={sizing.lg}
          color={colors.textDim}
          containerStyle={containerStyle}
        />
      </TouchableOpacity>
    )
  }

  function RightsideAction({ props }: { props: TextFieldAccessoryProps }) {
    return searchTerm && <ClearSearchIcon containerStyle={props.style} />
  }
}

function SearchIcon(props: Readonly<SearchIconProps>) {
  return (
    <Icon type="Ionicons" name="search-sharp" size={sizing.xl} color={colors.textDim} {...props} />
  )
}

interface ExpenseFilterIconProps {
  containerStyle?: ViewStyle
}
function ExpenseFilterIcon({ containerStyle }: Readonly<ExpenseFilterIconProps>) {
  const [durationFilter, isDisabled] = useExpenseStore((state) => [
    state.expenseFilter,
    !isCurrentMonthSelected(state),
  ])
  const color = !isDisabled ? colors.text : colors.textDim
  const currentFilter = !isDisabled ? durationFilter : "Month"
  const toggleFilter = useExpenseStore((state) => state.toggleExpenseFilter)
  const $filterIconWrapperStyles: ViewStyle = {
    ...containerStyle,
    flex: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  }
  const $iconTextStyles = { color: color, lineHeight: sizing.xs }

  return (
    <TouchableOpacity disabled={isDisabled} onPress={toggleFilter} style={$filterIconWrapperStyles}>
      <Icon type="image" name="calendarFilter" size={sizing.lg} color={color} />
      <Text size="xxxs" style={$iconTextStyles} tx={`expense.list.filter.${currentFilter}`} />
    </TouchableOpacity>
  )
}

const $expenseSummaryStyles: ViewStyle = {
  flex: 1,
  flexDirection: "row",
  columnGap: spacing.xs,
  justifyContent: "flex-end",
  padding: spacing.xxs,
}
function ExpenseSummary() {
  const totalExpenses = useExpenseStore(getVisibleExpenseTotal)
  return (
    <View style={$expenseSummaryStyles}>
      <Text style={{ color: colors.textDim }} tx="expense.list.totalExpenses" />
      <MoneyLabel amount={totalExpenses} style={{ color: colors.textDim }} />
    </View>
  )
}

function AddExpenseButton() {
  const $rightBottomStyles: ViewStyle = {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
  }

  function goToAddExpenseScreen() {
    navigate("ExpenseEditor")
  }

  const $addExpenseButtonContainerStyle: ViewStyle = {
    backgroundColor: colors.palette.primary500,
    opacity: 0.9,
  }
  return (
    <TouchableOpacity
      style={$rightBottomStyles}
      accessibilityRole="button"
      onPress={goToAddExpenseScreen}
    >
      <Icon
        type="FontAwesome"
        name="plus"
        shape="circle"
        size={sizing.xl}
        color={colors.background}
        containerStyle={$addExpenseButtonContainerStyle}
      />
    </TouchableOpacity>
  )
}
