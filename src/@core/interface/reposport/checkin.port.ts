import { CheckInInput } from "@core/domain/models/checkin/form.model";
import { CheckIn } from "@core/domain/models/checkin/list.model";

export interface CheckInRepositoryPort {
  getMany(): Promise<CheckIn[]>;
  getOne(id: number): Promise<CheckIn>;
  create(data: CheckInInput): Promise<CheckIn>;
  update(id: number, data: Partial<CheckInInput>): Promise<CheckIn>;
  delete(id: number): Promise<void>;
  checkout(id: number): Promise<CheckIn>;
  findByCustomerId(customerId: number): Promise<CheckIn[]>;
  findByBookingId(bookingId: number): Promise<CheckIn | null>;
}