// src/app/(dashboard)/checkins/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

// Component Imports
import { BookingSeach } from '@/views/apps/booking/BookingSeach';
import CheckInTable from '@views/apps/checkin/CheckInTable';
import CheckInCards from '@views/apps/checkin/CheckinCard';
import { DateRangePicker } from '@views/apps/checkin/DateRangePicker';

// Store Imports
import { useBookingStore } from '@core/infrastructure/store/booking/booking.store';
import { Booking } from '@core/domain/models/booking/list.model';

export default function CheckInPage() {
  const { 
    items: allBookings, 
    fetchItems, 
    checkin: checkinBooking,
    cancel: cancelBooking,
    isLoading
  } = useBookingStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [startDate, setStartDate] = useState(''); // เริ่มต้นเป็นค่าว่าง = แสดงทั้งหมด
  const [endDate, setEndDate] = useState(''); // เริ่มต้นเป็นค่าว่าง = แสดงทั้งหมด
  
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;
  

  const relevantBookings = allBookings.filter(booking => {
    // กรองเฉพาะสถานะที่เกี่ยวข้อง
    const isRelevantStatus = booking.StatusId === 2 || booking.StatusId === 3 || booking.StatusId === 5;
    
    // ถ้าไม่ได้เลือกวันที่ ให้แสดงทั้งหมด
    if (!startDate || !endDate) {
      return isRelevantStatus;
    }
    
    // ถ้าเลือกวันที่แล้ว ให้กรองตามช่วงวันที่
    const bookingDate = new Date(booking.CheckinDate);
    const filterStartDate = new Date(startDate);
    const filterEndDate = new Date(endDate);
    
    // เปรียบเทียบเฉพาะวันที่ (ไม่รวมเวลา)
    bookingDate.setHours(0, 0, 0, 0);
    filterStartDate.setHours(0, 0, 0, 0);
    filterEndDate.setHours(23, 59, 59, 999);
    
    const isInDateRange = bookingDate >= filterStartDate && bookingDate <= filterEndDate;
    
    return isRelevantStatus && isInDateRange;
  });
  
  // Handle checkin booking
  const handleCheckinBooking = async (booking: Booking) => {
    try {
      toast.info('ກຳລັງດຳເນີນການເຊັກອິນ...');
      
      await checkinBooking(booking.BookingId);
      
      toast.success('ເຊັກອິນສໍາເລັດແລ້ວ');
      
      // Refresh ข้อมูล
      fetchItems();
      
    } catch (error: any) {
      console.error('Error checking in booking:', error);
      
      if (error.message && (
        error.message.includes('already been checked in') || 
        error.message.includes('Booking has already been checked in') ||
        error.message.includes('ໄດ້ຖືກເຊັກອິນໄປແລ້ວ')
      )) {
        toast.warning('Booking ນີ້ໄດ້ຖືກເຊັກອິນໄປແລ້ວ');
        fetchItems();
      } else {
        toast.error('ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ: ' + (error.message || 'Unknown error'));
      }
    }
  };

  // Handle cancel booking
  const handleCancelBooking = async (booking: Booking) => {
    try {
      toast.info('ກຳລັງດຳເນີນການຍົກເລີກ...');
      
      await cancelBooking(booking.BookingId);
      
      toast.success('ຍົກເລີກການຈອງສໍາເລັດແລ້ວ');
      
      fetchItems();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການຍົກເລີກ');
    }
  };
  
  const getRoleText = (roleId: number) => {
    switch (roleId) {
      case 1: return 'ຜູ້ດູແລລະບົບ';
      case 2: return 'ພະນັກງານຕ້ອນຮັບ';
      case 3: return 'ພະນັກງານທົ່ວໄປ';
      case 4: return 'ຜູ້ຈັດການ';
      default: return 'ບໍ່ຮູ້';
    }
  };
  
  // Filtered Items Logic
  const filteredBookings = relevantBookings.filter(booking => {
    const roomId = booking.RoomId ? String(booking.RoomId) : '';
    const roomName = booking.room?.roomType?.TypeName || '';
    const customerName = booking.customer?.CustomerName || '';
    
    const matchesSearch = !searchValue || 
      String(booking.BookingId).includes(searchValue) || 
      roomId.includes(searchValue) ||
      roomName.toLowerCase().includes(searchValue.toLowerCase()) ||
      customerName.toLowerCase().includes(searchValue.toLowerCase());
    
    return matchesSearch;
  });

  // *** เพิ่ม: แยกนับจำนวนตามสถานะ ***
  const pendingCount = filteredBookings.filter(b => b.StatusId === 2).length;
  const checkedInCount = filteredBookings.filter(b => b.StatusId === 3).length;
  const cancelledCount = filteredBookings.filter(b => b.StatusId === 5).length;
  
  useEffect(() => {
    console.log("Loading booking data...");
    fetchItems();
  }, [fetchItems]);
  
  const handleFilterChange = (value: string) => setSearchValue(value);
  
  const handleStartDateChange = (date: string) => {
    setStartDate(date);
    // ถ้าวันที่เริ่มต้นมากกว่าวันที่สิ้นสุด ให้ปรับวันที่สิ้นสุด
    if (endDate && date > endDate) {
      setEndDate(date);
    }
  };
  
  const handleEndDateChange = (date: string) => setEndDate(date);
  
  const handleClearFilter = () => {
    setStartDate('');
    setEndDate('');
  };
  
  const hasDateFilter = Boolean(startDate && endDate);
  
  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }
  
  return (
    <Grid container spacing={6}>
      {/* ✅ Header Section */}
      <Grid item xs={12}>
        <Box sx={{ mb: 1 }}>
          <Typography variant="h4" fontWeight={600}>
            ການເຊັກອິນ
          </Typography>
      
        </Box>
      </Grid>

      {/* ✅ Statistics Cards */}
      <Grid item xs={12}>
        <CheckInCards 
          totalCount={filteredBookings.length}
          pendingCount={pendingCount}
          checkedInCount={checkedInCount}
          cancelledCount={cancelledCount}
        />
      </Grid>

      {/* ✅ Search and Table Section */}
      <Grid item xs={12}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
            <BookingSeach
              value={searchValue}
              onFilterChange={handleFilterChange}
            />
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={handleStartDateChange}
              onEndDateChange={handleEndDateChange}
              onClearFilter={handleClearFilter}
              hasFilter={hasDateFilter}
            />
          </Box>
          
      
        </Box>

        <CheckInTable
          data={filteredBookings}
          loading={isLoading}
          onCheckin={handleCheckinBooking}
          onCancel={handleCancelBooking}
          currentUserRole={userRoleId}
        />
      </Grid>
    </Grid>
  );
}