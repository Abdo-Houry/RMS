import { api } from "@/api/api";

export const categoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterCategory: builder.query<any, any>({
            query: (params) => ({
                url: '/api/ArticleCategories/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ['Articles', "Category"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        filterStaffCategory: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/ArticleCategories/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ['Articles', "Category"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getCategoryById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/ArticleCategories/Get`,
                method: 'GET',
                params: {
                    articleCategoryId: id
                }
            }),
            providesTags: ['Category'],
        }),
        getCategoryByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/ArticleCategories/Get`,
                method: 'GET',
                params: {
                    articleCategoryId: id
                }
            }),
            providesTags: ['Category'],
        }),
    }),
});

export const { useFilterCategoryQuery, useGetCategoryByIdQuery, useFilterStaffCategoryQuery, useGetCategoryByIdStaffQuery } = categoryApi;