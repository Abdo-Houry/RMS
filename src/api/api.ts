import { createApi, fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react'
import { toast } from 'react-toastify';

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
    let result = await baseQuery(args, api, extraOptions);

    // معالجة أخطاء الشبكة و CORS
    // if (result?.error?.status === 'FETCH_ERROR') {
    //     console.error('Network/Fetch Error:', result.error);
    //     toast.error('Network error. Check your connection or CORS settings.');
    //     return result;
    // }

    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // إذا كان خطأ غير مصرح (401/403) ولدينا refresh token
    if ((result?.error?.status === 401 || result?.error?.status === 403) && refreshToken) {
        console.log('Attempting token refresh...');

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
                    console.error('Invalid refresh response:', responseData);
                    handleLogout();
                }
            } else {
                console.error('Refresh failed:', refreshResult?.error);
                handleLogout();
            }
        } catch (error) {
            console.error('Refresh token error:', error);
            handleLogout();
        }
    } else if (result?.error?.status === 401 || result?.error?.status === 403) {
        handleLogout();
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


// import { createApi, fetchBaseQuery, type FetchArgs } from '@reduxjs/toolkit/query/react'
// import { toast } from 'react-toastify';
// import type { BaseQueryApi } from '@reduxjs/toolkit/query';

// const baseQuery = fetchBaseQuery({
//     baseUrl: import.meta.env.VITE_BASE_URL,
//     prepareHeaders: (headers, { getState, endpoint }) => {
//         const token = localStorage.getItem('accessToken');
        
//         if (token) {
//             headers.set("Authorization", `Bearer ${token}`); // Capital 'A' in Authorization
//         }
        
//         // إضافة headers مشتركة
//         headers.set('Content-Type', 'application/json');
//         headers.set('Accept', 'application/json');
        
//         return headers;
//     }
// });

// const baseQueryWithReauth = async (
//     args: string | FetchArgs, 
//     api: BaseQueryApi, 
//     extraOptions: any
// ) => {
//     let result = await baseQuery(args, api, extraOptions);
    
//     // 🔥 أولاً: معالجة أخطاء الشبكة (مهم جداً)
//     if (result?.error?.status === 'FETCH_ERROR') {
//         console.error('🌐 Network/Fetch Error Details:', {
//             error: result.error,
//             url: typeof args === 'string' ? args : args.url,
//             method: typeof args === 'string' ? 'GET' : args.method,
//         });
        
//         toast.error('Connection error. Please check your network.');
//         return result;
//     }
    
//     // 🔥 ثانياً: معالجة token منتهي (401/403)
//     if (result?.error?.status === 401 || result?.error?.status === 403) {
//         console.log('🔄 Token expired, attempting refresh...');
        
//         const refreshToken = localStorage.getItem('refreshToken');
        
//         if (!refreshToken) {
//             console.log('❌ No refresh token available');
//             handleLogout();
//             return result;
//         }
        
//         try {
//             // ⚠️ IMPORTANT: طريقة إرسال refresh token تعتمد على خادمك
//             // المحاولة 1: إرسال في body (كما تحاول)
//             const refreshResult = await baseQuery({
//                 url: "/api/public/Auth/Refresh",
//                 method: 'POST',
//                 body: { refreshToken }, // ⚠️ أرسل refreshToken فقط
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             }, api, extraOptions);
            
//             console.log('🔄 Refresh API Response:', refreshResult);
            
//             // المحاولة 2: إذا فشلت، جرب إرسال في Authorization header
//             if (refreshResult?.error) {
//                 console.log('⚠️ Trying alternative refresh method...');
//                 const refreshResultAlt = await baseQuery({
//                     url: "/api/public/Auth/Refresh",
//                     method: 'POST',
//                     headers: {
//                         'Authorization': `Bearer ${refreshToken}`,
//                         'Content-Type': 'application/json',
//                     }
//                 }, api, extraOptions);
                
//                 if (refreshResultAlt?.data) {
//                     await handleRefreshSuccess(refreshResultAlt.data);
//                     // إعادة المحاولة
//                     result = await baseQuery(args, api, extraOptions);
//                     console.log('✅ Request retried successfully after refresh');
//                     return result;
//                 }
//             }
            
//             if (refreshResult?.data) {
//                 await handleRefreshSuccess(refreshResult.data);
                
//                 // ⚠️ مهم: إعادة المحاولة مع الـ headers المحدثة
//                 // إنشاء args جديدة مع الـ headers المحدثة
//                 const retryArgs = typeof args === 'string' 
//                     ? { url: args, method: 'GET' }
//                     : { ...args };
                
//                 result = await baseQuery(retryArgs, api, extraOptions);
//                 console.log('✅ Request retried successfully after refresh');
//             } else {
//                 console.error('❌ Refresh failed:', refreshResult?.error);
//                 handleLogout();
//             }
//         } catch (error) {
//             console.error('❌ Refresh token error:', error);
//             handleLogout();
//         }
//     }
    
//     return result;
// };

// const handleRefreshSuccess = async (data: any) => {
//     console.log('🔄 Processing refresh response:', data);
    
//     // ⚠️ تعديل هذا بناءً على هيكل استجابة الخادم
//     let newAccessToken, newRefreshToken;
    
//     // المحاولة 1: هيكل { data: { accessToken, refreshToken } }
//     if (data?.data?.accessToken) {
//         newAccessToken = data.data.accessToken;
//         newRefreshToken = data.data.refreshToken;
//     }
//     // المحاولة 2: هيكل مباشر { accessToken, refreshToken }
//     else if (data?.accessToken) {
//         newAccessToken = data.accessToken;
//         newRefreshToken = data.refreshToken;
//     }
//     // المحاولة 3: هيكل مختلف
//     else {
//         console.log('📦 Raw refresh response:', data);
//         // حاول استخراج الـ token بأي طريقة
//         newAccessToken = data?.token || data?.access_token || data?.authToken;
//         newRefreshToken = data?.refresh_token || data?.refreshToken;
//     }
    
//     if (newAccessToken) {
//         localStorage.setItem('accessToken', newAccessToken);
//         console.log('✅ New access token saved');
//     } else {
//         console.error('❌ No access token in refresh response');
//     }
    
//     if (newRefreshToken) {
//         localStorage.setItem('refreshToken', newRefreshToken);
//         console.log('✅ New refresh token saved');
//     }
    
//     return { newAccessToken, newRefreshToken };
// };

// const handleLogout = () => {
//     console.log('👋 Logging out...');
//     toast.error("Session expired. Please login again.");
    
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     localStorage.removeItem('user');
    
//     // إعطاء وقت لـ toast للظهور
//     setTimeout(() => {
//         window.location.href = "/auth/login-admin";
//     }, 2000);
// };

// export const api = createApi({
//     reducerPath: 'api',
//     baseQuery: baseQueryWithReauth,
//     tagTypes: ['Articles', 'Category', 'Ingredients', 'Units', 'CategoryMeal', 'Machines', 'Meals', 'Users', "Brands"],
//     endpoints: () => ({}),
// });