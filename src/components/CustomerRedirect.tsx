'use client'

// Next Imports
import { redirect } from 'next/navigation'

// Type Imports
import type { Locale } from '@/configs/i18n'

// Config Imports
import { APP_ROUTES } from '../@core/infrastructure/api/config/app-routes.config'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const CustomerRedirect = ({ lang }: { lang: Locale }) => {
  // นำทางไปยังหน้า Home ของ Customer
  const homeUrl = getLocalizedUrl(APP_ROUTES.CUSTOMER_HOME, lang)
  
  return redirect(homeUrl)
}

export default CustomerRedirect