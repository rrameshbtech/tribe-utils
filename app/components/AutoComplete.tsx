import { colors, spacing } from "app/theme"
import React, { ForwardedRef, createRef, forwardRef, useImperativeHandle, useState } from "react"
import { View, TextStyle, ViewStyle } from "react-native"
import { FlatList, TextInput } from "react-native-gesture-handler"
import { ListItem } from "./ListItem"
import { Text } from "./Text"

interface DropDownProps {
  value?: string
  options: string[]
  onChange?: (value: string) => void
  styles?: TextStyle
  containerStyles?: ViewStyle
}

const AutoCompleteWithOutRef = (
  {
    value,
    options,
    onChange,
    styles: overrideStyles,
    containerStyles: overrideContainerStyles,
  }: Readonly<DropDownProps>,
  ref: ForwardedRef<unknown>,
) => {
  const [isListVisible, setIsListVisible] = useState(false)
  const inputRef = createRef<TextInput>()
  const containerStyles = { ...$containerStyles, ...overrideContainerStyles }
  const styles = { ...$styles, ...overrideStyles }

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus()
      showAutoCompleteList()
    },
  }))

  return (
    <View style={containerStyles}>
      <FlatList
        data={autoCompleteOptions()}
        renderItem={renderAutoCompleteOption}
        keyExtractor={(item) => item}
        ListHeaderComponent={
          <TextInput
            ref={inputRef}
            onFocus={showAutoCompleteList}
            style={styles}
            value={value}
            onChangeText={onChange}
            inputMode="text"
            autoCorrect={false}
            clearButtonMode="while-editing"
            selectTextOnFocus={true}
          />
        }
        stickyHeaderIndices={[0]}
      />
    </View>
  )

  function showAutoCompleteList() {
    setIsListVisible(true)
  }
  function hideAutoCompleteList() {
    setIsListVisible(false)
  }
  function renderAutoCompleteOption({ item }: any): JSX.Element {
    const listItemStyles = {
      ...$listItemStyles,
      display: isListVisible ? "flex" : "none",
    } as ViewStyle
    return (
      <ListItem style={listItemStyles} onPressIn={() => handleItemPress(item)}>
        <Text style={$listItemTextStyles}>{item}</Text>
      </ListItem>
    )
  }
  function handleItemPress(item: string) {
    onChange?.(item)
    hideAutoCompleteList()
  }
  function autoCompleteOptions() {
    if (!value) {
      return options
    }
    const filterValue = value.toLocaleLowerCase()
    return options.filter((option) => option.toLocaleLowerCase().includes(filterValue))
  }
}
const AutoComplete = forwardRef(AutoCompleteWithOutRef)
AutoComplete.displayName = "AutoComplete"
export { AutoComplete }

const $containerStyles = {
  flex: 1,
  flexDirection: "column",
} as ViewStyle

const $styles = {
  width: "100%",
  height: 50,
  borderColor: colors.palette.neutral400,
  borderWidth: 1,
  backgroundColor: colors.palette.neutral100,
  padding: spacing.sm,
} as TextStyle

const $listItemStyles = {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  padding: spacing.sm,
  margin: 0,
  borderWidth: 1,
  borderColor: colors.palette.neutral300,
  backgroundColor: colors.palette.neutral100,
} as ViewStyle

const $listItemTextStyles = {
  color: colors.textDim,
  fontSize: 16,
  flex: 1,
} as TextStyle
