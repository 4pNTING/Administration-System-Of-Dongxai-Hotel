// src/core/domain/store/bookings/booking.store.ts (Fixed)
import { create } from 'zustand';
import { Booking } from '@core/domain/models/booking/list.model';
import { bookingService } from '@core/services/booking.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { BookingInput } from '@core/domain/models/booking/form.model';

// สถานะของ Store
interface BookingState {
  // สถานะทั่วไป
  items: Booking[];
  isLoading: boolean;
  filters: Record<string, any>;
  
  // สถานะฟอร์ม
  isVisible: boolean;
  isFormVisible: boolean;
  isSubmitting: boolean;
  selectedItem: Booking | null;
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: Booking[]) => void;
  addItem: (item: Booking) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: Booking) => void;
  fetchItems: () => Promise<void>;
  fetchBookingById: (id: number) => Promise<Booking>;
  delete: (id: number) => Promise<void>;
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => void;
  setFormVisible: (visible: boolean) => void;
  setSelectedItem: (item: Booking | null) => void;
  create: (data: BookingInput) => Promise<Booking>;
  update: (id: number, data: BookingInput) => Promise<Booking>;
  
  // เพิ่มฟังก์ชันยืนยันการจอง
  confirmBooking: (id: number) => Promise<Booking>;
  
  reset: () => void;
  resetForm: () => void;
}

// สร้าง Zustand store
export const useBookingStore = create<BookingState>((set, get) => ({
  // สถานะเริ่มต้น
  items: [],
  isLoading: false,
  filters: {},
  
  // สถานะฟอร์ม
  isVisible: false,
  isFormVisible: false,
  isSubmitting: false,
  selectedItem: null,
  
  // ฟังก์ชันจัดการรายการการจอง
  setFilters: (filters: Record<string, any>) => set({ filters }),
  
  setItems: (items: Booking[]) => set({ items }),
  
  addItem: (item: Booking) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id: number) => set((state) => ({
    items: state.items.filter((item) => item.BookingId !== id) // แก้ไข: item.BookingId
  })),
  
  updateItem: (id: number, updatedItem: Booking) => set((state) => ({
    items: state.items.map((item) => 
      item.BookingId === id ? { ...item, ...updatedItem } : item // แก้ไข: item.BookingId
    )
  })),
  
  fetchItems: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      const data = await bookingService.getMany();
      set({ items: data, isLoading: false });
      
      setLoading(false);
    } catch (error: any) {
      set({ isLoading: false });
      setLoading(false);
      setError(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນການຈອງ');
      console.error('Error fetching bookings:', error);
    }
  },
  
  fetchBookingById: async (id: number) => {
    try {
      // ตรวจสอบว่ามีข้อมูลใน store แล้วหรือไม่
      const existingBooking = get().items.find(booking => booking.BookingId === id); // แก้ไข: BookingId
      if (existingBooking) {
        return existingBooking;
      }
      
      // ถ้าไม่มีให้ดึงจาก API
      const booking = await bookingService.getOne(id);
      
      // เพิ่มลงใน store สำหรับการใช้งานในอนาคต
      set((state) => ({
        items: [...state.items.filter(item => item.BookingId !== id), booking]
      }));
      
      return booking;
    } catch (error: any) {
      console.error('Error fetching booking:', error);
      const { setError } = useErrorStore.getState();
      setError(error?.message || 'ບໍ່ສາມາດດຶງຂໍ້ມູນການຈອງໄດ້');
      throw error;
    }
  },
  
  delete: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      await bookingService.delete(id);
      get().removeItem(id);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການລຶບການຈອງ');
      console.error('Error deleting booking:', error);
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์มการจอง
  setVisible: (visible: boolean) => set({ isVisible: visible }),
  setFormVisible: (visible: boolean) => set({ isFormVisible: visible }),
  
  setSelectedItem: (item: Booking | null) => set({ selectedItem: item }),
  
  create: async (data: BookingInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      const createResponse = await bookingService.create(data as any);
      
      // ตรวจสอบ response structure
      let completeItem: Booking;
      try {
        const bookingId = createResponse.BookingId || createResponse.id; 
        completeItem = await bookingService.getOne(bookingId);
      } catch (fetchError) {
        console.warn('Could not fetch complete booking data, using create response:', fetchError);
        completeItem = createResponse as Booking;
      }
      
      get().addItem(completeItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      setLoading(false);
      return completeItem;
    } catch (error: any) {
      set({ isSubmitting: false });
      setLoading(false);
      setError(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການສ້າງການຈອງ');
      console.error('Error creating booking:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: BookingInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      await bookingService.update(id, data);
      
      // ดึงข้อมูลใหม่จาก API หลังจากอัปเดต
      let updatedItem: Booking;
      try {
        updatedItem = await bookingService.getOne(id);
      } catch (fetchError) {
        console.warn('Could not fetch updated booking data, using partial update:', fetchError);
        // ใช้ข้อมูลเดิมที่อัพเดต
        const existingItem = get().items.find(item => item.BookingId === id);
        updatedItem = { ...existingItem, ...data } as Booking;
      }
      
      get().updateItem(id, updatedItem);
      
      set({
        isSubmitting: false,
        isVisible: false,
        isFormVisible: false,
        selectedItem: null
      });
      
      setLoading(false);
      return updatedItem;
    } catch (error: any) {
      set({ isSubmitting: false });
      setLoading(false);
      setError(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດການຈອງ');
      console.error('Error updating booking:', error);
      throw error;
    }
  },
  
  confirmBooking: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isLoading: true });
      setLoading(true);
      
      // ข้อมูลสำหรับอัพเดตสถานะ
      const updateData = {
        StatusId: 2 // เปลี่ยนเป็น "ยืนยันแล้ว" (2)
      };
      
      const updatedItem = await get().update(id, updateData as any);
      
      set({ isLoading: false });
      setLoading(false);
      
      return updatedItem;
    } catch (error: any) {
      set({ isLoading: false });
      setLoading(false);
      setError(error?.message || 'ເກີດຂໍ້ຜິດພາດໃນການຢືນຢັນການຈອງ');
      console.error('Error confirming booking:', error);
      throw error;
    }
  },
  
  reset: () => set({  
    isVisible: false,
    isSubmitting: false,
    selectedItem: null 
  }),
  
  resetForm: () => set({ 
    isFormVisible: false,
    isSubmitting: false,
    selectedItem: null 
  })
}));