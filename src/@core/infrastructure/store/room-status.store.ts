import { create } from 'zustand';
import { RoomStatusModel  } from '@core/domain/models/room-status/list.model';
import { roomStatusService } from '@core/services/room-status.service';
import { useErrorStore } from './useError.store';
import { useLoadingStore } from './useLoading.store';

interface RoomStatusState {
  roomStatuses: RoomStatusModel[];
  loading: boolean;
  error: string | null;
  fetchRoomStatuses: () => Promise<RoomStatusModel[]>; 
  createRoomStatus: (data: { StatusName: string }) => Promise<RoomStatusModel>;
  updateRoomStatus: (id: number, data: { StatusName: string }) => Promise<boolean>;
  deleteRoomStatus: (id: number) => Promise<boolean>;
}

export const useRoomStatusStore = create<RoomStatusState>((set, get) => ({
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
   
      throw error;
    }
  },
  
  createRoomStatus: async (data: { StatusName: string }) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const createResponse = await roomStatusService.create(data);
      const completeItem = await roomStatusService.getOne(createResponse.StatusId);
      
      set((state) => ({
        roomStatuses: [...state.roomStatuses, completeItem],
        loading: false
      }));
      
      setLoading(false);
      return completeItem;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create room status' });
      setLoading(false);
      setError(error.message || 'Failed to create room status');
  
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
        const updatedItem = await roomStatusService.getOne(id);
        set((state) => ({
          roomStatuses: state.roomStatuses.map((status) =>
            status.StatusId === id ? updatedItem : status
          ),
          loading: false
        }));
      }
      
      setLoading(false);
      return success;
    } catch (error: any) {
      set({ loading: false, error: error.message  });
      setLoading(false);
      setError(error.message );
    
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
      throw error;
    }
  }
}));