// src/core/domain/models/staffs/form.model.ts
export interface StaffInput {
  name: string;
  tel: number;
  address: string;
  userName: string;
  salary: number | null;
  gender: string;
  password: string;
  position: string;
  roleId: number;
}