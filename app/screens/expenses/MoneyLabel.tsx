import React from 'react'
import { Presets, Text } from 'app/components'
import { useLocale } from 'app/utils/useLocale'

export interface MoneyLabelProps {
  amount: number,
  styles?: any,
  preset?: Presets,
}
export function MoneyLabel({ amount, preset, styles: amountLabelStyles }: Readonly<MoneyLabelProps>) {
  const { digitGroupingRegex, digitGroupingSeparator, currencySymbol } = useLocale()
  const amountWithThousandsSeparator = amount
    .toFixed(2)
    .replace(digitGroupingRegex, digitGroupingSeparator ?? ",")

  return (
    <Text preset={preset} style={amountLabelStyles}>
      {currencySymbol}
      {amountWithThousandsSeparator}
    </Text>
  )
}
