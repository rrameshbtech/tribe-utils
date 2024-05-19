import React, { FC, ReactNode, useEffect } from "react"

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
  Button,
  Icon,
  Screen,
  SelectableList,
  SelectableListOption,
  Text,
  Toggle,
} from "app/components"
import { useColors, sizing, spacing } from "app/theme"
import {
  ExpenseCategory,
  ExpenseConfigs,
  Member,
  PaymentMode,
  useExpenseStore,
  useMemberStore,
} from "app/models"
import { pipe } from "app/utils/fns"
import { TextInput } from "react-native-gesture-handler"
import { t } from "i18n-js"
import Toast from "react-native-toast-message"
import { TxKeyPath } from "app/i18n"

interface ExpenseSettingsScreenProps extends AppStackScreenProps<"ExpenseSettings"> {}

export const ExpenseSettingsScreen: FC<ExpenseSettingsScreenProps> = function SettingsScreen() {
  const colors = useColors()
  const [configs, updateConfigs, reconcil] = useExpenseStore((s) => [
    s.configs,
    s.updateConfigs,
    s.reconcile,
  ])

  function updateCaptureLocation(value: boolean) {
    updateConfigs({ captureLocation: value })
  }

  const $deviderStyle: TextStyle = {
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderStyle: "dashed",
  }
  return (
    <Screen
      style={$root}
      contentContainerStyle={$screenContentContainerStyle}
      safeAreaEdges={["top"]}
      StatusBarProps={{ backgroundColor: colors.backgroundHighlight }}
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
        <Button
          tx="expense.reconcil"
          onPress={() => {
            reconcil()
            Toast.show({ text1: "Reconciled" })
          }}
        />
      </View>
    </Screen>
  )
}

function ExpenseSettingsHeader() {
  const colors = useColors()
  const $headerStyle = {
    color: colors.tint,
    backgroundColor: colors.backgroundHighlight,
    padding: spacing.xs,
    paddingLeft: spacing.sm,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
  }
  return <Text tx="expense.settings.title" preset="subheading" style={$headerStyle} />
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
            position: "top",
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
  const $toggleContainerStyle: ViewStyle = { flexDirection: "row", justifyContent: "space-between" }
  return (
    <View style={$toggleContainerStyle}>
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
  const spender = useMemberStore((state) => state.allMembers[spenderId])
  const [activeSelector, setActiveSelector] = React.useState<
    "paymentMode" | "category" | "payee" | "spender" | null
  >(null)

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
      <SelectorRow
        labelTx="expense.settings.defaultSpender"
        value={spender?.name ?? `[${t("common.notSelected")}]`}
        onEdit={() => setActiveSelector("spender")}
      >
        <SpenderSelector
          visible={activeSelector === "spender"}
          value={spenderId}
          onClose={onChangeEnd}
          onChange={updateSpender}
        />
      </SelectorRow>
      <SelectorRow
        labelTx="expense.settings.defaultPaymentMode"
        value={paymentMode}
        onEdit={() => setActiveSelector("paymentMode")}
      >
        <PaymentModeSelector
          visible={activeSelector === "paymentMode"}
          value={paymentMode}
          onClose={onChangeEnd}
          onChange={updatePaymentMode}
        />
      </SelectorRow>
      <SelectorRow
        labelTx="expense.settings.defaultCategory"
        value={category}
        onEdit={() => setActiveSelector("category")}
      >
        <CategorySelector
          visible={activeSelector === "category"}
          value={category}
          onChange={updateCategory}
          onClose={onChangeEnd}
        />
      </SelectorRow>
      <SelectorRow
        labelTx="expense.settings.defaultPayee"
        value={payee}
        onEdit={() => setActiveSelector("payee")}
      >
        <PayeeSelector
          visible={activeSelector === "payee"}
          value={payee}
          onChange={updatePayee}
          onClose={onChangeEnd}
          onSubmitEditing={onChangeEnd}
        />
      </SelectorRow>
    </>
  )
}

interface SelectorRowProps {
  children: React.ReactNode
  labelTx: TxKeyPath
  value?: string
  onEdit?: () => void
}
function SelectorRow({ children, labelTx, value, onEdit }: SelectorRowProps) {
  const $formRowStyle: ViewStyle = { flexDirection: "row", justifyContent: "space-between" }
  return (
    <View style={$formRowStyle}>
      <Text tx={labelTx} />
      <EditLabel value={value} onPress={onEdit} />
      {children}
    </View>
  )
}

