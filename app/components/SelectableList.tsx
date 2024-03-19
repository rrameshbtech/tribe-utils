import React from "react"
import { Icon } from "app/models/icon"
import { colors, sizing, spacing } from "app/theme"
import { ViewStyle } from "react-native"
import { ListView } from "./ListView"
import { ListItem } from "./ListItem"
import { Icon as IconComponent } from "./Icon"
import { Toggle } from "./Toggle"
import { Text } from "./Text"
import { t } from "i18n-js"

export interface SelectableListOption {
  name: string
  icon?: Icon
}
export interface SelectableListProps {
  value: string
  onChange: (value: string) => void
  options: SelectableListOption[]
  translationScope?: string
}
const $selectableItemStyles: ViewStyle = {
  flex: 1,
  alignContent: "center",
  marginRight: spacing.sm,
}
export function SelectableList({
  value,
  onChange,
  options,
  translationScope = "",
}: Readonly<SelectableListProps>) {
  return (
    <ListView
      data={options}
      estimatedItemSize={options.length}
      renderItem={({ item }) => (
        <ListItem
          style={$selectableItemStyles}
          onPress={() => onChange(item.name)}
          LeftComponent={<OptionIcon icon={item.icon} />}
          RightComponent={<OptionSelector isSelected={item.name === value} />}
        >
          <Text style={{ lineHeight: spacing.xxl }}>
            {t(`${translationScope}.${item.name}`, { defaultValue: item.name })}
          </Text>
        </ListItem>
      )}
      keyExtractor={(item) => item.name}
    />
  )
}

interface OptionIconProps {
  icon?: Icon
}
function OptionIcon({ icon }: Readonly<OptionIconProps>) {
  if (!icon) {
    return <></>
  }
  return (
    <IconComponent
      {...icon}
      size={sizing.lg}
      color={colors.palette.primary500}
      containerStyle={optionIconContainerStyles}
    />
  )
}
const optionIconContainerStyles: ViewStyle = {
  flex: 0,
  alignItems: "center",
  justifyContent: "center",
  minWidth: sizing.xxl,
  minHeight: sizing.xxl,
  padding: spacing.sm,
  backgroundColor: colors.palette.primary100,
  borderRadius: sizing.xxl,
  marginRight: spacing.sm,
}

interface OptionSelectorProps {
  isSelected: boolean
}
function OptionSelector({ isSelected }: Readonly<OptionSelectorProps>) {
  return (
    <Toggle
      variant="radio"
      value={isSelected}
      containerStyle={{ flex: 0, alignSelf: "center" }}
    ></Toggle>
  )
}
