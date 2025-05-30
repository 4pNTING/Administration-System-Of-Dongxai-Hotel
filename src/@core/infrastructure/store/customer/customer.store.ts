import { create } from 'zustand';
import { Customer } from '@core/domain/models/customer/list.model';
import { customerService } from '@core/services/customer.service';
import { useErrorStore } from '../useError.store';
import { useLoadingStore } from '../useLoading.store';
import { CustomerInput } from '@core/domain/models/customer/form.model';
import { CustomerState } from '@core/domain/models/customer/state.model';

export const useCustomerStore = create<CustomerState>((set, get) => ({
    items: [],
    isLoading: false,
    filters: {},
    
    isVisible: false,
    isFormVisible: false,
    isSubmitting: false,
    selectedItem: null,
    
    setFilters: (filters: Record<string, any>) => set({ filters }),
    
    setItems: (items: Customer[]) => set({ items }),
    
    addItem: (item: Customer) => set((state) => ({
        items: [...state.items, item]
    })),
    
    removeItem: (id: number) => set((state) => ({
        items: state.items.filter((item) => item.CustomerId !== id)
    })),
    
    updateItem: (id: number, updatedItem: Customer) => set((state) => ({
        items: state.items.map((item) => 
            item.CustomerId === id ? { ...item, ...updatedItem } : item
        )
    })),
    
    fetchItems: async () => {
        const { setLoading } = useLoadingStore.getState();
        const { setError } = useErrorStore.getState();

        try {
            setLoading(true);
            set({ isLoading: true });

            const data = await customerService.getMany();
            set({ items: data, isLoading: false });

            setLoading(false);
        } catch (error: any) {
            set({ isLoading: false });
            setLoading(false);
            setError(error.message || 'Failed to fetch customers');
            console.error('Error fetching customers:', error);
        }
    },
    
    delete: async (id: number) => {
        const { setLoading } = useLoadingStore.getState();
        const { setError } = useErrorStore.getState();
        
        try {
            setLoading(true);
            await customerService.delete(id);
            get().removeItem(id);
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            setError(error.message || 'Failed to delete customer');
            console.error('Error deleting customer:', error);
            throw error;
        }
    },
    
    setVisible: (visible: boolean) => set({ isVisible: visible }),
    setFormVisible: (visible: boolean) => set({ isFormVisible: visible }),
    
    setSelectedItem: (item: Customer | null) => set({ selectedItem: item }),
    
    create: async (data: CustomerInput) => {
        const { setLoading } = useLoadingStore.getState();
        const { setError } = useErrorStore.getState();
        
        try {
            set({ isSubmitting: true });
            setLoading(true);
            
            const createResponse = await customerService.create(data as any);
            const completeItem = await customerService.getOne(createResponse.CustomerId);
            
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
            setError(error.message || 'Failed to create customer');
            console.error('Error creating customer:', error);
            throw error;
        }
    },
    
    update: async (id: number, data: CustomerInput) => {
        const { setLoading } = useLoadingStore.getState();
        const { setError } = useErrorStore.getState();
        
        try {
            set({ isSubmitting: true });
            setLoading(true);
            
            await customerService.update(id, data as any);
            const updatedItem = await customerService.getOne(id);
            
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
            setError(error.message || 'Failed to update customer');
            console.error('Error updating customer:', error);
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