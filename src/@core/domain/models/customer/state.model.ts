// src/app/domain/models/customer/state.model.ts
import { z } from "zod";
import { Customer } from "./list.model";
import { CustomerFormSchema } from "@core/domain/schemas/customer.schema";

type CustomerFormInput = z.infer<typeof CustomerFormSchema>;

// Interface สำหรับจัดการสถานะของรายการลูกค้า
export interface CustomerListState {
    items: Customer[];
    isLoading: boolean;
    filters: Record<string, any>; // แทนที่ DataTableFilterMeta ด้วย Record<string, any>
    setFilters: (filters: Record<string, any>) => void;
    setItems: (items: Customer[]) => void;
    addItem: (item: Customer) => void;
    removeItem: (id: number) => void;
    updateItem: (id: number, updatedItem: Customer) => void;
    fetchItems: () => Promise<void>;
    delete: (id: number) => Promise<void>;
}

// Interface สำหรับจัดการสถานะของฟอร์มลูกค้า
export interface CustomerFormState {
    isVisible: boolean;
    isSubmitting: boolean;
    selectedItem: Customer | null;
    setVisible: (visible: boolean) => void;
    setSelectedItem: (item: Customer | null) => void;
    create: (data: CustomerFormInput) => Promise<Customer>;
    update: (id: number, data: CustomerFormInput) => Promise<Customer>;
    reset: () => void;
}

// Interface สำหรับจัดการสถานะทั้งหมด (รวม list และ form)
export interface CustomerState extends CustomerListState, CustomerFormState {
    // ปรับชื่อฟังก์ชันให้ตรงกับ store
    isFormVisible: boolean; // เพิ่มเพื่อให้สอดคล้องกับ store
    setFormVisible: (visible: boolean) => void; // เพิ่มเพื่อให้สอดคล้องกับ store
    resetForm: () => void; // เพิ่มเพื่อให้สอดคล้องกับ store
}