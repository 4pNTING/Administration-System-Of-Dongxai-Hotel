// src/core/use-cases/staff.use-case.ts
import { Staff } from "@core/domain/models/staffs/list.model";
import { StaffRepositoryPort } from "@core/interface/repositoriesport/staff.port";
import { StaffInput } from "@core/domain/models/staffs/form.model";

export class StaffUseCase {
  constructor(private readonly repository: StaffRepositoryPort) {}

  async executeQuery(): Promise<Staff[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<Staff> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: StaffInput): Promise<Staff> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<StaffInput>): Promise<Staff> {
    try {
      return await this.repository.update(id, data);
    } catch (error) {
      throw error;
    }
  }

  async executeDelete(id: number): Promise<void> {
    try {
      await this.repository.delete(id);
    } catch (error) {
      throw error;
    }
  }
}