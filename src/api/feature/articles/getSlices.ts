import { api } from "@/api/api";

export const articlesApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterArticles: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Articles/Filter',
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
        filterStaffArticles: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/Articles/Filter',
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
        getArticleById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Articles/Get`,
                method: 'GET',
                params: {
                    articleId: id
                }
            }),
            providesTags: ['Articles'],
        }),
        getArticleByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/Articles/Get`,
                method: 'GET',
                params: {
                    articleId: id
                }
            }),
            providesTags: ['Articles'],
        }),
    }),
});

export const { useFilterArticlesQuery, useGetArticleByIdQuery, useFilterStaffArticlesQuery, useGetArticleByIdStaffQuery } = articlesApi;