import { api } from "@/api/api";
import type { LoginRequest } from "@/types/auth";

// Inject endpoints
export const authApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<any, LoginRequest>({
            query: (credentials) => ({
                url: '/api/Auth/Login',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
});

export const { useLoginMutation } = authApi;
