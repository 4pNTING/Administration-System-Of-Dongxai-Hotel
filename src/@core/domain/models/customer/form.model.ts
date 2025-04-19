export interface CustomerFormData {
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: number;
  CustomerAddress: string;
  CustomerPostcode: number;
}

// เพิ่ม CustomerInput เพื่อให้สามารถ import ได้
export interface CustomerInput {
  CustomerName?: string;
  CustomerGender?: string;
  CustomerTel?: number;
  CustomerAddress?: string;
  CustomerPostcode?: number;
}