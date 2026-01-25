// import { AppSidebar } from '@/components/navbar/app-sidebar'
// import { Outlet, useLocation } from "react-router-dom";
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from '@/components/ui/breadcrumb'
// import { Separator } from '@/components/ui/separator'
// import {
//     SidebarInset,
//     SidebarProvider,
//     SidebarTrigger,
// } from '@/components/ui/sidebar'
// import { Images, Moon, Sun } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useTheme } from '@/theme/theme-provider';
// import { useTranslation } from 'react-i18next'
// // import type { RootState } from "@/store/store"
// // import { useEffect } from "react"
// // import { useSelector } from "react-redux"
// import { LanguageSwitcher } from '@/components/switch/languageSwitch';
// import { CarouselDialog } from '@/components/slideShow/HomeSlide';
// import { useState } from 'react';

// // import i18n from '@/i18n';
// // const navItems = [
// //     { titleKey: "sidebar.nav.home", url: "/" },
// //     { titleKey: "sidebar.nav.articles", url: "/article" },
// //     { titleKey: "sidebar.nav.mealCategories", url: "/categories-meal" },
// //     { titleKey: "sidebar.nav.machines", url: "/machines" },
// //     { titleKey: "sidebar.nav.articleCategories", url: "/categories" },
// //     { titleKey: "sidebar.nav.meals", url: "/meals" },
// //     { titleKey: "sidebar.nav.units", url: "/units" },
// //     { titleKey: "sidebar.nav.ingredient", url: "/ingredient" },
// //     { titleKey: "sidebar.nav.users", url: "/users" },
// // ]
// const navItems = [
//     { titleKey: "sidebar.nav.home", url: "/" },
//     { titleKey: "sidebar.nav.articles", url: "/article" },
//     { titleKey: "sidebar.nav.createArticle", url: "/articles/create" },
//     { titleKey: "sidebar.nav.editArticle", url: "/articles/edit" }, // لاحظ أن هذا يحتاج إلى معالجة ديناميكية عند الـ breadcrumb
//     { titleKey: "sidebar.nav.mealCategories", url: "/categories-meal" },
//     { titleKey: "sidebar.nav.machines", url: "/machines" },
//     { titleKey: "sidebar.nav.addMachine", url: "/machines/add" },
//     { titleKey: "sidebar.nav.editMachine", url: "/machines/edit" },
//     { titleKey: "sidebar.nav.machineDetails", url: "/machines/details" },
//     { titleKey: "sidebar.nav.articleCategories", url: "/categories" },
//     { titleKey: "sidebar.nav.meals", url: "/meals" },
//     { titleKey: "sidebar.nav.addMeal", url: "/meals/add" },
//     { titleKey: "sidebar.nav.editMeal", url: "/meals/edit" },
//     { titleKey: "sidebar.nav.units", url: "/units" },
//     { titleKey: "sidebar.nav.ingredient", url: "/ingredient" },
//     { titleKey: "sidebar.nav.users", url: "/users" },
//     { titleKey: "sidebar.nav.brands", url: "/brands" }
// ];

// function Layout() {
//     const location = useLocation()
//     const currentPage = navItems.find(item => item.url === location.pathname)
//     const { setTheme } = useTheme()
//     const { t, i18n } = useTranslation()
//     // const { direction } = useSelector((state: RootState) => state.language)
//     // useEffect(() => {
//     //     document.documentElement.dir = direction
//     // }, [direction])
//     const direction = i18n.language === "ar" ? "rtl" : "ltr"
//     // حالة للتحكم في عرض الكاروسيل
//     const [showCarousel, setShowCarousel] = useState(false)

//     const handleOpenCarousel = () => {
//         setShowCarousel(true)
//     }
//     return (
//         <SidebarProvider>
//             {showCarousel && <CarouselDialog />}
//             <AppSidebar />
//             <SidebarInset>
//                 <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
//                     <div className="flex items-center justify-between w-full gap-2 px-4">
//                         <div className="flex items-center">
//                             <SidebarTrigger className="-ml-1" />
//                             <Separator
//                                 orientation="vertical"
//                                 className="mr-2 data-[orientation=vertical]:h-4"
//                             />
//                             <Breadcrumb>
//                                 <BreadcrumbList>
//                                     <BreadcrumbItem className="hidden md:block">
//                                         <BreadcrumbLink href="/">
//                                             {t('layout.breadcrumb.home')}
//                                         </BreadcrumbLink>
//                                     </BreadcrumbItem>
//                                     <BreadcrumbSeparator className="hidden md:block" />
//                                     <BreadcrumbItem>
//                                         <BreadcrumbPage>
//                                             {currentPage ? t(currentPage.titleKey) : t('layout.breadcrumb.details')}
//                                         </BreadcrumbPage>
//                                     </BreadcrumbItem>
//                                 </BreadcrumbList>
//                             </Breadcrumb>
//                         </div>
//                         <div className="flex items-center gap-2">
//                             {/* زر عرض الكاروسيل */}
//                             <Button
//                                 onClick={handleOpenCarousel}
//                                 variant="outline"
//                                 size="sm"
//                                 className="gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30 hover:border-blue-500/50"
//                             >
//                                 <Images className="h-4 w-4" />
//                                 <span className="hidden sm:inline">{t('layout.carousel.show') || 'عرض العرض التقديمي'}</span>
//                             </Button>
//                             <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                     <Button variant="outline" size="icon">
//                                         <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
//                                         <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
//                                         <span className="sr-only">{t('layout.theme.toggle')}</span>
//                                     </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                     <DropdownMenuItem onClick={() => setTheme("light")}>
//                                         {t('layout.theme.light')}
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => setTheme("dark")}>
//                                         {t('layout.theme.dark')}
//                                     </DropdownMenuItem>
//                                     <DropdownMenuItem onClick={() => setTheme("system")}>
//                                         {t('layout.theme.system')}
//                                     </DropdownMenuItem>
//                                 </DropdownMenuContent>
//                             </DropdownMenu>
//                             <div className={`${direction === "rtl" ? "mr-auto" : "ml-auto"}`}>
//                                 <LanguageSwitcher />
//                             </div>
//                         </div>
//                     </div>
//                 </header>
//                 <Separator />
//                 <Outlet />
//             </SidebarInset>
//         </SidebarProvider>
//     )
// }

