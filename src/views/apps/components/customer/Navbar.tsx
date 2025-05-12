// views/apps/components/customer/Navbar.tsx
'use client'

// MUI Imports
import { useTheme } from '@mui/material/styles'
import AppBar from '@mui/material/AppBar'

// Third-party Imports
import classnames from 'classnames'
import type { CSSObject } from '@emotion/styled'

// Type Imports
import type { ChildrenType } from '@core/types'

// Util Imports
import { verticalLayoutClasses } from '@layouts/utils/layoutClasses'

type Props = ChildrenType & {
  overrideStyles?: CSSObject
}

const Navbar = (props: Props) => {
  // Props
  const { children, overrideStyles } = props

  // Hooks
  const theme = useTheme()

  // Define header style properties - these would normally come from your theme config
  const headerFixed = true
  const headerFloating = false
  const headerDetached = true
  const headerBlur = true
  const headerContentCompact = false
  const headerContentWide = true

  return (
    <AppBar
      position="static"
      color="default"
      elevation={3}
      sx={overrideStyles}
      className={classnames(verticalLayoutClasses.header, {
        [verticalLayoutClasses.headerFixed]: headerFixed,
        [verticalLayoutClasses.headerFloating]: headerFloating,
        [verticalLayoutClasses.headerDetached]: !headerFloating && headerDetached,
        [verticalLayoutClasses.headerBlur]: headerBlur,
        [verticalLayoutClasses.headerContentCompact]: headerContentCompact,
        [verticalLayoutClasses.headerContentWide]: headerContentWide
      })}
    >
      <div className={classnames(verticalLayoutClasses.navbar, 'flex bs-full')}>{children}</div>
    </AppBar>
  )
}

export default Navbar