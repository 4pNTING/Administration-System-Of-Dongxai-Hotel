// app/[lang]/(home)/CustomerHomeClientLayout.tsx
'use client'

import { ReactNode } from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'

// Component Imports
import CustomerHeader from '@views/apps/components/customer/Header'
import CustomerFooter from '@views/apps/components/customer/Footer'

// Type Imports
import type { Locale } from '@configs/i18n'

// Styled component for main content
const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  width: '100%',
  padding: 0, // เอา padding ออกเพื่อให้หน้าต่างๆ จัดการ padding เอง
  transition: 'padding .25s ease-in-out',
  backgroundColor: theme.palette.background.default
}))

interface CustomerHomeClientLayoutProps {
  children: ReactNode
  locale: Locale
}

export default function CustomerHomeClientLayout({ 
  children, 
  locale 
}: CustomerHomeClientLayoutProps) {
  return (
    <Box 
      className='layout-wrapper'
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh' 
      }}
    >
      <CustomerHeader />
      <Main className='layout-content-wrapper'>
        {children}
      </Main>
      <CustomerFooter />
    </Box>
  )
}