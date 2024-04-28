import { getLocales } from "expo-localization"

const INDIAN_SUBCONTINENT_REGION_CODES = ["IN", "BD", "NP", "LK", "PK", "BT"]

export function useLocale() {
  const locales = getLocales()
  const numberingSystem =
    locales[0].regionCode && INDIAN_SUBCONTINENT_REGION_CODES.includes(locales[0].regionCode)
      ? "Indian"
      : "International"
  const digitGroupingRegex =
    numberingSystem === "Indian" ? /\B(?=(\d{2})*(\d{3})(?!\d))/g : /\B(?=(\d{3})+(?!\d))/g
  const formatLocaleMoney = (value: number, precision = 2) => {
    return value.toFixed(precision).toString().replace(digitGroupingRegex, locales[0].digitGroupingSeparator ?? ",")
  }
  return {
    ...locales[0],
    numberingSystem,
    digitGroupingRegex,
    formatLocaleMoney,
  }
}
