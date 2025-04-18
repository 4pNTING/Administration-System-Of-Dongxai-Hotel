export interface BaseSelection {
    id: number;
    code?: string;
    name: string;
}

export interface CodeSelection extends BaseSelection {
    budgetGroup?: BaseSelection;
}