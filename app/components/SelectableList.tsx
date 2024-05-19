import React from "react"
import { Icon, InitialsIcon } from "app/models/icon"
import { useColors, sizing, spacing } from "app/theme"
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
  // style,
  translationScope = "",
}: Readonly<SelectableListProps>) {
  const colors = useColors()
  const renderSelectableItem = getRenderSelectableItemFn(value, onChange, translationScope)
  const $listContainerStyle = { backgroundColor: colors.background }
  // TODO:combine style with listContainerStyle

  return (
    <ListView
      data={options}
      contentContainerStyle={$listContainerStyle}
      estimatedItemSize={options.length}
      renderItem={renderSelectableItem}
      keyExtractor={(item) => item.value}
    />
  )
}

const getRenderSelectableItemFn =
  (value: string, onChange: (value: string) => void, translationScope = "") =>
  // eslint-disable-next-line
  ({ item }: { item: SelectableListOption }) =>
    (
      <SelectableItem
        item={item}
        value={value}
        onChange={onChange}
        translationScope={translationScope}
      />
    )
interface SelectableItemProps {
  item: SelectableListOption
  value: string
  onChange: (value: string) => void
  translationScope: string
}
function SelectableItem({
  item,
  value,
  onChange,
  translationScope,
}: Readonly<SelectableItemProps>) {
  const colors = useColors()
  const nameInitialsIcon: InitialsIcon = { type: "initials", name: item.name ?? item.value }
  const isSelected = item.value === value || item.name === value

  const $selectableItemStyles: ViewStyle = {
    flex: 1,
    alignContent: "center",
    padding: spacing.xs,
  }
  const $selectedItemStyle: ViewStyle = {
    backgroundColor: colors.backgroundHighlight,
    borderRadius: sizing.xxs,
  }
  return (
    <ListItem
      style={[$selectableItemStyles, isSelected && $selectedItemStyle]}
      onPress={() => onChange(item.value)}
      LeftComponent={<OptionIcon icon={item.icon ?? nameInitialsIcon} />}
      RightComponent={<OptionSelector {...{ isSelected }} onPress={() => onChange(item.value)} />}
    >
      <Text style={{ lineHeight: spacing.xxl }}>{getDisplayText()}</Text>
    </ListItem>
  )

  function getDisplayText() {
    return item.name
      ? t(`${translationScope}.${item.name}`, { defaultValue: item.name })
      : t(`${translationScope}.${item.value}`, { defaultValue: item.value })
  }
}

interface OptionIconProps {
  icon: Icon
}
function OptionIcon({ icon }: Readonly<OptionIconProps>) {
  const colors = useColors()
  return (
    <IconComponent
      {...icon}
      size={sizing.lg}
      shape="circle"
      color={colors.tint}
      containerStyle={{ marginRight: spacing.sm }}
    />
  )
}

interface OptionSelectorProps {
  isSelected: boolean
  onPress: () => void
}
function OptionSelector({ isSelected, onPress }: Readonly<OptionSelectorProps>) {
  const $toggleStyle: ViewStyle = { flex: 0, alignSelf: "center" }
  return (
    <Toggle
      variant="radio"
      value={isSelected}
      containerStyle={$toggleStyle}
      onPress={onPress}
    ></Toggle>
  )
}
