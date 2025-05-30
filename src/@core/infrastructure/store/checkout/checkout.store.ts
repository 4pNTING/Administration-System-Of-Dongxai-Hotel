// src/core/domain/store/Checkout/checkout.store.ts
import { create } from 'zustand';
import { CheckOutModel } from '@core/domain/models/check-out.model';
import { Booking } from '@core/domain/models/booking/list.model';
import { CheckOutService } from '@application/services/check-out.service';
import { BookingService } from '@application/services/bookings.service';
import { PaymentService } from '@application/services/payments.service';
import { CreateCheckOutDto } from '@application/dtos/check-out.dto';
import { CreatePaymentDto } from '@application/dtos/payment.dto';

interface CheckoutState {
  // Data
  checkedInBookings: Booking[];
  checkOuts: CheckOutModel[];
  selectedBooking: Booking | null;
  searchValue: string;
  
  // UI States
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  
  // Payment related
  showPaymentDialog: boolean;
  paymentAmount: number;
  
  // Actions
  setSearchValue: (value: string) => void;
  setSelectedBooking: (booking: Booking | null) => void;
  setShowPaymentDialog: (show: boolean) => void;
  setPaymentAmount: (amount: number) => void;
  
  // API Actions
  fetchCheckedInBookings: () => Promise<void>;
  processCheckout: (bookingId: number, paymentAmount?: number) => Promise<void>;
  
  // Computed
  getFilteredBookings: () => Booking[];
  getTodayCheckouts: () => Booking[];
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  // Initial state
  checkedInBookings: [],
  checkOuts: [],
  selectedBooking: null,
  searchValue: '',
  isLoading: false,
  isProcessing: false,
  error: null,
  showPaymentDialog: false,
  paymentAmount: 0,

  // Actions
  setSearchValue: (value: string) => set({ searchValue: value }),
  setSelectedBooking: (booking: Booking | null) => set({ selectedBooking: booking }),
  setShowPaymentDialog: (show: boolean) => set({ showPaymentDialog: show }),
  setPaymentAmount: (amount: number) => set({ paymentAmount: amount }),

  // Fetch checked-in bookings (StatusId = 3)
  fetchCheckedInBookings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const bookingService = new BookingService();
      const bookings = await bookingService.getCheckedInBookings({
        relations: ['room', 'customer', 'staff', 'room.roomType'],
        orderBy: { CheckinDate: 'DESC' },
        getType: 'many'
      });
      
      set({ 
        checkedInBookings: Array.isArray(bookings) ? bookings : [],
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching checked-in bookings:', error);
      set({ 
        error: 'ไม่สามารถโหลดข้อมูลการจองที่เช็คอินแล้วได้',
        isLoading: false 
      });
    }
  },

  // Process checkout
  processCheckout: async (bookingId: number, paymentAmount?: number) => {
    const { selectedBooking } = get();
    if (!selectedBooking) return;
    
    set({ isProcessing: true, error: null });
    
    try {
      // 1. Create checkout record first
      const checkOutService = new CheckOutService();
      const checkInService = new CheckInService();
      
      // Find the check-in record for this booking
      const checkInRecords = await checkInService.findByBookingId(bookingId);
      if (!checkInRecords) {
        throw new Error('ไม่พบข้อมูลการเช็คอิน');
      }
      
      const checkOutData: CreateCheckOutDto = {
        CheckoutDate: new Date(),
        CheckinId: checkInRecords.CheckInId,
        RoomId: selectedBooking.RoomId,
        StaffId: selectedBooking.StaffId || 1 // Default staff ID if not available
      };
      
      const checkOutResult = await checkOutService.create(checkOutData);
      
      // 2. Create payment record if payment amount is provided
      if (paymentAmount && paymentAmount > 0) {
        const paymentService = new PaymentService();
        const paymentData: CreatePaymentDto = {
          PaymentPrice: paymentAmount,
          PaymentDate: new Date(),
          StaffId: selectedBooking.StaffId || 1,
          CheckoutId: checkOutResult.CheckoutId
        };
        
        await paymentService.create(paymentData);
      }
      
      // 3. Update booking status to checked-out (StatusId = 4)
      const bookingService = new BookingService();
      await bookingService.checkoutBooking(bookingId);
      
      // 4. Refresh data
      await get().fetchCheckedInBookings();
      
      set({ 
        isProcessing: false,
        selectedBooking: null,
        showPaymentDialog: false,
        paymentAmount: 0
      });
      
      // Show success message (you might want to use a toast notification)
      console.log('เช็คเอาท์สำเร็จ');
      
    } catch (error) {
      console.error('Error during checkout:', error);
      set({ 
        error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการเช็คเอาท์',
        isProcessing: false 
      });
    }
  },

  // Get filtered bookings based on search
  getFilteredBookings: () => {
    const { checkedInBookings, searchValue } = get();
    
    if (!searchValue.trim()) {
      return checkedInBookings;
    }
    
    const search = searchValue.toLowerCase().trim();
    return checkedInBookings.filter(booking => 
      booking.BookingId.toString().includes(search) ||
      booking.RoomId.toString().includes(search) ||
      booking.customer?.CustomerName?.toLowerCase().includes(search) ||
      booking.room?.roomType?.TypeName?.toLowerCase().includes(search)
    );
  },

  // Get bookings that should checkout today
  getTodayCheckouts: () => {
    const { checkedInBookings } = get();
    const today = new Date().toDateString();
    
    return checkedInBookings.filter(booking => 
      new Date(booking.CheckoutDate).toDateString() === today
    );
  }
}));