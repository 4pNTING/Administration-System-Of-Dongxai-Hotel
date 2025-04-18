import { QueryOptions } from "../../domain/models/common/api.model";

export const SUPPLIER_QUERY = {
    LIST: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "id",
                "code",
                "businessName",
                "businessType",
                "firstName",
                "lastName",
                "tel",
                "village",
                "district",
                "province",
                "isActive",
                "countryId",
                "country.id",
                "country.name",
                "supplierBanks.id",
                "supplierBanks.accountNumber",
                "supplierBanks.accountName",
                "supplierBanks.bank.id",
                "supplierBanks.bank.name",
                "supplierBanks.currency.id",
                "supplierBanks.currency.name",
                "provinceColumn.id",
                "provinceColumn.name",
                "districtColumn.id", 
                "districtColumn.name",
                "villageColumn.id", 
                "villageColumn.name",
                "businessTypeObject.id",
                "businessTypeObject.bTypeName"
            ],
            relations: [
                "country",
                "businessTypeObject",
                "supplierBanks",
                "supplierBanks.bank",
                "supplierBanks.currency",
                "provinceColumn",
                "districtColumn", 
                "villageColumn"
            ],
            filter: filter,
            getType: "many"
        })
    },

    DETAIL: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "id",
                "code",
                "businessName",
                "firstName",
                "lastName",
                "tel",
                "businessType",
                "village",
                "district",
                "province",
                "isActive",
                "createdAt",
                "createdBy",
            
                "countryId",
                "country.id",
                "country.name",
                "country.code",
                "supplierBanks.id",
                "supplierBanks.accountNumber",
                "supplierBanks.accountName",
                "supplierBanks.bank.id",
                "supplierBanks.bank.name",
                "supplierBanks.currency.id",
                "supplierBanks.currency.name",
                "provinceColumn.id",
                "provinceColumn.name",
                "districtColumn.id", 
                "districtColumn.name",
                "villageColumn.id", 
                "villageColumn.name",
                "businessTypeObject.id",
                "businessTypeObject.bTypeName"
            ],
            relations: [
                "country",
                "businessTypeObject",
                "supplierBanks",
                "supplierBanks.bank",
                "supplierBanks.currency",
                "provinceColumn",
                "districtColumn", 
                "villageColumn"
            ],
            filter: filter,
            getType: "one"
        })
    }
} as const;