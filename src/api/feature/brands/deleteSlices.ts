import { api } from "@/api/api";

export const brandsDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteBrands: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Brands/Delete`,
                method: 'DELETE',
                params: {
                    brandId: id
                }
            }),
            invalidatesTags: ['Brands'],
        }),
    }),
});

export const { useDeleteBrandsMutation } = brandsDeleteApi;
