import { api } from "@/api/api";

export const ingredientsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterIngredients: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Ingredients/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Ingredients"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        filterStaffIngredients: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/Ingredients/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Ingredients"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getIngredientsById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Ingredients/Get`,
                method: 'GET',
                params: {
                    ingredientId: id
                }
            }),
            providesTags: ['Ingredients'],
        }),
        getIngredientsByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/Ingredients/Get`,
                method: 'GET',
                params: {
                    ingredientId: id
                }
            }),
            providesTags: ['Ingredients'],
        }),
    }),
});

export const { useGetIngredientsByIdQuery, useFilterIngredientsQuery, useFilterStaffIngredientsQuery, useGetIngredientsByIdStaffQuery } = ingredientsApi;