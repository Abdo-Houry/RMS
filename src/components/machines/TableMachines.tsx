"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { columns } from "./tables/columns";
import { useFilterMachinesQuery, useFilterMachinesStaffQuery } from "@/api/feature/machines/getSlice";
import { useUserRole } from "@/hooks/useUserRole";
import DeleteMachine from "./modules/Delete";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from 'react-i18next'; // استيراد الترجمة
import { useNavigate } from "react-router-dom";

export default function TableMachines() {
    const navigate = useNavigate();

    const { t } = useTranslation(); // استخدام الترجمة
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isStaff, isLoading: roleLoading } = useUserRole();
    // @ts-ignore
    const { hasPermission, hasAnyPermission } = usePermissions();

    const { data, isLoading } = isStaff
        ? useFilterMachinesStaffQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoading,
        })
        : useFilterMachinesQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: isStaff || roleLoading,
        });

    // const [editing, setEditing] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<string | null>(null);
    // const [details, setDetails] = useState<string | null>(null);
    // const [isAddOpen, setIsAddOpen] = useState(false);

    // const onEdit = (row: any) => setEditing(row.id);
    const onDelete = (row: any) => setDeleted(row.id);
    // const onDetails = (row: any) => setDetails(row.id);
    const onDetails = (row: any) => {
        navigate(`/machines/details/${row.id}`);
    };

    const onEdit = (row: any) => {
        navigate(`/machines/edit/${row.id}`);
    };
    if (isLoading) return <SkeletonTable />;

    const machines = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };

    const canViewMACHINES = hasPermission(PERMISSIONS.MACHINES.SHOW);
    const canCreateMACHINES = hasPermission(PERMISSIONS.MACHINES.CREATE);
    const canEditMACHINES = hasPermission(PERMISSIONS.MACHINES.UPDATE);
    const canDeleteMACHINES = hasPermission(PERMISSIONS.MACHINES.DELETE);
    // return (
    //     <div className="p-4 relative">
    //         {canCreateMACHINES && !isStaff && (
    //             <Button onClick={() => navigate("/machines/add")}>
    //                 {t('machines.table.addMachine')}
    //             </Button>
    //         )}
    //         {/* {canCreateMACHINES && !isStaff && (
    //             <Button onClick={() => setIsAddOpen(true)}>
    //                 {t('machines.table.addMachine')}
    //             </Button>
    //         )} */}

    //         {/* {isAddOpen && (
    //             <AddMachine
    //                 isOpen={isAddOpen}
    //                 onOpenChange={(open) => setIsAddOpen(open)}
    //             />
    //         )} */}

    //         {editing && (
    //             <EditMachine
    //                 isOpen={!!editing}
    //                 onOpenChange={(open) => !open && setEditing(null)}
    //                 machineId={editing}
    //             />
    //         )}

    //         {deleted && (
    //             <DeleteMachine
    //                 isOpen={!!deleted}
    //                 onOpenChange={(open) => !open && setDeleted(null)}
    //                 machineId={deleted}
    //             />
    //         )}

    //         {details && (
    //             <DetailsMachine
    //                 isOpen={!!details}
    //                 onOpenChange={(open) => !open && setDetails(null)}
    //                 machineId={details}
    //             />
    //         )}

    //         <DataTable
    //             columns={columns(onEdit, onDelete, onDetails, canEditMACHINES, canDeleteMACHINES, canViewMACHINES, t)}
    //             data={machines}
    //             pagination={pagination}
    //             onPageChange={(newPage: number) => setPage(newPage)}
    //             onSearch={(value: string) => {
    //                 setSearch(value);
    //                 setPage(1);
    //             }}
    //             onEdit={onEdit}
    //             onDelete={onDelete}
    //             onDetails={onDetails}
    //         />
    //     </div>
    // );

    return (
        <div className="p-4 relative">
            {isLoading ? (
                <SkeletonTable />
            ) : (
                <>
                    {canCreateMACHINES && !isStaff && (
                        <Button onClick={() => navigate("/machines/add")}>
                            {t('machines.table.addMachine')}
                        </Button>
                    )}

                    {/* {editing && (
                        <EditMachine
                            isOpen={!!editing}
                            onOpenChange={(open) => !open && setEditing(null)}
                            machineId={editing}
                        />
                    )} */}

                    {deleted && (
                        <DeleteMachine
                            isOpen={!!deleted}
                            onOpenChange={(open) => !open && setDeleted(null)}
                            machineId={deleted}
                        />
                    )}

                    {/* {details && (
                        <DetailsMachine
                            isOpen={!!details}
                            onOpenChange={(open) => !open && setDetails(null)}
                            machineId={details}
                        />
                    )} */}

                    <DataTable
                        columns={columns(
                            onEdit,
                            onDelete,
                            onDetails,
                            canEditMACHINES,
                            canDeleteMACHINES,
                            canViewMACHINES,
                            t
                        )}
                        data={machines}
                        pagination={pagination}
                        onPageChange={(newPage: number) => setPage(newPage)}
                        onSearch={(value: string) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDetails={onDetails}
                    />
                </>
            )}
        </div>
    );


}