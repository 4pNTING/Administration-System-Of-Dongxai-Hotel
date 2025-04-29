// src/core/domain/models/staffs/list.model.ts
export interface Staff {
  id: number;
  name: string;
  tel: number;
  address: string;
  userName: string;
  salary: number | null;
  gender: string;
  position: string;
  roleId: number;
  createdAt?: string;
  updatedAt?: string;
}