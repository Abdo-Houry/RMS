// import React, { createContext, useContext, useState, type ReactNode } from 'react';

// interface AuthContextType {
//     accessToken: string | null;
//     refreshToken: string | null;
//     setTokens: (accessToken: string, refreshToken: string) => void;
//     clearTokens: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//     const [accessToken, setAccessToken] = useState<string | null>(null);
//     const [refreshToken, setRefreshToken] = useState<string | null>(null);

//     const setTokens = (access: string, refresh: string) => {
//         setAccessToken(access);
//         setRefreshToken(refresh);
//     };

//     const clearTokens = () => {
//         setAccessToken(null);
//         setRefreshToken(null);
//     };

//     return (
//         <AuthContext.Provider value={{ accessToken, refreshToken, setTokens, clearTokens }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within AuthProvider');
//     }
//     return context;
// };