import { api } from "@/api/api";

export const categoryMealDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteCategoryMeal: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/MealCategories/Delete`,
                method: 'DELETE',
                params: {
                    mealCategoryId: id
                }
            }),
            invalidatesTags: ['CategoryMeal'],
        }),
    }),
});

export const { useDeleteCategoryMealMutation } = categoryMealDeleteApi;
