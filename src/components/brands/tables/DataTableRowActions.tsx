// "use client"

// import { Button } from "@/components/ui/button"
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import type { Brand } from "@/types/brands";
// import { MoreHorizontal } from "lucide-react"

// interface DataTableRowActionsProps {
//     data: Brand;
//     onEdit: (value: Brand) => void;
//     onDelete: (value: Brand) => void;
//     onDetails: (value: Brand) => void;
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
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
//                     <MoreHorizontal className="h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//                 {canEdit && (
//                     <>
//                         <DropdownMenuItem onClick={() => onEdit(data)}>
//                             Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                     </>
//                 )}
//                 {canDelete && (
//                     <>
//                         <DropdownMenuItem
//                             onClick={() => onDelete(data)}
//                             className="text-red-600 focus:text-red-600"
//                         >
//                             Delete
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
//                     </>
//                 )}
//                 {canView && (
//                     <>
//                         <DropdownMenuItem
//                             onClick={() => onDetails(data)}
//                         >
//                             Details
//                         </DropdownMenuItem>
//                         <DropdownMenuSeparator />
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
import type { Brand } from "@/types/brands";
import { MoreHorizontal } from "lucide-react"

interface DataTableRowActionsProps {
    data: Brand;
    onEdit: (value: Brand) => void;
    onDelete: (value: Brand) => void;
    onDetails: (value: Brand) => void;
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
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {canEdit && (
                    <>
                        <DropdownMenuItem onClick={() => onEdit(data)}>
                            {t ? t("brands.table.edit") : "Edit"}
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
                            {t ? t("brands.table.delete") : "Delete"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
                {canView && (
                    <>
                        <DropdownMenuItem
                            onClick={() => onDetails(data)}
                        >
                            {t ? t("brands.table.details") : "Details"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default DataTableRowActions