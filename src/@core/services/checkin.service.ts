// src/core/services/checkin.service.ts
import { CheckIn } from "@core/domain/models/checkin/list.model";
import { CheckInRepositoryPort } from "@/@core/interface/reposport/checkin.port";
import { CheckInUseCase } from "@core/use-cases/checkin.use-case";
import { CheckInInput } from "@core/domain/models/checkin/form.model";
import { CheckInRepository } from "@core/infrastructure/api/repository/checkin.repository";

export class CheckInService {
  private useCase: CheckInUseCase;

  constructor(repositoryPort: CheckInRepositoryPort) {
    this.useCase = new CheckInUseCase(repositoryPort);
  }

  async getMany(): Promise<CheckIn[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<CheckIn> {
    return this.useCase.executeGetOne(id);
  }

  async create(data: CheckInInput): Promise<CheckIn> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<CheckInInput>): Promise<CheckIn> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }

  async checkout(id: number): Promise<CheckIn> {
    return this.useCase.executeCheckout(id);
  }

  async findByCustomerId(customerId: number): Promise<CheckIn[]> {
    return this.useCase.executeFindByCustomerId(customerId);
  }

  async findByBookingId(bookingId: number): Promise<CheckIn | null> {
    return this.useCase.executeFindByBookingId(bookingId);
  }
}

// สร้าง instance และ export เพื่อใช้ใน store
const repository = new CheckInRepository();
export const checkinService = new CheckInService(repository);