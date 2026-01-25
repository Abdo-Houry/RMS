export interface MachineDetail {
    id?: string;
    key: string;
    value: string;
}

export interface Machine {
    id: string;
    name: string;
    imagePath: string;
    details?: MachineDetail[];
}
