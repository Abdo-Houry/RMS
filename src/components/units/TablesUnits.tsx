// "use client";

// import { useState } from "react";
// import SkeletonTable from "./tables/SkeletonTable";
// import { DataTable } from "./tables/data-table";

// import { Button } from "../ui/button";
// import { useFilterUnitsQuery, useFilterStaffUnitsQuery } from "@/api/feature/units/getSlice";
// import { columns } from "./tables/columns";
// import AddUnit from "./modules/Add";
// import EditUnit from "./modules/Edit";
// import DeleteUnit from "./modules/Delete";
// import DetailsUnit from "./modules/Details";
// import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
// import { usePermissions } from "@/hooks/usePermissions";
// import { PERMISSIONS } from "@/constants/permissions";
// export default function TableUnits() {
//     const [page, setPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const { isStaff, isLoading: roleLoadings } = useUserRole();
//     const { hasPermission, hasAnyPermission } = usePermissions();

//     // استخدام الاستعلام المناسب بناءً على دور المستخدم
//     const { data, isLoading } = isStaff
//         ? useFilterStaffUnitsQuery({
//             page,
//             size: 10,
//             key: search || undefined,
//         }, {
//             skip: !isStaff || roleLoadings,
//         })
//         : useFilterUnitsQuery({
//             page,
//             size: 10,
//             key: search || undefined,
//         }, {
//             skip: isStaff || roleLoadings,
//         });

//     const [editing, setEditing] = useState<string | null>(null);
//     const [deleted, setDeleted] = useState<string | null>(null);
//     const [details, setDetails] = useState<string | null>(null);
//     const [isAddOpen, setIsAddOpen] = useState(false);

//     const onEdit = (data: any) => setEditing(data.id);
//     const onDelete = (data: any) => setDeleted(data.id);
//     const onDetails = (data: any) => setDetails(data.id);

//     if (isLoading) return <SkeletonTable />;

//     const unitsData = data?.data?.values || [];
//     const totalPages = data?.data?.pages || 1;

//     const pagination = {
//         current_page: page,
//         total_pages: totalPages,
//         has_prev: page > 1,
//         has_next: page < totalPages,
//     };

//     const canViewUNITS = hasPermission(PERMISSIONS.UNITS.SHOW);
//     const canCreateUNITS = hasPermission(PERMISSIONS.UNITS.CREATE);
//     const canEditUNITS = hasPermission(PERMISSIONS.UNITS.UPDATE);
//     const canDeleteUNITS = hasPermission(PERMISSIONS.UNITS.DELETE);

//     return (
//         <div className="p-4 relative">
//             {/* إظهار زر الإضافة فقط إذا لم يكن Staff */}
//             {canCreateUNITS && !isStaff && (
//                 <Button onClick={() => setIsAddOpen(true)}>Add Unit</Button>
//             )}

//             {isAddOpen && (
//                 <AddUnit
//                     isOpen={isAddOpen}
//                     onOpenChange={(open: boolean) => setIsAddOpen(open)}
//                 />
//             )}
//             {editing && (
//                 <EditUnit
//                     isOpen={!!editing}
//                     onOpenChange={(open) => !open && setEditing(null)}
//                     unitId={editing}
//                 />
//             )}
//             {deleted && (
//                 <DeleteUnit
//                     isOpen={!!deleted}
//                     onOpenChange={(open) => !open && setDeleted(null)}
//                     unitId={deleted}
//                 />
//             )}
//             {details && (
//                 <DetailsUnit
//                     isOpen={!!details}
//                     onOpenChange={(open) => !open && setDetails(null)}
//                     unitId={details}
//                 />
//             )}

//             <DataTable
//                 columns={columns(onEdit, onDelete, onDetails, canEditUNITS, canDeleteUNITS, canViewUNITS)}
//                 data={unitsData}
//                 pagination={pagination}
//                 onPageChange={setPage}
//                 onSearch={(value: string) => {
//                     setSearch(value);
//                     setPage(1);
//                 }}
//                 onEdit={onEdit}
//                 onDelete={onDelete}
//                 onDetails={onDetails}
//             />
//         </div>
//     );
// }
"use client";

import { useState } from "react";
import SkeletonTable from "./tables/SkeletonTable";
import { DataTable } from "./tables/data-table";
import { Button } from "../ui/button";
import { useFilterUnitsQuery, useFilterStaffUnitsQuery } from "@/api/feature/units/getSlice";
import { columns } from "./tables/columns";
import AddUnit from "./modules/Add";
import EditUnit from "./modules/Edit";
import DeleteUnit from "./modules/Delete";
import DetailsUnit from "./modules/Details";
import { useUserRole } from "@/hooks/useUserRole";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from 'react-i18next';

export default function TableUnits() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { isStaff, isLoading: roleLoadings } = useUserRole();
    // @ts-ignore
    const { hasPermission, hasAnyPermission } = usePermissions();

    const { data, isLoading } = isStaff
        ? useFilterStaffUnitsQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: !isStaff || roleLoadings,
        })
        : useFilterUnitsQuery({
            page,
            size: 10,
            key: search || undefined,
        }, {
            skip: isStaff || roleLoadings,
        });

    const [editing, setEditing] = useState<string | null>(null);
    const [deleted, setDeleted] = useState<string | null>(null);
    const [details, setDetails] = useState<string | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);

    const onEdit = (data: any) => setEditing(data.id);
    const onDelete = (data: any) => setDeleted(data.id);
    const onDetails = (data: any) => setDetails(data.id);

    if (isLoading) return <SkeletonTable />;

    const unitsData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };

    const canViewUNITS = hasPermission(PERMISSIONS.UNITS.SHOW);
    const canCreateUNITS = hasPermission(PERMISSIONS.UNITS.CREATE);
    const canEditUNITS = hasPermission(PERMISSIONS.UNITS.UPDATE);
    const canDeleteUNITS = hasPermission(PERMISSIONS.UNITS.DELETE);

    return (
        <div className="p-4 relative">
            {canCreateUNITS && !isStaff && (
                <Button onClick={() => setIsAddOpen(true)}>
                    {t("units.table.addUnit")}
                </Button>
            )}

            {isAddOpen && (
                <AddUnit
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )}
            {editing && (
                <EditUnit
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    unitId={editing}
                />
            )}
            {deleted && (
                <DeleteUnit
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    unitId={deleted}
                />
            )}
            {details && (
                <DetailsUnit
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    unitId={details}
                />
            )}

            <DataTable
                columns={columns(onEdit, onDelete, onDetails, canEditUNITS, canDeleteUNITS, canViewUNITS, t)}
                data={unitsData}
                pagination={pagination}
                onPageChange={setPage}
                onSearch={(value: string) => {
                    setSearch(value);
                    setPage(1);
                }}
                onEdit={onEdit}
                onDelete={onDelete}
                onDetails={onDetails}
            />
        </div>
    );
}