interface EditLabelProps {
  value?: string
  onPress?: () => void
}
function EditLabel({ value, onPress }: EditLabelProps) {
  const colors = useColors()
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
  onClose: () => void
  value: string
  visible?: boolean
}
function PaymentModeSelector({
  value,
  onChange,
  visible,
  onClose,
}: Readonly<PaymentModeSelectorProps>) {
  const paymentModes = useExpenseStore((state) => Object.values(state.paymentModes))

  return (
    <SettingsModal visible={visible}>
      <SelectorModalHeader tx="expense.settings.payeeSelectionTitle" onClose={onClose} />
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(paymentModes)}
        value={value}
        onChange={onChange}
        translationScope="expense.paymentModes"
      />
    </SettingsModal>
  )
}

interface SettingsModalProps {
  children: ReactNode
  visible?: boolean
}
function SettingsModal({ children, visible = false }: Readonly<SettingsModalProps>) {
  const colors = useColors()
  const $modalContainerStyle = { flex: 1, backgroundColor: colors.background }
  return (
    <Modal visible={visible} animationType="slide">
      <View style={$modalContainerStyle}>{children}</View>
    </Modal>
  )
}

interface CategorySelectorProps {
  onChange: (changed: string) => void
  onClose: () => void
  value: string
  visible?: boolean
}
function CategorySelector({ value, onChange, visible, onClose }: Readonly<CategorySelectorProps>) {
  const categories = useExpenseStore((state) => Object.values(state.expenseCategories))

  return (
    <SettingsModal visible={visible}>
      <SelectorModalHeader tx="expense.settings.categorySelectionTitle" onClose={onClose} />
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(categories)}
        value={value}
        onChange={onChange}
        translationScope="expense.categories"
      />
    </SettingsModal>
  )
}

interface SpenderSelectorProps {
  onChange: (changed: string) => void
  onClose: () => void
  value: string
  visible?: boolean
}
function SpenderSelector({ value, onChange, visible, onClose }: Readonly<SpenderSelectorProps>) {
  const tribeMembers = useMemberStore((state) => Object.values(state.allMembers))

  return (
    <SettingsModal visible={visible}>
      <SelectorModalHeader tx="expense.settings.spenderSelectionTitle" onClose={onClose} />
      <SelectableList
        options={pipe(Object.values, convertToSelectableListOptions)(tribeMembers)}
        value={value}
        onChange={onChange}
      />
    </SettingsModal>
  )
}

interface PayeeSelectorProps {
  onChange: (changed: string) => void
  onClose: () => void
  onSubmitEditing?: () => void
  value: string
  visible?: boolean
}
type SelectorModalHeaderProps = {
  tx: TxKeyPath
  onClose?: () => void
}

function SelectorModalHeader({ tx, onClose }: SelectorModalHeaderProps) {
  const colors = useColors()
  const $selectorHeaderStyle: ViewStyle = {
    padding: spacing.xs,
    backgroundColor: colors.backgroundHighlight,
    marginBottom: spacing.sm,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: spacing.xs,
  }
  const $headerStyle = { color: colors.tint, flex: 1 }
  return (
    <View style={$selectorHeaderStyle}>
      <Text preset="subheading" tx={tx} style={$headerStyle} />
      <Icon type="Ionicons" name="close" onPress={onClose} size={sizing.lg}></Icon>
    </View>
  )
}

function PayeeSelector({
  value,
  onChange,
  onClose,
  visible,
  onSubmitEditing,
}: Readonly<PayeeSelectorProps>) {
  const payees = useExpenseStore((state) => state.payees)
  const ref = React.useRef<TextInput>(null)
  useEffect(() => {
    ref.current?.focus()
  }, [visible])

  function updateAndSubmit(payee: string) {
    onChange(payee)
    onSubmitEditing?.()
  }

  return (
    <SettingsModal visible={visible}>
      <SelectorModalHeader tx="expense.settings.payeeSelectionTitle" onClose={onClose} />
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
    </SettingsModal>
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
