"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import type { Ingredient } from "@/types/Ingredients";
import { Eye } from "lucide-react";

export const columns = (
    t: (key: string) => string,
    onEdit: (data: Ingredient) => void,
    onDelete: (data: Ingredient) => void,
    onDetails: (data: Ingredient) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true
): ColumnDef<Ingredient>[] => [
        {
            accessorKey: "name",
            header: t('ingredients.table.name'),
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
            accessorKey: "images",
            header: t('ingredients.table.image'),
            cell: ({ row }) => {
                const images = row.getValue("images") as string[];
                const name = row.getValue("name") as string;
                const imagePath = row.original.imagePath as string; // للحفاظ على التوافق مع البيانات القديمة

                // التعامل مع البيانات الجديدة (مصفوفة images) والقديمة (imagePath)
                let firstImage: string | null = null;

                if (images && Array.isArray(images) && images.length > 0) {
                    // البيانات الجديدة
                    firstImage = images[0];
                } else if (imagePath) {
                    // البيانات القديمة
                    firstImage = imagePath;
                }

                // بناء رابط الصورة الكامل
                const fullImageUrl = firstImage
                    ? `${import.meta.env.VITE_BASE_URL}/${firstImage}`
                    : null;

                // حساب عدد الصور الإضافية
                // const additionalImagesCount = images && Array.isArray(images)
                //     ? images.length - 1
                //     : 0;

                return (
                    <div className="w-12 h-12 rounded overflow-hidden border border-gray-200 relative">
                        {fullImageUrl ? (
                            <>
                                <img
                                    src={fullImageUrl}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        // عرض عنصر نائب إذا فشل تحميل الصورة
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
                                {/* عرض شارة إذا كان هناك صور متعددة */}
                                {/* {additionalImagesCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-[10px] rounded-full w-6 h-6 flex items-center justify-center border-2 border-white">
                                        +{additionalImagesCount}
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
            header: t('ingredients.table.details'),
            cell: ({ row }) => {
                if (!canView) return null;

                return (
                    <button
                        onClick={() => onDetails(row.original)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title={t('ingredients.actions.view') || "View Details"}
                    >
                        <Eye className="w-5 h-5 text-blue-600" />
                    </button>
                );
            },
        },
        {
            id: "actions",
            header: t('ingredients.table.actions'),
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