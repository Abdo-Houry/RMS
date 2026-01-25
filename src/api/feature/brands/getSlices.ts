import { api } from "@/api/api";

export const brandsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterBrands: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Brands/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Brands"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getBrandsById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Brands/Get`,
                method: 'GET',
                params: {
                    brandId: id
                }
            }),
            providesTags: ['Brands'],
        }),
    }),
});

export const { useFilterBrandsQuery, useGetBrandsByIdQuery } = brandsApi;