// app/[lang]/(home)/layout.tsx
import { headers } from 'next/headers'
import dynamic from 'next/dynamic'
import Container from '@mui/material/Container'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'
import type { Locale } from '@configs/i18n'

// Component Imports
import CustomerHeader from '@views/apps/components/customer/Header'
import CustomerFooter from '@views/apps/components/customer/Footer'
import { SettingsProvider } from '@core/contexts/settingsContext'
import { NextAuthProvider } from '../../../contexts/nextAuthProvider'
import ThemeProvider from '../../../examples/menu/ThemeProvider'
import TranslationWrapper from '@/hocs/TranslationWrapper'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'

// Config Imports
import { i18n } from '@configs/i18n'

// Util Imports
import { getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'

// ใช้ dynamic import สำหรับ AppReactToastify
const AppReactToastify = dynamic(() => import('@/libs/styles/AppReactToastify'), {
  ssr: false
})

export default function CustomerHomeLayout({ children, params }: ChildrenType & { params: { lang: Locale } }) {
  // Vars
  const headersList = headers()
  const direction = i18n.langDirection[params.lang]
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const systemMode = getSystemMode()

  return (
    <TranslationWrapper headersList={headersList} lang={params.lang}>
      <NextAuthProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
          <ThemeProvider direction={direction}>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <CustomerHeader />
              <main style={{ flexGrow: 1 }}>
                {/* ใช้ Container เหมือนกับที่ใช้ใน Header */}
                <Container maxWidth="xl" sx={{ py: 6 }}>
                  {children}
                </Container>
              </main>
              <CustomerFooter />
            </div>
            <AppReactToastify direction={direction} />
          </ThemeProvider>
        </SettingsProvider>
      </NextAuthProvider>
    </TranslationWrapper>
  )
}