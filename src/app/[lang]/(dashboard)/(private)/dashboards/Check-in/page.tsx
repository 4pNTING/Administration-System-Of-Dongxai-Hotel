// src/views/apps/checkin/CheckinPage.tsx (Fixed)
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';

// Vuexy Components
import CustomTextField from '@core/components/mui/TextField';
import CustomChip from '@core/components/mui/Chip';

import { CheckinSearch } from '@views/apps/checkin/CheckinSearch';
import { CheckinCard } from '@views/apps/checkin/CheckinCard';
import { CheckinConfirmDialog } from '@views/apps/checkin/CheckinConfirmDialog';
import { CancelBookingDialog } from '@views/apps/checkin/CancelBookingDialog';

// Fixed import path
import { useBookingStore } from '@core/infrastructure/store/booking/booking.store';
import { Booking } from '@core/domain/models/booking/list.model';

// Types for NextAuth
interface SessionUser {
  id: string;
  userName: string;
  roleId: number;
  role: string;
}

declare module 'next-auth' {
  interface Session {
    user: SessionUser;
  }
}

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
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  
  // Session management
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?? 0;
  
  // Helper function to get role name
  const getRoleText = (roleId: number): string => {
    const roles: Record<number, string> = {
      1: 'ຜູ້ດູແລລະບົບ',
      2: 'ພະນັກງານຕ້ອນຮັບ', 
      3: 'ພະນັກງານທົ່ວໄປ',
      4: 'ຜູ້ຈັດການ'
    };
    return roles[roleId] || 'ບໍ່ຮູ້';
  };

  // Load data on component mount
  useEffect(() => {
    fetchConfirmedBookings();
  }, [fetchConfirmedBookings]);

  // Get filtered data
  const filteredBookings = getFilteredBookings();
  const todayCheckIns = getTodayCheckIns();
  
  // Calculate today's check-ins manually to ensure accuracy
  const calculateTodayCheckIns = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredBookings.filter(booking => {
      try {
        const checkinDate = new Date(booking.CheckinDate);
        checkinDate.setHours(0, 0, 0, 0);
        return today.getTime() === checkinDate.getTime();
      } catch {
        return false;
      }
    });
  };
  
  const todayCheckInsCount = calculateTodayCheckIns().length;

  // Debug log
  console.log('Debug CheckinPage:', {
    confirmedBookings: confirmedBookings.length,
    filteredBookings: filteredBookings.length,
    todayCheckIns: todayCheckIns.length,
    todayCheckInsCount,
    today: new Date().toDateString(),
    bookings: filteredBookings.map(b => ({
      id: b.BookingId,
      status: b.StatusId,
      checkinDate: new Date(b.CheckinDate).toDateString(),
      isToday: new Date().toDateString() === new Date(b.CheckinDate).toDateString()
    }))
  });

  // Handlers
  const handleCheckinClick = (booking: Booking) => {
    console.log('Selected booking for check-in:', {
      id: booking.BookingId,
      status: booking.StatusId,
      customer: booking.customer?.CustomerName
    });
    setSelectedBooking(booking);
    setDialogOpen(true);
  };

  const handleCheckinConfirm = async () => {
    if (!selectedBooking) return;
    
    try {
      console.log('Processing check-in for booking:', selectedBooking.BookingId);
      await processCheckin(selectedBooking.BookingId);
      setDialogOpen(false);
      
      // Refresh data after successful check-in
      setTimeout(() => {
        fetchConfirmedBookings();
      }, 1000);
    } catch (error) {
      console.error('Check-in failed:', error);
      // Error is handled in the store
    }
  };

  const handleCheckinCancel = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  // Cancel booking handlers
  const handleCancelClick = (booking: Booking) => {
    console.log('Selected booking for cancellation:', booking.BookingId);
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async (reason: string, refundAmount?: number) => {
    if (!bookingToCancel) return;
    
    try {
      console.log('Cancelling booking:', {
        bookingId: bookingToCancel.BookingId,
        reason,
        refundAmount
      });
      
      // TODO: Implement actual cancel booking API call
      // await cancelBookingService.cancel(bookingToCancel.BookingId, reason, refundAmount);
      
      setCancelDialogOpen(false);
      setBookingToCancel(null);
      
      // Refresh data after cancellation
      fetchConfirmedBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const handleCancelDialogClose = () => {
    setCancelDialogOpen(false);
    setBookingToCancel(null);
  };

  // Loading state
  if (isLoadingAuth) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          ກຳລັງກວດສອບສິດການໃຊ້ງານ...
        </Typography>
      </Box>
    );
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '80vh',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <Typography variant="h6" color="error">
          ກະລຸນາເຂົ້າສູ່ລະບົບກ່ອນ
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        {/* Page Header - Vuexy Style */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 500 }}>
            ລະບົບເຊັກອິນ
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            ຈັດການການເຊັກອິນສຳລັບການຈອງທີ່ຢືນຢັນແລ້ວ
          </Typography>
          
          {/* User Role Chip */}
          <CustomChip
            label={`${getRoleText(userRoleId)} (ID: ${userRoleId})`}
            size="small"
            variant="tonal"
            color="primary"
          />
        </Box>

        {/* Search Component */}
        <CheckinSearch 
          value={searchValue}
          onChange={setSearchValue}
        />

        {/* Summary Cards */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'common.white'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {filteredBookings.length}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      ການຈອງທັງໝົດ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ພ້ອມເຊັກອິນ
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      bgcolor: 'success.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'common.white'
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {todayCheckInsCount}
                    </Typography>
                  </Box>
                  
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      ເຊັກອິນວັນນີ້
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ກຳນົດເຊັກອິນມື້ນີ້
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Main Content */}
        {isLoading ? (
          <Card>
            <CardContent>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  py: 8,
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <CircularProgress />
                <Typography variant="body1" color="text.secondary">
                  ກຳລັງໂຫລດຂໍ້ມູນ...
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  px: 4
                }}
              >
                <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                  ບໍ່ມີການຈອງທີ່ພ້ອມເຊັກອິນ
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {searchValue ? 'ບໍ່ພົບຜົນການຄົ້ນຫາ' : 'ການຈອງທັງໝົດໄດ້ເຊັກອິນແລ້ວ ຫຼື ຍັງບໍ່ໄດ້ຢືນຢັນ'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {filteredBookings.map((booking) => {
              const isToday = new Date().toDateString() === new Date(booking.CheckinDate).toDateString();
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={booking.BookingId}>
                  <CheckinCard 
                    booking={booking}
                    isToday={isToday}
                    onCheckin={handleCheckinClick}
                    onCancel={handleCancelClick}
                    isProcessing={isProcessing}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </Grid>

      {/* Dialogs */}
      <CheckinConfirmDialog 
        open={dialogOpen}
        booking={selectedBooking}
        isProcessing={isProcessing}
        onConfirm={handleCheckinConfirm}
        onCancel={handleCheckinCancel}
      />

      <CancelBookingDialog 
        open={cancelDialogOpen}
        booking={bookingToCancel}
        isProcessing={isProcessing}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelDialogClose}
      />
    </Grid>
  );
}