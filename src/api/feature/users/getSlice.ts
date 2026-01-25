import { api } from "@/api/api";

export const usersApi = api.injectEndpoints({
    endpoints: (builder) => ({
        filterUsers: builder.query<any, any>({
            query: (params) => ({
                url: '/api/Users/Filter',
                method: 'GET',
                params: {
                    ...params,
                    page: params.page?.toString(),
                    size: params.size?.toString(),
                },
            }),
            providesTags: ["Users"],
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (_, newItems) => newItems,
            forceRefetch({ currentArg, previousArg }) {
                return currentArg !== previousArg;
            },
        }),
        getUsersById: builder.query<any, any>({
            query: (id) => ({
                url: `/api/Users/Get`,
                method: 'GET',
                params: {
                    userId: id
                }
            }),
            providesTags: ['Users'],
        }),
    }),
});

export const { useFilterUsersQuery, useGetUsersByIdQuery } = usersApi;