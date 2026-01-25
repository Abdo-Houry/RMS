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
// import { useUserRole } from "@/hooks/useUserRole";
// interface User {
//     id: string;
//     userName: string;
//     email: string;
// }
// interface DataTableRowActionsProps {
//     data: User;
//     onDelete: (value: User) => void;
//     onDetails: (value: User) => void;
//     onEdit: (value: User) => void;
//     onEditPer: (value: User) => void;
//     canEdit?: boolean;
//     canDelete?: boolean;
//     canView?: boolean;
//     canSetPermissions?: boolean;
// }

// const DataTableRowActions = ({
//     data,
//     onDelete,
//     onDetails,
//     onEdit,
//     onEditPer,
//     canEdit = true,
//     canDelete = true,
//     canView = true,
//     canSetPermissions = true
// }: DataTableRowActionsProps) => {
//     const { isStaff } = useUserRole();

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
//                         {canSetPermissions && (
//                             <>
//                                 <DropdownMenuItem onClick={() => onEditPer(data)}>
//                                     Edit Permissions
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
import { useTranslation } from "react-i18next";

interface User {
    id: string;
    userName: string;
    email: string;
}

interface DataTableRowActionsProps {
    data: User;
    onDelete: (value: User) => void;
    onDetails: (value: User) => void;
    onEdit: (value: User) => void;
    onEditPer: (value: User) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
    canSetPermissions?: boolean;
}

const DataTableRowActions = ({
    data,
    onDelete,
    onDetails,
    onEdit,
    onEditPer,
    canEdit = true,
    canDelete = true,
    canView = true,
    canSetPermissions = true
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
                        {t('users.actions.details')}
                    </DropdownMenuItem>
                ) : (
                    // إذا كان Admin يظهر جميع الخيارات
                    <>
                        {canEdit && (
                            <>
                                <DropdownMenuItem onClick={() => onEdit(data)}>
                                    {t('users.actions.edit')}
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
                                    {t('users.actions.delete')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canView && (
                            <>
                                <DropdownMenuItem onClick={() => onDetails(data)}>
                                    {t('users.actions.details')}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canSetPermissions && (
                            <DropdownMenuItem onClick={() => onEditPer(data)}>
                                {t('users.actions.editPermissions')}
                            </DropdownMenuItem>
                        )}
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DataTableRowActions;