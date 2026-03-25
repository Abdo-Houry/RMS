// import { api } from "@/api/api";

// export const mealsPutApi = api.injectEndpoints({
//     endpoints: (builder) => ({
//         mealsPut: builder.mutation<any, any>({
//             query: (credentials) => ({
//                 url: '/api/Meals/Update',
//                 method: 'PUT',
//                 body: credentials,
//             }),
//             invalidatesTags: ['Meals']
//         }),
//     }),
// });

// export const { useMealsPutMutation } = mealsPutApi;
import { api } from "@/api/api";
import axios from "axios";

export const mealsPutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        mealsPut: builder.mutation<
            any,
            {
                data: FormData;
                onProgress?: (percent: number) => void;
            }
        >({
            async queryFn({ data, onProgress }) {
                try {
                    const token = localStorage.getItem("accessToken");

                    const response = await axios.put(
                        `${import.meta.env.VITE_BASE_URL}/api/Meals/Update`,
                        data,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    const percent = Math.round(
                                        (progressEvent.loaded * 100) /
                                        progressEvent.total
                                    );
                                    onProgress?.(percent);
                                }
                            },
                        }
                    );

                    return { data: response.data };
                } catch (error: any) {
                    return {
                        error: {
                            status: error.response?.status,
                            data: error.response?.data,
                        },
                    };
                }
            },
            invalidatesTags: ["Meals"],
        }),
    }),
});

export const { useMealsPutMutation } = mealsPutApi;