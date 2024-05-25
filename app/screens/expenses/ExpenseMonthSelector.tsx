import { Icon, SelectableList, SelectableListOption, Text } from "app/components"
import { MonthIdentifier, getMonthId, useExpenseStore } from "app/models"
import { useColors, spacing } from "app/theme"
import { convertToDate } from "app/utils/formatDate"
import { format } from "date-fns"
import React, { useState } from "react"
import { Modal, Pressable, TextStyle, View, ViewStyle } from "react-native"

interface ExpenseMonthSelectorProps {
  onChange: (month: MonthIdentifier) => void
  value: MonthIdentifier
  color?: string
}
export function ExpenseMonthSelector({
  value,
  onChange,
  color,
}: ExpenseMonthSelectorProps): JSX.Element {
  const colors = useColors()
  const [isMonthSelectorVisible, setIsMonthSelectorVisible] = useState(false)
  const availableMonthsNumbers = useExpenseStore((state) => Object.keys(state.expensesByMonth))
  const availableMonthsNumbersWithCurrentMonth = new Set([
    ...availableMonthsNumbers,
    getMonthId(new Date()),
  ])

  const selectedMonth = convertToDate(value)
  const availableMonthListItems = Array.from(availableMonthsNumbersWithCurrentMonth)
    .sort(byDescending)
    .map(convertToSelectable)
  const $monthSelectionTitleStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  }
  const $monthTitleStyle: TextStyle = { margin: spacing.sm, alignSelf: "center" }
  const $monthSelectorModalStyle = { backgroundColor: colors.background, flex: 1 }
  return (
    <>
      <Pressable style={$monthSelectionTitleStyle} onPress={() => setIsMonthSelectorVisible(true)}>
        <Text
          preset="subheading"
          style={{ color: color ?? colors.tint }}
          text={format(selectedMonth, "MMMM yy")}
        ></Text>
        <Icon type="FontAwesome" name="caret-down" color={color ?? colors.tint} />
      </Pressable>
      <Modal
        visible={isMonthSelectorVisible}
        animationType="slide"
        onRequestClose={() => setIsMonthSelectorVisible(false)}
      >
        <View style={$monthSelectorModalStyle}>
          <Text
            preset="subheading"
            tx="expense.report.selectMonthTitle"
            style={$monthTitleStyle}
          ></Text>
          <SelectableList
            options={availableMonthListItems}
            value={value}
            style={{ backgroundColor: colors.background }}
            onChange={(value) => {
              onChange(value as MonthIdentifier)
              setIsMonthSelectorVisible(false)
            }}
          />
        </View>
      </Modal>
    </>
  )

  function convertToSelectable(month: string): SelectableListOption {
    const date = convertToDate(month)
    return {
      name: format(date, "MMMM''yy"),
      value: month,
      icon: {
        type: "initials",
        name: format(date, "MMM"),
      },
    } as SelectableListOption
  }

  function byDescending(a: string, b: string): number {
    return +b - +a
  }
}
