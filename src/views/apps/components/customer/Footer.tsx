// views/apps/components/customer/Footer.tsx
'use client'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'

const CustomerFooter = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        bgcolor: 'grey.200'
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          {'© '}
          <Link color="inherit" href="/">
            Dongxai Hotel
          </Link>{' '}
          {new Date().getFullYear()}
          {'. All rights reserved.'}
        </Typography>
      </Container>
    </Box>
  )
}

export default CustomerFooter