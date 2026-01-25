import { api } from "@/api/api";

export const ingredientsPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        ingredientsPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Ingredients/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Ingredients']
        }),
    }),
});

export const { useIngredientsPostMutation } = ingredientsPostApi;
