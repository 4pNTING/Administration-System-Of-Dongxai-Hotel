export type QueryType = 'one' | 'many';

export interface QueryOptions {
    select?: ReadonlyArray<string>;
    relations?: ReadonlyArray<string>;
    filter?: Record<string, any>;
    getType: QueryType;
}

export interface ApiResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    meta: {
        timestamp: string;
        path: string;
        method: string;
    }
}


export interface ActionResponse {
    success: boolean;
    message: string;
    data?: any;
}