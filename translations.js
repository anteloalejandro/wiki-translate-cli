import { en } from "./translations/en.js";
import { es } from "./translations/es.js";

const translations = {
  default: en,
  fallback: en,
  en, es
};

/**
 * @param {string} lang
 */
export function setTextLang(lang) {
  if (Object.hasOwn(translations, lang))
    translations.default = translations[lang];
}

/**
 * @param {string} key
 * @param {string} lang
 */
export function getText(key, lang) {
  if (!lang || !Object.hasOwn(translations, lang)) lang = "default";

  /** @type { Map } */
  const langMap = translations[lang];

  return langMap.has(key)
    ? langMap.get(key)
    : (
      translations.fallback.has(key)
        ? translations.fallback.get(key)
        : key
    );
}
