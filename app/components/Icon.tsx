import * as React from "react"
import { ComponentType } from "react"
import { imageIconRegistry, ImageIcon, FontIcon, FontIconMap } from "app/models/icon"
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
import { FontAwesome } from "@expo/vector-icons"

interface CommonIconProps {
  color?: string
  size?: number
  containerStyle?: StyleProp<ViewStyle>
  onPress?: TouchableOpacityProps["onPress"]
}
interface ImageIconProps extends TouchableOpacityProps, CommonIconProps, ImageIcon {
  style?: StyleProp<ImageStyle>
}
interface FontIconProps extends TouchableOpacityProps, CommonIconProps, FontIcon {
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

type FontIconPropsWithOutWrapper = Omit<FontIconProps, "containerStyle" | "onPress">
function FontIconComponent({ type, name, ...props }: Readonly<FontIconPropsWithOutWrapper>) {
  const IconComponent = FontIconMap[type] || FontAwesome
  return <IconComponent name={name} {...props} />
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
    name,
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
        <ImageIconComponent {...{ type: "image", name, color, size }} style={$imageStyleOverride} />
      ) : (
        <FontIconComponent {...{ type, name, color, size }} style={$imageStyleOverride} />
      )}
    </Wrapper>
  )
}

const $imageStyleBase: ImageStyle = {
  resizeMode: "contain",
}
