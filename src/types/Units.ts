export interface Unit {
    id: string;
    name: string;
}
export interface UnitDetailsResponse {
    data: Unit;
    error: {
        code: string;
        message: string;
        latinoMessage: string;
    };
}
export interface AddUnitPayload {
    name: string;
}
export interface EditUnitPayload {
    unitId: string;
    name: string;
}
