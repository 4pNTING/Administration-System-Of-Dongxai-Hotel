// ไฟล์: src/stores/customer.store.ts
import { create } from 'zustand'
import { CustomerRepository } from '../../../infrastructure/api/repository/customer.repository'

// สร้าง instance ของ repository
const customerRepository = new CustomerRepository()

// กำหนด interface สำหรับ state
interface CustomerState {
    items: any[]
    loading: boolean
    error: string | null
    fetchCustomers: () => Promise<void>
    getCustomerById: (id: number) => Promise<any>
    createCustomer: (data: any) => Promise<void>
    updateCustomer: (id: number, data: any) => Promise<void>
    deleteCustomer: (id: number) => Promise<void>
    // toggleCustomerActive: (id: number) => Promise<void> // Commented out
}

// สร้าง Zustand store
export const useCustomerStore = create<CustomerState>((set, get) => ({
    items: [], // เปลี่ยนจาก customers เป็น items
    loading: false,
    error: null,

    // ดึงข้อมูลลูกค้าทั้งหมด
    fetchCustomers: async () => {
        try {
          set({ loading: true, error: null });
          const result = await customerRepository.findAll();
          set({ items: result || [], loading: false }); // เปลี่ยนจาก customers เป็น items
          console.log('Fetched customers:', result);
        } catch (error) {
          console.error('Error in store.fetchCustomers:', error);
          set({ items: [], loading: false, error: error instanceof Error ? error.message : 'Unknown error' }); // เปลี่ยนจาก customers เป็น items
        }
      },

    // ดึงข้อมูลลูกค้าตาม ID
    getCustomerById: async (id: number) => {
        try {
            set({ loading: true, error: null })
            const customer = await customerRepository.findById(id)
            set({ loading: false })
            return customer
        } catch (error: any) {
            set({ error: error.message, loading: false })
            throw error
        }
    },

    // สร้างลูกค้าใหม่
    createCustomer: async (data: any) => {
        try {
            set({ loading: true, error: null })
            await customerRepository.create(data)
            // ดึงข้อมูลใหม่หลังจากสร้าง
            await get().fetchCustomers()
            set({ loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
            throw error
        }
    },

    // อัปเดตข้อมูลลูกค้า
    updateCustomer: async (id: number, data: any) => {
        try {
            set({ loading: true, error: null })
            await customerRepository.update(id, data)
            // ดึงข้อมูลใหม่หลังจากอัปเดต
            await get().fetchCustomers()
            set({ loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
            throw error
        }
    },

    // ลบลูกค้า
    deleteCustomer: async (id: number) => {
        try {
            set({ loading: true, error: null })
            await customerRepository.delete(id)
            // ดึงข้อมูลใหม่หลังจากลบ
            await get().fetchCustomers()
            set({ loading: false })
        } catch (error: any) {
            set({ error: error.message, loading: false })
            throw error
        }
    },

    // สลับสถานะ active (Commented out)
    // toggleCustomerActive: async (id: number) => {
    //     try {
    //         set({ loading: true, error: null })
    //         await customerRepository.toggleActive(id)
    //         // ดึงข้อมูลใหม่หลังจากเปลี่ยนสถานะ
    //         await get().fetchCustomers()
    //         set({ loading: false })
    //     } catch (error: any) {
    //         set({ error: error.message, loading: false })
    //         throw error
    //     }
    // }
}))