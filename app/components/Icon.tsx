import * as React from "react"
import { ComponentType } from "react"
import { imageIconRegistry, ImageIcon, FontIcon, FontIconMap, InitialsIcon } from "app/models/icon"
import {
  Image,
  ImageStyle,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { colors, sizing, spacing } from "app/theme"

interface CommonIconProps {
  color?: string
  size?: number
  shape?: "circle" | "square"
  containerStyle?: StyleProp<ViewStyle>
  onPress?: TouchableOpacityProps["onPress"]
}
interface ImageIconProps extends TouchableOpacityProps, CommonIconProps, ImageIcon {
  style?: StyleProp<ImageStyle>
}

type ImageIconPropsWithOutWrapper = Omit<ImageIconProps, "containerStyle" | "onPress">
function ImageIconComponent({ name, color, size, style }: Readonly<ImageIconPropsWithOutWrapper>) {
  const $imageStyle: StyleProp<ImageStyle> = [
    $imageStyleBase,
    color !== undefined && { tintColor: color },
    size !== undefined && { minWidth: size, minHeight: size },
    style,
  ]

  return <Image style={$imageStyle} source={imageIconRegistry[name]} />
}

interface FontIconProps extends TouchableOpacityProps, CommonIconProps, FontIcon {
  style?: StyleProp<ImageStyle>
}
type FontIconPropsWithOutWrapper = Omit<FontIconProps, "containerStyle" | "onPress">
function FontIconComponent({ type, name, ...props }: Readonly<FontIconPropsWithOutWrapper>) {
  const IconComponent = FontIconMap[type] || FontAwesome
  return <IconComponent name={name} {...props} />
}

interface InitialsIconProps extends TouchableOpacityProps, CommonIconProps, InitialsIcon {
  style?: StyleProp<TextStyle>
}
type InitialsIconPropsWithOutWrapper = Omit<InitialsIconProps, "containerStyle" | "onPress">
function InitialsIconComponent({
  name,
  type,
  size,
  color,
  style,
  ...props
}: Readonly<InitialsIconPropsWithOutWrapper>) {
  const firstLetterOfWordRegex = /\b(\w)/g
  const initials = name
    .match(firstLetterOfWordRegex)
    ?.join("")
    .concat(name[1])
    .slice(0, 2)
    .toUpperCase() ?? ""

  const stepDownedSize = ((size ?? 1) / 8 - 1) * 8
  const fontSize = initials.length > 1 ? stepDownedSize : size
  const $style: StyleProp<TextStyle> = [
    color !== undefined && { color },
    size !== undefined && { fontSize, lineHeight: fontSize},
    { fontWeight: "bold" },
    style,
  ]

  return (
    <Text style={$style} {...props}>
      {initials}
    </Text>
  )
}

/**
 * A component to render a registered icon.
 * It is wrapped in a <TouchableOpacity /> if `onPress` is provided, otherwise a <View />.
 * @see [Documentation and Examples]{@link https://docs.infinite.red/ignite-cli/boilerplate/components/Icon/}
 * @param {CommonIconProps} props - The props for the `Icon` component.
 * @returns {JSX.Element} The rendered `Icon` component.
 */
export function Icon(props: ImageIconProps | FontIconProps | InitialsIconProps) {
  const {
    type,
    name,
    color,
    size = sizing.lg,
    shape,
    style: styleOverride,
    containerStyle: $containerStyleOverride,
    ...WrapperProps
  } = props

  const containerStyle = [
    shape ? $containerStyle(size): {},
    shape === "circle" ? $circleContainerStyle(size) : {},
    $containerStyleOverride,
  ]

  const isPressable = !!WrapperProps.onPress
  const Wrapper = (WrapperProps?.onPress ? TouchableOpacity : View) as ComponentType<
    TouchableOpacityProps | ViewProps
  >
  function IconComponentByType() {
    switch (type) {
      case "initials":
        return (
          <InitialsIconComponent
            {...{ type: "initials", name, color, size }}
            style={styleOverride}
          />
        )
      case "image":
        return (
          <ImageIconComponent {...{ type: "image", name, color, size }} style={styleOverride} />
        )
      default:
        return <FontIconComponent {...{ type, name, color, size }} style={styleOverride} />
    }
  }
  return (
    <Wrapper
      accessibilityRole={isPressable ? "button" : undefined}
      {...WrapperProps}
      style={containerStyle}
    >
      <IconComponentByType />
    </Wrapper>
  )
}

const $containerStyle = (size: number): ViewStyle => ({
  flex: 0,
  alignItems: "center",
  justifyContent: "center",
  minWidth: size * 2,
  minHeight: size * 2,
  padding: size / 2,
  backgroundColor: colors.palette.primary100,
  borderRadius: sizing.xs,
})

const $circleContainerStyle = (size: number): ViewStyle => ({
  borderRadius: size,
})

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
