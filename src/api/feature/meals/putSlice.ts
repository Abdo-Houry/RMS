import { api } from "@/api/api";

export const mealsPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        mealsPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Meals/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Meals']
        }),
    }),
});

export const { useMealsPutMutation } = mealsPutApi;
