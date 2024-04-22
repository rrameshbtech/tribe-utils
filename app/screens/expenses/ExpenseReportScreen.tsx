import React, { FC, useEffect, useState } from "react"
import { Modal, Pressable, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  EmptyState,
  Icon,
  Screen,
  Text,
  TrasWithComponents,
  MoneyLabel,
  SelectableList,
  SelectableListOption,
} from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { LineChart, PieChart, lineDataItem, pieDataItem } from "react-native-gifted-charts"
import {
  Expense,
  MonthIdentifier,
  getExpenseSummary,
  getMonthId,
  useExpenseStore,
} from "app/models"
import { ScrollView } from "react-native-gesture-handler"
import { format, getDaysInMonth } from "date-fns"
import { TxKeyPath, convertToLocaleAbbrevatedNumber } from "app/i18n"

const HEADER_TEXT_COLOR = colors.background
const CHART_WRAPPER_BACKGROUND_COLOR = colors.palette.secondary100
const CHART_WRAPPER_BORDER_COLOR = colors.palette.secondary200
const CONTENT_TEXT_COLOR = colors.text
const MAX_MONEY_DECIMALS = 2

interface ExpenseReportScreenProps extends AppStackScreenProps<"ExpenseReport"> {}
export const ExpenseReportScreen: FC<ExpenseReportScreenProps> = function ExpenseReportScreen() {
  const [reportMonth, setReportMonth] = useState<MonthIdentifier>(getMonthId(new Date()))
  const summary = useExpenseStore(getExpenseSummary(reportMonth))

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <ScrollView>
        <ReportHeader reportMonth={reportMonth} onReportMonthChange={setReportMonth} />
        {summary.total > 0 && (
          <>
            <ReportSummary total={summary.total} largestExpense={summary.largest} />
            <PieChartByExpenseCategory data={summary.byCategory} />
            <PieChartByPaymentMode data={summary.byPaymentMode} />
            <PieChartByPayee data={summary.byPayee} />
            <LineChartByDate data={summary.byDate} />
          </>
        )}
        {summary.total === 0 && <EmptyState preset="noExpenses" />}
      </ScrollView>
    </Screen>
  )
}

interface ReportSummaryProps {
  total: number
  largestExpense?: Expense
}
function ReportSummary({ total, largestExpense }: Readonly<ReportSummaryProps>) {
  const $rowStyle: ViewStyle = { flexDirection: "row", alignItems: "flex-start", flexWrap: "wrap" }
  const $totalLabelStyle = { flex: 1, marginLeft: spacing.xs }
  return (
    <ChartWrapper title="expense.report.summary">
      <View style={$rowStyle}>
        <Text preset="bold">Total expenses:</Text>
        <MoneyLabel amount={total} containerStyle={$totalLabelStyle} />
      </View>
      <View style={$rowStyle}>
        <Text preset="bold">Largest expense:</Text>
        <View style={{ flex: 1, ...$rowStyle }}>
          <TrasWithComponents
            tx="expense.report.summaryLargestExpenseText"
            txOptions={{
              payee: largestExpense?.payee ?? "",
              amount: (
                <MoneyLabel
                  amount={largestExpense?.amount ?? 0}
                  containerStyle={{ marginHorizontal: spacing.xs }}
                />
              ),
              category: largestExpense?.category ?? "",
            }}
          />
        </View>
      </View>
    </ChartWrapper>
  )
}

interface ReportHeaderProps {
  reportMonth: MonthIdentifier
  onReportMonthChange: (month: MonthIdentifier) => void
}

function ReportHeader({ reportMonth, onReportMonthChange }: ReportHeaderProps) {
  const $headerStyle: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    padding: spacing.sm,
    backgroundColor: colors.tint,
    columnGap: spacing.sm,
    marginBottom: spacing.md,
  }
  return (
    <View style={$headerStyle}>
      <TrasWithComponents
        tx="expense.report.title"
        preset="subheading"
        style={{ color: HEADER_TEXT_COLOR }}
        txOptions={{
          month: <ReportMonthSelector {...{ reportMonth, onReportMonthChange }} />,
        }}
      />
    </View>
  )
}