// export default Layout
import { AppSidebar } from '@/components/navbar/app-sidebar'
import { Outlet, useLocation } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { Moon, Sun, Images, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from '@/theme/theme-provider';
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/switch/languageSwitch';
import { CarouselDialog } from '@/components/slideShow/HomeSlide';
import { useState, useEffect, useCallback } from 'react';

const navItems = [
    { titleKey: "sidebar.nav.home", url: "/" },
    { titleKey: "sidebar.nav.articles", url: "/article" },
    { titleKey: "sidebar.nav.createArticle", url: "/articles/create" },
    { titleKey: "sidebar.nav.editArticle", url: "/articles/edit" },
    { titleKey: "sidebar.nav.mealCategories", url: "/categories-meal" },
    { titleKey: "sidebar.nav.machines", url: "/machines" },
    { titleKey: "sidebar.nav.addMachine", url: "/machines/add" },
    { titleKey: "sidebar.nav.editMachine", url: "/machines/edit" },
    { titleKey: "sidebar.nav.machineDetails", url: "/machines/details" },
    { titleKey: "sidebar.nav.articleCategories", url: "/categories" },
    { titleKey: "sidebar.nav.meals", url: "/meals" },
    { titleKey: "sidebar.nav.addMeal", url: "/meals/add" },
    { titleKey: "sidebar.nav.editMeal", url: "/meals/edit" },
    { titleKey: "sidebar.nav.units", url: "/units" },
    { titleKey: "sidebar.nav.ingredient", url: "/ingredient" },
    { titleKey: "sidebar.nav.users", url: "/users" },
    { titleKey: "sidebar.nav.brands", url: "/brands" }
];

function Layout() {
    const location = useLocation()
    const currentPage = navItems.find(item => item.url === location.pathname)
    const { setTheme } = useTheme()
    const { t, i18n } = useTranslation()
    const direction = i18n.language === "ar" ? "rtl" : "ltr"

    // حالة للتحكم في عرض الكاروسيل
    const [showCarousel, setShowCarousel] = useState(false)
    const [carouselKey, setCarouselKey] = useState(0) // مفتاح لإعادة إنشاء المكون

    const handleOpenCarousel = useCallback(() => {
        setShowCarousel(true)
        setCarouselKey(prev => prev + 1) // تغيير المفتاح لإعادة إنشاء المكون
    }, [])

    const handleCloseCarousel = useCallback(() => {
        setShowCarousel(false)
    }, [])

    // إضافة تحكم بلوحة المفاتيح للتفعيل
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl + P لفتح الكاروسيل
            if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
                e.preventDefault()
                handleOpenCarousel()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleOpenCarousel])

    return (
        <SidebarProvider>
            {/* عرض الكاروسيل مع مفتاح لإعادة الإنشاء */}
            {showCarousel && (
                <CarouselDialog
                    key={carouselKey} // مفتاح لإعادة إنشاء المكون
                    isOpen={showCarousel} // تمرير الحالة
                    onClose={handleCloseCarousel} // تمرير دالة الإغلاق
                />
            )}

            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center justify-between w-full gap-2 px-4">
                        <div className="flex items-center">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="/">
                                            {t('layout.breadcrumb.home')}
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            {currentPage ? t(currentPage.titleKey) : t('layout.breadcrumb.details')}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                        <div className="flex items-center gap-2">
                            {/* زر عرض الكاروسيل */}
                            <Button
                                onClick={handleOpenCarousel}
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20 border-blue-500/30 hover:border-blue-500/50 transition-all duration-300"
                            >
                                {showCarousel ? (
                                    <>
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">إغلاق العرض</span>
                                    </>
                                ) : (
                                    <>
                                        <Images className="h-4 w-4" />
                                        <span className="hidden sm:inline">{t('layout.carousel.show') || 'عرض العرض التقديمي'}</span>
                                    </>
                                )}
                            </Button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon">
                                        <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                                        <span className="sr-only">{t('layout.theme.toggle')}</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        {t('layout.theme.light')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        {t('layout.theme.dark')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        {t('layout.theme.system')}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <div className={`${direction === "rtl" ? "mr-auto" : "ml-auto"}`}>
                                <LanguageSwitcher />
                            </div>
                        </div>
                    </div>
                </header>
                <Separator />
                <Outlet />
            </SidebarInset>
        </SidebarProvider>
    )
}

export default Layout