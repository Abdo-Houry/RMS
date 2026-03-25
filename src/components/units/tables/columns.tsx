"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import type { Unit } from "@/types/Units";
import { Eye } from "lucide-react";

export const columns = (
    onEdit: (data: Unit) => void,
    onDelete: (data: Unit) => void,
    onDetails: (data: Unit) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true,
    t?: (key: string) => string
): ColumnDef<Unit>[] => [
        {
            accessorKey: "name",
            header: t ? t("units.table.name") : "Name",
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
            id: "view",
            header: t ? t('units.table.details') : "Details",
            cell: ({ row }) => {
                if (!canView) return null;

                return (
                    <button
                        onClick={() => onDetails(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={t ? t('units.table.details') : "Details"}
                    >
                        <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: t ? t("units.table.actions") : "Actions",
            cell: ({ row }) => (
                <DataTableRowActions
                    data={row.original}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onDetails={onDetails}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canView={canView}
                    t={t}
                />
            ),
        },
    ];