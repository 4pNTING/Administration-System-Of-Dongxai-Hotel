'use client'

// hocs/AuthGuard.tsx
import { useEffect, useState, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Box, CircularProgress } from '@mui/material'
import AuthRedirect from '@/components/AuthRedirect'

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
const customerRoutes = [
  '/home',
  '/my-bookings',
  '/book-now',
  '/profile',
  '/user-settings'
];

interface AuthGuardProps {
  children: ReactNode
  locale: Locale
}

const AuthGuard1111 = ({ children, locale }: AuthGuardProps) => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)

  // Debug logs to see what's happening
  console.log("AUTH GUARD - Session Status:", status)
  console.log("AUTH GUARD - Session:", session)
  console.log("AUTH GUARD - Current Path:", pathname)

  useEffect(() => {
    // Wait for session check to complete
    if (status === 'loading') {
      return
    }

    

    // Extract path without locale prefix for route checking
    const pathWithoutLocale = pathname.replace(`/${locale}`, '')
    console.log("Path without locale:", pathWithoutLocale)
    
    // Check if current route is public
    const isPublicRoute = publicRoutes.some(route => 
      pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
    )
    console.log("Is public route:", isPublicRoute)

    // NOT AUTHENTICATED: Redirect to login if trying to access protected route
    if (status === 'unauthenticated' && !isPublicRoute) {
      console.log("Not authenticated, redirecting to login")
      router.replace(getLocalizedUrl(`/login?redirectTo=${pathname}`, locale))
      return
    }

    if (isPublicRoute) {
      setAuthorized(true)
      return
    }

    // AUTHENTICATED: Handle redirects based on user type
    if (status === 'authenticated') {
      const userType = session.user.type || 'staff'
      console.log("User type:", userType)
      
      // If on login page and already authenticated, redirect to appropriate dashboard
      if (pathWithoutLocale === '/login') {
        console.log("Already logged in, redirecting from login page")
        if (userType === 'customer') {
          router.replace(getLocalizedUrl(APP_ROUTES.CUSTOMER_HOME, locale))
        } else {
          router.replace(getLocalizedUrl(APP_ROUTES.DASHBOARD_ROUTE, locale))
        }
        return
      }
      
      // Check access permissions based on user type
      if (userType === 'customer') {
        const isStaffRoute = staffRoutes.some(route => 
          pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
        )
        
        if (isStaffRoute) {
          console.log("Customer trying to access staff route, redirecting")
          router.replace(getLocalizedUrl(APP_ROUTES.CUSTOMER_HOME, locale))
          return
        }
      } else if (userType === 'staff') {
        const isCustomerRoute = customerRoutes.some(route => 
          pathWithoutLocale === route || pathWithoutLocale.startsWith(`${route}/`)
        )
        
        if (isCustomerRoute) {
          console.log("Staff trying to access customer route, redirecting")
          router.replace(getLocalizedUrl(APP_ROUTES.DASHBOARD_ROUTE, locale))
          return
        }
      }
    }

    // All checks passed, render the content
    console.log("Authorization passed, rendering content")
    setAuthorized(true)
  }, [status, pathname, router, locale, session])

  // Show loading spinner during authorization check
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

export default AuthGuard1111