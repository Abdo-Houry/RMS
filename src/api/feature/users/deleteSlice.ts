import { api } from "@/api/api";

export const usersDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteUsers: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Users/Delete`,
                method: 'DELETE',
                params: {
                    userId: id
                }
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const { useDeleteUsersMutation } = usersDeleteApi;
