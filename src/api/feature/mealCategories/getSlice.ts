import { api } from "@/api/api";

export const categoryMealApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterCategoryMeal: builder.query<any, any>({
            query: (params) => ({
                url: '/api/MealCategories/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["CategoryMeal"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        filterCategoryMealStaff: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/MealCategories/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["CategoryMeal"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getCategoryMealById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/MealCategories/Get`,
                method: 'GET',
                params: {
                    mealCategoryId: id
                }
            }),
            providesTags: ['CategoryMeal'],
        }),
        getCategoryMealByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/MealCategories/Get`,
                method: 'GET',
                params: {
                    mealCategoryId: id
                }
            }),
            providesTags: ['CategoryMeal'],
        }),
    }),
});

export const { useFilterCategoryMealQuery, useGetCategoryMealByIdQuery, useFilterCategoryMealStaffQuery, useGetCategoryMealByIdStaffQuery } = categoryMealApi;