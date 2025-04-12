import { CustomerEntity } from '../../domain/entities/customer.entity';

export class CustomerMapper {
  static toEntity(data: any): CustomerEntity | null {
    if (!data) return null;
    
    const entity: CustomerEntity = {
      CustomerId: data.CustomerId,
      CustomerName: data.CustomerName,
      CustomerGender: data.CustomerGender,
      CustomerTel: data.CustomerTel,
      CustomerAddress: data.CustomerAddress,
      CustomerPostcode: data.CustomerPostcode,
      createdAt: data.createdAt ? new Date(data.createdAt) : null,
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : null
    };
    
    return entity;
  }

  static toEntityList(data: any[]): CustomerEntity[] {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(item => this.toEntity(item)).filter(Boolean) as CustomerEntity[];
  }
}