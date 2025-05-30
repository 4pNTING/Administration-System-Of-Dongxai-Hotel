
// src/core/domain/store/booking-status.store.ts
import { create } from 'zustand';
import { BookingStatus } from '@core/domain/models/booking/booking-status/list.model';
import { bookingStatusService } from '@core/services/booking-status.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';

// สถานะของ Store
interface BookingStatusState {
  bookingStatuses: BookingStatus[];
  isLoading: boolean;
  
  // ฟังก์ชันจัดการรายการ
  setBookingStatuses: (bookingStatuses: BookingStatus[]) => void;
  fetchBookingStatuses: () => Promise<void>;
}

// สร้าง Zustand store
export const useBookingStatusStore = create<BookingStatusState>((set) => ({
  // สถานะเริ่มต้น
  bookingStatuses: [],
  isLoading: false,
  
  // ฟังก์ชันจัดการรายการสถานะการจอง
  setBookingStatuses: (bookingStatuses: BookingStatus[]) => set({ bookingStatuses }),
  
  fetchBookingStatuses: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      const data = await bookingStatusService.getMany();
      set({ bookingStatuses: data, isLoading: false });
      
      setLoading(false);
    } catch (error: any) {
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch booking statuses');
      console.error('Error fetching booking statuses:', error);
    }
  }
}));