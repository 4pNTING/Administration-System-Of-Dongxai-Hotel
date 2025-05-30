'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-toastify';

// MUI Imports
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';

// Component Imports
import { BookingSeach } from '@/views/apps/booking/BookingSeach';
import { BookingStatusFilter } from '@views/apps/booking/components/BookingStatusFilter';
import BookingTable from '@views/apps/booking/BookingTable';
import BookingFormInput from '@views/apps/booking/components/BookingFormInput';

// Store Imports
import { useBookingStore } from '@/@core/infrastructure/store/booking/booking.store';
import { useBookingStatusStore } from '@/@core/infrastructure/store/booking/booking-status.store';
import { Booking } from '@core/domain/models/booking/list.model';

export default function BookingPage() {
  const { items, fetchItems, confirmBooking, isLoading: isLoadingBooking } = useBookingStore();
  const { bookingStatuses, fetchBookingStatuses, isLoading: isLoadingStatus } = useBookingStatusStore();
  
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmingBooking, setConfirmingBooking] = useState(false);
  
  // Use useSession hook from next-auth/react
  const { data: session, status } = useSession();
  const isLoadingAuth = status === 'loading';
  
  // Get roleId from session (check both string and number)
  const userRoleId = session?.user?.roleId ?  
    (typeof session.user.roleId === 'string' ? parseInt(session.user.roleId, 10) : session.user.roleId) : 0;
  
  const handleConfirmBooking = async (booking: Booking) => {
  try {
    setConfirmingBooking(true);
    
    // แสดงว่ากำลังประมวลผล
    toast.info('ກຳລັງດຳເນີນການຢືນຢັນການຈອງ...');
    
    // เรียกใช้ฟังก์ชันยืนยันการจอง
    await confirmBooking(booking.BookingId);
    
    // แสดงข้อความสำเร็จ
    toast.success('ຢືນຢັນການຈອງສໍາເລັດແລ້ວ');
    
    // โหลดข้อมูลใหม่อีกครั้งเพื่ออัปเดตรายการ
    fetchItems();
  } catch (error) {
    console.error('Error confirming booking:', error);
    toast.error('ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ');
  } finally {
    setConfirmingBooking(false);
  }
};
  
  // Debug information
  useEffect(() => {
    console.log('SESSION INFO:', {
      session,
      status,
      userRoleId
    });
    
    // Store data in sessionStorage for other components
    if (session?.user) {
      sessionStorage.setItem('user', JSON.stringify({
        id: session.user.id,
        userName: session.user.userName,
        roleId: userRoleId,
        role: session.user.role
      }));
    }
  }, [session, status, userRoleId]);
  
  // Load booking statuses
  useEffect(() => {
    fetchBookingStatuses();
  }, [fetchBookingStatuses]);
  
  // Helper function to get role name from roleId
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
  const filteredItems = items ? items.filter(booking => {
    // Extract room information - handle potential undefined properties safely
    const roomId = booking.RoomId ? String(booking.RoomId) : '';
    const roomName = booking.room?.roomType?.TypeName || '';
    
    // Extract customer information
    const customerName = booking.customer?.CustomerName || '';
    
    // Search logic
    const matchesSearch = !searchValue || 
      String(booking.BookingId).includes(searchValue) || 
      roomId.includes(searchValue) ||
      roomName.toLowerCase().includes(searchValue.toLowerCase()) ||
      customerName.toLowerCase().includes(searchValue.toLowerCase());
    
    // Status filter logic - try to match with bookingStatus.StatusName if available
    const matchesStatus = !statusFilter || 
      (booking.bookingStatus?.StatusName || '') === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) : [];
  
  useEffect(() => {
    console.log("Fetching booking items...");
    fetchItems();
  }, [fetchItems]);
  
  // Filter Handlers
  const handleFilterChange = (value: string) => setSearchValue(value);
  const handleStatusFilterChange = (value: string) => setStatusFilter(value);
  
  // Form Handlers
  const handleCreate = () => {
    setSelectedItem(null);
    setFormOpen(true);
  };
  
  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setFormOpen(true);
  };
  
  const handleFormClose = () => {
    setSelectedItem(null);
    setFormOpen(false);
  };
  
  // Show loading state while authentication is being checked
  const isLoading = isLoadingAuth || isLoadingBooking || isLoadingStatus || confirmingBooking;
  
  if (isLoadingAuth) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>ກຳລັງກວດສອບສິດການໃຊ້ງານ...</Typography>
      </Box>
    );
  }
  
  return (
    <Grid spacing={4} justifyContent="center">
      <Grid item xs={12} md={10} lg={9}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight={600}>
            ຈັດການການຈອງ
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ສິດການໃຊ້ງານປັດຈຸບັນ: {getRoleText(userRoleId)} (ID: {userRoleId})
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, flexGrow: 1 }}>
            <BookingSeach
              value={searchValue}
              onFilterChange={handleFilterChange}
            />
            <BookingStatusFilter
              statusFilter={statusFilter}
              onStatusFilterChange={handleStatusFilterChange}
              bookingStatuses={bookingStatuses}
            />
          </Box>
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
            sx={{
              height: 'fit-content',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ເພິ່ມການຈອງ
          </Button>
        </Box>
        
        <BookingTable
          data={filteredItems}
          loading={isLoading}
          onEdit={handleEdit}
          onConfirm={handleConfirmBooking}
          currentUserRole={userRoleId}
          bookingStatuses={bookingStatuses}
        />
        
      </Grid>
      
      <BookingFormInput
        open={formOpen}
        onClose={handleFormClose}
        selectedItem={selectedItem}
        onSaved={fetchItems}
      />
    </Grid>
  );
}