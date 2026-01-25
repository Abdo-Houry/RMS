import { api } from "@/api/api";

export const categoryDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteCategory: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/ArticleCategories/Delete`,
                method: 'DELETE',
                params: {
                    articleCategoryId: id
                }
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const { useDeleteCategoryMutation } = categoryDeleteApi;
