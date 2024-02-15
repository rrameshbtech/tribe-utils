import { FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import * as React from "react"
import { ComponentType } from "react"
import {
  Image,
  ImageStyle,
  StyleProp,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"

export type ImageIconNames = keyof typeof iconRegistry
export type FontIconTypes = "FontAwesome" | "FontAwesome5" | "Ionicons" | "AntDesign" | "Material"
interface CommonIconProps {
  color?: string
  size?: number
  containerStyle?: StyleProp<ViewStyle>
  onPress?: TouchableOpacityProps["onPress"]
}
interface ImageIconProps extends TouchableOpacityProps, CommonIconProps {
  type?: "image"
  icon: ImageIconNames
  style?: StyleProp<ImageStyle>
}
interface FontIconProps extends TouchableOpacityProps, CommonIconProps {
  type: FontIconTypes
  icon: string
  style?: StyleProp<ImageStyle>
}
export type IconSpecifier = {
  name: string
  type: FontIconTypes
} | {
  name: ImageIconNames
  type: "image"
}

type ImageIconPropsWithOutWrapper = Omit<ImageIconProps, "containerStyle" | "onPress">
function ImageIcon({ icon, color, size, style }: Readonly<ImageIconPropsWithOutWrapper>) {
  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { minWidth: size, minHeight: size },
    style,
  ]

  return <Image style={$imageStyle} source={iconRegistry[icon]} />
}

type FontIconComponentTypes =
  | typeof FontAwesome
  | typeof FontAwesome5
  | typeof MaterialCommunityIcons
  | typeof Ionicons
type FontIconPropsWithOutWrapper = Omit<FontIconProps, "containerStyle" | "onPress">
function FontIcon({ type, icon, ...props }: Readonly<FontIconPropsWithOutWrapper>) {
  const iconTypeMap: Record<string, FontIconComponentTypes> = {
    FontAwesome,
    FontAwesome5,
    Material: MaterialCommunityIcons,
    Ionicons,
  }
  const IconComponent = iconTypeMap[type] || FontAwesome
  return <IconComponent name={icon} {...props} />
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Icon/}
 * @param {CommonIconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: ImageIconProps | FontIconProps) {
  const {
    type,
    icon,
    color,
    size,
    style: $imageStyleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >

  return (
    <Wrapper
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
      style={$containerStyleOverride}
    >
      {!type || type === "image" ? (
        <ImageIcon {...{icon, color, size}} style={$imageStyleOverride} />
      ) : (
        <FontIcon {...{type, icon, color, size}} style={$imageStyleOverride} />
      )}
    </Wrapper>
  )
}

export const iconRegistry = {
  back: require("../../assets/icons/back.png"),
  bell: require("../../assets/icons/bell.png"),
  caretLeft: require("../../assets/icons/caretLeft.png"),
  caretRight: require("../../assets/icons/caretRight.png"),
  check: require("../../assets/icons/check.png"),
  hidden: require("../../assets/icons/hidden.png"),
  ladybug: require("../../assets/icons/ladybug.png"),
  lock: require("../../assets/icons/lock.png"),
  menu: require("../../assets/icons/menu.png"),
  more: require("../../assets/icons/more.png"),
  settings: require("../../assets/icons/settings.png"),
  view: require("../../assets/icons/view.png"),
  x: require("../../assets/icons/x.png"),
  mobilePay: require("../../assets/icons/mobilePay.png"),
  mobileWallet: require("../../assets/icons/mobileWallet.png"),
  calendarFilter: require("../../assets/icons/calendarFilter.png"),
  loan: require("../../assets/icons/loan.png"),
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
