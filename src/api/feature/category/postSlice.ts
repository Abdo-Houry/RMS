import { api } from "@/api/api";

export const categoryPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        categoryPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/ArticleCategories/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Category']
        }),
    }),
});

export const { useCategoryPostMutation } = categoryPostApi;
