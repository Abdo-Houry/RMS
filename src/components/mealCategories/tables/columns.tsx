"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import { Eye } from "lucide-react";

export const columns = (
    onEdit: (data: any) => void,
    onDelete: (data: any) => void,
    onDetails: (data: any) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true,
    t: (key: string) => string
): ColumnDef<any>[] => [
        {
            accessorKey: "name",
            header: t('categories.table.name'),
            cell: ({ row }) => {
                const name = row.getValue("name") as string;
                return (
                    <div className="max-w-[200px] truncate" title={name}>
                        {name}
                    </div>
                );
            },
        },
        {
            accessorKey: "mealsCount",
            header: t('categories.table.mealsCount'),
            cell: ({ row }) => {
                const mealsCount = row.getValue("mealsCount") as string;
                return (
                    <div className="max-w-[300px] truncate" title={mealsCount}>
                        {mealsCount || "-"}
                    </div>
                );
            },
        },
        {
            id: "view",
            header: t('categories.table.details'),
            cell: ({ row }) => {
                if (!canView) return null;

                return (
                    <button
                        onClick={() => onDetails(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={t('categories.actions.view') || "View Details"}
                    >
                        <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: t('categories.table.actions'),
            cell: ({ row }) => (
                <DataTableRowActions
                    data={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetails={onDetails}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canView={canView}
                    t={t} // تمرير t هنا
                />
            ),
        },
    ];