import { create } from 'zustand';
import { RoomTypeModel } from '@core/domain/models/room-type/list.model';
import { roomTypeService } from '@core/services/room-type.service';
import { useErrorStore } from './useError.store';
import { useLoadingStore } from './useLoading.store';
import { RoomTypeFormData } from '@core/domain/models/room-type/form.model';

interface RoomTypeState {
  roomTypes: RoomTypeModel[];
  loading: boolean;
  error: string | null;
  fetchRoomTypes: () => Promise<RoomTypeModel[]>;
  createRoomType: (data: RoomTypeFormData) => Promise<RoomTypeModel>;
  updateRoomType: (id: number, data: RoomTypeFormData) => Promise<boolean>;
  deleteRoomType: (id: number) => Promise<boolean>;
}

export const useRoomTypeStore = create<RoomTypeState>((set, get) => ({
  roomTypes: [],
  loading: false,
  error: null,
  
  fetchRoomTypes: async () => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const data = await roomTypeService.getMany();
      set({ roomTypes: data, loading: false });
      
      setLoading(false);
      return data;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to fetch room types' });
      setLoading(false);
      setError(error.message || 'Failed to fetch room types');
      console.error('Error fetching room types:', error);
      throw error;
    }
  },
  
  createRoomType: async (data: RoomTypeFormData) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const createResponse = await roomTypeService.create(data);
      const completeItem = await roomTypeService.getOne(createResponse.TypeId);
      
      set((state) => ({
        roomTypes: [...state.roomTypes, completeItem],
        loading: false
      }));
      
      setLoading(false);
      return completeItem;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to create room type' });
      setLoading(false);
      setError(error.message || 'Failed to create room type');
      console.error('Error creating room type:', error);
      throw error;
    }
  },
  
  updateRoomType: async (id: number, data: RoomTypeFormData) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const success = await roomTypeService.update(id, data);
      
      if (success) {
        const updatedItem = await roomTypeService.getOne(id);
        set((state) => ({
          roomTypes: state.roomTypes.map((type) =>
            type.TypeId === id ? updatedItem : type
          ),
          loading: false
        }));
      }
      
      setLoading(false);
      return success;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to update room type' });
      setLoading(false);
      setError(error.message || 'Failed to update room type');
      console.error('Error updating room type:', error);
      throw error;
    }
  },
  
  deleteRoomType: async (id: number) => {
    const { setLoading } = useLoadingStore.getState();
    const { setError } = useErrorStore.getState();
    
    try {
      setLoading(true);
      set({ loading: true, error: null });
      
      const success = await roomTypeService.delete(id);
      
      if (success) {
        set((state) => ({
          roomTypes: state.roomTypes.filter((type) => type.TypeId !== id),
          loading: false
        }));
      }
      
      setLoading(false);
      return success;
    } catch (error: any) {
      set({ loading: false, error: error.message || 'Failed to delete room type' });
      setLoading(false);
      setError(error.message || 'Failed to delete room type');
      console.error('Error deleting room type:', error);
      throw error;
    }
  }
}));