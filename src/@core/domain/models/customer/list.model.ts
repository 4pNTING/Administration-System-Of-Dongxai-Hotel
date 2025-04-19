export interface Customer {
    CustomerId: number;
    CustomerName: string;
    CustomerGender: string;
    CustomerTel: number;
    CustomerAddress: string;
    CustomerPostcode: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}