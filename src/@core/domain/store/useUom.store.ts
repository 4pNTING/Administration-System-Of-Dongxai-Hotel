import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { uomService } from '../services/uom.service';
import { Uom, UomInput } from '@/app/domain/models/utils/uom.model';

interface UomState {
    items: Uom[];
    isLoading: boolean;
    selectedItem: Uom | null;

    setItems: (items: Uom[]) => void;
    setSelectedItem: (item: Uom | null) => void;

    addItem: (item: Uom) => void;
    removeItem: (id: number) => void;
    updateItem: (id: number, updatedItem: Uom) => void;

    fetchItems: () => Promise<void>;
    create: (data: UomInput) => Promise<Uom>;
    update: (id: number, data: UomInput) => Promise<void>;
    delete: (id: number) => Promise<void>;
}


export const useUomStore = create<UomState>()(
    persist(
        (set, get) => ({
            items: [],
            isLoading: false,
            selectedItem: null,

            setItems: (items) => set({ items }),
            setSelectedItem: (item) => set({ selectedItem: item }),
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
            fetchItems: async () => {
                try {
                    set({ isLoading: true });
                    const data = await uomService.getMany();
                    set({ items: data });
                } catch (error) {
                    throw error;
                } finally {
                    set({ isLoading: false });
                }
            },
            create: async (data) => {
                try {
                    const createResponse = await uomService.create(data);
                    const completeItem = await uomService.getOne(createResponse.id);
                    get().addItem(completeItem);
                    return completeItem;
                } catch (error) {
                    throw error;
                }
            },
            update: async (id, data) => {
                try {
                    await uomService.update(id, data);
                    const updatedItem = await uomService.getOne(id);
                    get().updateItem(id, updatedItem);
                } catch (error) {
                    throw error;
                }
            },
            delete: async (id) => {
                await uomService.delete(id);
                get().removeItem(id);
            }
        }),
        {
            name: 'uom-storage',
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);
