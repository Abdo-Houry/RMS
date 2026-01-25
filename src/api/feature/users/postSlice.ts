import { api } from "@/api/api";

export const userPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        userPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: `/api/Users/Create`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useUserPostMutation } = userPostApi;
