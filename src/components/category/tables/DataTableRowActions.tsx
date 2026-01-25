"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Category } from "@/types/category";
import { MoreHorizontal } from "lucide-react"
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { useTranslation } from 'react-i18next'

interface DataTableRowActionsProps {
    data: Category;
    onEdit: (value: Category) => void;
    onDelete: (value: Category) => void;
    onDetails: (value: Category) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
}

const DataTableRowActions = ({
    data,
    onEdit,
    onDelete,
    onDetails,
    canEdit = true,
    canDelete = true,
    canView = true
}: DataTableRowActionsProps) => {
    const { isStaff } = useUserRole(); // استخدام الـ hook
    const { t } = useTranslation();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {isStaff ? (
                    // إذا كان Staff يظهر فقط Details
                    <DropdownMenuItem onClick={() => onDetails(data)}>
                        {t('category.table.details')}
                    </DropdownMenuItem>
                ) : (
                    // إذا كان Admin يظهر جميع الخيارات
                    <>
                        {canEdit && (
                            <>
                                <DropdownMenuItem onClick={() => onEdit(data)}>
                                    {t('category.table.edit')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canDelete && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => onDelete(data)}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    {t('category.table.delete')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canView && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => onDetails(data)}
                                >
                                    {t('category.table.details')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DataTableRowActions