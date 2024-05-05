import { Icon, SelectableList, SelectableListOption, Text } from "app/components"
import { MonthIdentifier, getMonthId, useExpenseStore } from "app/models"
import { colors, spacing } from "app/theme"
import { formatMonthId } from "app/utils/formatDate"
import { format } from "date-fns"
import { useState } from "react"
import { Modal, Pressable } from "react-native"

interface ExpenseMonthSelectorProps {
  onChange: (month: MonthIdentifier) => void
  value: MonthIdentifier
  color?: string
}
export function ExpenseMonthSelector({
  value,
  onChange: onChange,
  color,
}: ExpenseMonthSelectorProps): JSX.Element {
  const [isMonthSelectorVisible, setIsMonthSelectorVisible] = useState(false)
  const availableMonthsNumbers = useExpenseStore((state) => Object.keys(state.expensesByMonth))
  const availableMonthsNumbersWithCurrentMonth = new Set([
    ...availableMonthsNumbers,
    getMonthId(new Date()),
  ])

  const selectedMonth = new Date(formatMonthId(value))
  const availableMonthListItems = Array.from(availableMonthsNumbersWithCurrentMonth)
    .sort(byDescending)
    .map(convertToSelectable)
  return (
    <>
      <Pressable
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.xxs }}
        onPress={() => setIsMonthSelectorVisible(true)}
      >
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
        <Text
          preset="subheading"
          tx="expense.report.selectMonthTitle"
          style={{ margin: spacing.sm, alignSelf: "center" }}
        ></Text>
        <SelectableList
          options={availableMonthListItems}
          value={value}
          onChange={(value) => {
            onChange(value as MonthIdentifier)
            setIsMonthSelectorVisible(false)
          }}
        />
      </Modal>
    </>
  )

  function convertToSelectable(
    month: string,
    index: number,
    array: string[],
  ): SelectableListOption {
    const date = new Date(formatMonthId(month))
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
