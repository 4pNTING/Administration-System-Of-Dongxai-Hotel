// ไฟล์: src/domain/entities/customer.entity.ts
export interface CustomerEntity {
  CustomerId: number;
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: number;
  CustomerAddress: string;
  CustomerPostcode: number;
  createdAt: Date | null;
  updatedAt: Date | null;
}