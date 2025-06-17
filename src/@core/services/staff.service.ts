// src/core/services/staff.service.ts
import { Staff } from "@core/domain/models/staffs/list.model";
import { StaffRepositoryPort } from "@/@core/interface/reposport/staff.port";
import { StaffUseCase } from "@core/use-cases/staff.use-case";
import { StaffInput } from "@core/domain/models/staffs/form.model";
import { StaffRepository } from "@core/infrastructure/api/repository/staff.repository";

export class StaffService {
  private useCase: StaffUseCase;

  constructor(repositoryPort: StaffRepositoryPort) {
    this.useCase = new StaffUseCase(repositoryPort);
  }

  async getMany(): Promise<Staff[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<Staff> {
    return this.useCase.executeGetOne(id);
  }

  async create(data: StaffInput): Promise<Staff> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<StaffInput>): Promise<Staff> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }
}

const repository = new StaffRepository();
export const staffService = new StaffService(repository);