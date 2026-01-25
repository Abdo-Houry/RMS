// import { useEffect } from 'react';
// import { useAuth } from './contextAuth';
// import { setAuthTokens } from '@/api/api';


// const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const { accessToken, refreshToken, setTokens } = useAuth();

//     useEffect(() => {
//         setAuthTokens({
//             accessToken,
//             refreshToken,
//             setTokens
//         });
//     }, [accessToken, refreshToken, setTokens]);

//     return <>{children}</>;
// };

// export default AuthInitializer;