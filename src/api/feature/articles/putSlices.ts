// import { api } from "@/api/api";

// export const articlePutApi = api.injectEndpoints({
//     endpoints: (builder) => ({
//         articlePut: builder.mutation<any, any>({
//             query: (credentials) => ({
//                 url: '/api/Articles/Update',
//                 method: 'PUT',
//                 body: credentials,
//             }),
//             invalidatesTags: ['Articles']
//         }),
//     }),
// });

// export const { useArticlePutMutation } = articlePutApi;
import { api } from "@/api/api";
import axios from "axios";

export const articlePutApi = api.injectEndpoints({
    endpoints: (builder) => ({
        articlePut: builder.mutation<
            any,
            {
                formData: FormData;
                onProgress?: (percent: number) => void;
            }
        >({
            async queryFn({ formData, onProgress }) {
                try {
                    const token = localStorage.getItem("accessToken");

                    const response = await axios.put(
                        `${import.meta.env.VITE_BASE_URL}/api/Articles/Update`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
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
            invalidatesTags: ["Articles"],
        }),
    }),
});

export const { useArticlePutMutation } = articlePutApi;