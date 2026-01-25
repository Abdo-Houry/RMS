import { api } from "@/api/api";

export const machinesPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        machinesPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Machines/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Machines']
        }),
    }),
});

export const { useMachinesPutMutation } = machinesPutApi;
