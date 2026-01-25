import { api } from "@/api/api";

export const articleDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteArticle: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Articles/Delete`,
                method: 'DELETE',
                params: {
                    articleId: id
                }
            }),
            invalidatesTags: ['Articles'],
        }),
    }),
});

export const { useDeleteArticleMutation } = articleDeleteApi;
