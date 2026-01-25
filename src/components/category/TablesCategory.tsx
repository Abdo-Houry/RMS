"use client";

import { useState } from "react";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { columns } from "./tables/columns";
import { Button } from "../ui/button";
import { useFilterCategoryQuery, useFilterStaffCategoryQuery } from "@/api/feature/category/getSlice";
import AddCategory from "./modules/Add";
import EditCategory from "./modules/Edit";
import DetailsCategory from "./modules/Details";
import Delete from "./modules/Delete";
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from 'react-i18next'
export default function TableCategory() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isStaff, isLoading: roleLoading } = useUserRole();
    // @ts-ignore
    const { hasPermission, hasAnyPermission } = usePermissions();
    const { t } = useTranslation()

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useFilterStaffCategoryQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoading,
        })
        : useFilterCategoryQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: isStaff || roleLoading,
        });

    // State for modals
    const [editing, setEditing] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<string | null>(null);
    const [details, setDetails] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    // Action handlers
    const onEdit = (item: any) => setEditing(item.id);
    const onDelete = (item: any) => setDeleted(item.id);
    const onDetails = (item: any) => setDetails(item.id);

    if (isLoading) return <SkeletonTable />;

    const categoriesData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };
    const canViewARTICLE_CATEGORIES = hasPermission(PERMISSIONS.ARTICLE_CATEGORIES.SHOW);
    const canCreateARTICLE_CATEGORIES = hasPermission(PERMISSIONS.ARTICLE_CATEGORIES.CREATE);
    const canEditARTICLE_CATEGORIES = hasPermission(PERMISSIONS.ARTICLE_CATEGORIES.UPDATE);
    const canDeleteARTICLE_CATEGORIES = hasPermission(PERMISSIONS.ARTICLE_CATEGORIES.DELETE);

    return (
        <div className="p-4 relative">
            {/* إظهار زر الإضافة فقط إذا لم يكن Staff */}
            {canCreateARTICLE_CATEGORIES && !isStaff && (
                <Button onClick={() => setIsAddOpen(true)}>{t('category.table.addCategory')}</Button>
            )}

            {/* Add Modal */}
            {isAddOpen && (
                <AddCategory
                    isOpen={isAddOpen}
                    onOpenChange={(open) => setIsAddOpen(open)}
                />
            )}

            {/* Edit Modal */}
            {editing && (
                <EditCategory
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    categoryId={editing}
                />
            )}

            {/* Delete Modal */}
            {deleted && (
                <Delete
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    categoryId={deleted}
                />
            )}

            {/* Details Modal */}
            {details && (
                <DetailsCategory
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    categoryId={details}
                />
            )}

            {/* Data Table */}
            <DataTable
                columns={columns(onEdit, onDelete, onDetails, canEditARTICLE_CATEGORIES, canDeleteARTICLE_CATEGORIES, canViewARTICLE_CATEGORIES, t)}
                data={categoriesData}
                pagination={pagination}
                onPageChange={(newPage) => setPage(newPage)}
                onSearch={(value) => {
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