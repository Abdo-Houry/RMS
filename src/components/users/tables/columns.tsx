// "use client";

// import { type ColumnDef } from "@tanstack/react-table";
// import DataTableRowActions from "./DataTableRowActions";

// interface User {
//     id: string;
//     userName: string;
//     email: string;
// }

// export const columns = (
//     onDelete: (data: User) => void,
//     onDetails: (data: User) => void,
//     onEdit: (data: User) => void,
//     onEditPer: (data: User) => void,
//     canEdit: boolean = true,
//     canDelete: boolean = true,
//     canView: boolean = true,
//     canSetPermissions: boolean = true
// ): ColumnDef<User>[] => [
//         {
//             accessorKey: "userName",
//             header: "Username",
//             cell: ({ row }) => {
//                 const userName = row.getValue("userName") as string;
//                 return (
//                     <div className="max-w-[200px] truncate" title={userName}>
//                         {userName}
//                     </div>
//                 );
//             },
//         },
//         {
//             accessorKey: "email",
//             header: "Email",
//             cell: ({ row }) => {
//                 const email = row.getValue("email") as string;
//                 return (
//                     <div className="max-w-[250px] truncate" title={email}>
//                         {email}
//                     </div>
//                 );
//             },
//         },
//         {
//             id: "actions",
//             header: "Actions",
//             cell: ({ row }) => (
//                 <DataTableRowActions
//                     data={row.original}
//                     onDelete={onDelete}
//                     onDetails={onDetails}
//                     onEdit={onEdit}
//                     onEditPer={onEditPer}
//                     canEdit={canEdit}
//                     canDelete={canDelete}
//                     canView={canView}
//                     canSetPermissions={canSetPermissions}
//                 />
//             ),
//         },
//     ];
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import DataTableRowActions from "./DataTableRowActions";
import { Eye } from "lucide-react";

interface User {
    id: string;
    userName: string;
    email: string;
}

export const columns = (
    onDelete: (data: User) => void,
    onDetails: (data: User) => void,
    onEdit: (data: User) => void,
    onEditPer: (data: User) => void,
    canEdit: boolean = true,
    canDelete: boolean = true,
    canView: boolean = true,
    canSetPermissions: boolean = true,
    t: (key: string) => string
): ColumnDef<User>[] => [
        {
            accessorKey: "userName",
            header: () => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                // const { t } = require("react-i18next").useTranslation();
                return t('users.table.username');
            },
            cell: ({ row }) => {
                const userName = row.getValue("userName") as string;
                return (
                    <div className="max-w-[200px] truncate" title={userName}>
                        {userName}
                    </div>
                );
            },
        },
        {
            accessorKey: "email",
            header: () => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                // const { t } = require("react-i18next").useTranslation();
                return t('users.table.email');
            },
            cell: ({ row }) => {
                const email = row.getValue("email") as string;
                return (
                    <div className="max-w-[250px] truncate" title={email}>
                        {email}
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
            header: () => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                // const { t } = require("react-i18next").useTranslation();
                return t('users.table.actions');
            },
            cell: ({ row }) => (
                <DataTableRowActions
                    data={row.original}
                    onDelete={onDelete}
                    onDetails={onDetails}
                    onEdit={onEdit}
                    onEditPer={onEditPer}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canView={canView}
                    canSetPermissions={canSetPermissions}
                />
            ),
        },
    ];