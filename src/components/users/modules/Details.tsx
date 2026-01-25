// "use client";

// import { useGetUsersByIdQuery } from "@/api/feature/users/getSlice";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogClose,
// } from "@/components/ui/dialog";
// import { Skeleton } from "@/components/ui/skeleton";
// import { User, X, Mail, Key } from "lucide-react";
// import { useTranslation } from "react-i18next";

// interface DetailsUserProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     userId: string;
// }

// export default function DetailsUser({ isOpen, onOpenChange, userId }: DetailsUserProps) {
//     const { t } = useTranslation();
//     const { data, isLoading } = useGetUsersByIdQuery(userId, {
//         skip: !isOpen,
//     });

//     const user = data?.data;
//     const permissions = user?.permissions || [];

//     // إنشاء نسخة مرتبة من الصلاحيات لتجنب خطأ read-only
//     const sortedPermissions = [...permissions].sort((a, b) => a - b);

//     // دالة للحصول على اسم الصلاحية من الترجمة
//     const getPermissionName = (id: number): string => {
//         return t(`users.permissions.actions.${id}`) || `${t('users.details.permission')} ${id}`;
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl">
//                 {/* Header */}
//                 <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-white rounded-xl shadow-sm">
//                             <User className="h-6 w-6 text-blue-600" />
//                         </div>
//                         <div>
//                             <DialogTitle className="text-2xl font-bold">
//                                 {t('users.details.title')}
//                             </DialogTitle>
//                             <p className="text-gray-600 mt-1 text-sm">
//                                 {t('users.details.subtitle')}
//                             </p>
//                         </div>
//                     </div>
//                 </DialogHeader>

//                 {/* Content */}
//                 <div className="flex-1 p-6">
//                     {isLoading ? (
//                         <div className="space-y-6">
//                             <div className="space-y-3">
//                                 <Skeleton className="h-6 w-32" />
//                                 <Skeleton className="h-12 w-full rounded-lg" />
//                             </div>
//                             <div className="space-y-3">
//                                 <Skeleton className="h-6 w-28" />
//                                 <Skeleton className="h-12 w-full rounded-lg" />
//                             </div>
//                             <div className="space-y-3">
//                                 <Skeleton className="h-6 w-24" />
//                                 <Skeleton className="h-12 w-full rounded-lg" />
//                             </div>
//                         </div>
//                     ) : user ? (
//                         <div className="space-y-6">
//                             {/* Username Section */}
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-blue-50 rounded-lg">
//                                         <User className="h-4 w-4 text-blue-600" />
//                                     </div>
//                                     <h3 className="font-semibold text-lg">{t('users.table.username')}</h3>
//                                 </div>
//                                 <div className="text-gray-700 text-lg bg-gray-50 rounded-lg p-4 border border-gray-200">
//                                     {user.userName}
//                                 </div>
//                             </div>

//                             {/* Email Section */}
//                             <div className="space-y-3">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-green-50 rounded-lg">
//                                         <Mail className="h-4 w-4 text-green-600" />
//                                     </div>
//                                     <h3 className="font-semibold text-lg">{t('users.table.email')}</h3>
//                                 </div>
//                                 <div className="text-gray-700 text-lg bg-gray-50 rounded-lg p-4 border border-gray-200">
//                                     {user.email}
//                                 </div>
//                             </div>

//                             {/* Permissions Section */}
//                             <div className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <div className="p-2 bg-purple-50 rounded-lg">
//                                             <Key className="h-4 w-4 text-purple-600" />
//                                         </div>
//                                         <h3 className="font-semibold text-lg">{t('users.add.permissions')}</h3>
//                                     </div>
//                                     <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                                         {permissions.length} {t('users.add.permissionsCount')}
//                                     </span>
//                                 </div>

//                                 {permissions.length === 0 ? (
//                                     <div className="text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
//                                         <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
//                                             <Key className="h-6 w-6 text-gray-400" />
//                                         </div>
//                                         <p className="text-gray-500 font-medium">{t('users.details.noPermissions')}</p>
//                                         <p className="text-gray-400 text-sm mt-1">{t('users.details.noPermissionsDesc')}</p>
//                                     </div>
//                                 ) : (
//                                     <div className="border border-gray-200 rounded-lg p-4 space-y-3 max-h-[300px] overflow-y-auto">
//                                         {sortedPermissions.map((permissionId) => (
//                                             <div
//                                                 key={permissionId}
//                                                 className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:bg-gray-50"
//                                             >
//                                                 <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                                                     <span className="text-blue-600 font-semibold text-sm">
//                                                         {permissionId}
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex-1">
//                                                     <p className="text-sm font-medium text-gray-800">
//                                                         {getPermissionName(permissionId)}
//                                                     </p>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}

//                                 {/* Permissions Summary */}
//                                 {permissions.length > 0 && (
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                                         <div className="flex items-center gap-3">
//                                             <div className="p-1.5 bg-blue-100 rounded">
//                                                 <Key className="h-4 w-4 text-blue-600" />
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-semibold text-blue-900 mb-1">
//                                                     {t('users.permissions.summary.title')}
//                                                 </h4>
//                                                 <p className="text-xs text-blue-700">
//                                                      {permissions.length}
//                                                 </p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     ) : (
//                         <div className="text-center py-8">
//                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                                 <User className="h-8 w-8 text-gray-400" />
//                             </div>
//                             <p className="text-gray-500 font-medium text-lg">{t('users.details.notFound')}</p>
//                             <p className="text-gray-400 text-sm mt-1">{t('users.details.notFoundDesc')}</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <DialogFooter className="p-6 pt-4 border-t border-gray-100">
//                     <DialogClose asChild>
//                         <Button
//                             variant="outline"
//                             className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
//                         >
//                             <X className="h-4 w-4" />
//                             {t('users.details.close')}
//                         </Button>
//                     </DialogClose>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
"use client";

