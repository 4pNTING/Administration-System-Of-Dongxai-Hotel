// views/apps/components/customer/NavbarContent.tsx
'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

// Third-party Imports
import classnames from 'classnames'

// Config Imports
import { APP_ROUTES } from '../../../../@core/infrastructure/api/config/app-routes.config'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

// Component Imports
import UserDropdown from './UserDropdown'
import ModeDropdown from '@components/layout/shared/ModeDropdown'

const NavbarContent = () => {
  const { lang: locale } = useParams() as { lang: Locale }
  
  return (
    <Container maxWidth="xl">
      <div className={classnames(verticalLayoutClasses.navbarContent, 'flex items-center justify-between gap-4 is-full')}>
        <Toolbar 
          disableGutters
          sx={{ 
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '64px',
            py: 1
          }}
        >
          {/* Left section: Logo */}
          <div className='flex items-center gap-4'>
            <Typography 
              variant="h6" 
              noWrap 
              component="div"
              sx={{ 
                fontWeight: 600,
                color: 'var(--mui-palette-text-primary)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              Dongxai Hotel
            </Typography>
          </div>
          
          {/* Center section: Navigation Links */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'right', 
              flexGrow: 1,
              '& .MuiButton-root': {
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  transform: 'translateX(-50%) scaleX(0)',
                  transformOrigin: 'center',
                  width: '80%',
                  height: '2px',
                  bgcolor: 'primary.main',
                  transition: 'transform 0.3s ease'
                },
                '&:hover::after': {
                  transform: 'translateX(-50%) scaleX(1)'
                }
              }
            }}
          >
            <Button
              component={Link}
              href={getLocalizedUrl(APP_ROUTES.CUSTOMER_HOME, locale)}
              sx={{ 
                color: 'text.primary', 
                textTransform: 'uppercase',
                fontWeight: 500,
                fontSize: '14px',
                mx: { xs: 0.5, sm: 1, md: 2 },
                px: { xs: 1, sm: 1.5, md: 2 },
                py: 1
              }}
            >
              HOME
            </Button>
            <Button
              component={Link}
              href={getLocalizedUrl(APP_ROUTES.CUSTOMER_BOOK_NOW, locale)}
              sx={{ 
                color: 'text.primary', 
                textTransform: 'uppercase',
                fontWeight: 500,
                fontSize: '14px',
                mx: { xs: 0.5, sm: 1, md: 2 },
                px: { xs: 1, sm: 1.5, md: 2 },
                py: 1
              }}
            >
              BOOK NOW
            </Button>
            <Button
              component={Link}
              href={getLocalizedUrl(APP_ROUTES.CUSTOMER_BOOKING.BASE_URL, locale)}
              sx={{ 
                color: 'text.primary', 
                textTransform: 'uppercase',
                fontWeight: 500,
                fontSize: '14px',
                mx: { xs: 0.5, sm: 1, md: 2 },
                px: { xs: 1, sm: 1.5, md: 2 },
                py: 1
              }}
            >
              MY BOOKINGS
            </Button>
          </Box>

          {/* Right section: Mode and User dropdowns */}
          <div className='flex items-center gap-1'>
            <ModeDropdown />
            <UserDropdown />
          </div>
        </Toolbar>
      </div>
    </Container>
  )
}

export default NavbarContent