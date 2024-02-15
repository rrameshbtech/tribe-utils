import i18n from "i18n-js"
import { TxKeyPath } from "./i18n"

/**
 * Translates text.
 * @param {TxKeyPath} key - The i18n key.
 * @param {i18n.TranslateOptions} options - The i18n options.
 * @returns {string} - The translated text.
 * @example
 * Translations:
 *
 * ```en.ts
 * {
 *  "hello": "Hello, {{name}}!"
 * }
 * ```
 *
 * Usage:
 * ```ts
 * import { translate } from "i18n-js"
 *
 * translate("common.ok", { name: "world" })
 * // => "Hello world!"
 * ```
 */
export function translate(key: TxKeyPath, options?: i18n.TranslateOptions): string {
  return i18n.t(key, options)
}

/**
 * Translates text with support to interpolate with components.
 * @param {TxKeyPath} key - The i18n key.
 * @param {i18n.TranslateOptions} options - The i18n options.
 * @returns {React.ReactNode} - The translated text.
 * @example
 * Translations:
 * ```en.ts
 * {
 * "hello": "Hello, {{name}}!"
 * }
 * ```
 * Usage:
 * ```tsx
 * import { translate } from "i18n-js"
 * 
 * <Text>{translate("common.ok", { name: <Text weight="bold">world</Text> })}</Text>
 * // => "Hello world!"
 * ```
 */
export function translateWithComponentInterpolation(key: TxKeyPath, options?: i18n.TranslateOptions): React.ReactNode {
  const translated = i18n.t(key, options)
  const componentRegex = /<(\w+)([^>]*)>(.*?)<\/\1>/g
  const matches = translated.matchAll(componentRegex)
  let result = translated
  for (const match of matches) {
    const [fullMatch, component, props, content] = match
    result = result.replace(fullMatch, `<${component}${props}>${content}</${component}>`)
  }
  return i18n.t(key, options)
}