// src/core/domain/store/staffs/staff.store.ts
import { create } from 'zustand';
import { Staff } from '@core/domain/models/staffs/list.model';
import { staffService } from '@core/services/staff.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { StaffInput } from '@core/domain/models/staffs/form.model';

// สถานะของ Store
interface StaffState {
  [x: string]: any;
  // สถานะทั่วไป
  items: Staff[];
  isLoading: boolean;
  filters: Record<string, any>;
  
  // สถานะฟอร์ม
  isVisible: boolean;
  isFormVisible: boolean;
  isSubmitting: boolean;
  selectedItem: Staff | null;
  
  // ฟังก์ชันจัดการรายการ
  setFilters: (filters: Record<string, any>) => void;
  setItems: (items: Staff[]) => void;
  addItem: (item: Staff) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: Staff) => void;
  fetchItems: () => Promise<void>;
  delete: (id: number) => Promise<void>;
  
  // ฟังก์ชันจัดการฟอร์ม
  setVisible: (visible: boolean) => void;
  setFormVisible: (visible: boolean) => void;
  setSelectedItem: (item: Staff | null) => void;
  create: (data: StaffInput) => Promise<Staff>;
  update: (id: number, data: StaffInput) => Promise<Staff>;
  reset: () => void;
  resetForm: () => void;
}

// สร้าง Zustand store
export const useStaffStore = create<StaffState>((set, get) => ({
  // สถานะเริ่มต้น
  items: [],
  isLoading: false,
  filters: {},
  
  // สถานะฟอร์ม
  isVisible: false,
  isFormVisible: false,
  isSubmitting: false,
  selectedItem: null,
  
  // ฟังก์ชันจัดการรายการพนักงาน
  setFilters: (filters: Record<string, any>) => set({ filters }),
  
  setItems: (items: Staff[]) => set({ items }),
  
  addItem: (item: Staff) => set((state) => ({
    items: [...state.items, item]
  })),
  
  removeItem: (id: number) => set((state) => ({
    items: state.items.filter((item) => item.id !== id)
  })),
  
  updateItem: (id: number, updatedItem: Staff) => set((state) => ({
    items: state.items.map((item) => 
      item.id === id ? { ...item, ...updatedItem } : item
    )
  })),
  
  fetchItems: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ isLoading: true });
      
      const data = await staffService.getMany();
      set({ items: data, isLoading: false });
      
      setLoading(false);
    } catch (error: any) {
      set({ isLoading: false });
      setLoading(false);
      setError(error.message || 'Failed to fetch staffs');
      console.error('Error fetching staffs:', error);
    }
  },
  
  delete: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      await staffService.delete(id);
      get().removeItem(id);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message || 'Failed to delete staff');
      console.error('Error deleting staff:', error);
      throw error;
    }
  },

  fetchStaffById: async (id: number) => {
    try {
      // ตรวจสอบว่ามีข้อมูลใน store แล้วหรือไม่
      const existingStaff = get().items.find(staff => staff.id === id);
      if (existingStaff) {
        return existingStaff;
      }
      
      // ถ้าไม่มีให้ดึงจาก API
      return await staffService.getOne(id);
    } catch (error: any) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },
  
  // ฟังก์ชันจัดการฟอร์มพนักงาน
  setVisible: (visible: boolean) => set({ isVisible: visible }),
  setFormVisible: (visible: boolean) => set({ isFormVisible: visible }),
  
  setSelectedItem: (item: Staff | null) => set({ selectedItem: item }),
  
  create: async (data: StaffInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      const createResponse = await staffService.create(data as any);
      const completeItem = await staffService.getOne(createResponse.id);
      
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
      setError(error.message || 'Failed to create staff');
      console.error('Error creating staff:', error);
      throw error;
    }
  },
  
  update: async (id: number, data: StaffInput) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      set({ isSubmitting: true });
      setLoading(true);
      
      await staffService.update(id, data);
      
      // ดึงข้อมูลใหม่จาก API หลังจากอัปเดต
      const updatedItem = await staffService.getOne(id);
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
      setError(error.message || 'Failed to update staff');
      console.error('Error updating staff:', error);
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