import { QueryOptions } from "@/app/domain/models/common/api.model";

const SELECT_FIELDS = [
    "id",
    "name",
    "isActive",
    "createdAt",
    "updatedAt"
];

export const UOM_QUERY = {
    LIST: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: SELECT_FIELDS,
            relations: [],
            filter: filter,
            getType: "many"
        })
    },

    DETAIL: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: SELECT_FIELDS,
            relations: [],
            filter: filter,
            getType: "one"
        })
    }
} as const;