import { api } from "@/api/api";

export const machinesDeleteApi = api.injectEndpoints({
    endpoints: (builder) => ({
        deleteMachines: builder.mutation<any, any>({
            query: (id) => ({
                url: `/api/Machines/Delete`,
                method: 'DELETE',
                params: {
                    machineId: id
                }
            }),
            invalidatesTags: ['Machines'],
        }),
    }),
});

export const { useDeleteMachinesMutation } = machinesDeleteApi;
