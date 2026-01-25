import { api } from "@/api/api";

export const machinesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterMachines: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Machines/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Machines"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        filterMachinesStaff: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/Machines/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Machines"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getMachinesById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Machines/Get`,
                method: 'GET',
                params: {
                    machineId: id
                }
            }),
            providesTags: ['Machines'],
        }),
        getMachinesByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/Machines/Get`,
                method: 'GET',
                params: {
                    machineId: id
                }
            }),
            providesTags: ['Machines'],
        }),
    }),
});

export const { useFilterMachinesQuery, useGetMachinesByIdQuery, useFilterMachinesStaffQuery, useGetMachinesByIdStaffQuery } = machinesApi;