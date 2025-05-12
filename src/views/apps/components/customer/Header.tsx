// views/apps/components/customer/Header.tsx
'use client'

// MUI Imports
import AppBar from '@mui/material/AppBar'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import NavbarContent from './NavbarContent'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

const CustomerHeader = () => {
  return (
    <AppBar 
      position="static" 
      color="default" 
      elevation={0}
      className={classnames(verticalLayoutClasses.header, {
        [verticalLayoutClasses.headerDetached]: true,
        [verticalLayoutClasses.headerContentWide]: true
      })}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        boxShadow: theme => `0 2px 4px ${theme.palette.mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(0,0,0,0.2)'}`,
      }}
    >
      <NavbarContent />
    </AppBar>
  )
}

export default CustomerHeader