import React from 'react'
import { Presets, Text } from 'app/components'
import { useLocale } from 'app/utils/useLocale'

export interface AmountLabelProps {
  amount: number,
  styles?: any,
  preset?: Presets
}
export function AmountLabel({ amount, preset, styles: amountLabelStyles }: Readonly<AmountLabelProps>) {
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
