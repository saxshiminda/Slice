import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { en } from './en';
import { ka } from './ka';
import { ru } from './ru';
import type { Translations } from './en';

export type Locale = 'en' | 'ka' | 'ru';

const LOCALES: Record<Locale, Translations> = { en, ka, ru };

interface I18nState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      locale: 'en' as Locale,
      setLocale: (locale) => set({ locale }),
    }),
    { name: 'slice-locale', storage: createJSONStorage(() => localStorage) }
  )
);

export function useT(): Translations {
  const locale = useI18nStore((s) => s.locale);
  return LOCALES[locale];
}

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'EN',
  ka: 'KA',
  ru: 'RU',
};
