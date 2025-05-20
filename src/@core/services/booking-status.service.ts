// src/core/services/booking-status.service.ts
import { BookingStatus } from "@core/domain/models/booking/booking-status/list.model";
import { BookingStatusRepositoryPort } from "@core/interface/repositoriesport/booking-status.port";
import { BookingStatusUseCase } from "@core/use-cases/booking-status.use-case";
import { BookingStatusRepository } from "@core/infrastructure/api/repository/booking-status.repository";

export class BookingStatusService {
  private useCase: BookingStatusUseCase;

  constructor(repositoryPort: BookingStatusRepositoryPort) {
    this.useCase = new BookingStatusUseCase(repositoryPort);
  }

  async getMany(): Promise<BookingStatus[]> {
    return this.useCase.executeQuery();
  }

  async getOne(id: number): Promise<BookingStatus> {
    return this.useCase.executeGetOne(id);
  }

  async create(data: Partial<BookingStatus>): Promise<BookingStatus> {
    return this.useCase.executeCreate(data);
  }

  async update(id: number, data: Partial<BookingStatus>): Promise<BookingStatus> {
    return this.useCase.executeUpdate(id, data);
  }

  async delete(id: number): Promise<void> {
    return this.useCase.executeDelete(id);
  }
}

const repository = new BookingStatusRepository();
export const bookingStatusService = new BookingStatusService(repository);