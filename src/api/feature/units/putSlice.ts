import { api } from "@/api/api";

export const unitsPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        unitsPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: `/api/Units/Update`,
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Units']
        }),
    }),
});

export const { useUnitsPutMutation } = unitsPutApi;
