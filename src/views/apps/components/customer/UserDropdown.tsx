// views/apps/components/customer/UserDropdown.tsx
'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

// Config Imports
import { APP_ROUTES } from '../../../../@core/infrastructure/api/config/app-routes.config'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'
import type { Locale } from '@/configs/i18n'

const UserDropdown = () => {
  const { data: session } = useSession()
  const { lang: locale } = useParams() as { lang: Locale }
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  // เหลือเฉพาะส่วน User Dropdown
  return (
    <div>
      {!session ? (
        // If there's no session, show login button
        <Button
          component={Link}
          href={getLocalizedUrl('/login', locale)}
          color="inherit"
        >
          Login
        </Button>
      ) : (
        // If there's a session, show user dropdown
        <>
          <IconButton
            onClick={handleClick}
            size="small"
            edge="end"
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {session?.user?.name?.[0] || 'U'}
            </Avatar>
          </IconButton>

          <Menu
            id="account-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            PaperProps={{
              elevation: 4,
              sx: {
                mt: 1,
                width: 220,
                overflow: 'visible',
                '&:before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translateY(-50%) rotate(45deg)',
                  zIndex: 0
                }
              }
            }}
          >
            <Box>
              {session?.user?.name && (
                <>
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="body1" fontWeight="600">
                      {session.user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {session.user.email}
                    </Typography>
                  </Box>
                  <Divider />
                </>
              )}
              <MenuItem component={Link} href={getLocalizedUrl(APP_ROUTES.CUSTOMER_PROFILE, locale)}>
                <i className='tabler-user mr-2' /> Profile
              </MenuItem>
              <MenuItem component={Link} href={getLocalizedUrl(APP_ROUTES.CUSTOMER_BOOKING.BASE_URL, locale)}>
                <i className='tabler-calendar mr-2' /> My Bookings
              </MenuItem>
              <MenuItem component={Link} href={getLocalizedUrl('/pages/account-settings', locale)}>
                <i className='tabler-settings mr-2' /> Settings
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => signOut({ callbackUrl: getLocalizedUrl('/login', locale) })}>
                <i className='tabler-logout mr-2' /> Logout
              </MenuItem>
            </Box>
          </Menu>
        </>
      )}
    </div>
  )
}

export default UserDropdown