import React from "react"
import { Icon, InitialsIcon } from "app/models/icon"
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
  const renderSelectableItem = getRenderSelectableItemFn(value, onChange, translationScope)
  return (
    <ListView
      data={options}
      estimatedItemSize={options.length}
      renderItem={renderSelectableItem}
      keyExtractor={(item) => item.name}
    />
  )
}

const getRenderSelectableItemFn =
  (value: string, onChange: (value: string) => void, translationScope = "") =>
  ({ item }: { item: SelectableListOption }) => {
    const nameInitialsIcon: InitialsIcon = { type: "initials", name: item.name }
    return (
      <ListItem
        style={$selectableItemStyles}
        onPress={() => onChange(item.name)}
        LeftComponent={<OptionIcon icon={item.icon ?? nameInitialsIcon} />}
        RightComponent={<OptionSelector isSelected={item.name === value} />}
      >
        <Text style={{ lineHeight: spacing.xxl }}>
          {t(`${translationScope}.${item.name}`, { defaultValue: item.name })}
        </Text>
      </ListItem>
    )
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
