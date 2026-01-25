// import type { ReactNode } from "react"
// import { Navigate } from "react-router-dom"
// import { useAuth } from "@/context/contextAuth"

// function RequireAuth({ children }: { children: ReactNode }) {
//   const { accessToken } = useAuth()
//   const L_accessToken = localStorage.getItem('accessToken');
//   const accessTokenFinal = accessToken || L_accessToken
//   return accessTokenFinal ? children : <Navigate to="/auth/login-admin" replace />
// }

// export default RequireAuth
import { type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"

function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()

  const accessToken = localStorage.getItem('accessToken')


  if (!accessToken) {
    return <Navigate to="/auth/login-admin" state={{ from: location }} replace />
  }

  return <>{children}</>
}

export default RequireAuth