export interface CustomerQueryParams {
  CustomerId?: number;
  CustomerName?: string;
  CustomerGender?: string;
  getType?: 'one' | 'many';
  [key: string]: any;
}

export interface CreateCustomerDTO {
  CustomerName: string;
  CustomerGender: string;
  CustomerTel: number;
  CustomerAddress: string;
  CustomerPostcode: number;
}

export interface UpdateCustomerDTO {
  CustomerName?: string;
  CustomerGender?: string;
  CustomerTel?: number;
  CustomerAddress?: string;
  CustomerPostcode?: number;
}