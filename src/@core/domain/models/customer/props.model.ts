import { Customer } from "./list.model";

export interface CustomerFilterProps {
    value: string;
    onFilterChange: (value: string) => void;
}

export interface CustomerFormInputProps {
    visible: boolean;   // เปลี่ยนจาก visible เป็น open
    selectedItem?: Customer | null;
    
}

export interface CustomerFormInputProps {
    visible: boolean;  // ใช้ visible แทน open
    selectedItem?: Customer | null;
    onHide: () => void;  // ใช้ onHide แทน onClose
}

export interface CustomerDataTableProps {
    data: Customer[];            // ข้อมูลลูกค้าทั้งหมด
    filters: Record<string, any>; // ตัวกรองข้อมูล
    loading?: boolean;           // สถานะกำลังโหลด
    onEdit: (item: Customer) => void; // ฟังก์ชันเมื่อคลิกแก้ไข
}