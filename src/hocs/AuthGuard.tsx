// Third-party Imports
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/libs/auth'  // นำเข้า authOptions จากไฟล์ที่คุณกำหนด

// Type Imports
import type { Locale } from '@configs/i18n'
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children, locale }: ChildrenType & { locale: Locale }) {
  // ส่ง authOptions เข้าไปด้วย
  const session = await getServerSession(authOptions)
  
  console.log("SERVER SESSION:", session)
  
  return <>{session ? children : <AuthRedirect lang={locale} />}</>
}