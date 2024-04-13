import React, { FC, useEffect } from "react"

import {
  Modal,
  PermissionsAndroid,
  Platform,
  Pressable,
  TextStyle,
  View,
  ViewStyle,
} from "react-native"
import { AppStackScreenProps } from "app/navigators"
import {
  AutoComplete,
  Icon,
  Screen,
  SelectableList,
  SelectableListOption,
  Text,
  Toggle,
} from "app/components"
import { colors, sizing, spacing } from "app/theme"
import { ExpenseCategory, ExpenseConfigs, Member, PaymentMode, useRootStore } from "app/models"
import { pipe } from "app/utils/fns"
import { TextInput } from "react-native-gesture-handler"
import { t } from "i18n-js"
import Toast from "react-native-toast-message"

interface ExpenseSettingsScreenProps extends AppStackScreenProps<"ExpenseSettings"> {}

export const ExpenseSettingsScreen: FC<ExpenseSettingsScreenProps> = function SettingsScreen() {
  const configs = useRootStore((s) => s.configs)
  const updateConfigs = useRootStore((s) => s.updateConfigs)

  function updateCaptureLocation(value: boolean) {
    updateConfigs({ captureLocation: value })
  }

  const $deviderStyle: TextStyle = {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.palette.neutral400,
    borderStyle: "dashed",
  }
  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainerStyle}
      safeAreaEdges={["top", "bottom"]}
      StatusBarProps={{ backgroundColor: colors.tint }}
    >
      <ExpenseSettingsHeader />
      <View style={{ padding: spacing.xs, rowGap: spacing.sm }}>
        <LocationToggle value={configs.captureLocation} onChange={updateCaptureLocation} />
        <Text
          tx="expense.settings.defaultValueSectionTitle"
          preset="bold"
          style={$deviderStyle}
        ></Text>
        <ExpenseDefaultValues configs={configs} onChange={updateConfigs} />
      </View>
    </Screen>
  )
}

function ExpenseSettingsHeader() {
  return (
    <Text
      tx="expense.settings.title"
      preset="subheading"
      style={{ color: colors.background, backgroundColor: colors.tint, padding: spacing.xs }}
    />
  )
}

interface LocationToggleProps {
  value?: boolean
  onChange?: (value: boolean) => void
}

function LocationToggle({ value, onChange }: LocationToggleProps) {
  function handleChange(value: boolean) {
    if (!value || Platform.OS !== "android") {
      onChange?.(value)
      return
    }
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
      title: t("expense.settings.locationPermissionTitle"),
      message: t("expense.settings.locationPermissionMessage"),
      buttonNeutral: t("expense.settings.locationPermissionButtonNeutral"),
      buttonNegative: t("expense.settings.locationPermissionButtonNegative"),
      buttonPositive: t("expense.settings.locationPermissionButtonPositive"),
    })
      .then((result) => {
        if (result === PermissionsAndroid.RESULTS.GRANTED) {
          onChange?.(value)
        } else {
          Toast.show({
            type: "error",
            text1: t("expense.settings.locationPermissionDeniedTitle"),
            text2: t("expense.settings.locationPermissionDeniedMessage"),
          })
        }
      })
      .catch((err) => {
        onChange?.(false)
        console.warn("Unexpected error when requesting location permission", err)
      })
  }
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <Text tx="expense.settings.location" />
      <Toggle value={value} variant="switch" onValueChange={handleChange}></Toggle>
    </View>
  )
}

interface ExpenseDefaultValuesProps {
  configs: ExpenseConfigs
  onChange: (updated: Partial<ExpenseConfigs>) => void
}

