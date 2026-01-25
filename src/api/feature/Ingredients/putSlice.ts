import { api } from "@/api/api";

export const ingredientsPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        ingredientsPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Ingredients/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Ingredients']
        }),
    }),
});

export const { useIngredientsPutMutation } = ingredientsPutApi;
