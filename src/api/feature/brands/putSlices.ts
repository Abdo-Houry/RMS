import { api } from "@/api/api";

export const brandsPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        brandsPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Brands/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Brands']
        }),
    }),
});

export const { useBrandsPutMutation } = brandsPutApi;
