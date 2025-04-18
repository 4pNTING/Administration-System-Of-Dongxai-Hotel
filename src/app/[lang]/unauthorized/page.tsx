// src/app/[lang]/unauthorized/page.tsx
'use client'

import { useRouter } from 'next/navigation';
import { Button, Typography, Container, Box } from '@mui/material';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          gap: 4
        }}
      >
        <Typography variant="h3" component="h1" color="error" gutterBottom>
          Access Denied
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          You don't have permission to access this page.
        </Typography>
        
        <Typography variant="body1" paragraph>
          Please contact your administrator if you believe this is an error.
        </Typography>
        
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
          
          <Button variant="outlined" onClick={() => router.back()}>
            Go Back
          </Button>
        </Box>
      </Box>
    </Container>
  );
}