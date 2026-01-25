"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import type { Meal } from "@/types/Meal";
import { Eye } from "lucide-react";

export const columns = (
    onEdit: (data: Meal) => void,
    onDelete: (data: Meal) => void,
    onDetails: (data: Meal) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true,
    t: (key: string) => string
): ColumnDef<Meal>[] => [
        {
            accessorKey: "name",
            header: t('meals.table.name'),
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
            id: "images",
            header: t('meals.table.image'),
            cell: ({ row }) => {
                const images = row.original.images;
                const name = row.original.name;
                const sortedImages = images && Array.isArray(images)
                    ? [...images].sort((a, b) => a.index - b.index)
                    : [];
                const firstImage = sortedImages.length > 0 ? sortedImages[0] : null;
                const fullImageUrl = firstImage?.image
                    ? `${import.meta.env.VITE_BASE_URL || ''}/${firstImage.image}`
                    : null;

                return (
                    <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 relative">
                        {fullImageUrl ? (
                            <>
                                <img
                                    src={fullImageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const imgElement = e.target as HTMLImageElement;
                                        imgElement.style.display = 'none';
                                        const parent = imgElement.parentElement;
                                        if (parent) {
                                            const placeholder = document.createElement('div');
                                            placeholder.className = 'w-full h-full flex items-center justify-center bg-gray-100';
                                            placeholder.innerHTML = `
                                                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                </svg>
                                            `;
                                            parent.appendChild(placeholder);
                                        }
                                    }}
                                />
                                {/* {images && images.length > 1 && (
                                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-[9px] font-medium rounded-full w-5 h-5 flex items-center justify-center border border-white shadow-sm">
                                        +{images.length - 1}
                                    </div>
                                )} */}
                            </>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                        )}
                    </div>
                );
            },
        },
        {
            accessorKey: "mealCategoryName",
            header: t('meals.table.category'),
        },
        {
            id: "view",
            header: t('meals.table.details'),
            cell: ({ row }) => {
                if (!canView) return null;

                return (
                    <button
                        onClick={() => onDetails(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={t('meals.actions.view') || "View Details"}
                    >
                        <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: t('meals.table.actions'),
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