import { QueryOptions } from "../../domain/models/common/api.model";

export const CUSTOMER_QUERY = {
    LIST: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "CustomerId",
                "CustomerName",
                "CustomerGender",
                "CustomerTel",
                "CustomerAddress",
                "CustomerPostcode",
                "createdAt",
                "updatedAt"
            ],
            filter: filter,
            getType: "many"
        })
    },

    DETAIL: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "CustomerId",
                "CustomerName",
                "CustomerGender",
                "CustomerTel",
                "CustomerAddress",
                "CustomerPostcode",
                "createdAt",
                "updatedAt"
            ],
            filter: filter,
            getType: "one"
        })
    }
} as const;