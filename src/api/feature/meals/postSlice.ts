// import { api } from "@/api/api";

// export const mealsPostApi = api.injectEndpoints({
//     endpoints: (builder) => ({
//         mealsPost: builder.mutation<any, any>({
//             query: (credentials) => ({
//                 url: '/api/Meals/Create',
//                 method: 'POST',
//                 body: credentials,
//             }),
//             invalidatesTags: ['Meals']
//         }),
//     }),
// });

// export const { useMealsPostMutation } = mealsPostApi;

import { api } from "@/api/api";
import axios from "axios";

export const mealsPostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        mealsPost: builder.mutation<
            any,
            {
                formData: FormData;
                onProgress?: (percent: number) => void;
            }
        >({
            async queryFn({ formData, onProgress }) {
                try {
                    const token = localStorage.getItem("accessToken");

                    const response = await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/api/Meals/Create`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                // لا تضع Content-Type هنا
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

export const { useMealsPostMutation } = mealsPostApi;