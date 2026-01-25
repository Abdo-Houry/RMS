// import { useFilterArticlesQuery } from "@/api/feature/articles/getSlices";
// import { useFilterCategoryMealQuery } from "@/api/feature/mealCategories/getSlice";
// import { useFilterMealsQuery } from "@/api/feature/meals/getSlice";
// import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
// import DashboardSkeleton from "@/components/dashboard/Skeleton";

// export default function Dashboard() {
//     const {
//         data: articlesData,
//         isLoading: articlesLoading
//     } = useFilterArticlesQuery({
//         page: 1,
//         size: 200,
//         key: undefined,
//     });

//     const {
//         data: mealsData,
//         isLoading: mealsLoading
//     } = useFilterMealsQuery({
//         page: 1,
//         size: 200,
//         key: undefined,
//     });

//     const {
//         data: categoriesData,
//         isLoading: categoriesLoading
//     } = useFilterCategoryMealQuery({
//         page: 1,
//         size: 200,
//         key: undefined,
//     });

//     if (articlesLoading || mealsLoading || categoriesLoading) {
//         return <div><DashboardSkeleton /></div>;
//     }

//     return (
//         <div className="container mx-auto p-6">
//             <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
//             <DashboardCharts
//                 articlesData={articlesData}
//                 mealsData={mealsData}
//                 categoriesData={categoriesData}
//             />
//         </div>
//     );
// }
// Dashboard.tsx
import { useFilterArticlesQuery, useFilterStaffArticlesQuery } from "@/api/feature/articles/getSlices";
import { useFilterCategoryMealQuery, useFilterCategoryMealStaffQuery } from "@/api/feature/mealCategories/getSlice";
import { useFilterMealsQuery, useFilterStaffMealsQuery } from "@/api/feature/meals/getSlice";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import DashboardSkeleton from "@/components/dashboard/Skeleton";
import { useUserRole } from "@/hooks/useUserRole";

export default function Dashboard() {
    const { isStaff, isLoading: roleLoading } = useUserRole();

    // استخدام الاستعلام المناسب بناءً على الدور
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

    const categoriesQuery = isStaff
        ? useFilterCategoryMealStaffQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading })
        : useFilterCategoryMealQuery({
            page: 1,
            size: 200,
            key: undefined,
        }, { skip: roleLoading });

    if (roleLoading || articlesQuery.isLoading || mealsQuery.isLoading || categoriesQuery.isLoading) {
        return <div><DashboardSkeleton /></div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <DashboardCharts
                articlesData={articlesQuery.data}
                mealsData={mealsQuery.data}
                categoriesData={categoriesQuery.data}
            />
        </div>
    );
}