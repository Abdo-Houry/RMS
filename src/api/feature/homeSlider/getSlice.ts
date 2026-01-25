import { api } from "@/api/api";

export const categoryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        homeSlider: builder.query<any, any>({
            query: (request) => ({
                url: "/api/Home/SlideShow",
                method: "GET",
                params: request, // Request object
            }),
            providesTags: ["Articles", "Machines", "Meals"],
        }),
    }),
});

export const { useHomeSliderQuery } = categoryApi;