import { useFilterArticlesQuery } from "@/api/feature/articles/getSlices";
import { useFilterMachinesQuery } from "@/api/feature/machines/getSlice";
import { useFilterMealsQuery } from "@/api/feature/meals/getSlice";
import { useGetUsersByIdQuery } from "@/api/feature/users/getSlice";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { User, X, Mail, Key } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DetailsUserProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

export default function DetailsUser({ isOpen, onOpenChange, userId }: DetailsUserProps) {
    const { t } = useTranslation();
    const { data, isLoading } = useGetUsersByIdQuery(userId, {
        skip: !isOpen,
    });

    const user = data?.data;
    const permissions = user?.permissions || [];
    // صلاحيات المقالات، الماكينات، الوجبات
    const { data: articlesData } = useFilterArticlesQuery({ page: 1, size: 100 });
    const { data: machinesData } = useFilterMachinesQuery({ page: 1, size: 100 });
    const { data: mealsData } = useFilterMealsQuery({ page: 1, size: 100 });

    // Helper لعرض الصلاحيات باسمها
    const renderPermissions = (permissions: any[], type: string) => {
        if (!permissions || permissions.length === 0) return <p className="text-gray-500 text-sm">{t('users.details.noPermissions')}</p>;

        return permissions.map((permId: any) => {
            let name = permId;
            if (type === "article") {
                const article = articlesData?.data?.values.find((a: any) => a.id === permId);
                name = article?.title || permId;
            } else if (type === "meal") {
                const meal = mealsData?.data?.values.find((m: any) => m.id === permId);
                name = meal?.name || permId;
            } else if (type === "machine") {
                const machine = machinesData?.data?.values.find((m: any) => m.id === permId);
                name = machine?.name || permId;
            }
            return (
                <div key={permId} className="flex items-center gap-3 p-2 bg-white border border-gray-100 rounded-lg">
                    <Key className="h-4 w-4 text-purple-600" />
                    <span className="text-sm text-gray-800">{name}</span>
                </div>
            );
        });
    };
    // إنشاء نسخة مرتبة من الصلاحيات لتجنب خطأ read-only
    const sortedPermissions = [...permissions].sort((a, b) => a - b);

    // دالة للحصول على اسم الصلاحية من الترجمة
    const getPermissionName = (id: number): string => {
        return t(`users.permissions.actions.${id}`) || `${t('users.details.permission')} ${id}`;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto p-0 rounded-2xl">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <User className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                {t('users.details.title')}
                            </DialogTitle>
                            <p className="text-gray-600 mt-1 text-sm">
                                {t('users.details.subtitle')}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 p-6">
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                        </div>
                    ) : user ? (
                        <div className="space-y-6">
                            {/* Username Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <User className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t('users.table.username')}</h3>
                                </div>
                                <div className="text-gray-700 text-lg bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {user.userName}
                                </div>
                            </div>

                            {/* Email Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Mail className="h-4 w-4 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t('users.table.email')}</h3>
                                </div>
                                <div className="text-gray-700 text-lg bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {user.email}
                                </div>
                            </div>
                            {/* Active & Limit Access */}
                            <div className="flex gap-6 items-center">
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={!!user.active} />
                                    <span>{t('users.add.active')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Checkbox checked={!!user.limitAccess} />
                                    <span>{t('users.add.limitAccess')}</span>
                                </div>
                            </div>
                            {/* Permissions Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Key className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t('users.add.permissions')}</h3>
                                    </div>
                                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {permissions.length} {t('users.add.permissionsCount')}
                                    </span>
                                </div>

                                {permissions.length === 0 ? (
                                    <div className="text-center py-6 border border-gray-200 rounded-lg bg-gray-50">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Key className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-gray-500 font-medium">{t('users.details.noPermissions')}</p>
                                        <p className="text-gray-400 text-sm mt-1">{t('users.details.noPermissionsDesc')}</p>
                                    </div>
                                ) : (
                                    <div className="border border-gray-200 rounded-lg p-4 space-y-3 max-h-[300px] overflow-y-auto">
                                        {sortedPermissions.map((permissionId) => (
                                            <div
                                                key={permissionId}
                                                className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-blue-600 font-semibold text-sm">
                                                        {permissionId}
                                                    </span>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                        {getPermissionName(permissionId)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Permissions Summary */}
                                {permissions.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-blue-100 rounded">
                                                <Key className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                                    {t('users.permissions.summary.title')}
                                                </h4>
                                                <p className="text-xs text-blue-700">
                                                    {permissions.length}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Article Permissions */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">{t('users.details.articlePermissions')}</h4>
                                <div className="border border-gray-200 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {renderPermissions(user.articlePermissions, "article")}
                                </div>
                            </div>

                            {/* Meal Permissions */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">{t('users.details.mealPermissions')}</h4>
                                <div className="border border-gray-200 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {renderPermissions(user.mealPermissions, "meal")}
                                </div>
                            </div>

                            {/* Machine Permissions */}
                            <div className="space-y-2">
                                <h4 className="font-semibold">{t('users.details.machinePermissions')}</h4>
                                <div className="border border-gray-200 rounded-lg p-4 space-y-2 max-h-[300px] overflow-y-auto">
                                    {renderPermissions(user.machinePermissions, "machine")}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <User className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium text-lg">{t('users.details.notFound')}</p>
                            <p className="text-gray-400 text-sm mt-1">{t('users.details.notFoundDesc')}</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t('users.details.close')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}