// src/presentation/store/customer.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CustomerEntity, CustomerQueryParams } from '@/core/domain/entities/customer.entity';
import { customerService, CustomerService } from '../../core/services/customer.service';

interface CustomerState {
  items: CustomerEntity[];
  selectedCustomer: CustomerEntity | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    global: { value: string | null; matchMode: string };
  };
  
  // Actions สำหรับจัดการ state
  setFilters: (filters: any) => void;
  setItems: (items: CustomerEntity[]) => void;
  setSelectedCustomer: (customer: CustomerEntity | null) => void;
  addItem: (item: CustomerEntity) => void;
  removeItem: (id: number) => void;
  updateItem: (id: number, updatedItem: CustomerEntity) => void;
  clearError: () => void;
  
  // Actions สำหรับเรียกใช้ Service
  fetchItems: (params?: CustomerQueryParams) => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (data: any) => Promise<void>;
  update: (id: number, data: any) => Promise<void>;
  delete: (id: number) => Promise<void>;
  searchCustomers: (searchTerm: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      items: [],
      selectedCustomer: null,
      isLoading: false,
      error: null,
      filters: {
        global: { value: null, matchMode: 'contains' },
      },
      
      // State management actions
      setFilters: (filters) => set({ filters }),
      setItems: (items) => set({ items }),
      setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
      addItem: (item) => set((state) => ({
        items: [item, ...state.items]
      })),
      removeItem: (id) => set((state) => ({
        items: state.items.filter(item => item.id !== id)
      })),
      updateItem: (id, updatedItem) => set((state) => ({
        items: state.items.map(item =>
          item.id === id ? updatedItem : item
        )
      })),
      clearError: () => set({ error: null }),
      
      // Service interaction actions
      fetchItems: async (params = {}) => {
        try {
          set({ isLoading: true, error: null });
          const data = await customerService.getMany(params);
          set({ items: data });
        } catch (error) {
          console.error('Error fetching customers:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to fetch customers' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchById: async (id) => {
        try {
          set({ isLoading: true, error: null });
          const customer = await customerService.getById(id);
          set({ selectedCustomer: customer });
        } catch (error) {
          console.error(`Error fetching customer ${id}:`, error);
          set({ error: error instanceof Error ? error.message : `Failed to fetch customer ${id}` });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      create: async (data) => {
        try {
          set({ isLoading: true, error: null });
          const newCustomer = await customerService.create(data);
          get().addItem(newCustomer);
        } catch (error) {
          console.error('Error creating customer:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to create customer' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      update: async (id, data) => {
        try {
          set({ isLoading: true, error: null });
          const success = await customerService.update(id, data);
          
          if (success) {
            const updatedCustomer = await customerService.getById(id);
            if (updatedCustomer) {
              get().updateItem(id, updatedCustomer);
            }
          }
        } catch (error) {
          console.error(`Error updating customer ${id}:`, error);
          set({ error: error instanceof Error ? error.message : `Failed to update customer ${id}` });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      delete: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await customerService.delete(id);
          get().removeItem(id);
        } catch (error) {
          console.error(`Error deleting customer ${id}:`, error);
          set({ error: error instanceof Error ? error.message : `Failed to delete customer ${id}` });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      searchCustomers: async (searchTerm) => {
        if (!searchTerm) {
          return get().fetchItems();
        }
        
        try {
          set({ isLoading: true, error: null });
          const params = {
            filter: {
              name: { $like: `%${searchTerm}%` }
            }
          };
          const data = await customerService.getMany(params);
          set({ items: data });
        } catch (error) {
          console.error('Error searching customers:', error);
          set({ error: error instanceof Error ? error.message : 'Failed to search customers' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'customer-storage',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);