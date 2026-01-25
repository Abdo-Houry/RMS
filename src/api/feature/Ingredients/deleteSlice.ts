import { api } from "@/api/api";

export const ingredientsDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteIngredients: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Ingredients/Delete`,
                method: 'DELETE',
                params: {
                    ingredientId: id
                }
            }),
            invalidatesTags: ['Ingredients'],
        }),
    }),
});

export const { useDeleteIngredientsMutation } = ingredientsDeleteApi;
