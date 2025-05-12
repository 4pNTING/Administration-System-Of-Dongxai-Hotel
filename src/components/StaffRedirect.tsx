'use client'

// Next Imports
import { redirect } from 'next/navigation'

// Type Imports
import type { Locale } from '@/configs/i18n'

// Config Imports
import { APP_ROUTES } from '../@core/infrastructure/api/config/app-routes.config'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

const StaffRedirect = ({ lang }: { lang: Locale }) => {
  // นำทางไปยังหน้า Dashboard ของ Staff
  const dashboardUrl = getLocalizedUrl(APP_ROUTES.DASHBOARD_ROUTE, lang)
  
  return redirect(dashboardUrl)
}

export default StaffRedirect