import React, { FC, useEffect, useState } from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps } from "app/navigators"
import { EmptyState, Screen, Text, TrasWithComponents, MoneyLabel } from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { LineChart, PieChart, lineDataItem, pieDataItem } from "react-native-gifted-charts"
import {
  Expense,
  MonthIdentifier,
  getExpenseSummary,
  useExpenseStore,
} from "app/models"
import { ScrollView } from "react-native-gesture-handler"
import { getDaysInMonth } from "date-fns"
import { TxKeyPath, convertToLocaleAbbrevatedNumber } from "app/i18n"
import { useLocale } from "app/utils/useLocale"
import { ExpenseMonthSelector } from "./ExpenseMonthSelector"

const HEADER_TEXT_COLOR = colors.tint
const CHART_WRAPPER_BACKGROUND_COLOR = colors.backgroundHighlight
const CHART_WRAPPER_BORDER_COLOR = colors.border
const CONTENT_TEXT_COLOR = colors.text
const CONTENT_HIGHLIGHT_TEXT_COLOR = colors.palette.primary600

interface ExpenseReportScreenProps extends AppStackScreenProps<"ExpenseReport"> {}
export const ExpenseReportScreen: FC<ExpenseReportScreenProps> = function ExpenseReportScreen() {
  const [reportMonth, setReportMonth] = useExpenseStore((state) => [
    state.selectedMonth,
    state.setSelectedMonth,
  ])
  const summary = useExpenseStore(getExpenseSummary(reportMonth))

  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
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
        {summary.total === 0 && <EmptyState preset="noExpensesReport" />}
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
    backgroundColor: colors.backgroundHighlight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
          month: (
            <ExpenseMonthSelector
              value={reportMonth}
              onChange={onReportMonthChange}
              color={HEADER_TEXT_COLOR}
            />
          ),
        }}
      />
    </View>
  )
}

type ChartDataType = {
  data: Record<string, number>
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
  data: totalByGroup,
  selected,
}: Readonly<PieChartInnerCircleProps>): React.JSX.Element {
  const MAX_TEXT_LENGTH = 8
  const getFontSize = (content: string) =>
    content.length <= MAX_TEXT_LENGTH ? sizing.md : sizing.sm
  const totalTextSize = getFontSize(totalByGroup[selected].toString())
  const groupTextSize = getFontSize(selected)

  const $pieChartInnerCircleStyle: ViewStyle = { justifyContent: "center", alignItems: "center" }
  const $groupTextStyle = { fontSize: groupTextSize, color: CONTENT_HIGHLIGHT_TEXT_COLOR }
  const $totalTextStyle = { fontSize: totalTextSize, color: CONTENT_HIGHLIGHT_TEXT_COLOR }

  return (
    <View style={$pieChartInnerCircleStyle}>
      <MoneyLabel amount={totalByGroup[selected]} style={$totalTextStyle} />
      <Text style={$groupTextStyle}>{selected}</Text>
    </View>
  )
}

function LineChartByDate({ data }: { data: Record<string, number> }) {
  const { currencySymbol } = useLocale()
  const chartData = Array(getDaysInMonth(new Date()))
    .fill(1)
    .map((_, index) => {
      const date = (index + 1).toString()
      return {
        value: data[date] ?? 0,
        labelComponent: () =>
          index === 0 || ((index ?? 0) + 1) % 5 === 0 ? (
            <Text style={{ fontSize: sizing.sm, color: CONTENT_TEXT_COLOR, width: sizing.lg }}>
              {date}
            </Text>
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
        xAxisTextNumberOfLines={2}
        formatYLabel={(label) =>
          `${currencySymbol}${convertToLocaleAbbrevatedNumber(parseFloat(label))}`
        }
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
    color: colors.tint,
  }
  return (
    <View style={$chartContainerStyle}>
      <Text preset="bold" tx={title} style={$chartTitleStyle} />
      {children}
    </View>
  )
}
