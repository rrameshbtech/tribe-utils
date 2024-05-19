export interface Palette {
  neutral100: string
  neutral200: string
  neutral300: string
  neutral400: string
  neutral500: string
  neutral600: string
  neutral700: string
  neutral800: string
  neutral900: string

  primary100: string
  primary200: string
  primary300: string
  primary400: string
  primary500: string
  primary600: string

  secondary100: string
  secondary200: string
  secondary300: string
  secondary400: string
  secondary500: string

  accent100: string
  accent200: string
  accent300: string
  accent400: string
  accent500: string

  angry100: string
  angry500: string

  overlay20: string
  overlay50: string

  colorBox1: string[]
  colorBox2: string[]
}

export const darkPalette: Palette = {
  neutral100: "#191919",
  neutral200: "#2A2A2A",
  neutral300: "#3B3B3B",
  neutral400: "#4C4C4C",
  neutral500: "#7D7D7D",
  neutral600: "#A3A3A3",
  neutral700: "#BFBFBF",
  neutral800: "#F1F1F1",
  neutral900: "#FFFFFF",

  primary100: "#0D4023",
  primary200: "#1B7F3B",
  primary300: "#238E48",
  primary400: "#2AA656",
  primary500: "#30BF64",
  primary600: "#33CC6B",

  secondary100: "#4C1A21",
  secondary200: "#7B1D34",
  secondary300: "#A72247",
  secondary400: "#D92A59",
  secondary500: "#F4336B",

  accent100: "#4C3A17",
  accent200: "#7F5C21",
  accent300: "#A6792A",
  accent400: "#D69C33",
  accent500: "#FFB84C",

  angry100: "#8C1F0B",
  angry500: "#FF5733",

  overlay20: "rgba(240, 240, 240, 0.2)",
  overlay50: "rgba(240, 240, 240, 0.5)",

  colorBox1: [
    "#FF9980",
    "#80FFD5",
    "#FFDA80",
    "#FF99B0",
    "#80C3FF",
    "#FF99CC",
    "#80FF80",
    "#FFB37F",
    "#80A3FF",
    "#80FF8C",
    "#A180FF",
    "#FF8080",
    "#A38983",
    "#FF99E6",
    "#A6A6A6",
  ],
  colorBox2: [
    "#FF9980", // Lighter Orange
    "#FFDFC4",
    "#FFDA80", // Lighter Yellow
    "#FF99B0", // Lighter Pink
    "#6699FF", // Lighter Blue
    "#FF99CC", // Lighter Magenta
    "#FFB37F", // Lighter Dark Orange
    "#9933FF", // Lighter Purple
    "#FF8080", // Lighter Red
    "#CC99FF", // Lighter Lavender
    "#FFB380", // Lighter Peach
    "#996633", // Lighter Brown
    "#FFCCFF", // Lighter Light Pink
    "#CC99FF", // Lighter Violet
    "#FF6666", // Lighter Bright Red
  ],
} as const

export const lightPalatte : Palette = {
  neutral100: "#F5F5F5",
  neutral200: "#F4F2F1",
  neutral300: "#ede8e6",
  neutral400: "#D7CEC9",
  neutral500: "#978F8A",
  neutral600: "#6e6e6e",
  neutral700: "#3C3836",
  neutral800: "#191015",
  neutral900: "#000000",

  primary100: "#E8F6E9",
  primary200: "#C8E6C9",
  primary300: "#A5D6A7",
  primary400: "#81C784",
  primary500: "#4CAF50",
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
  colorBox1: [
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

  colorBox2: [
    "#FF5733", // Orange
    "#ffaf98",
    "#FFC300", // Yellow
    "#FF3365", // Pink
    "#3366FF", // Blue
    "#FF33A3", // Magenta
    "#FF7F0E", // Dark Orange
    "#6600CC", // Purple
    "#FF5050", // Red
    "#CC66FF", // Lavender
    "#FF9966", // Peach
    "#663300", // Brown
    "#FF99FF", // Light Pink
    "#9966FF", // Violet
    "#FF0000", // Bright Red
  ],
} as const