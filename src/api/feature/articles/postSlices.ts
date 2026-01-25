import { api } from "@/api/api";

export const articlePostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        articlePost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Articles/Create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Articles']
        }),
    }),
});

export const { useArticlePostMutation } = articlePostApi;
