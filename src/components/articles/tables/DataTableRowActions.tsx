"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { useUserRole } from "@/hooks/useUserRole";
import type { Article } from "@/types/article";
import { useTranslation } from 'react-i18next'

interface DataTableRowActionsProps {
    data: Article;
    onEdit: (value: Article) => void;
    onDelete: (value: Article) => void;
    onDetails: (value: Article) => void;
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
    const { isStaff } = useUserRole();
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
                        {t('articles.table.details')}
                    </DropdownMenuItem>
                ) : (
                    // إذا كان Admin يظهر جميع الخيارات
                    <>
                        {canEdit && (
                            <>
                                <DropdownMenuItem onClick={() => onEdit(data)}>
                                    {t('articles.table.edit')}
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
                                    {t('articles.table.delete')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canView && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => onDetails(data)}
                                >
                                    {t('articles.table.details')}
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