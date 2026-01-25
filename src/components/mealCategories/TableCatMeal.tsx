// "use client";

// import { useState } from "react";
// import SkeletonTable from "../Ingredients/tables/SkeletonTable";
// import { DataTable } from "@/components/Ingredients/tables/data-table";
// import { columns } from "./tables/columns";

// import { Button } from "@/components/ui/button";

// import AddCategoryMeal from "./modules/Add";
// import EditCategoryMeal from "./modules/Edit";
// import DeleteCategoryMeal from "./modules/Delete";
// import DetailsCategoryMeal from "./modules/Details";
// import { useFilterCategoryMealQuery, useFilterCategoryMealStaffQuery } from "@/api/feature/mealCategories/getSlice";
// import { useUserRole } from "@/hooks/useUserRole";
// import { usePermissions } from "@/hooks/usePermissions";
// import { PERMISSIONS } from "@/constants/permissions";
// export default function TableCategoryMeal() {
//     const [page, setPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const { isStaff, isLoading: roleLoading } = useUserRole();
//     const { hasPermission, hasAnyPermission } = usePermissions();

//     // استخدام الاستعلام المناسب بناءً على دور المستخدم
//     const { data, isLoading } = isStaff
//         ? useFilterCategoryMealStaffQuery({
//             page,
//             size: 10,
//             key: search || undefined,
//         }, {
//             skip: !isStaff || roleLoading,
//         })
//         : useFilterCategoryMealQuery({
//             page,
//             size: 10,
//             key: search || undefined,
//         }, {
//             skip: isStaff || roleLoading,
//         });

//     const [editing, setEditing] = useState<string | null>(null);
//     const [deleted, setDeleted] = useState<string | null>(null);
//     const [details, setDetails] = useState<string | null>(null);
//     const [isAddOpen, setIsAddOpen] = useState(false);

//     const onEdit = (data: any) => setEditing(data.id);
//     const onDelete = (data: any) => setDeleted(data.id);
//     const onDetails = (data: any) => setDetails(data.id);

//     if (isLoading) return <SkeletonTable />;

//     const rows = data?.data?.values || [];
//     const totalPages = data?.data?.pages || 1;

//     const pagination = {
//         current_page: page,
//         total_pages: totalPages,
//         has_prev: page > 1,
//         has_next: page < totalPages,
//     };
//     const canViewMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.SHOW);
//     const canCreateMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.CREATE);
//     const canEditMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.UPDATE);
//     const canDeleteMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.DELETE);

//     return (
//         <div className="p-4 relative">
//             {/* إظهار زر الإضافة فقط إذا لم يكن Staff */}
//             {canCreateMEAL_CATEGORIES && !isStaff && (
//                 <Button onClick={() => setIsAddOpen(true)}>Add Category</Button>
//             )}

//             {isAddOpen && (
//                 <AddCategoryMeal
//                     isOpen={isAddOpen}
//                     onOpenChange={(open: boolean) => setIsAddOpen(open)}
//                 />
//             )}

//             {editing && (
//                 <EditCategoryMeal
//                     isOpen={!!editing}
//                     onOpenChange={(open) => !open && setEditing(null)}
//                     categoryMealId={editing}
//                 />
//             )}

//             {deleted && (
//                 <DeleteCategoryMeal
//                     isOpen={!!deleted}
//                     onOpenChange={(open) => !open && setDeleted(null)}
//                     categoryMealId={deleted}
//                 />
//             )}

//             {details && (
//                 <DetailsCategoryMeal
//                     isOpen={!!details}
//                     onOpenChange={(open) => !open && setDetails(null)}
//                     categoryMealId={details}
//                 />
//             )}

//             <DataTable
//                 columns={columns(onEdit, onDelete, onDetails, canEditMEAL_CATEGORIES, canDeleteMEAL_CATEGORIES, canViewMEAL_CATEGORIES)}
//                 data={rows}
//                 pagination={pagination}
//                 onPageChange={setPage}
//                 onSearch={(value: string) => {
//                     setSearch(value);
//                     setPage(1);
//                 }}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//                 onDetails={onDetails}
//             />
//         </div>
//     );
// }
"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import SkeletonTable from "../Ingredients/tables/SkeletonTable";
import { columns } from "./tables/columns";
import { Button } from "@/components/ui/button";
import AddCategoryMeal from "./modules/Add";
import EditCategoryMeal from "./modules/Edit";
import DeleteCategoryMeal from "./modules/Delete";
import DetailsCategoryMeal from "./modules/Details";
import { useFilterCategoryMealQuery, useFilterCategoryMealStaffQuery } from "@/api/feature/mealCategories/getSlice";
import { useUserRole } from "@/hooks/useUserRole";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { DataTable } from "./tables/data-table";

export default function TableCategoryMeal() {
    // @ts-ignore
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isStaff, isLoading: roleLoading } = useUserRole();
    const { hasPermission } = usePermissions();

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useFilterCategoryMealStaffQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoading,
        })
        : useFilterCategoryMealQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: isStaff || roleLoading,
        });

    const [editing, setEditing] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<string | null>(null);
    const [details, setDetails] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const onEdit = (data: any) => {
        setEditing(data.id);
    };

    const onDelete = (data: any) => {
        setDeleted(data.id);
    };

    const onDetails = (data: any) => {
        // navigate(`/category-meal/${data.id}`);
        setDetails(data.id);
    };

    if (isLoading) return <SkeletonTable />;

    const rows = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };

    const canViewMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.SHOW);
    const canCreateMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.CREATE);
    const canEditMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.UPDATE);
    const canDeleteMEAL_CATEGORIES = hasPermission(PERMISSIONS.MEAL_CATEGORIES.DELETE);

    return (
        <div className="p-4 relative">
            {canCreateMEAL_CATEGORIES && !isStaff && (
                <Button onClick={() => setIsAddOpen(true)}>
                    {t('categories.table.addCategory')}
                </Button>
            )}

            {isAddOpen && (
                <AddCategoryMeal
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )}

            {editing && (
                <EditCategoryMeal
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    categoryMealId={editing}
                />
            )}

            {deleted && (
                <DeleteCategoryMeal
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    categoryMealId={deleted}
                />
            )}

            {details && (
                <DetailsCategoryMeal
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    categoryMealId={details}
                />
            )}

            <DataTable
                columns={columns(
                    onEdit,
                    onDelete,
                    onDetails,
                    canEditMEAL_CATEGORIES,
                    canDeleteMEAL_CATEGORIES,
                    canViewMEAL_CATEGORIES,
                    t // تمرير t هنا
                )}
                data={rows}
                pagination={pagination}
                onPageChange={(newPage: number) => setPage(newPage)}
                onSearch={(value: string) => {
                    setSearch(value);
                    setPage(1);
                }}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
            />
        </div>
    );
}