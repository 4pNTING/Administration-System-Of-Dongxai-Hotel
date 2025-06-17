// src/@core/infrastructure/store/checkin/checkin.store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { checkinService } from '@core/services/checkin.service';
import { CheckIn } from '@core/domain/models/checkin/list.model';
import { CheckInInput } from '@core/domain/models/checkin/form.model';

interface CheckInStoreState {
  items: CheckIn[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  getOne: (id: number) => Promise<CheckIn>;
  create: (data: CheckInInput) => Promise<CheckIn>;
  update: (id: number, data: Partial<CheckInInput>) => Promise<CheckIn>;
  delete: (id: number) => Promise<void>;
  checkout: (id: number) => Promise<CheckIn>;
  reset: () => void;
}

export const useCheckInStore = create<CheckInStoreState>()(
  devtools(
    (set, get) => ({
      items: [],
      isLoading: false,
      isSubmitting: false,
      error: null,

      fetchItems: async () => {
        try {
          set({ isLoading: true, error: null });
          const items = await checkinService.getMany();
          set({ items, isLoading: false });
        } catch (error: any) {
          console.error('Error fetching check-ins:', error);
          set({ 
            error: error.message || 'Failed to fetch check-ins', 
            isLoading: false 
          });
        }
      },

      getOne: async (id: number) => {
        try {
          set({ isLoading: true, error: null });
          const item = await checkinService.getOne(id);
          set({ isLoading: false });
          return item;
        } catch (error: any) {
          console.error('Error fetching check-in:', error);
          set({ 
            error: error.message || 'Failed to fetch check-in', 
            isLoading: false 
          });
          throw error;
        }
      },

      create: async (data: CheckInInput) => {
        try {
          set({ isSubmitting: true, error: null });
          const newItem = await checkinService.create(data);
          
          // Add to items list
          set(state => ({
            items: [newItem, ...state.items],
            isSubmitting: false
          }));
          
          return newItem;
        } catch (error: any) {
          console.error('Error creating check-in:', error);
          set({ 
            error: error.message || 'Failed to create check-in', 
            isSubmitting: false 
          });
          throw error;
        }
      },

      update: async (id: number, data: Partial<CheckInInput>) => {
        try {
          set({ isSubmitting: true, error: null });
          const updatedItem = await checkinService.update(id, data);
          
          // Update in items list
          set(state => ({
            items: state.items.map(item => 
              item.CheckInId === id ? updatedItem : item
            ),
            isSubmitting: false
          }));
          
          return updatedItem;
        } catch (error: any) {
          console.error('Error updating check-in:', error);
          set({ 
            error: error.message || 'Failed to update check-in', 
            isSubmitting: false 
          });
          throw error;
        }
      },

      delete: async (id: number) => {
        try {
          set({ isSubmitting: true, error: null });
          await checkinService.delete(id);
          
          // Remove from items list
          set(state => ({
            items: state.items.filter(item => item.CheckInId !== id),
            isSubmitting: false
          }));
        } catch (error: any) {
          console.error('Error deleting check-in:', error);
          set({ 
            error: error.message || 'Failed to delete check-in', 
            isSubmitting: false 
          });
          throw error;
        }
      },

      checkout: async (id: number) => {
        try {
          set({ isSubmitting: true, error: null });
          const updatedItem = await checkinService.checkout(id);
          
          // Update in items list
          set(state => ({
            items: state.items.map(item => 
              item.CheckInId === id ? updatedItem : item
            ),
            isSubmitting: false
          }));
          
          return updatedItem;
        } catch (error: any) {
          console.error('Error checking out:', error);
          set({ 
            error: error.message || 'Failed to check out', 
            isSubmitting: false 
          });
          throw error;
        }
      },

      reset: () => {
        set({ 
          isSubmitting: false, 
          error: null 
        });
      }
    }),
    {
      name: 'checkin-store'
    }
  )
);