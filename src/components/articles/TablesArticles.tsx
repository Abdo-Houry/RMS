"use client";

import { useFilterArticlesQuery, useFilterStaffArticlesQuery } from "@/api/feature/articles/getSlices";
import { useState } from "react";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { columns } from "./tables/columns";
// import AddArticle from "./modules/Add";
import { Button } from "../ui/button";
import Delete from "./modules/Delete";
import Details from "./modules/Details";
import { useUserRole } from "@/hooks/useUserRole";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from 'react-i18next'
export default function TableArticle() {
    const navigate = useNavigate();
    const { t } = useTranslation()
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    // @ts-ignore
    const { isStaff, isAdmin, userRole, isLoading: roleLoading } = useUserRole();
    // @ts-ignore
    const { hasPermission, hasAnyPermission } = usePermissions();
    const { data, isLoading } = isStaff
        ? useFilterStaffArticlesQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoading
        })
        : useFilterArticlesQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: isStaff || roleLoading
        });
    // @ts-ignore
    const [editing, setEditing] = useState<any | null>(null)
    const [deleted, setDeleted] = useState<any | null>(null)
    const [details, setDetails] = useState<any | null>(null)
    // const [isAddOpen, setIsAddOpen] = useState(false);

    // const onEdit = (data: any) => {
    //     setEditing(data.id)
    // }
    const onEdit = (data: any) => {
        navigate(`/articles/edit/${data.id}`);
    }

    const onDelete = (data: any) => {
        setDeleted(data.id)
    }

    const onDetails = (data: any) => {
        // setDetails(data.id)
        navigate(`/article/${data.id}`);
    }

    if (isLoading) return <SkeletonTable />;

    const articlesData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };


    const canViewArticles = hasPermission(PERMISSIONS.ARTICLES.SHOW);
    const canCreateArticles = hasPermission(PERMISSIONS.ARTICLES.CREATE);
    const canEditArticles = hasPermission(PERMISSIONS.ARTICLES.UPDATE);
    const canDeleteArticles = hasPermission(PERMISSIONS.ARTICLES.DELETE);
    return (
        <div className="p-4 relative">
            {/* {canCreateArticles && !isStaff && (
                <Button onClick={() => setIsAddOpen(true)}>
                    {t('articles.table.addArticle')}
                </Button>
            )} */}
            {canCreateArticles && !isStaff && (
                <Button onClick={() => navigate("/articles/create")}>
                    {t("articles.table.addArticle")}
                </Button>
            )}


            {/* {isAddOpen && (
                <AddArticle
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )} */}
            {/* {editing && (
                <Edit
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    articleId={editing}
                />
            )} */}
            {deleted && (
                <Delete
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    articleId={deleted}
                />
            )}
            {details && (
                <Details
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    articleId={details}
                />
            )}

            <DataTable
                columns={columns(onEdit, onDelete, onDetails, canDeleteArticles, canEditArticles, canViewArticles, t)}
                data={articlesData}
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