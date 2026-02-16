// src/i18n/index.ts
import en from "./locales/en.json"
import fr from "./locales/fr.json"
import ar from "./locales/ar.json"

export type Locale = "en" | "fr" | "lb"
type Dict = Record<string, any>

const dictionaries: Record<Locale, Dict> = {
  en,
  fr,
  lb: ar,
}

function get(obj: any, path: string) {
  return path.split(".").reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj)
}

export function createTranslator(locale: Locale) {
  const dict = dictionaries[locale] ?? dictionaries.en

  return function t(keyPath: string) {
    const value = get(dict, keyPath)
    if (typeof value === "string") return value
    return keyPath
  }
}
