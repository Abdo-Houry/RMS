// "use client";

// import { useState } from "react";
// import SkeletonTable from "./tables/SkeletonTable";
// import { DataTable } from "./tables/data-table";
// import { columns } from "./tables/columns";
// import AddBrand from "./modules/Add";
// import { Button } from "../ui/button";
// import Edit from "./modules/Edit";
// import Delete from "./modules/Delete";
// import Details from "./modules/Details";
// import { useFilterBrandsQuery } from "@/api/feature/brands/getSlices";
// import type { Brand } from "@/types/brands";
// import { usePermissions } from "@/hooks/usePermissions";
// import { PERMISSIONS } from "@/constants/permissions";
// export default function TableBrands() {
//     const [page, setPage] = useState(1);
//     const [search, setSearch] = useState("");
//     const { hasPermission, hasAnyPermission } = usePermissions();

//     const { data, isLoading } = useFilterBrandsQuery({
//         page,
//         size: 10,
//         key: search || undefined,
//     });

//     const [editing, setEditing] = useState<string | null>(null)
//     const [deleted, setDeleted] = useState<string | null>(null)
//     const [details, setDetails] = useState<string | null>(null)
//     const [isAddOpen, setIsAddOpen] = useState(false);

//     const onEdit = (data: Brand) => {
//         setEditing(data.id)
//     }

//     const onDelete = (data: Brand) => {
//         setDeleted(data.id)
//     }

//     const onDetails = (data: Brand) => {
//         setDetails(data.id)
//     }

//     if (isLoading) return <SkeletonTable />;

//     const brandsData = data?.data?.values || [];
//     const totalPages = data?.data?.pages || 1;

//     const pagination = {
//         current_page: page,
//         total_pages: totalPages,
//         has_prev: page > 1,
//         has_next: page < totalPages,
//     };
//     const canViewBrands = hasPermission(PERMISSIONS.BRANDS.SHOW);
//     const canCreateBrands = hasPermission(PERMISSIONS.BRANDS.CREATE);
//     const canEditBrands = hasPermission(PERMISSIONS.BRANDS.UPDATE);
//     const canDeleteBrands = hasPermission(PERMISSIONS.BRANDS.DELETE);
//     return (
//         <div className="p-4 relative">
//             {
//                 canCreateBrands && (
//                     <Button onClick={() => setIsAddOpen(true)}>
//                         Add Brand
//                     </Button>
//                 )
//             }
//             {isAddOpen && (
//                 <AddBrand
//                     isOpen={isAddOpen}
//                     onOpenChange={(open: boolean) => setIsAddOpen(open)}
//                 />
//             )}
//             {editing && (
//                 <Edit
//                     isOpen={!!editing}
//                     onOpenChange={(open) => !open && setEditing(null)}
//                     brandId={editing}
//                 />
//             )}
//             {deleted && (
//                 <Delete
//                     isOpen={!!deleted}
//                     onOpenChange={(open) => !open && setDeleted(null)}
//                     brandId={deleted}
//                 />
//             )}
//             {details && (
//                 <Details
//                     isOpen={!!details}
//                     onOpenChange={(open) => !open && setDetails(null)}
//                     brandId={details}
//                 />
//             )}

//             <DataTable
//                 columns={columns(onEdit, onDelete, onDetails, canDeleteBrands, canEditBrands, canViewBrands)}
//                 data={brandsData}
//                 pagination={pagination}
//                 onPageChange={(newPage: number) => setPage(newPage)}
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
import { columns } from "./tables/columns";
import AddBrand from "./modules/Add";
import { Button } from "../ui/button";
import Edit from "./modules/Edit";
import Delete from "./modules/Delete";
import Details from "./modules/Details";
import { useFilterBrandsQuery } from "@/api/feature/brands/getSlices";
import type { Brand } from "@/types/brands";
import { usePermissions } from "@/hooks/usePermissions";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from 'react-i18next';

export default function TableBrands() {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    // @ts-ignore
    const { hasPermission, hasAnyPermission } = usePermissions();

    const { data, isLoading } = useFilterBrandsQuery({
        page,
        size: 10,
        key: search || undefined,
    });

    const [editing, setEditing] = useState<string | null>(null)
    const [deleted, setDeleted] = useState<string | null>(null)
    const [details, setDetails] = useState<string | null>(null)
    const [isAddOpen, setIsAddOpen] = useState(false);

    const onEdit = (data: Brand) => {
        setEditing(data.id)
    }

    const onDelete = (data: Brand) => {
        setDeleted(data.id)
    }

    const onDetails = (data: Brand) => {
        setDetails(data.id)
    }

    if (isLoading) return <SkeletonTable />;

    const brandsData = data?.data?.values || [];
    const totalPages = data?.data?.pages || 1;

    const pagination = {
        current_page: page,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages,
    };
    const canViewBrands = hasPermission(PERMISSIONS.BRANDS.SHOW);
    const canCreateBrands = hasPermission(PERMISSIONS.BRANDS.CREATE);
    const canEditBrands = hasPermission(PERMISSIONS.BRANDS.UPDATE);
    const canDeleteBrands = hasPermission(PERMISSIONS.BRANDS.DELETE);
    return (
        <div className="p-4 relative">
            {
                canCreateBrands && (
                    <Button onClick={() => setIsAddOpen(true)}>
                        {t("brands.table.addBrand")}
                    </Button>
                )
            }
            {isAddOpen && (
                <AddBrand
                    isOpen={isAddOpen}
                    onOpenChange={(open: boolean) => setIsAddOpen(open)}
                />
            )}
            {editing && (
                <Edit
                    isOpen={!!editing}
                    onOpenChange={(open) => !open && setEditing(null)}
                    brandId={editing}
                />
            )}
            {deleted && (
                <Delete
                    isOpen={!!deleted}
                    onOpenChange={(open) => !open && setDeleted(null)}
                    brandId={deleted}
                />
            )}
            {details && (
                <Details
                    isOpen={!!details}
                    onOpenChange={(open) => !open && setDetails(null)}
                    brandId={details}
                />
            )}

            <DataTable
                columns={columns(onEdit, onDelete, onDetails, canDeleteBrands, canEditBrands, canViewBrands, t)}
                data={brandsData}
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
        </div>
    );
}