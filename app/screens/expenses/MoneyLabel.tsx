import React from "react"
import { Presets, Text } from "app/components"
import { useLocale } from "app/utils/useLocale"
import { TextProps } from "react-native"

export interface MoneyLabelProps extends Omit<TextProps, "text"> {
  amount: number
  preset?: Presets
}
export function MoneyLabel({
  amount,
  preset,
  ...textProps
}: Readonly<MoneyLabelProps>) {
  const { digitGroupingRegex, digitGroupingSeparator, currencySymbol } = useLocale()
  const amountWithThousandsSeparator = amount
    .toFixed(2)
    .replace(digitGroupingRegex, digitGroupingSeparator ?? ",")

  return (
    <Text preset={preset} {...textProps}>
      {currencySymbol}
      {amountWithThousandsSeparator}
    </Text>
  )
}
