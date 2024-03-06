import { TxKeyPath, translate } from "../i18n"
import React, { isValidElement } from "react"
import { Text } from "./Text"
import { View, ViewStyle } from "react-native"

export interface TrasWithComponentsProps {
  tx: TxKeyPath
  txOptions: Record<string, JSX.Element | string>
  containerStyles?: ViewStyle
}

export function TrasWithComponents({
  tx,
  txOptions,
  containerStyles: overrideContainerStyles,
}: Readonly<TrasWithComponentsProps>): JSX.Element {
  const containerStyles = { ...containerBaseStyles, ...overrideContainerStyles }
  const [optionsWithJsx, optionsWithOutJSX] = groupOptionsByType(txOptions)

  const translatedText = translate(tx, optionsWithOutJSX)
  const componentPlaceholders = Object.keys(optionsWithJsx).map((key) => ({
    key,
    component: optionsWithJsx[key],
  }))
    
  return (
    <View style={containerStyles}>
      {componentPlaceholders ? (
        replacePlaceholders(translatedText, componentPlaceholders)
      ) : (
        <Text>{translatedText}</Text>
      )}
    </View>
  )
}

type Placeholder = {
  key: string
  component: JSX.Element
}

// recursively replace placeholders with components
function replacePlaceholders(text: string, placeholders: Placeholder[]): JSX.Element[]{
  if (placeholders.length === 0) {
    return [<Text key="end-text" text={text} />]
  }

  const key = placeholders[0].key
  const [beforeText, afterText] = text.split(`{{${key}}}`)
  const remainingPlaceholders = placeholders.slice(1)
  const beforeTextComponent = beforeText ? <Text key={`${key}-before-text`} text={beforeText} /> : <></>
  const placeholderComponent = <View key={key}>{placeholders[0].component}</View>

  return [
    beforeTextComponent,
    placeholderComponent,
    ...replacePlaceholders(afterText, remainingPlaceholders),
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

const containerBaseStyles: ViewStyle = {
  display: "flex",
  flexDirection: "row",
}
