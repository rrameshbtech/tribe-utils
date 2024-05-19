import { useColorScheme } from "react-native"
import { Palette, darkPalette, lightPalatte } from "./palettes"

function getColors(palette : Palette) {
  return {
    /**
     * The palette is available to use, but prefer using the name.
     * This is only included for rare, one-off cases. Try to use
     * semantic names as much as possible.
     */
    palette,
    /**
     * A helper for making something see-thru.
     */
    transparent: "rgba(0, 0, 0, 0)",
    /**
     * The default text color in many components.
     */
    text: palette.neutral800,
    /**
     * Secondary text information.
     */
    textDim: palette.neutral600,
    /**
     * The default color of the screen background.
     */
    background: palette.neutral200,

    backgroundHighlight: palette.neutral300,
    /**
     * The default border color.
     */
    border: palette.neutral400,

    shadow: palette.neutral800,
    /**
     * The main tinting color.
     */
    tint: palette.primary500,
    secondaryTint: palette.secondary500,
    highlight: palette.accent500,
    cardBackground: palette.primary100,
    cardBorder: palette.primary300,
    cardShadow: palette.neutral800,
    /**
     * A subtle color used for lines.
     */
    separator: palette.neutral300,
    /**
     * Error messages.
     */
    error: palette.angry500,
    /**
     * Error Background.
     *
     */
    errorBackground: palette.angry100,

    colorBox1: palette.colorBox1,

    colorBox2: palette.colorBox2,
  }
}

export function useColors() {
  return useColorScheme() === "dark" ? getColors(darkPalette) : getColors(lightPalatte)
}

export type Colors = ReturnType<typeof getColors>
