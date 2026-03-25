import { api } from "@/api/api";
import axios from "axios";

export const articlePostApi = api.injectEndpoints({
    endpoints: (builder) => ({
        // articlePost: builder.mutation<any, any>({
        //     query: (credentials) => ({
        //         url: '/api/Articles/Create',
        //         method: 'POST',
        //         body: credentials,
        //     }),
        //     invalidatesTags: ['Articles']
        // }),
        articlePost: builder.mutation<
            any,
            {
                formData: FormData
                onProgress?: (percent: number) => void
            }
        >({
            async queryFn({ formData, onProgress }) {
                try {
                    const token = localStorage.getItem("accessToken")

                    const response = await axios.post(
                        `${import.meta.env.VITE_BASE_URL}/api/Articles/Create`,
                        formData,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "multipart/form-data",
                            },
                            onUploadProgress: (progressEvent) => {
                                if (progressEvent.total) {
                                    const percent = Math.round(
                                        (progressEvent.loaded * 100) /
                                        progressEvent.total
                                    )
                                    onProgress?.(percent)
                                }
                            },
                        }
                    )

                    return { data: response.data }
                } catch (error: any) {
                    return {
                        error: {
                            status: error.response?.status,
                            data: error.response?.data,
                        },
                    }
                }
            },
        }),
    }),
});

export const { useArticlePostMutation } = articlePostApi;
