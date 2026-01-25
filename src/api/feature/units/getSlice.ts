import { api } from "@/api/api";

export const unitsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterUnits: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Units/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Ingredients", "Units"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        filterStaffUnits: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/Units/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Ingredients", "Units"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getUnitsById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Units/Get`,
                method: 'GET',
                params: {
                    unitId: id
                }
            }),
            providesTags: ['Units'],
        }),
        getUnitsByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/Units/Get`,
                method: 'GET',
                params: {
                    unitId: id
                }
            }),
            providesTags: ['Units'],
        }),
    }),
});

export const { useFilterUnitsQuery, useGetUnitsByIdQuery, useFilterStaffUnitsQuery, useGetUnitsByIdStaffQuery } = unitsApi;