type ChartDataType = {
  data: Record<string, number>
}
interface ReportMonthSelectorProps {
  onReportMonthChange: (month: MonthIdentifier) => void
  reportMonth: MonthIdentifier
}
function ReportMonthSelector({
  reportMonth,
  onReportMonthChange,
}: ReportMonthSelectorProps): JSX.Element {
  const [isMonthSelectorVisible, setIsMonthSelectorVisible] = useState(false)
  const availableMonthsNumbers = useExpenseStore((state) => Object.keys(state.expensesByMonth))
  const availableMonthsNumbersWithCurrentMonth = new Set([
    ...availableMonthsNumbers,
    getMonthId(new Date()),
  ])

  const formatMonthId = (month: string) => month.replace(/\B(?=(\d{4})*(\d{2})(?!\d))/g, "-")
  const selectedMonth = new Date(formatMonthId(reportMonth))
  const availableMonthListItems = Array.from(availableMonthsNumbersWithCurrentMonth).map(
    (month) => {
      const date = new Date(formatMonthId(month))
      return {
        name: format(date, "MMMM''yy"),
        value: month,
        icon: {
          type: "initials",
          name: format(date, "MMM"),
        },
      } as SelectableListOption
    },
  )
  return (
    <>
      <Pressable
        style={{ flexDirection: "row", alignItems: "center", gap: spacing.xxs }}
        onPress={() => setIsMonthSelectorVisible(true)}
      >
        <Text
          preset="subheading"
          style={{ color: HEADER_TEXT_COLOR }}
          text={format(selectedMonth, "MMMM yy")}
        ></Text>
        <Icon type="FontAwesome" name="caret-down" color={HEADER_TEXT_COLOR} />
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
          value={reportMonth}
          onChange={(value) => {
            onReportMonthChange(value as MonthIdentifier)
            setIsMonthSelectorVisible(false)
          }}
        />
      </Modal>
    </>
  )
}

function PieChartByExpenseCategory({ data }: ChartDataType) {
  return <ExpensePieChartByGroup title="expense.report.expenseByCategory" data={data} />
}

function PieChartByPaymentMode({ data }: ChartDataType) {
  return <ExpensePieChartByGroup title="expense.report.expenseByPaymentMode" data={data} />
}

function PieChartByPayee({ data }: ChartDataType) {
  return <ExpensePieChartByGroup title="expense.report.expenseByPayee" data={data} />
}

interface ExpensePieChartByGroupProps {
  title: TxKeyPath
  data: Record<string, number>
}
function ExpensePieChartByGroup({ title, data }: Readonly<ExpensePieChartByGroupProps>) {
  const [selected, setSelected] = useState("")

  const chartData = Object.keys(data)
    .reduce<pieDataItem[]>((chartItem, category, index) => {
      chartItem.push({
        value: data[category],
        color: colors.chartSectionColors[index],
        focused: category === selected,
        text: category,
      } as pieDataItem)
      return chartItem
    }, [])
    .sort((a, b) => b.value - a.value)
  useEffect(() => setSelected(chartData[0]?.text ?? ""), [data])

  return (
    <ChartWrapper title={title}>
      <PieChart
        data={chartData}
        donut
        sectionAutoFocus
        radius={90}
        innerRadius={60}
        innerCircleColor={CHART_WRAPPER_BACKGROUND_COLOR}
        centerLabelComponent={() => <PieChartInnerCircle {...{ data, selected }} />}
      />
      <Legends data={chartData} onSelect={setSelected} />
    </ChartWrapper>
  )
}

const $screenContentContainer: ViewStyle = {
  flexGrow: 1,
}
const $root: ViewStyle = {
  flex: 1,
}

interface LegendsProps {
  data: pieDataItem[]
  onSelect: (name: string) => void
}

const Legends = ({ data, onSelect }: LegendsProps) => {
  const $legendsStyle: ViewStyle = {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
    flexWrap: "wrap",
    gap: spacing.xs,
  }
  return (
    <View style={$legendsStyle}>
      {data.map((item) => (
        <Legend
          key={item.text}
          name={item.text ?? ""}
          subText={item.value.toString()}
          color={item.color ?? colors.tint}
          onPress={onSelect}
        />
      ))}
    </View>
  )
}

