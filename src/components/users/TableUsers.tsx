// "use client";

// import { useState } from "react";
// import SkeletonTable from "./tables/SkeletonTable";
// import { DataTable } from "./tables/data-table";

// import { Button } from "../ui/button";
// import { useFilterUsersQuery } from "@/api/feature/users/getSlice";
// import { columns } from "./tables/columns";
// import AddUser from "./modules/Add";
// import DeleteUser from "./modules/Delete";
// import DetailsUser from "./modules/Details";
// import EditUser from "./modules/Edit";
// import SetUserPermissions from "./modules/EditPer";
// import { usePermissions } from "@/hooks/usePermissions";
// import { PERMISSIONS } from "@/constants/permissions";
// export default function TableUsers() {
//     const [page, setPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const [role, setRole] = useState("0");

//     const { data, isLoading } = useFilterUsersQuery({
//         page,
//         size: 10,
//         key: search || undefined,
//         role: role !== "0" ? role : undefined,
//     });
//     const { hasPermission, hasAnyPermission } = usePermissions();
//     const [deleted, setDeleted] = useState<string | null>(null);
//     const [edit, setEdit] = useState<string | null>(null);
//     const [editPer, setEditPer] = useState<string | null>(null);
//     const [details, setDetails] = useState<string | null>(null);
//     const [isAddOpen, setIsAddOpen] = useState(false);

//     const onDelete = (data: any) => setDeleted(data.id);
//     const onDetails = (data: any) => setDetails(data.id);
//     const onEdit = (data: any) => setEdit(data.id);
//     const onEditPer = (data: any) => setEditPer(data.id);

//     if (isLoading) return <SkeletonTable />;

//     const usersData = data?.data?.values || [];
//     const totalPages = data?.data?.pages || 1;

//     const pagination = {
//         current_page: page,
//         total_pages: totalPages,
//         has_prev: page > 1,
//         has_next: page < totalPages,
//     };
//     const canViewUSERS = hasPermission(PERMISSIONS.USERS.SHOW);
//     const canCreateUSERS = hasPermission(PERMISSIONS.USERS.CREATE);
//     const canEditUSERS = hasPermission(PERMISSIONS.USERS.UPDATE);
//     const canDeleteUSERS = hasPermission(PERMISSIONS.USERS.DELETE);
//     const canSetPermissionsUSERS = hasPermission(PERMISSIONS.USERS.SET_PERMISSIONS);
//     return (
//         <div className="p-4 relative">
//             {
//                 canCreateUSERS && (
//                     <Button onClick={() => setIsAddOpen(true)}>Add User</Button>
//                 )
//             }

//             {isAddOpen && (
//                 <AddUser
//                     isOpen={isAddOpen}
//                     onOpenChange={(open: boolean) => setIsAddOpen(open)}
//                 />
//             )}
//             {deleted && (
//                 <DeleteUser
//                     isOpen={!!deleted}
//                     onOpenChange={(open) => !open && setDeleted(null)}
//                     userId={deleted}
//                 />
//             )}
//             {edit && (
//                 <EditUser
//                     isOpen={!!edit}
//                     onOpenChange={(open) => !open && setEdit(null)}
//                     userId={edit}
//                 />
//             )}
//             {editPer && (
//                 <SetUserPermissions
//                     isOpen={!!editPer}
//                     onOpenChange={(open) => !open && setEditPer(null)}
//                     userId={editPer}
//                 />
//             )}
//             {details && (
//                 <DetailsUser
//                     isOpen={!!details}
//                     onOpenChange={(open) => !open && setDetails(null)}
//                     userId={details}
//                 />
//             )}

//             <DataTable
//                 columns={columns(onDelete, onDetails, onEdit, onEditPer, canDeleteUSERS, canEditUSERS, canViewUSERS, canSetPermissionsUSERS)}
//                 data={usersData}
//                 pagination={pagination}
//                 onPageChange={setPage}
//                 onSearch={(value: string) => {
//                     setSearch(value);
//                     setPage(1);
//                 }}
//                 onRoleFilter={(value: string) => {
//                     setRole(value);
//                     setPage(1);
//                 }}
//                 onDelete={onDelete}
//                 onDetails={onDetails}
//                 onEdit={onEdit}
//                 onEditPer={onEditPer}
//             />
//         </div>
//     );
// }
"use client";

import { useState } from "react";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { Button } from "../ui/button";
import { useFilterUsersQuery } from "@/api/feature/users/getSlice";
import { columns } from "./tables/columns";
import AddUser from "./modules/Add";
import DeleteUser from "./modules/Delete";
import DetailsUser from "./modules/Details";
import EditUser from "./modules/Edit";
import SetUserPermissions from "./modules/EditPer";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from "react-i18next";

export default function TableUsers() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("0");

    const { data, isLoading } = useFilterUsersQuery({
        page,
        size: 10,
        key: search || undefined,
        role: role !== "0" ? role : undefined,
    });
    const { hasPermission } = usePermissions();
    const [deleted, setDeleted] = useState<string | null>(null);
    const [edit, setEdit] = useState<string | null>(null);
    const [editPer, setEditPer] = useState<string | null>(null);
    const [details, setDetails] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const onDelete = (data: any) => setDeleted(data.id);
    const onDetails = (data: any) => setDetails(data.id);
    const onEdit = (data: any) => setEdit(data.id);
    const onEditPer = (data: any) => setEditPer(data.id);

    if (isLoading) return <SkeletonTable />;

    const usersData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };

    const canViewUSERS = hasPermission(PERMISSIONS.USERS.SHOW);
    const canCreateUSERS = hasPermission(PERMISSIONS.USERS.CREATE);
    const canEditUSERS = hasPermission(PERMISSIONS.USERS.UPDATE);
    const canDeleteUSERS = hasPermission(PERMISSIONS.USERS.DELETE);
    const canSetPermissionsUSERS = hasPermission(PERMISSIONS.USERS.SET_PERMISSIONS);

    return (
        <div className="p-4 relative">
            {canCreateUSERS && (
                <Button onClick={() => setIsAddOpen(true)}>
                    {t('users.table.addUser')}
                </Button>
            )}

            {isAddOpen && (
                <AddUser
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )}
            {deleted && (
                <DeleteUser
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    userId={deleted}
                />
            )}
            {edit && (
                <EditUser
                    isOpen={!!edit}
                    onOpenChange={(open) => !open && setEdit(null)}
                    userId={edit}
                />
            )}
            {editPer && (
                <SetUserPermissions
                    isOpen={!!editPer}
                    onOpenChange={(open) => !open && setEditPer(null)}
                    userId={editPer}
                />
            )}
            {details && (
                <DetailsUser
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    userId={details}
                />
            )}

            <DataTable
                columns={columns(onDelete, onDetails, onEdit, onEditPer, canDeleteUSERS, canEditUSERS, canViewUSERS, canSetPermissionsUSERS, t)}
                data={usersData}
                pagination={pagination}
                onPageChange={setPage}
                onSearch={(value: string) => {
                    setSearch(value);
                    setPage(1);
                }}
                onRoleFilter={(value: string) => {
                    setRole(value);
                    setPage(1);
                }}
                onDetails={onDetails}
            />
        </div>
    );
}