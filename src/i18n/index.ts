import { ref } from 'vue'

import enApp from './locales/en/app.json'
import enCommon from './locales/en/common.json'
import enNavbar from './locales/en/navbar.json'
import enSettings from './locales/en/settings.json'
import enSidebar from './locales/en/sidebar.json'
import enTutorial from './locales/en/tutorial.json'
import enUpload from './locales/en/upload.json'
import enViewer from './locales/en/viewer.json'

import zhApp from './locales/zh/app.json'
import zhCommon from './locales/zh/common.json'
import zhNavbar from './locales/zh/navbar.json'
import zhSettings from './locales/zh/settings.json'
import zhSidebar from './locales/zh/sidebar.json'
import zhTutorial from './locales/zh/tutorial.json'
import zhUpload from './locales/zh/upload.json'
import zhViewer from './locales/zh/viewer.json'

export const SUPPORTED_LOCALES = ['zh', 'en'] as const
export type Locale = (typeof SUPPORTED_LOCALES)[number]

/** Chinese is the default interface language. */
export const DEFAULT_LOCALE: Locale = 'zh'

const LOCALE_STORAGE_KEY = 'bd2-l2d-viewer-locale'

const DOCUMENT_TITLES: Record<Locale, string> = {
  zh: '棕色尘埃2 L2D 立绘查看器',
  en: 'Brown Dust 2 L2D Viewer',
}

type MessageBundle = Record<string, string>

function flattenMessages(
  source: Record<string, unknown>,
  prefix: string,
  target: MessageBundle,
): MessageBundle {
  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (typeof value === 'string') {
      target[path] = value
    } else if (value && typeof value === 'object') {
      flattenMessages(value as Record<string, unknown>, path, target)
    }
  }
  return target
}

function createBundle(namespaces: Record<string, Record<string, unknown>>): MessageBundle {
  const bundle: MessageBundle = {}
  for (const [namespace, messages] of Object.entries(namespaces)) {
    flattenMessages(messages, namespace, bundle)
  }
  return bundle
}

const bundles: Record<Locale, MessageBundle> = {
  en: createBundle({
    app: enApp,
    common: enCommon,
    navbar: enNavbar,
    settings: enSettings,
    sidebar: enSidebar,
    tutorial: enTutorial,
    upload: enUpload,
    viewer: enViewer,
  }),
  zh: createBundle({
    app: zhApp,
    common: zhCommon,
    navbar: zhNavbar,
    settings: zhSettings,
    sidebar: zhSidebar,
    tutorial: zhTutorial,
    upload: zhUpload,
    viewer: zhViewer,
  }),
}

function isSupportedLocale(value: string | null | undefined): value is Locale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

function readStoredLocale(): Locale {
  if (typeof window === 'undefined') return DEFAULT_LOCALE
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY)
    return isSupportedLocale(stored) ? stored : DEFAULT_LOCALE
  } catch {
    return DEFAULT_LOCALE
  }
}

/** Reactive current locale. Reading it inside a render function / computed keeps it reactive. */
export const locale = ref<Locale>(readStoredLocale())

export function setLocale(next: Locale) {
  if (!isSupportedLocale(next)) return
  locale.value = next
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      /* storage can be unavailable (private mode) - the language still switches for this session */
    }
  }
  syncDocumentLanguage()
}

export function syncDocumentLanguage() {
  if (typeof document === 'undefined') return
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
  document.title = DOCUMENT_TITLES[locale.value] ?? DOCUMENT_TITLES[DEFAULT_LOCALE]
}

/**
 * Translate a key. Missing keys fall back to the default locale bundle, then to the key itself,
 * so a partially translated language never renders an empty string.
 */
export function t(key: string, params?: Record<string, string | number>): string {
  const currentBundle = bundles[locale.value] ?? bundles[DEFAULT_LOCALE]
  let message = currentBundle[key]
  if (message === undefined) message = bundles[DEFAULT_LOCALE][key]
  if (message === undefined) {
    if (import.meta.env.DEV) console.warn(`[i18n] Missing translation key: ${key}`)
    return key
  }
  if (!params) return message
  return message.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name]
    return value === undefined ? match : String(value)
  })
}

export function useI18n() {
  return { t, locale, setLocale, supportedLocales: SUPPORTED_LOCALES }
}

syncDocumentLanguage()
