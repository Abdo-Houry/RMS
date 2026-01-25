import { api } from "@/api/api";

export const unitsPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        UnitsPost: builder.mutation<any, any>({
            query: (credentials) => ({
                url: `/api/Units/Create`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Units']
        }),
    }),
});

export const { useUnitsPostMutation } = unitsPostApi;
