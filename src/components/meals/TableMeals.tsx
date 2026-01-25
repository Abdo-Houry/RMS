"use client";

import { useState } from "react";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { Button } from "../ui/button";
import { useFilterMealsQuery, useFilterStaffMealsQuery } from "@/api/feature/meals/getSlice";

import DeleteMeal from "./modules/Delete";
import DetailsMeal from "./modules/Details";
import { columns } from "./tables/columns";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from 'react-i18next';

export default function TableMeals() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isStaff, isLoading: roleLoading } = useUserRole();
    // @ts-ignore
    const { hasPermission, hasAnyPermission } = usePermissions();

    const { data, isLoading } = isStaff
        ? useFilterStaffMealsQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoading,
        })
        : useFilterMealsQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: isStaff || roleLoading,
        });
    // @ts-ignore
    const [editing, setEditing] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<string | null>(null);
    const [details, setDetails] = useState<string | null>(null);
    // @ts-ignore
    const [isAddOpen, setIsAddOpen] = useState(false);

    // const onEdit = (data: any) => setEditing(data.id);
    const onEdit = (data: any) => {
        navigate(`/meals/edit/${data.id}`);
    };
    const onDelete = (data: any) => setDeleted(data.id);
    const onDetails = (data: any) => {
        navigate(`/meals/${data.id}`);
    };

    if (isLoading) return <SkeletonTable />;

    const mealsData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };

    const canViewMEALS = hasPermission(PERMISSIONS.MEALS.SHOW);
    const canCreateMEALS = hasPermission(PERMISSIONS.MEALS.CREATE);
    const canEditMEALS = hasPermission(PERMISSIONS.MEALS.UPDATE);
    const canDeleteMEALS = hasPermission(PERMISSIONS.MEALS.DELETE);

    return (
        <div className="p-4 relative">
            {canCreateMEALS && !isStaff && (
                <Button onClick={() => navigate("/meals/add")}>
                    {t('meals.table.addMeal')}
                </Button>
            )}
            {/* {canCreateMEALS && !isStaff && (
                <Button onClick={() => setIsAddOpen(true)}>
                    {t('meals.table.addMeal')}
                </Button>
            )} */}

            {/* {isAddOpen && (
                <AddMeal
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )} */}
            {/* {editing && (
                <EditMeal
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    mealId={editing}
                />
            )} */}
            {deleted && (
                <DeleteMeal
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    mealId={deleted}
                />
            )}
            {details && (
                <DetailsMeal
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    mealId={details}
                />
            )}

            <DataTable
                columns={columns(onEdit, onDelete, onDetails, canEditMEALS, canDeleteMEALS, canViewMEALS, t)}
                data={mealsData}
                pagination={pagination}
                onPageChange={setPage}
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