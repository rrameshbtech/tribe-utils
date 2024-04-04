import React from "react"
import { Icon, InitialsIcon } from "app/models/icon"
import { colors, sizing, spacing } from "app/theme"
import { StyleProp, ViewStyle } from "react-native"
import { ListView } from "./ListView"
import { ListItem } from "./ListItem"
import { Icon as IconComponent } from "./Icon"
import { Toggle } from "./Toggle"
import { Text } from "./Text"
import { t } from "i18n-js"

export interface SelectableListOption {
  value: string
  name?: string
  icon?: Icon
}
export interface SelectableListProps {
  value: string
  onChange: (value: string) => void
  options: SelectableListOption[]
  translationScope?: string
  style?: StyleProp<ViewStyle>
}
export function SelectableList({
  value,
  onChange,
  options,
  style,
  translationScope = "",
}: Readonly<SelectableListProps>) {
  const renderSelectableItem = getRenderSelectableItemFn(value, onChange, translationScope)
  return (
    <ListView
      data={options}
      style={style}
      estimatedItemSize={options.length}
      renderItem={renderSelectableItem}
      keyExtractor={(item) => item.value}
    />
  )
}

const getRenderSelectableItemFn =
  (value: string, onChange: (value: string) => void, translationScope = "") =>
  ({ item }: { item: SelectableListOption }) => {
    const nameInitialsIcon: InitialsIcon = { type: "initials", name: item.name ?? item.value }
    const isSelected = item.value === value || item.name === value
    return (
      <ListItem
        style={[$selectableItemStyles, isSelected && $selectedItemStyle]}
        onPress={() => onChange(item.value)}
        LeftComponent={<OptionIcon icon={item.icon ?? nameInitialsIcon} />}
        RightComponent={<OptionSelector {...{ isSelected }} />}
      >
        <Text style={{ lineHeight: spacing.xxl }}>{getDisplayText()}</Text>
      </ListItem>
    )

    function getDisplayText() {
      return item.name ?? t(`${translationScope}.${item.value}`, { defaultValue: item.value })
    }
  }

const $selectableItemStyles: ViewStyle = {
  flex: 1,
  alignContent: "center",
  padding: spacing.xs,
}
const $selectedItemStyle: ViewStyle = {
  backgroundColor: colors.palette.neutral300,
  borderRadius: sizing.xxs,
}

interface OptionIconProps {
  icon: Icon
}
function OptionIcon({ icon }: Readonly<OptionIconProps>) {
  return (
    <IconComponent
      {...icon}
      size={sizing.lg}
      shape="circle"
      color={colors.palette.primary500}
      containerStyle={{ marginRight: spacing.sm }}
    />
  )
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
