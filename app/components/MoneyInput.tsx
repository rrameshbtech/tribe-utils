import { useColors } from "app/theme"
import { pipe } from "app/utils/fns"
import { useLocale } from "app/utils/useLocale"
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import {
  Keyboard,
  NativeSyntheticEvent,
  Pressable,
  Text,
  TextInput,
  TextInputKeyPressEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"

const DEFAULT_FONT_SIZE = 36
const DEFAULT_PLACEHOLDER = "0"
export interface MoneyInputProps extends TextInputProps {
  value: string
  styles?: TextStyle
  containerStyles?: ViewStyle
  onChangeText?: (value: string) => void
  onEndEditing?: () => void
  /**
   * The number of decimal places to allow
   * @default 2
   */
  decimalPrecision?: number
}

/**
 * Text input to enter money values
 * @param value - The value to display in the input
 * @param styles - The styles to apply to the text
 * @param containerStyles - The styles to apply to the container
 * @param onChangeText - A callback that is called when the value changes
 * @param decimalPrecision - The number of decimal places to allow
 * @returns A money input
 */
const MoneyInput = forwardRef(
  (
    {
      value,
      styles: overrideStyles,
      containerStyles: overrideContainerStyles,
      onChangeText,
      onEndEditing,
      decimalPrecision = 2,
      ...textInputProps
    }: MoneyInputProps,
    ref,
  ) => {
    const colors = useColors()
    const [isFocused, setIsFocused] = React.useState(false)
    const textInputRef = React.useRef<TextInput>(null)
    const { currencySymbol } = useLocale()
    const hasValidValue = value.length > 0


const $textStyles: TextStyle = {
  fontSize: DEFAULT_FONT_SIZE,
  color: colors.text,
}

const $placeholderStyles: TextStyle = {
  color: colors.text,
}
    const styles = {
      ...$textStyles,
      ...overrideStyles,
    }
    const containerStyles = {
      ...$containerStyles,
      ...overrideContainerStyles,
    }

    useEffect(
      () =>
        Keyboard.addListener("keyboardDidHide", () => {
          textInputRef.current?.blur()
        }).remove,
      [],
    )

    useImperativeHandle(ref, () => ({
      focus: () => {
        textInputRef.current?.focus()
      },
    }))

    return (
      <Pressable style={containerStyles} onPress={handleContainerPress}>
        <Text style={{ ...styles, ...$currencySymbolStyles(styles) }}>{currencySymbol}</Text>
        {hasValidValue && <Text style={styles}>{formatValue(value)}</Text>}
        <BlinkingCursor styles={styles} isVisible={isFocused} />
        {!hasValidValue && (
          <Text style={{ ...styles, ...$placeholderStyles }}>{DEFAULT_PLACEHOLDER}</Text>
        )}
        <TextInput
          style={$textInputStyles}
          inputMode="decimal"
          ref={textInputRef}
          onKeyPress={handleKeyPress}
          onBlur={handleBlur}
          onFocus={() => setIsFocused(true)}
          onEndEditing={onEndEditing}
          {...textInputProps}
        />
      </Pressable>
    )

    function handleKeyPress({
      nativeEvent: { key },
    }: NativeSyntheticEvent<TextInputKeyPressEventData>) {
      if (!isKeyAllowed(key, value)) {
        return
      }

      pipe<string>(
        applyKey(key),
        removeLeadingZeros,
        addLeadingZeroForDot,
        callOnChangeIfChanged(value),
      )(value)
    }

    function isKeyAllowed(key: string, currentValue: string) {
      const containsDecimal = currentValue.includes(".")
      const isDigit = /\d/.test(key)

      return (
        (key === "." && !containsDecimal) ||
        (isDigit && !isDecimalPrecisionExceeded(currentValue)) ||
        key === "Backspace" ||
        key === "Enter"
      )
    }

    function isDecimalPrecisionExceeded(currentValue: string) {
      const decimalPart = fractionalPart(currentValue)
      return decimalPart.length >= decimalPrecision
    }

    function fractionalPart(value: string) {
      const fractionalPartRegex = /\.(\d+)/
      const fractionalPart = value.match(fractionalPartRegex)?.[1]
      return fractionalPart ?? ""
    }

    function applyKey(key: string) {
      return function addKey(currentValue: string) {
        if (key === "Backspace") {
          return currentValue.slice(0, -1)
        }
        if (key === "Enter") {
          return currentValue
        }
        return currentValue + key
      }
    }

    function formatValue(value: string) {
      const { digitGroupingRegex, digitGroupingSeparator } = useLocale()
      const formattedValue = value.replace(digitGroupingRegex, digitGroupingSeparator ?? ",")
      return formattedValue
    }

    function removeLeadingZeros(value: string) {
      const leadingZerosRegex = /^0+(?=\d)/
      return value.replace(leadingZerosRegex, "")
    }

    function addLeadingZeroForDot(value: string) {
      return value === "." ? "0." : value
    }

    function callOnChangeIfChanged(oldValue: string) {
      return (newValue: string) => {
        if (oldValue === newValue) {
          return newValue
        }

        onChangeText?.(newValue)
        return newValue
      }
    }

    function handleContainerPress() {
      textInputRef.current?.focus()
    }

    function handleBlur() {
      setIsFocused(false)
      const containsDecimal = value.indexOf(".") >= 0
      if (!containsDecimal) {
        return
      }

      const formattedValue = parseFloat(value)?.toFixed(decimalPrecision).toString()
      if (formattedValue === value) {
        return
      }
      onChangeText?.(formattedValue)
    }
  },
)
MoneyInput.displayName = "MoneyInput"
export { MoneyInput }

const $containerStyles: ViewStyle = {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
}

const $textInputStyles: TextStyle = {
  display: "none",
}

const $currencySymbolStyles = (textStyle: TextStyle): TextStyle => ({
  fontSize: (textStyle.fontSize ?? DEFAULT_FONT_SIZE) * 0.6,
  alignSelf: "center",
  marginRight: 4,
})

/**
 * BlinkingCursor
 * @param speedInMS - The speed of the cursor's blinking
 * @param styles - The styles to apply to the cursor
 * @param isVisible - Whether the cursor is visible or not
 * @returns A blinking cursor
 */
interface BlinkingCursorProps {
  speedInMS?: number
  styles?: TextStyle
  isVisible?: boolean
}
function BlinkingCursor({
  speedInMS = 500,
  styles: overrideStyles,
  isVisible,
}: BlinkingCursorProps) {
  const [style, setStyle] = useState({ opacity: isVisible ? 1 : 0 })
  const colors = useColors()
  const $cursorStyles = (style?: TextStyle): ViewStyle => ({
    width: 1,
    height: style?.fontSize ?? DEFAULT_FONT_SIZE,
    marginLeft: 2,
    backgroundColor: colors.text,
  })

  useEffect(() => {
    if (!isVisible) {
      setStyle({ opacity: 0 })
      return
    }
    const interval = setInterval(toggleVisibility, speedInMS)
    return () => clearInterval(interval)

    function toggleVisibility() {
      setStyle((prev) => ({ opacity: prev.opacity === 0 ? 1 : 0 }))
    }
  }, [speedInMS, isVisible])

  return (
    <View
      style={{
        ...$cursorStyles(overrideStyles),
        ...style,
      }}
    ></View>
  )
}
