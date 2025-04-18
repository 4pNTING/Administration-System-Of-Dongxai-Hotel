import { QueryOptions } from "@/app/domain/models/common/api.model";

export const VILLAGE_QUERY = {
    LIST: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "id",
                "code",
                "name",
                "description",
                "district_id"
            ],
            relations: [],
            filter: filter,
            getType: "many"
        })
    },
    DETAIL: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "id",
                "code",
                "name",
                "description",
                "district_id"
            ],
            relations: [],
            filter: filter,
            getType: "one"
        })
    },
    BY_DISTRICT: {
        createQuery: (districtId: number): QueryOptions => ({
            select: [
                "id",
                "code",
                "name",
                "description",
                "district_id"
            ],
            relations: [],
            filter: { district_id: districtId },
            getType: "many"
        })
    },
    WITH_DISTRICT: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "id",
                "code",
                "name",
                "description",
                "district_id"
            ],
            relations: ["district"],
            filter: filter,
            getType: "many"
        })
    },
    WITH_DISTRICT_PROVINCE: {
        createQuery: (filter: Record<string, any> = {}): QueryOptions => ({
            select: [
                "id",
                "code",
                "name",
                "description",
                "district_id"
            ],
            relations: ["district", "district.province"],
            filter: filter,
            getType: "many"
        })
    }
} as const;