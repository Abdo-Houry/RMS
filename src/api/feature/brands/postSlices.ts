import { api } from "@/api/api";

export const brandsPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        brandsPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Brands/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Brands']
        }),
    }),
});

export const { useBrandsPostMutation } = brandsPostApi;
