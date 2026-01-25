import { api } from "@/api/api";

export const machinesPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        machinesPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Machines/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Machines']
        }),
    }),
});

export const { useMachinesPostMutation } = machinesPostApi;
