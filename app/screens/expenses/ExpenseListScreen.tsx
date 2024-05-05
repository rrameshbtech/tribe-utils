import React, { FC, useEffect } from "react"
import { ViewStyle, View, FlatList, TouchableOpacity, TextInput } from "react-native"
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
import { useColors, sizing, spacing } from "app/theme"
import {
  useExpenseStore,
  getVisibleExpenses,
  Expense,
  getVisibleExpenseTotal,
  isCurrentMonthSelected,
} from "app/models"
import { ExpenseMonthSelector } from "./ExpenseMonthSelector"
import { useNavigation } from "@react-navigation/native"

interface ExpenseListScreenProps extends AppStackScreenProps<"ExpenseList"> {}
export const ExpenseListScreen: FC<ExpenseListScreenProps> = function ExpenseListScreen() {
  const expenses = useExpenseStore(getVisibleExpenses)
  const colors = useColors()
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null)
  const toggleExpandedItem = (id: string) => {
    if (expandedItem === id) {
      setExpandedItem(null)
    } else {
      setExpandedItem(id)
    }
  }
  const $root: ViewStyle = {
    flex: 1,
  }
  const $screenContentContainer: ViewStyle = {
    flexGrow: 1,
  }

  const $listContainerStyle: ViewStyle = {
    minHeight: 2,
    flex: 0.9,
    flexGrow: 1,
    backgroundColor: colors.background,
  }

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
    >
      <View style={$listContainerStyle}>
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

function ExpenseListHeader() {
  const colors = useColors()
  const [isSearchActive, setIsSearchActive] = React.useState(false)
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
  const colors = useColors()
  const setSelectedMonth = useExpenseStore((state) => state.setSelectedMonth)
  const selectedMonth = useExpenseStore((state) => state.selectedMonth)

  const $filterContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  }
  const $filterToolsContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  }
  return (
    <View style={$filterContainerStyle}>
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
      <View style={$filterToolsContainerStyle}>
        <SearchIcon onPress={onSearchPress} />
        <ExpenseFilterIcon />
      </View>
    </View>
  )
}

interface SearchIconProps {
  onPress?: () => void
  containerStyle?: ViewStyle
}
function ExpenseListSearchInput({ onBackPress }: { onBackPress: () => void }) {
  // TODO: filter should have a dropdown
  const navigation = useNavigation()
  const setSearchTerm = useExpenseStore((state) => state.setSearchTerm)
  const ref = React.useRef<TextInput>(null)
  const searchTerm = useExpenseStore((state) => state.searchTerm)
  const durationFilter = useExpenseStore((state) =>
    isCurrentMonthSelected(state) ? state.expenseFilter : "Month",
  )

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        onBackPress()
        e.preventDefault()
      }),
    [navigation, onBackPress],
  )

  useEffect(() => {
    if (ref.current) {
      ref.current.focus()
    }
  }, [])

  const $expenseSearchBarStyle = { flex: 1 }
  const $searchInputContainerStyle: ViewStyle = { flexDirection: "row" }
  return (
    <View style={$searchInputContainerStyle}>
      <TextField
        placeholderTx={`expense.list.searchPlaceholder.${durationFilter}`}
        LeftAccessory={(props) => <BackIcon containerStyle={props.style} onPress={onBackPress} />}
        RightAccessory={(props) => <RightsideAction props={props} />}
        inputWrapperStyle={$expenseSearchInputWrapperStyles}
        onChangeText={(text) => setSearchTerm(text)}
        ref={ref}
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
    const colors = useColors()
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
  const colors = useColors()
  return (
    <Icon type="Ionicons" name="search-sharp" size={sizing.xl} color={colors.textDim} {...props} />
  )
}

interface ExpenseFilterIconProps {
  containerStyle?: ViewStyle
}
function ExpenseFilterIcon({ containerStyle }: Readonly<ExpenseFilterIconProps>) {
  const colors = useColors()
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
  const colors = useColors()
  const totalExpenses = useExpenseStore(getVisibleExpenseTotal)
  return (
    <View style={$expenseSummaryStyles}>
      <Text style={{ color: colors.textDim }} tx="expense.list.totalExpenses" />
      <MoneyLabel amount={totalExpenses} style={{ color: colors.textDim }} />
    </View>
  )
}

function AddExpenseButton() {
  const colors = useColors()
  const $rightBottomStyles: ViewStyle = {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
  }

  function goToAddExpenseScreen() {
    navigate("ExpenseEditor")
  }

  const $addExpenseButtonContainerStyle: ViewStyle = {
    backgroundColor: colors.tint,
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
