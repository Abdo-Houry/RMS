import { api } from "@/api/api";

export const CategoryPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        categoryPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/ArticleCategories/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Category']
        }),
    }),
});

export const { useCategoryPutMutation } = CategoryPutApi;
