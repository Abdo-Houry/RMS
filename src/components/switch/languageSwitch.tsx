"use client"

import { useDispatch, useSelector } from "react-redux"
import { Languages } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { RootState } from "@/store/store"
import { setLanguage, type Language } from "@/api/feature/switch/languageSlice"
import i18n from "@/i18n"
import { useTranslation } from "react-i18next"

export function LanguageSwitcher() {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { currentLanguage, direction } = useSelector((state: RootState) => state.language)

    const handleLanguageChange = (lang: Language) => {
        dispatch(setLanguage(lang))
        i18n.changeLanguage(lang)
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
        document.documentElement.lang = lang
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 px-0">
                    <Languages className="h-4 w-4" />
                    <span className="sr-only">Selected</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={direction === "rtl" ? "start" : "end"}>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange("ar")}
                    className={currentLanguage === "ar" ? "bg-accent" : ""}
                >
                    <span className={direction === "rtl" ? "ml-2" : "mr-2"}>AR</span>
                    {t("sidebar.nav.ar")}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => handleLanguageChange("en")}
                    className={currentLanguage === "en" ? "bg-accent" : ""}
                >
                    <span className={direction === "rtl" ? "ml-2" : "mr-2"}>EN</span>
                    {t("sidebar.nav.en")}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
