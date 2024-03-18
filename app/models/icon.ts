import { FontAwesome, FontAwesome5, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"

export const imageIconRegistry = {
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

export type FontIconType = "FontAwesome" | "FontAwesome5" | "Ionicons" | "Material"
export const FontIconMap: Record<FontIconType, any> = {
  FontAwesome: FontAwesome,
  FontAwesome5: FontAwesome5,
  Ionicons: Ionicons,
  Material: MaterialCommunityIcons,
}

export interface FontIcon {
  name: string
  type: FontIconType
}

export type ImageIconName = keyof typeof imageIconRegistry

export interface ImageIcon {
  name: ImageIconName
  type: "image"
}

export type Icon = FontIcon | ImageIcon