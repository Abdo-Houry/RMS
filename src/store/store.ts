import { api } from "@/api/api";
import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "redux-persist/lib/storage"
import { persistStore, persistReducer } from "redux-persist"
import languageReducer from "../api/feature/switch/languageSlice"
const languagePersistConfig = {
    key: "language",
    storage,
}
const persistedLanguageReducer = persistReducer(languagePersistConfig, languageReducer)


export const store = configureStore({
    reducer: {
        [api.reducerPath]: api.reducer,
        language: persistedLanguageReducer,
    },
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
    }).concat(api.middleware),
})
setupListeners(store.dispatch)
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// import { api } from "@/api/api";
// import { configureStore } from "@reduxjs/toolkit";
// import { setupListeners } from "@reduxjs/toolkit/query";
// import storage from "redux-persist/lib/storage"
// import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"
// import languageReducer from "../api/feature/switch/languageSlice"

// const languagePersistConfig = {
//     key: "language",
//     storage,
//     whitelist: ["currentLanguage"] // حدد الحقول المراد حفظها فقط
// }

// const persistedLanguageReducer = persistReducer(languagePersistConfig, languageReducer);

// export const store = configureStore({
//     reducer: {
//         [api.reducerPath]: api.reducer,
//         language: persistedLanguageReducer,
//     },
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: {
//                 ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//             },
//         }).concat(api.middleware),
//     devTools: process.env.NODE_ENV !== 'production',
// });

// setupListeners(store.dispatch);

// export const persistor = persistStore(store);
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;