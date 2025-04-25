// src/core/domain/store/rooms/room-status.store.ts
import { create } from 'zustand';
import { RoomStatusModel  } from '@core/domain/models/room-status/list.model';
import { roomStatusService } from '@core/services/room-status.service';
import { useErrorStore } from './useError.store';
import { useLoadingStore } from './useLoading.store';

interface RoomStatusState {
  roomStatuses: RoomStatusModel[];
  loading: boolean;
  error: string | null;
  fetchRoomStatuses: () => Promise<RoomStatusModel[]>; // เปลี่ยนเป็น Promise<RoomStatusModel[]>
  createRoomStatus: (data: { StatusName: string }) => Promise<RoomStatusModel>;
  updateRoomStatus: (id: number, data: { StatusName: string }) => Promise<boolean>;
  deleteRoomStatus: (id: number) => Promise<boolean>;
}

export const useRoomStatusStore = create<RoomStatusState>((set) => ({
  roomStatuses: [],
  loading: false,
  error: null,
  
  fetchRoomStatuses: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const data = await roomStatusService.getMany();
      set({ roomStatuses: data, loading: false });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch room statuses' });
      setLoading(false);
      setError(error.message || 'Failed to fetch room statuses');
      console.error('Error fetching room statuses:', error);
      throw error;
    }
  },
  
  createRoomStatus: async (data: { StatusName: string }) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const result = await roomStatusService.create(data);
      
      // เพิ่มสถานะใหม่เข้าไปในรายการ
      set((state) => ({
        roomStatuses: [...state.roomStatuses, result],
        loading: false
      }));
      
      setLoading(false);
      return result;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create room status' });
      setLoading(false);
      setError(error.message || 'Failed to create room status');
      console.error('Error creating room status:', error);
      throw error;
    }
  },
  
  updateRoomStatus: async (id: number, data: { StatusName: string }) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const success = await roomStatusService.update(id, data);
      
      if (success) {
        // อัปเดตสถานะในรายการ
        set((state) => ({
          roomStatuses: state.roomStatuses.map((status) =>
            status.StatusId === id ? { ...status, ...data } : status
          ),
          loading: false
        }));
      }
      
      setLoading(false);
      return success;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update room status' });
      setLoading(false);
      setError(error.message || 'Failed to update room status');
      console.error('Error updating room status:', error);
      throw error;
    }
  },
  
  deleteRoomStatus: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const success = await roomStatusService.delete(id);
      
      if (success) {
        // ลบสถานะออกจากรายการ
        set((state) => ({
          roomStatuses: state.roomStatuses.filter((status) => status.StatusId !== id),
          loading: false
        }));
      }
      
      setLoading(false);
      return success;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete room status' });
      setLoading(false);
      setError(error.message || 'Failed to delete room status');
      console.error('Error deleting room status:', error);
      throw error;
    }
  }
}));