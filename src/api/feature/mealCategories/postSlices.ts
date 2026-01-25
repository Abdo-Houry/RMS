import { api } from "@/api/api";

export const categoryMealPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        categoryMealPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/MealCategories/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['CategoryMeal']
        }),
    }),
});

export const { useCategoryMealPostMutation } = categoryMealPostApi;
