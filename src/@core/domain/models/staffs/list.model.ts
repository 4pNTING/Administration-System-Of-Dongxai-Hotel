
// src/core/domain/models/staffs/list.model.ts
export interface Staff {
  id: number;
  StaffId: number;
  StaffName: string;
  tel: number;
  address: string;
  userName: string;
  salary: number | null;
  gender: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
}