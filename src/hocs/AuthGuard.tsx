'use client'

// hocs/AuthGuard.tsx
import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'
import { Box, CircularProgress } from '@mui/material'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Type Imports
import type { Locale } from '@configs/i18n'

// Config Imports
import { APP_ROUTES } from '@core/infrastructure/api/config/app-routes.config'

// กำหนดเส้นทางสาธารณะที่ไม่ต้องยืนยันตัวตน
const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/home', '/book-now'];

// กำหนดเส้นทางที่เฉพาะ staff เท่านั้นที่เข้าถึงได้
const staffRoutes = [
  '/dashboards',
  '/apps',
  '/customers',
  '/rooms',
  '/room-types',
  '/staff',
  '/bookings',
  '/payments',
  '/reports',
  '/settings'
];

// กำหนดเส้นทางที่เฉพาะ customer เท่านั้นที่เข้าถึงได้
const customerProtectedRoutes = [
  '/my-bookings',
  '/profile',
  '/user-settings'
];

interface AuthGuardProps {
  children: ReactNode
  locale: Locale
}

const AuthGuard = ({ children, locale }: AuthGuardProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo')
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    // รอให้การตรวจสอบ session เสร็จสิ้น
    if (status === 'loading') {
      return
    }

    console.log("AUTH GUARD - Session Status:", status)
    console.log("AUTH GUARD - Session:", session)
    console.log("AUTH GUARD - Current Path:", pathname)
    console.log("AUTH GUARD - Redirect To:", redirectTo)

    // ถอด locale ออกจาก path
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    console.log("Path without locale:", pathWithoutLocale)
    
    // ตรวจสอบว่าเป็นเส้นทางสาธารณะหรือไม่
    const isPublicRoute = publicRoutes.some(route => 
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    )
    
    // ตรวจสอบว่าเป็นเส้นทางของ customer หรือไม่
    const isCustomerProtectedRoute = customerProtectedRoutes.some(route => 
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    )
    
    console.log("Is public route:", isPublicRoute)
    console.log("Is customer protected route:", isCustomerProtectedRoute)

    // ถ้าเป็นเส้นทางสาธารณะ อนุญาตให้เข้าถึงได้โดยไม่ต้องยืนยันตัวตน
    if (isPublicRoute) {
      console.log("Public route, access granted")
      setAuthorized(true)
      return
    }

    // ถ้าไม่ใช่เส้นทางสาธารณะและยังไม่ได้ยืนยันตัวตน นำทางไปยังหน้า login
    if (status === 'unauthenticated') {
      console.log("Not authenticated, redirecting to login")
      // บันทึกหน้าที่ต้องการเข้าถึงไว้ใน localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('redirectAfterLogin', pathname)
      }
      router.replace(getLocalizedUrl(`/login?redirectTo=${pathname}`, locale))
      return
    }

    // จากนี้เป็นกรณีที่ได้รับการยืนยันตัวตนแล้ว
    if (status === 'authenticated') {
      const userType = session.user.type || 'staff'
      console.log("User type:", userType)
      
      // ถ้าอยู่ในหน้า login และได้รับการยืนยันตัวตนแล้ว
      if (pathWithoutLocale === '/login') {
        console.log("Already logged in, redirecting from login page")
        
        // ตรวจสอบว่ามี redirectTo หรือไม่
        let redirectPath = null
        
        // ลำดับการตรวจสอบ:
        // 1. จาก query parameter redirectTo
        if (redirectTo) {
          redirectPath = redirectTo
        } 
        // 2. จาก localStorage
        else if (typeof window !== 'undefined') {
          redirectPath = localStorage.getItem('redirectAfterLogin')
          localStorage.removeItem('redirectAfterLogin') // ลบหลังจากใช้งาน
        }
        
        // หากมี redirectPath ให้นำทางไปยังหน้านั้น
        if (redirectPath) {
          console.log("Redirecting to:", redirectPath)
          router.replace(redirectPath)
        } 
        // หากไม่มี redirectPath ให้นำทางไปยังหน้าหลักตามประเภทผู้ใช้
        else {
          if (userType === 'customer') {
            router.replace(getLocalizedUrl(APP_ROUTES.CUSTOMER_HOME, locale))
          } else {
            router.replace(getLocalizedUrl(APP_ROUTES.DASHBOARD_ROUTE, locale))
          }
        }
        return
      }
      
      // ตรวจสอบสิทธิ์การเข้าถึงตามประเภทผู้ใช้
      if (userType === 'customer') {
        // Customer สามารถเข้าถึงเส้นทาง customer และ public ได้
        const isStaffRoute = staffRoutes.some(route => 
          pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
        )
        
        if (isStaffRoute) {
          console.log("Customer trying to access staff route, redirecting")
          router.replace(getLocalizedUrl(APP_ROUTES.CUSTOMER_HOME, locale))
          return
        }
        
        // Customer สามารถเข้าถึงเส้นทาง customer protected ได้
        if (isCustomerProtectedRoute) {
          console.log("Customer accessing protected customer route, access granted")
          setAuthorized(true)
          return
        }
      } else {
        // เป็น staff หรือ admin
        // Staff ไม่สามารถเข้าถึงเส้นทาง customer protected ได้
        if (isCustomerProtectedRoute) {
          console.log("Staff trying to access customer route, redirecting")
          router.replace(getLocalizedUrl(APP_ROUTES.DASHBOARD_ROUTE, locale))
          return
        }
      }
    }

    // ผ่านการตรวจสอบทั้งหมด
    console.log("Authorization passed, rendering content")
    setAuthorized(true)
  }, [status, pathname, router, locale, session, redirectTo])

  // แสดง loading ระหว่างการตรวจสอบ
  if (!authorized) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return <>{children}</>
}

export default AuthGuard