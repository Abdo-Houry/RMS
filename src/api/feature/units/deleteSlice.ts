import { api } from "@/api/api";

export const unitsDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteUnits: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Units/Delete`,
                method: 'DELETE',
                params: {
                    unitId: id
                }
            }),
            invalidatesTags: ['Units'],
        }),
    }),
});

export const { useDeleteUnitsMutation } = unitsDeleteApi;
