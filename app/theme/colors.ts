// TODO: write documentation for colors and palette in own markdown file and add links from here

const palette = {
  neutral100: "#F5F5F5",
  neutral200: "#F4F2F1",
  neutral300: "#ede8e6",
  neutral400: "#D7CEC9",
  neutral500: "#978F8A",
  neutral600: "#564E4A",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#E8F6E9",
  primary200: "#C8E6C9",
  primary300: "#A5D6A7",
  primary400: "#81C784",
  primary500: "#4CAF50", // #8dd69c
  primary600: "#388E3C",

  secondary100: "#F9DED9",
  secondary200: "#F3B9C3",
  secondary300: "#EE94AD",
  secondary400: "#E96988",
  secondary500: "#D34B80", // #d34b80

  accent100: "#FFEED4",
  accent200: "#FFE1B2",
  accent300: "#FDD495",
  accent400: "#FBC878",
  accent500: "#FFBB50",
  angry100: "#F2D6CD",
  angry500: "#C03403",

  overlay20: "rgba(25, 16, 21, 0.2)",
  overlay50: "rgba(25, 16, 21, 0.5)",
} as const;

// Todo: Make colors refered from the named ones and not directly from palate. where ever possile
export const colors = {
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
  /**
   * The default border color.
   */
  border: palette.neutral400,
  /**
   * The main tinting color.
   */
  tint: palette.primary400,
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

  chartSectionColors1: [
    "#FF5733",
    "#33FFB8",
    "#FFC300",
    "#FF3365",
    "#33A7FF",
    "#FF33A3",
    "#3FF100",
    "#FF7F0E",
    "#1F77B4",
    "#2CA02C",
    "#9467BD",
    "#D62728",
    "#8C564B",
    "#E377C2",
    "#7F7F7F",
  ],

  chartSectionColors : [
    '#FF5733', // Orange
    '#ffaf98', 
    '#FFC300', // Yellow
    '#FF3365', // Pink
    '#3366FF', // Blue
    '#FF33A3', // Magenta
    '#FF7F0E', // Dark Orange
    '#6600CC', // Purple
    '#FF5050', // Red
    '#CC66FF', // Lavender
    '#FF9966', // Peach
    '#663300', // Brown
    '#FF99FF', // Light Pink
    '#9966FF', // Violet
    '#FF0000'  // Bright Red
  ]
}
