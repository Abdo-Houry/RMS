import { api } from "@/api/api";

export const articlePutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        articlePut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: '/api/Articles/Update',
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Articles']
        }),
    }),
});

export const { useArticlePutMutation } = articlePutApi;
