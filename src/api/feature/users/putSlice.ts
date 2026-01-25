import { api } from "@/api/api";

export const usersPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        usersPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: `/api/Users/Update`,
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Users']
        }),
        permissionPut: builder.mutation<any, any>({
            query: (credentials) => ({
                url: `/api/Users/SetPermissions`,
                method: 'PUT',
                body: credentials,
            }),
            invalidatesTags: ['Users']
        }),
    }),
});

export const { useUsersPutMutation, usePermissionPutMutation } = usersPutApi;
