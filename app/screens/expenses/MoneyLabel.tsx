import React from "react"
import { Text } from "app/components"
import { useLocale } from "app/utils/useLocale"
import { TextProps, TextStyle, View, ViewStyle } from "react-native"
import { sizing } from "app/theme"

export interface MoneyLabelProps extends Omit<TextProps, "text" | "style"> {
  amount: number
  subTextSymbol?: boolean
  style?: TextStyle
  containerStyle?: ViewStyle
}
export function MoneyLabel({
  amount,
  style,
  subTextSymbol = false,
  containerStyle,
  ...textProps
}: Readonly<MoneyLabelProps>) {
  const { digitGroupingRegex, digitGroupingSeparator, currencySymbol } = useLocale()
  const amountWithThousandsSeparator = amount
    .toFixed(2)
    .replace(digitGroupingRegex, digitGroupingSeparator ?? ",")

  const $moneyLabelContainerStyle: ViewStyle = { flexDirection: "row", alignItems: "center" }

  return (
    <View style={[$moneyLabelContainerStyle, containerStyle]}>
      <Text {...textProps} style={[style, subTextSymbol && $currencySymbolStyles(style)]}>
        {currencySymbol}
      </Text>
      <Text {...textProps} style={style}>
        {amountWithThousandsSeparator}
      </Text>
    </View>
  )
}
const DEFAULT_FONT_SIZE = sizing.lg
const $currencySymbolStyles = (textStyle?: TextStyle): TextStyle => ({
  fontSize: (textStyle?.fontSize ?? DEFAULT_FONT_SIZE) * 0.6,
  lineHeight: (textStyle?.fontSize ?? DEFAULT_FONT_SIZE) * 0.6,
  alignSelf: "center",
})
