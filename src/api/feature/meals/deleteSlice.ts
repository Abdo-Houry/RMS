import { api } from "@/api/api";

export const mealsDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteMeals: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Meals/Delete`,
                method: 'DELETE',
                params: {
                    mealId: id
                }
            }),
            invalidatesTags: ['Meals'],
        }),
    }),
});

export const { useDeleteMealsMutation } = mealsDeleteApi;
