import { TxKeyPath, translate } from "../i18n"
import React, { isValidElement } from "react"
import { Text, TextProps } from "./Text"
import { View, ViewStyle } from "react-native"

export interface TrasWithComponentsProps extends Omit<TextProps, "tx" | "txOptions" | "text"> {
  tx: TxKeyPath
  txOptions: Record<string, JSX.Element | string>
  containerStyle?: ViewStyle
}

/**
 * translate text with components
 * @param {TxKeyPath} tx - The i18n key.
 * @param {Record<string, JSX.Element | string>} txOptions - The i18n options with components in placeholder values.
 * @param {ViewStyle} containerStyles - The container styles.
 * @returns translated text with components enclosed in a container.
 * @example
 * ```tsx
 * <TrasWithComponents
 *  tx="expense.new.verbose"
 *  txOptions={{payee: "Amazon", amount: <Text preset="bold">{expense.amount.toLocaleString()}</Text> }}
 *  containerStyles={{flex: 1, flexDirection: "row"}}
 * />
 * ```
 */
export function TrasWithComponents({
  tx,
  txOptions,
  containerStyle: overrideContainerStyles,
  ...textOptions
}: Readonly<TrasWithComponentsProps>): JSX.Element {
  const containerStyles = { ...$containerBaseStyles, ...overrideContainerStyles }
  const [optionsWithJsx, optionsWithOutJSX] = groupOptionsByType(txOptions)

  const translatedText = translate(tx, optionsWithOutJSX)
  return (
    <View style={containerStyles}>
      {Object.keys(optionsWithJsx).length > 0 ? (
        replacePlaceholders(translatedText, optionsWithJsx, textOptions)
      ) : (
        <Text {...textOptions}>{translatedText}</Text>
      )}
    </View>
  )
}

type Placeholder = Record<string, JSX.Element>

function getFirstPlaceholder(text: string): string | null {
  const placeholderRegEx = /{{(\w+)}}/
  const matches = placeholderRegEx.exec(text)
  if (!matches) {
    return null
  }

  return `{{(${matches[1]})}}`
}

// recursively replace placeholders with components
function replacePlaceholders(
  text: string,
  placeholders: Placeholder,
  textOptions: TextProps = {}
): JSX.Element[] {
  if (!text) {
    return []
  }

  const firstPlaceholder = getFirstPlaceholder(text)
  if (!firstPlaceholder) {
    return [<Text {...textOptions} key="end-text" text={text} />]
  }

  const firstPlaceholderRegex = new RegExp(firstPlaceholder)
  const [beforeText, key, afterText] = text.split(firstPlaceholderRegex)
  const beforeTextComponent = beforeText
    ? [<Text {...textOptions} key={`${key}-before-text`} text={beforeText} />]
    : []
  const placeholderComponent = <View key={key}>{placeholders[key]}</View>

  return [
    ...beforeTextComponent,
    placeholderComponent,
    ...replacePlaceholders(afterText, placeholders),
  ]
}

function groupOptionsByType(txOptions: Record<string, string | JSX.Element>): [any, any] {
  const initialOptions: [Record<string, JSX.Element>, Record<string, any>] = [{}, {}]
  return Object.keys(txOptions).reduce((groupedOptions, key) => {
    const value = txOptions[key]
    if (isValidElement(value)) {
      return [
        { ...groupedOptions[0], [key]: value },
        { ...groupedOptions[1], [key]: `{{${key}}}` },
      ]
    }
    return [groupedOptions[0], { ...groupedOptions[1], [key]: value }]
  }, initialOptions)
}

const $containerBaseStyles: ViewStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
}
