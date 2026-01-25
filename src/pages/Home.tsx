import { useFilterArticlesQuery, useFilterStaffArticlesQuery } from "@/api/feature/articles/getSlices";
import { useFilterMealsQuery, useFilterStaffMealsQuery } from "@/api/feature/meals/getSlice";
import { useFilterMachinesQuery, useFilterMachinesStaffQuery } from "@/api/feature/machines/getSlice";
import { CustomCarousel } from "@/components/home/Carousel";
import { useUserRole } from "@/hooks/useUserRole";
import { useTranslation } from "react-i18next";

export default function Home() {
    const { isStaff, isLoading: roleLoading } = useUserRole();
    const {t} = useTranslation()
    const articlesQuery = isStaff
        ? useFilterStaffArticlesQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading })
        : useFilterArticlesQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading });

    const mealsQuery = isStaff
        ? useFilterStaffMealsQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading })
        : useFilterMealsQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading });

    const machinesQuery = isStaff
        ? useFilterMachinesStaffQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading })
        : useFilterMachinesQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading });

    return (
        <div className="space-y-12 py-8">
            <CustomCarousel
                title={t('customCarousel.typeLabels.articles')}
                data={articlesQuery.data?.data?.values || []}
                isLoading={articlesQuery.isLoading || roleLoading}
                type="articles"
            />

            <CustomCarousel
                title={t('customCarousel.typeLabels.meals')}
                data={mealsQuery.data?.data?.values || []}
                isLoading={mealsQuery.isLoading || roleLoading}
                type="meals"
            />

            <CustomCarousel
                title={t('customCarousel.typeLabels.machines')}
                data={machinesQuery.data?.data?.values || []}
                isLoading={machinesQuery.isLoading || roleLoading}
                type="machines"
            />
        </div>
    );
}