"use client";

import { useState } from "react";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { columns } from "./tables/columns";
import { Button } from "../ui/button";
import { useFilterIngredientsQuery, useFilterStaffIngredientsQuery } from "@/api/feature/Ingredients/getSlice";
import AddIngredient from "./modules/Add";
import EditIngredient from "./modules/Edit";
import DeleteIngredient from "./modules/Delete";
import DetailsIngredient from "./modules/Details";
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from "react-i18next";
export default function TableIngredients() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isStaff, isLoading: roleLoading } = useUserRole(); // استخدام الـ hook
    const { hasPermission } = usePermissions();
    const { t } = useTranslation();

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useFilterStaffIngredientsQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoading,
        })
        : useFilterIngredientsQuery({
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

    const onEdit = (data: any) => setEditing(data.id);
    const onDelete = (data: any) => setDeleted(data.id);
    const onDetails = (data: any) => setDetails(data.id);

    if (isLoading) return <SkeletonTable />;

    const ingredientsData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };
    const canViewINGREDIENTS = hasPermission(PERMISSIONS.INGREDIENTS.SHOW);
    const canCreateINGREDIENTS = hasPermission(PERMISSIONS.INGREDIENTS.CREATE);
    const canEditINGREDIENTS = hasPermission(PERMISSIONS.INGREDIENTS.UPDATE);
    const canDeleteINGREDIENTS = hasPermission(PERMISSIONS.INGREDIENTS.DELETE);

    return (
        <div className="p-4 relative">
            {/* إظهار زر الإضافة فقط إذا لم يكن Staff */}
            {canCreateINGREDIENTS && !isStaff && (
                <Button onClick={() => setIsAddOpen(true)}>{t('ingredients.table.addIngredient')}</Button>
            )}

            {isAddOpen && (
                <AddIngredient
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )}
            {editing && (
                <EditIngredient
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    ingredientId={editing}
                />
            )}
            {deleted && (
                <DeleteIngredient
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    ingredientId={deleted}
                />
            )}
            {details && (
                <DetailsIngredient
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    ingredientId={details}
                />
            )}

            <DataTable
                columns={columns(t, onEdit, onDelete, onDetails, canEditINGREDIENTS, canDeleteINGREDIENTS, canViewINGREDIENTS)}
                data={ingredientsData}
                pagination={pagination}
                onPageChange={setPage}
                onSearch={(value: string) => {
                    setSearch(value);
                    setPage(1);
                }}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
                t={t}
            />
        </div>
    );
}