// src/views/apps/checkin/CheckinPage.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';

// Components
import { CheckinSearch } from '@views/apps/checkin/heckinSearch';
import { CheckinStatistics } from '@views/apps/checkin/CheckinStatistics';
import { CheckinCard } from '@views/apps/checkin/CheckinCard';
import { CheckinConfirmDialog } from '@views/apps/checkin/CheckinConfirmDialog';

// Store
import { useCheckinStore } from '@core/domain/store/Checkin/checkin.store';
import { Booking } from '@core/domain/models/booking/list.model';

export default function CheckinPage() {
  const {
    confirmedBookings,
    isLoading,
    searchValue,
    selectedBooking,
    isProcessing,
    setSearchValue,
    setSelectedBooking,
    fetchConfirmedBookings,
    processCheckin,
    getFilteredBookings,
    getTodayCheckIns
  } = useCheckinStore();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Session management
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;
  
  // Helper function to get role name
  const getRoleText = (roleId: number) => {
    switch (roleId) {
      case 1: return 'ຜູ້ດູແລລະບົບ';
      case 2: return 'ພະນັກງານຕ້ອນຮັບ';
      case 3: return 'ພະນັກງານທົ່ວໄປ';
      case 4: return 'ຜູ້ຈັດການ';
      default: return 'ບໍ່ຮູ້';
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchConfirmedBookings();
  }, [fetchConfirmedBookings]);

  // Get filtered data
  const filteredBookings = getFilteredBookings();
  const todayCheckIns = getTodayCheckIns();

  // Handlers
  const handleCheckinClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCheckinConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      await processCheckin(selectedBooking.BookingId);
      setDialogOpen(false);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const handleCheckinCancel = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  // Loading state
  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          ລະບົບເຊັກອິນ
        </Typography>
        <Typography variant="body2" color="text.secondary">
          ສິດການໃຊ້ງານປັດຈຸບັນ: {getRoleText(userRoleId)} (ID: {userRoleId})
        </Typography>
      </Box>

      {/* Search */}
      <CheckinSearch 
        value={searchValue}
        onChange={setSearchValue}
      />

      {/* Statistics */}
      <CheckinStatistics 
        totalConfirmed={filteredBookings.length}
        todayCheckIns={todayCheckIns.length}
      />

      {/* Bookings List */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>ກຳລັງໂຫລດຂໍ້ມູນ...</Typography>
        </Box>
      ) : filteredBookings.length === 0 ? (
        <Card>
          <CardContent>
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary">
                ບໍ່ມີການຈອງທີ່ພ້ອມເຊັກອິນ
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {searchValue ? 'ບໍ່ພົບຜົນການຄົ້ນຫາ' : 'ການຈອງທັງໝົດໄດ້ເຊັກອິນແລ້ວ ຫຼື ຍັງບໍ່ໄດ້ຢືນຢັນ'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredBookings.map((booking) => {
            const isToday = new Date().toDateString() === new Date(booking.CheckinDate).toDateString();
            
            return (
              <Grid item xs={12} md={6} lg={4} key={booking.BookingId}>
                <CheckinCard 
                  booking={booking}
                  isToday={isToday}
                  onCheckin={handleCheckinClick}
                  isProcessing={isProcessing}
                />
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Confirmation Dialog */}
      <CheckinConfirmDialog 
        open={dialogOpen}
        booking={selectedBooking}
        isProcessing={isProcessing}
        onConfirm={handleCheckinConfirm}
        onCancel={handleCheckinCancel}
      />
    </Box>
  );
}