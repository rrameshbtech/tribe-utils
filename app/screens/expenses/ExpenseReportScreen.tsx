import React, { FC, useEffect, useState } from "react"
import { Pressable, TextStyle, View, ViewStyle } from "react-native"
import { AppStackScreenProps, goBack } from "app/navigators"
import { Icon, Screen, Text, TrasWithComponents } from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { LineChart, PieChart, lineDataItem, pieDataItem } from "react-native-gifted-charts"
import { Expense, getExpenseSummary, useRootStore } from "app/models"
import { MoneyLabel } from "./MoneyLabel"
import { ScrollView } from "react-native-gesture-handler"
import { getDaysInMonth } from "date-fns"
import { TxKeyPath, convertToLocaleAbbrevatedNumber } from "app/i18n"

const CHART_WRAPPER_BACKGROUND_COLOR = colors.palette.secondary300
const CONTENT_TEXT_COLOR = colors.text

interface ExpenseReportScreenProps extends AppStackScreenProps<"ExpenseReport"> {}
export const ExpenseReportScreen: FC<ExpenseReportScreenProps> = function ExpenseReportScreen() {
  const summary = useRootStore(getExpenseSummary)
  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <ScrollView>
        <ReportHeader />
        <ReportSummary total={summary.total} largestExpense={summary.largest} />
        <PieChartByExpenseCategory data={summary.byCategory} />
        <PieChartByPaymentMode data={summary.byPaymentMode} />
        <PieChartByPayee data={summary.byPayee} />
        <LineChartByDate data={summary.byDate} />
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

function ReportHeader() {
  const $headerStyle: ViewStyle = {
    flex: 1,
    flexDirection: "row",
    padding: spacing.sm,
    backgroundColor: colors.tint,
    columnGap: spacing.sm,
    marginBottom: spacing.md,
  }
  const $iconContainerStyle: ViewStyle = { justifyContent: "center" }
  return (
    <View style={$headerStyle}>
      <Icon
        type="Material"
        name="arrow-left"
        onPress={goBack}
        color={colors.background}
        containerStyle={$iconContainerStyle}
      ></Icon>
      <Text
        tx="expense.report.title"
        txOptions={{ month: new Date().toLocaleString("default", { month: "long" }) }}
        preset="subheading"
        style={{ color: colors.background }}
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
  useEffect(() => setSelected(chartData[0].text ?? ""), [])

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
        ${expensesByCategory[selected]}
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
        scrollToEnd={true}
        dataPointsColor={colors.palette.accent500}
        yAxisTextNumberOfLines={2}
        yAxisLabelWidth={50}
        yAxisColor={CONTENT_TEXT_COLOR}
        color={colors.palette.accent500}
        startFillColor={colors.palette.accent500}
        endFillColor={colors.palette.accent200}
        areaChart
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
    borderColor: CHART_WRAPPER_BACKGROUND_COLOR,
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