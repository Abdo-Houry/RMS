"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import type { Category } from "@/types/category";
import { Eye } from "lucide-react";



export const columns = (
    onEdit: (data: Category) => void,
    onDelete: (data: Category) => void,
    onDetails: (data: Category) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true,
    t: (key: string) => string
): ColumnDef<Category>[] => [
        {
            accessorKey: "name",
            header: t('category.table.name'),
            cell: ({ row }) => {
                const name = row.getValue("name") as string;
                return (
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                        {name}
                    </div>
                );
            },
        },
        {
            accessorKey: "articlesCount",
            header: t('category.table.articlesCount'),
            cell: ({ row }) => {
                const count = row.getValue("articlesCount") as number;
                return (
                    <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 font-medium">
                        {count}
                    </span>
                );
            },
        },
        {
            id: "view",
            header: t('articles.table.details'),
            cell: ({ row }) => {
                if (!canView) return null;

                return (
                    <button
                        onClick={() => onDetails(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={t('articles.actions.view') || "View Details"}
                    >
                        <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: t('category.table.actions'),
            cell: ({ row }) => (
                <DataTableRowActions
                    data={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetails={onDetails}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canView={canView}
                />
            ),
        },
    ];
