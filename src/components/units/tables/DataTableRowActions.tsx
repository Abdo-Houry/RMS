// "use client"

// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import type { Unit } from "@/types/Units";
// import { MoreHorizontal } from "lucide-react"
// import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook

// interface DataTableRowActionsProps {
//     data: Unit;
//     onEdit: (value: Unit) => void;
//     onDelete: (value: Unit) => void;
//     onDetails: (value: Unit) => void;
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
import type { Unit } from "@/types/Units";
import { MoreHorizontal } from "lucide-react"
import { useUserRole } from "@/hooks/useUserRole";

interface DataTableRowActionsProps {
    data: Unit;
    onEdit: (value: Unit) => void;
    onDelete: (value: Unit) => void;
    onDetails: (value: Unit) => void;
    canEdit?: boolean;
    canDelete?: boolean;
    canView?: boolean;
    t?: (key: string) => string;
}

const DataTableRowActions = ({
    data,
    onEdit,
    onDelete,
    onDetails,
    canEdit = true,
    canDelete = true,
    canView = true,
    t
}: DataTableRowActionsProps) => {
    const { isStaff } = useUserRole();

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
                        {t ? t("units.table.details") : "Details"}
                    </DropdownMenuItem>
                ) : (
                    <>
                        {canEdit && (
                            <>
                                <DropdownMenuItem onClick={() => onEdit(data)}>
                                    {t ? t("units.table.edit") : "Edit"}
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
                                    {t ? t("units.table.delete") : "Delete"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                            </>
                        )}
                        {canView && (
                            <>
                                <DropdownMenuItem
                                    onClick={() => onDetails(data)}
                                >
                                    {t ? t("units.table.details") : "Details"}
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