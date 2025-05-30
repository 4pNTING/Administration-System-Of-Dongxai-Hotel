// src/views/apps/checkin/components/CheckinStatistics.tsx
import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

interface CheckinStatisticsProps {
  totalConfirmed: number;
  todayCheckIns: number;
}

export const CheckinStatistics: React.FC<CheckinStatisticsProps> = ({
  totalConfirmed,
  todayCheckIns
}) => {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="primary" gutterBottom>
              ການຈອງທີ່ຢືນຢັນແລ້ວ
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {totalConfirmed}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ພ້ອມສຳລັບເຊັກອິນ
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" color="success.main" gutterBottom>
              ເຊັກອິນວັນນີ້
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {todayCheckIns}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ມີກຳນົດເຂົ້າພັກວັນນີ້
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};