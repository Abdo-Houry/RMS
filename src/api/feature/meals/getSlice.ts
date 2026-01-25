import { api } from "@/api/api";

export const mealsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterMeals: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Meals/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Meals"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        filterStaffMeals: builder.query<any, any>({
            query: (params) => ({
                url: '/api/staff/Meals/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Meals"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getMealsById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Meals/Get`,
                method: 'GET',
                params: {
                    mealId: id
                }
            }),
            providesTags: ['Meals'],
        }),
        getMealsByIdStaff: builder.query<any, any>({
            query: (id) => ({
                url: `/api/staff/Meals/Get`,
                method: 'GET',
                params: {
                    mealId: id
                }
            }),
            providesTags: ['Meals'],
        }),
    }),
});

export const { useGetMealsByIdQuery, useFilterMealsQuery, useFilterStaffMealsQuery, useGetMealsByIdStaffQuery } = mealsApi;