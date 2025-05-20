export interface BookingStatus {
  StatusId: number;
  StatusName: string;
  StatusDescription?: string;
  CreatedAt?: Date | string;
  UpdatedAt?: Date | string;
}