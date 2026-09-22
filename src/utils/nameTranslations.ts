import { locale } from '@/i18n'

import nameTranslations from './nameTranslations.json'

/**
 * Simplified-Chinese names for the characters and costumes shipped with the viewer.
 *
 * The keys are the exact English values used by `src/utils/character_list.ts`; an entry is
 * omitted when no official/community Chinese name could be confirmed, in which case the
 * English name is shown as-is.
 */
const characterNames: Record<string, string> = nameTranslations.characters
const costumeNames: Record<string, string> = nameTranslations.costumes

const NPC_SUFFIX = /\s*\(Npc\)\s*$/i
const CENSORED_SUFFIX = /\s*\(Censored\)\s*$/i

/** Localized label of a character, keeping the NPC marker translated too. */
export function localizeCharacterName(rawName: string): string {
  if (locale.value !== 'zh') return rawName
  const translated = characterNames[rawName]
  if (!translated) return rawName
  return NPC_SUFFIX.test(rawName) ? `${translated}（NPC）` : translated
}

/** Localized label of a costume, including the "(Censored)" model variant. */
export function localizeCostumeName(rawName: string): string {
  if (locale.value !== 'zh') return rawName
  const translated = costumeNames[rawName]
  if (translated) return translated
  const base = rawName.replace(CENSORED_SUFFIX, '')
  if (base !== rawName && costumeNames[base]) return `${costumeNames[base]}（和谐版）`
  return rawName
}

/**
 * Haystack used by the sidebar search box: the original English names plus the Chinese ones,
 * so a query matches in either language regardless of the active locale.
 */
export function nameSearchText(charName: string, costumeName: string): string {
  const costumeBase = costumeName.replace(CENSORED_SUFFIX, '')
  return [
    charName,
    costumeName,
    charName.replace(NPC_SUFFIX, ''),
    characterNames[charName] ?? '',
    costumeNames[costumeName] ?? costumeNames[costumeBase] ?? '',
  ]
    .join(' ')
    .toLowerCase()
}

/** Whether any Chinese name is available at all (used to hide the language hint). */
export function hasChineseNames(): boolean {
  return Object.keys(characterNames).length > 0 || Object.keys(costumeNames).length > 0
}