function ExpenseDefaultValues({ configs, onChange }: ExpenseDefaultValuesProps) {
  const {
    defaultPaymentMode: paymentMode,
    defaultCategory: category,
    defaultPayee: payee,
    defaultSpender: spenderId,
  } = configs
  const spender = useRootStore((state) => state.allMembers[spenderId])
  const [activeSelector, setActiveSelector] = React.useState<
    "paymentMode" | "category" | "payee" | "spender" | null
  >("paymentMode")
  const $formRowStyle: ViewStyle = { flexDirection: "row", justifyContent: "space-between" }

  function updatePaymentMode(value: string) {
    onChange({ defaultPaymentMode: value })
    setActiveSelector(null)
  }
  function updateCategory(value: string) {
    onChange({ defaultCategory: value })
    setActiveSelector(null)
  }
  function updatePayee(value: string) {
    onChange({ defaultPayee: value })
  }
  function updateSpender(value: string) {
    onChange({ defaultSpender: value })
    setActiveSelector(null)
  }

  function onChangeEnd() {
    setActiveSelector(null)
  }
  return (
    <>
      <View style={$formRowStyle}>
        <Text tx="expense.settings.defaultSpender" />
        <EditLabel value={spender?.name} onPress={() => setActiveSelector("spender")} />
        <SpenderSelector
          visible={activeSelector === "spender"}
          value={spenderId}
          onChange={updateSpender}
        />
      </View>
      <View style={$formRowStyle}>
        <Text tx="expense.settings.defaultPaymentMode" />
        <EditLabel value={paymentMode} onPress={() => setActiveSelector("paymentMode")} />
        <PaymentModeSelector
          visible={activeSelector === "paymentMode"}
          value={paymentMode}
          onChange={updatePaymentMode}
        />
      </View>
      <View style={$formRowStyle}>
        <Text tx="expense.settings.defaultCategory" />
        <EditLabel value={category} onPress={() => setActiveSelector("category")} />
        <CategorySelector
          visible={activeSelector === "category"}
          value={category}
          onChange={updateCategory}
        />
      </View>
      <View style={$formRowStyle}>
        <Text tx="expense.settings.defaultPayee" />
        <EditLabel value={payee} onPress={() => setActiveSelector("payee")} />
        <PayeeSelector
          visible={activeSelector === "payee"}
          value={payee}
          onChange={updatePayee}
          onSubmitEditing={onChangeEnd}
        />
      </View>
    </>
  )
}

interface EditLabelProps {
  value?: string
  onPress: () => void
}
function EditLabel({ value, onPress }: EditLabelProps) {
  const $valueContainerStyle: ViewStyle = {
    flexDirection: "row",
    alignItems: "center",
    columnGap: spacing.xxs,
  }
  return (
    <Pressable style={$valueContainerStyle} onPress={onPress}>
      <Text
        text={value ?? `[${t("common.notSelected")}]`}
        style={{ color: value ? colors.text : colors.textDim }}
      />
      <Icon type="FontAwesome" name="pencil" size={sizing.md} />
    </Pressable>
  )
}

interface PaymentModeSelectorProps {
  onChange: (changed: string) => void
  value: string
  visible?: boolean
}
function PaymentModeSelector({ value, onChange, visible }: Readonly<PaymentModeSelectorProps>) {
  const paymentModes = useRootStore((state) => Object.values(state.paymentModes))

  return (
    <Modal visible={visible} animationType="slide">
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(paymentModes)}
        value={value}
        onChange={onChange}
        translationScope="expense.paymentModes"
      />
    </Modal>
  )
}

interface CategorySelectorProps {
  onChange: (changed: string) => void
  value: string
  visible?: boolean
}
function CategorySelector({ value, onChange, visible }: Readonly<CategorySelectorProps>) {
  const categories = useRootStore((state) => Object.values(state.expenseCategories))

  return (
    <Modal visible={visible} animationType="slide">
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(categories)}
        value={value}
        onChange={onChange}
        translationScope="expense.categories"
      />
    </Modal>
  )
}

interface SpenderSelectorProps {
  onChange: (changed: string) => void
  value: string
  visible?: boolean
}
function SpenderSelector({ value, onChange, visible }: Readonly<SpenderSelectorProps>) {
  const tribeMembers = useRootStore((state) => Object.values(state.allMembers))

  return (
    <Modal visible={visible} animationType="slide">
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(tribeMembers)}
        value={value}
        onChange={onChange}
      />
    </Modal>
  )
}

interface PayeeSelectorProps {
  onChange: (changed: string) => void
  onSubmitEditing?: () => void
  value: string
  visible?: boolean
}
function PayeeSelector({
  value,
  onChange,
  visible,
  onSubmitEditing,
}: Readonly<PayeeSelectorProps>) {
  const payees = useRootStore((state) => state.payees)
  const ref = React.useRef<TextInput>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [visible])

  function updateAndSubmit(payee: string) {
    onChange(payee)
    onSubmitEditing?.()
  }

  return (
    <Modal visible={visible} animationType="slide">
      <AutoComplete
        {...{ value, ref }}
        onChangeText={onChange}
        onSelection={updateAndSubmit}
        onSubmitEditing={onSubmitEditing}
        options={payees}
        inputMode="text"
        clearButtonMode="always"
        returnKeyType="next"
      />
    </Modal>
  )
}

function convertToSelectableListOptions(items: PaymentMode[] | ExpenseCategory[] | Member[]) {
  return items.map(
    (item) =>
      ({
        value: "id" in item ? item.id : item.name,
        name: item.name,
        icon: "icon" in item ? item.icon : null,
      } as SelectableListOption),
  )
}
const $root: ViewStyle = {
  flex: 1,
}
const $screenContentContainerStyle: ViewStyle = {
  flexGrow: 1,
}
