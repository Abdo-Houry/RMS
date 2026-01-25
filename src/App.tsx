import { RouterProvider } from "react-router-dom"
import { routes } from "./routes"
import { ToastContainer } from 'react-toastify';
// import AuthInitializer from "./context/AuthInitializer";
import { ThemeProvider } from "./theme/theme-provider";
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
function App() {
  const { i18n } = useTranslation()

  // useEffect(() => {
  //   const direction = i18n.language === "ar" ? "rtl" : "ltr"
  //   document.documentElement.dir = direction
  //   document.documentElement.lang = i18n.language
  // }, [i18n.language])
  useEffect(() => {
    const dir = i18n.language === "ar" ? "rtl" : "ltr"
    document.documentElement.setAttribute("dir", dir)
    document.documentElement.setAttribute("lang", i18n.language)
  }, [i18n.language])

  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/* <AuthInitializer> */}
        <RouterProvider router={routes} />
        {/* </AuthInitializer> */}
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          closeOnClick
        />
      </ThemeProvider>
    </>
  )
}

export default App