import { CheckIn } from "@core/domain/models/checkin/list.model";
import { CheckInRepositoryPort } from "@/@core/interface/reposport/checkin.port";
import { CheckInInput } from "@core/domain/models/checkin/form.model";

export class CheckInUseCase {
  constructor(private readonly repository: CheckInRepositoryPort) {}

  async executeQuery(): Promise<CheckIn[]> {
    try {
      return await this.repository.getMany();
    } catch (error) {
      throw error;
    }
  }

  async executeGetOne(id: number): Promise<CheckIn> {
    try {
      return await this.repository.getOne(id);
    } catch (error) {
      throw error;
    }
  }

  async executeCreate(data: CheckInInput): Promise<CheckIn> {
    try {
      return await this.repository.create(data);
    } catch (error) {
      throw error;
    }
  }

  async executeUpdate(id: number, data: Partial<CheckInInput>): Promise<CheckIn> {
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

  async executeCheckout(id: number): Promise<CheckIn> {
    try {
      return await this.repository.checkout(id);
    } catch (error) {
      throw error;
    }
  }

  async executeFindByCustomerId(customerId: number): Promise<CheckIn[]> {
    try {
      return await this.repository.findByCustomerId(customerId);
    } catch (error) {
      throw error;
    }
  }

  async executeFindByBookingId(bookingId: number): Promise<CheckIn | null> {
    try {
      return await this.repository.findByBookingId(bookingId);
    } catch (error) {
      throw error;
    }
  }
}