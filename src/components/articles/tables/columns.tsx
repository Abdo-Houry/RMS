"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import type { Article } from "@/types/article";
import { Eye } from "lucide-react";
export const columns = (

    onEdit: (data: Article) => void,
    onDelete: (data: Article) => void,
    onDetails: (data: Article) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true,
    t: (key: string) => string
): ColumnDef<Article>[] => [
        {
            accessorKey: "title",
            header: t('articles.table.title'),
            cell: ({ row }) => {
                const title = row.getValue("title") as string;
                return (
                    <div className="max-w-[200px] truncate" title={title}>
                        {title}
                    </div>
                );
            },
        },
        {
            accessorKey: "articleCategoryName",
            header: t('articles.table.category'),
        },
        {
            accessorKey: "images",
            header: t('articles.table.image'),
            cell: ({ row }) => {
                const images = row.getValue("images") as string[];
                const title = row.getValue("title") as string;

                // Get first image from the array
                const firstImage = images && Array.isArray(images) && images.length > 0
                    ? images[0]
                    : null;

                // Build the full URL
                const fullImageUrl = firstImage
                    ? `${import.meta.env.VITE_BASE_URL}/${firstImage}`
                    : null;

                return (
                    <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 relative">
                        {fullImageUrl ? (
                            <>
                                <img
                                    src={fullImageUrl}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // Show placeholder if image fails to load
                                        (e.target as HTMLImageElement).style.display = 'none';
                                        const parent = (e.target as HTMLElement).parentElement;
                                        if (parent) {
                                            parent.innerHTML = `
                                                <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                                    </svg>
                                                </div>
                                            `;
                                        }
                                    }}
                                />
                                {/* Optional: Show badge if there are multiple images */}
                                {/* {images && images.length > 1 && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
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
            header: t('articles.table.actions'),
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