interface LegendProps {
  color: string
  name: string
  subText: string
  onPress?: (name: string) => void
}
const Legend = ({ color, name, subText, onPress }: Readonly<LegendProps>) => {
  const $legendStyle: ViewStyle = { flexDirection: "row", alignItems: "center" }
  return (
    <Pressable onPress={() => onPress?.(name)} style={$legendStyle}>
      <Dot color={color} />
      <Text style={{ color: CONTENT_TEXT_COLOR }}>{name} (</Text>
      <MoneyLabel amount={parseFloat(subText)} style={{ color: CONTENT_TEXT_COLOR }} />
      <Text style={{ color: CONTENT_TEXT_COLOR }}>)</Text>
    </Pressable>
  )
}

const Dot = ({ color }: { color: string }) => {
  const $dotStyle = {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: color,
    marginRight: 10,
  }
  return <View style={$dotStyle} />
}
interface PieChartInnerCircleProps {
  data: Record<string, number>
  selected: string
}
function PieChartInnerCircle({
  data: expensesByCategory,
  selected,
}: Readonly<PieChartInnerCircleProps>): React.JSX.Element {
  const $pieChartInnerCircleStyle: ViewStyle = { justifyContent: "center", alignItems: "center" }
  const $subTextStyle = { fontSize: sizing.md, color: CONTENT_TEXT_COLOR }
  return (
    <View style={$pieChartInnerCircleStyle}>
      <Text preset="bold" style={{ fontSize: sizing.lg, color: CONTENT_TEXT_COLOR }}>
        ${expensesByCategory[selected].toFixed(MAX_MONEY_DECIMALS)}
      </Text>
      <Text style={$subTextStyle}>{selected}</Text>
    </View>
  )
}

function LineChartByDate({ data }: { data: Record<string, number> }) {
  const chartData = Array(getDaysInMonth(new Date()))
    .fill(1)
    .map((_, index) => {
      const date = (index + 1).toString()
      return {
        value: data[date] ?? 0,
        labelComponent: () =>
          index === 0 || ((index ?? 0) + 1) % 5 === 0 ? (
            <Text style={{ fontSize: sizing.sm, color: CONTENT_TEXT_COLOR }}>{date}</Text>
          ) : (
            <></>
          ),
      } as lineDataItem
    })

  return (
    <ChartWrapper title="expense.report.expenseByDate">
      <LineChart
        initialSpacing={0}
        noOfSections={3}
        spacing={15}
        data={chartData}
        dataPointsColor={colors.palette.accent500}
        yAxisTextNumberOfLines={2}
        yAxisLabelWidth={50}
        yAxisColor={CONTENT_TEXT_COLOR}
        color={colors.palette.accent500}
        startFillColor={colors.palette.accent500}
        endFillColor={colors.palette.accent200}
        areaChart
        hideDataPoints1
        yAxisTextStyle={{ fontSize: sizing.sm, color: CONTENT_TEXT_COLOR }}
        xAxisColor={CONTENT_TEXT_COLOR}
        formatYLabel={(label) => "$ " + convertToLocaleAbbrevatedNumber(parseFloat(label))}
      />
    </ChartWrapper>
  )
}

interface ChartWrapperProps {
  title: TxKeyPath
  children: any
}

function ChartWrapper({ title, children }: Readonly<ChartWrapperProps>) {
  const $chartContainerStyle: ViewStyle = {
    alignItems: "center",
    backgroundColor: CHART_WRAPPER_BACKGROUND_COLOR,
    padding: spacing.sm,
    borderColor: CHART_WRAPPER_BORDER_COLOR,
    borderWidth: 1,
    borderRadius: sizing.xs,
    margin: spacing.xs,
  }

  const $chartTitleStyle: TextStyle = {
    alignSelf: "flex-start",
    marginBottom: spacing.sm,
    color: CONTENT_TEXT_COLOR,
  }
  return (
    <View style={$chartContainerStyle}>
      <Text preset="subheading" tx={title} style={$chartTitleStyle} />
      {children}
    </View>
  )
}
