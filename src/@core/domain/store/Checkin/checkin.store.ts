// src/core/domain/store/checkin/checkin.store.ts
import { create } from 'zustand';
import { Booking } from '@core/domain/models/booking/list.model';
import { bookingService } from '@core/services/booking.service';
import { toast } from 'react-toastify';

interface CheckinState {
  // State
  confirmedBookings: Booking[];
  isLoading: boolean;
  searchValue: string;
  selectedBooking: Booking | null;
  isProcessing: boolean;
  
  // Actions
  setSearchValue: (value: string) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  fetchConfirmedBookings: () => Promise<void>;
  processCheckin: (bookingId: number) => Promise<void>;
  
  // Computed
  getFilteredBookings: () => Booking[];
  getTodayCheckIns: () => Booking[];
}

export const useCheckinStore = create<CheckinState>((set, get) => ({
  // Initial State
  confirmedBookings: [],
  isLoading: false,
  searchValue: '',
  selectedBooking: null,
  isProcessing: false,
  
  // Actions
  setSearchValue: (value: string) => set({ searchValue: value }),
  
  setSelectedBooking: (booking: Booking | null) => set({ selectedBooking: booking }),
  
  fetchConfirmedBookings: async () => {
    try {
      set({ isLoading: true });
      
      // Fetch all bookings และ filter เฉพาะที่ยืนยันแล้ว
      const allBookings = await bookingService.getMany();
      const confirmedBookings = allBookings.filter(booking => booking.StatusId === 2);
      
      set({ 
        confirmedBookings,
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching confirmed bookings:', error);
      toast.error('ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຈອງ');
      set({ isLoading: false });
    }
  },
  
  processCheckin: async (bookingId: number) => {
    try {
      set({ isProcessing: true });
      
      console.log('🏨 Processing check-in for booking ID:', bookingId);
      
      // เพิ่มการตรวจสอบวันที่และ confirmation สำหรับ early check-in
      const booking = get().confirmedBookings.find(b => b.BookingId === bookingId);
      if (booking) {
        const today = new Date();
        const checkinDate = new Date(booking.CheckinDate);
        
        // เปรียบเทียบเฉพาะวันที่
        today.setHours(0, 0, 0, 0);
        checkinDate.setHours(0, 0, 0, 0);
        
        // แก้ไข type error - แปลงเป็น number ก่อนคำนวณ
        const todayTime = today.getTime();
        const checkinTime = checkinDate.getTime();
        const daysDiff = Math.ceil((checkinTime - todayTime) / (1000 * 60 * 60 * 24));
        
        // ตรวจสอบว่าเป็น early check-in หรือไม่
        if (daysDiff > 0) {
          console.log(`⚠️ Early check-in: ${daysDiff} day(s) before scheduled date`);
          
          // แสดง confirmation dialog
          const customerName = booking.customer?.CustomerName || `Booking #${bookingId}`;
          const scheduledDate = checkinDate.toLocaleDateString('th-TH');
          
          const confirmed = confirm(
            `🏨 Early Check-in Confirmation\n\n` +
            `ລູກຄ້າ: ${customerName}\n` +
            `ກຳນົດເຊັກອິນ: ${scheduledDate}\n` +
            `ເຊັກອິນກ່ອນກຳນົດ: ${daysDiff} ວັນ\n\n` +
            `ຢືນຢັນການເຊັກອິນກ່ອນກຳນົດ?`
          );
          
          if (!confirmed) {
            console.log('❌ Early check-in cancelled by user');
            set({ isProcessing: false });
            toast.info('ຍົກເລີກການເຊັກອິນ');
            return;
          }
          
          console.log('✅ Early check-in confirmed by user');
        } else if (daysDiff === 0) {
          console.log('✅ On-time check-in');
        } else {
          const lateDays = Math.abs(daysDiff);
          console.log(`⚠️ Late check-in: ${lateDays} day(s) after scheduled date`);
        }
      }
      
      // ดำเนินการเช็คอิน
      await bookingService.checkin(bookingId);
      
      console.log('✅ Check-in completed successfully');
      
      // Remove from confirmed bookings list
      const { confirmedBookings } = get();
      const updatedBookings = confirmedBookings.filter(
        booking => booking.BookingId !== bookingId
      );
      
      set({ 
        confirmedBookings: updatedBookings,
        isProcessing: false,
        selectedBooking: null
      });
      
      // แสดงข้อความสำเร็จตามประเภทการเช็คอิน
      if (booking) {
        const today = new Date();
        const checkinDate = new Date(booking.CheckinDate);
        today.setHours(0, 0, 0, 0);
        checkinDate.setHours(0, 0, 0, 0);
        
        // แก้ไข type error - แปลงเป็น number ก่อนคำนวณ
        const todayTime = today.getTime();
        const checkinTime = checkinDate.getTime();
        const daysDiff = Math.ceil((checkinTime - todayTime) / (1000 * 60 * 60 * 24));
        
        if (daysDiff > 0) {
          toast.success(`✅ Early Check-in ສຳເລັດ! (ກ່ອນກຳນົດ ${daysDiff} ວັນ)`);
        } else if (daysDiff === 0) {
          toast.success('✅ ເຊັກອິນສຳເລັດ!');
        } else {
          toast.success(`✅ Late Check-in ສຳເລັດ! (ຫລັງກຳນົດ ${Math.abs(daysDiff)} ວັນ)`);
        }
      } else {
        toast.success('✅ ເຊັກອິນສຳເລັດແລ້ວ!');
      }
      
    } catch (error: any) {
      console.error('❌ Error processing check-in:', error);
      
      // ปรับปรุงการจัดการ error message
      let errorMessage = 'ເກີດຂໍ້ຜິດພາດໃນການເຊັກອິນ';
      
      if (error.message && typeof error.message === 'string') {
        if (error.message.includes('before the scheduled date') || error.message.includes('เช็คอินก่อนกำหนด')) {
          errorMessage = 'ເຊັກອິນກ່ອນກຳນົດໄດ້ສູງສຸດ 1 ວັນ';
        } else if (error.message.includes('already been checked in')) {
          errorMessage = 'ການຈອງນີ້ເຊັກອິນແລ້ວ';
        } else if (error.message.includes('not found')) {
          errorMessage = 'ບໍ່ພົບການຈອງນີ້';
        } else if (error.message.includes('expected status 2')) {
          errorMessage = 'ສະຖານະການຈອງບໍ່ຖືກຕ້ອງສຳລັບເຊັກອິນ';
        }
      }
      
      toast.error(errorMessage);
      set({ isProcessing: false });
      throw error;
    }
  },
  
  // Computed Functions
  getFilteredBookings: () => {
    const { confirmedBookings, searchValue } = get();
    
    if (!searchValue) return confirmedBookings;
    
    return confirmedBookings.filter(booking => {
      const searchLower = searchValue.toLowerCase();
      return (
        String(booking.BookingId).includes(searchValue) ||
        String(booking.RoomId).includes(searchValue) ||
        (booking.customer?.CustomerName || '').toLowerCase().includes(searchLower)
      );
    });
  },
  
  getTodayCheckIns: () => {
    const filteredBookings = get().getFilteredBookings();
    const today = new Date().toDateString();
    
    return filteredBookings.filter(booking => {
      const checkinDate = new Date(booking.CheckinDate).toDateString();
      return today === checkinDate;
    });
  }
}));