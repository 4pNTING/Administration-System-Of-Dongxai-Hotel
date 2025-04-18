import { labelColors } from "@/views/apps/email/SidebarLeft"

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'ar','la'],
  langDirection: {
    en: 'ltr',
    fr: 'ltr',
    ar: 'rtl',
    la: 'lao'
  }
} as const

export type Locale = (typeof i18n)['locales'][number]
