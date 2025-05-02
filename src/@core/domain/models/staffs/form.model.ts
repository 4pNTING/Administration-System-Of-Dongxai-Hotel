// src/core/domain/models/staffs/form.model.ts
export interface StaffInput {
  StaffName: string;
  tel: number;
  address: string;
  userName: string;
  salary: number | null;
  gender: string;
  password: string;
  roleId: number;
}