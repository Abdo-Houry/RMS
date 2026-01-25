// "use client"

// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { MoreHorizontal } from "lucide-react"
// import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook

// interface DataTableRowActionsProps {
//     data: any;
//     onEdit: (value: any) => void;
//     onDelete: (value: any) => void;
//     onDetails: (value: any) => void;
//     canEdit?: boolean;
//     canDelete?: boolean;
//     canView?: boolean;
// }

// const DataTableRowActions = ({
//     data,
//     onEdit,
//     onDelete,
//     onDetails,
//     canEdit = true,
//     canDelete = true,
//     canView = true
// }: DataTableRowActionsProps) => {
//     const { isStaff } = useUserRole(); // استخدام الـ hook

//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
//                     <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 {isStaff ? (
//                     // إذا كان Staff يظهر فقط Details
//                     <DropdownMenuItem onClick={() => onDetails(data)}>
//                         Details
//                     </DropdownMenuItem>
//                 ) : (
//                     // إذا كان Admin يظهر جميع الخيارات
//                     <>
//                         {canEdit && (
//                             <>
//                                 <DropdownMenuItem onClick={() => onEdit(data)}>
//                                     Edit
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                             </>
//                         )}
//                         {canDelete && (
//                             <>
//                                 <DropdownMenuItem
//                                     onClick={() => onDelete(data)}
//                                     className="text-red-600 focus:text-red-600"
//                                 >
//                                     Delete
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                             </>
//                         )}
//                         {canView && (
//                             <>
//                                 <DropdownMenuItem
//                                     onClick={() => onDetails(data)}
//                                 >
//                                     Details
//                                 </DropdownMenuItem>
//                                 <DropdownMenuSeparator />
//                             </>
//                         )}
//                     </>
//                 )}
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// }

// export default DataTableRowActions
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
import { useTranslation } from 'react-i18next'
interface DataTableRowActionsProps {
    data: any;
    onEdit: (value: any) => void;
    onDelete: (value: any) => void;
    onDetails: (value: any) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
    t: (key: string) => string;
}

const DataTableRowActions = ({
    data,
    onEdit,
    onDelete,
    onDetails,
    canEdit = true,
    canDelete = true,
    canView = true,
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
                    <DropdownMenuItem onClick={() => onDetails(data)}>
                        {t('categories.table.details')}
                    </DropdownMenuItem>
                ) : (
                    <>
                        {canEdit && (
                            <>
                                <DropdownMenuItem onClick={() => onEdit(data)}>
                                    {t('categories.table.edit')}
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
                                    {t('categories.table.delete')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canView && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => onDetails(data)}
                                >
                                    {t('categories.table.details')}
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

export default DataTableRowActions;