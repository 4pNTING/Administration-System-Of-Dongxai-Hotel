// src/core/interface/repositoriesport/staff.port.ts
import { StaffFormData } from "@core/domain/models/staffs/form.model";
import { Staff } from "@core/domain/models/staffs/list.model";

export interface StaffRepositoryPort {
  getMany(): Promise<Staff[]>;
  getOne(id: number): Promise<Staff>;
  create(data: StaffFormData): Promise<Staff>;
  update(id: number, data: Partial<StaffFormData>): Promise<Staff>;
  delete(id: number): Promise<void>;
}