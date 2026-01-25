import { api } from "@/api/api";

export const CategoryMealPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        categoryMealPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/MealCategories/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['CategoryMeal']
        }),
    }),
});

export const { useCategoryMealPutMutation } = CategoryMealPutApi;
