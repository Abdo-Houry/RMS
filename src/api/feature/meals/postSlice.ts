import { api } from "@/api/api";

export const mealsPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        mealsPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Meals/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Meals']
        }),
    }),
});

export const { useMealsPostMutation } = mealsPostApi;
