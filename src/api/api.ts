// import { createApi, fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react'
// import { toast } from 'react-toastify';

// const baseQuery = fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_BASE_URL,
//     prepareHeaders: (headers) => {
//         const token = localStorage.getItem('accessToken');

//         if (token) {
//             headers.set("authorization", `Bearer ${token}`);
//         }

//         return headers;
//     }
// });

// const baseQueryWithReauth = async (args: string | FetchArgs, api: any, extraOptions: any) => {
//     let result = await baseQuery(args, api, extraOptions);


//     const accessToken = localStorage.getItem('accessToken');
//     const refreshToken = localStorage.getItem('refreshToken');

//     // إذا كان خطأ غير مصرح (401/403) ولدينا refresh token
//     if ((result?.error?.status === 401 || result?.error?.status === 403 || result?.error?.status === 'FETCH_ERROR') && refreshToken) {
//         console.log('Attempting token refresh...');

//         try {
//             const refreshResult = await baseQuery({
//                 url: "/api/public/Auth/Refresh",
//                 method: 'POST',
//                 body: { accessToken, refreshToken },
//             }, api, extraOptions);

//             if (refreshResult?.data) {
//                 const responseData = refreshResult.data as any;
//                 const newAccessToken = responseData.data?.accessToken;
//                 const newRefreshToken = responseData.data?.refreshToken;

//                 if (newAccessToken && newRefreshToken) {
//                     localStorage.setItem('accessToken', newAccessToken);
//                     localStorage.setItem('refreshToken', newRefreshToken);

//                     result = await baseQuery(args, api, extraOptions);
//                 } else {
//                     console.error('Invalid refresh response:', responseData);
//                     handleLogout();
//                 }
//             } else {
//                 console.error('Refresh failed:', refreshResult?.error);
//                 handleLogout();
//             }
//         } catch (error) {
//             console.error('Refresh token error:', error);
//             handleLogout();
//         }
//     } else if (result?.error?.status === 401 || result?.error?.status === 403) {
//         handleLogout();
//     }

//     return result;
// };

// const handleLogout = () => {
//     toast.error("Session expired. Please login again.");

//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');

//     setTimeout(() => {
//         window.location.href = "/auth/login-admin";
//     }, 1500);
// };

// export const api = createApi({
//     reducerPath: 'api',
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Articles', 'Category', 'Ingredients', 'Units', 'CategoryMeal', 'Machines', 'Meals', 'Users', "Brands"],
//     endpoints: () => ({}),
// });


import { createApi, fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify';
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }

        return headers;
    }
});

const baseQueryWithReauth = async (args: string | FetchArgs, api: any, extraOptions: any) => {

    await mutex.waitForUnlock();

    let result = await baseQuery(args, api, extraOptions);

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if ((result?.error?.status === 401 || result?.error?.status === 403) && refreshToken) {

        if (!mutex.isLocked()) {

            const release = await mutex.acquire();

            try {

                const refreshResult = await baseQuery({
                    url: "/api/public/Auth/Refresh",
                    method: 'POST',
                    body: { accessToken, refreshToken },
                }, api, extraOptions);

                if (refreshResult?.data) {

                    const responseData = refreshResult.data as any;

                    const newAccessToken = responseData.data?.accessToken;
                    const newRefreshToken = responseData.data?.refreshToken;

                    if (newAccessToken && newRefreshToken) {

                        localStorage.setItem('accessToken', newAccessToken);
                        localStorage.setItem('refreshToken', newRefreshToken);

                        result = await baseQuery(args, api, extraOptions);

                    } else {

                        handleLogout();

                    }

                } else {

                    handleLogout();

                }

            } catch (error) {

                handleLogout();

            } finally {

                release();

            }

        } else {

            await mutex.waitForUnlock();
            result = await baseQuery(args, api, extraOptions);

        }

    }

    return result;
};

const handleLogout = () => {

    toast.error("Session expired. Please login again.");

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    setTimeout(() => {
        window.location.href = "/auth/login-admin";
    }, 1500);

};

export const api = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Articles', 'Category', 'Ingredients', 'Units', 'CategoryMeal', 'Machines', 'Meals', 'Users', "Brands"],
    endpoints: () => ({}),
});