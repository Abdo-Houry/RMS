
// "use client";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogClose,
// } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { toast } from "react-toastify";
// import { usePermissionPutMutation } from "@/api/feature/users/putSlice";
// import { useGetUsersByIdQuery } from "@/api/feature/users/getSlice";
// import {
//     Key,
//     Loader,
//     X,
//     User,
//     ChefHat,
//     Tag,
//     ShoppingBag,
//     Package,
//     Cpu,
//     FileText,
//     Layers,
//     Scale,
//     Shield
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";
// import { PERMISSIONS } from "@/constants/permissions";
// import { useTranslation } from "react-i18next";

// interface SetUserPermissionsProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     userId: string;
// }

// // Interface for permission category
// interface PermissionCategory {
//     name: string;
//     icon: React.ReactNode;
//     permissions: Array<{
//         id: number;
//     }>;
// }

// export default function SetUserPermissions({ isOpen, onOpenChange, userId }: SetUserPermissionsProps) {
//     const { t } = useTranslation();

//     // Fetch user data by ID to get current permissions
//     const { data: userData, isLoading: isLoadingUser, isError, refetch } = useGetUsersByIdQuery(userId, {
//         skip: !userId || !isOpen
//     });

//     const [setPermissions, { isLoading: isUpdating }] = usePermissionPutMutation();
//     const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
//     const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);

//     // Define permission categories with labels and icons
//     const permissionCategories: PermissionCategory[] = [
//         {
//             name: "USERS",
//             icon: <User className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.USERS.CREATE },
//                 { id: PERMISSIONS.USERS.UPDATE },
//                 { id: PERMISSIONS.USERS.DELETE },
//                 { id: PERMISSIONS.USERS.SHOW },
//                 { id: PERMISSIONS.USERS.SET_PERMISSIONS },
//             ]
//         },
//         {
//             name: "MEALS",
//             icon: <ChefHat className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.MEALS.CREATE },
//                 { id: PERMISSIONS.MEALS.UPDATE },
//                 { id: PERMISSIONS.MEALS.DELETE },
//                 { id: PERMISSIONS.MEALS.SHOW },
//             ]
//         },
//         {
//             name: "MEAL_CATEGORIES",
//             icon: <Tag className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.MEAL_CATEGORIES.CREATE },
//                 { id: PERMISSIONS.MEAL_CATEGORIES.UPDATE },
//                 { id: PERMISSIONS.MEAL_CATEGORIES.DELETE },
//                 { id: PERMISSIONS.MEAL_CATEGORIES.SHOW },
//             ]
//         },
//         {
//             name: "BRANDS",
//             icon: <ShoppingBag className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.BRANDS.CREATE },
//                 { id: PERMISSIONS.BRANDS.UPDATE },
//                 { id: PERMISSIONS.BRANDS.DELETE },
//                 { id: PERMISSIONS.BRANDS.SHOW },
//             ]
//         },
//         {
//             name: "INGREDIENTS",
//             icon: <Package className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.INGREDIENTS.CREATE },
//                 { id: PERMISSIONS.INGREDIENTS.UPDATE },
//                 { id: PERMISSIONS.INGREDIENTS.DELETE },
//                 { id: PERMISSIONS.INGREDIENTS.SHOW },
//             ]
//         },
//         {
//             name: "MACHINES",
//             icon: <Cpu className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.MACHINES.CREATE },
//                 { id: PERMISSIONS.MACHINES.UPDATE },
//                 { id: PERMISSIONS.MACHINES.DELETE },
//                 { id: PERMISSIONS.MACHINES.SHOW },
//             ]
//         },
//         {
//             name: "ARTICLES",
//             icon: <FileText className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.ARTICLES.CREATE },
//                 { id: PERMISSIONS.ARTICLES.UPDATE },
//                 { id: PERMISSIONS.ARTICLES.DELETE },
//                 { id: PERMISSIONS.ARTICLES.SHOW },
//             ]
//         },
//         {
//             name: "ARTICLE_CATEGORIES",
//             icon: <Layers className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.ARTICLE_CATEGORIES.CREATE },
//                 { id: PERMISSIONS.ARTICLE_CATEGORIES.UPDATE },
//                 { id: PERMISSIONS.ARTICLE_CATEGORIES.DELETE },
//                 { id: PERMISSIONS.ARTICLE_CATEGORIES.SHOW },
//             ]
//         },
//         {
//             name: "UNITS",
//             icon: <Scale className="h-4 w-4" />,
//             permissions: [
//                 { id: PERMISSIONS.UNITS.CREATE },
//                 { id: PERMISSIONS.UNITS.UPDATE },
//                 { id: PERMISSIONS.UNITS.DELETE },
//                 { id: PERMISSIONS.UNITS.SHOW },
//             ]
//         },
//     ];

//     // Load user data when dialog opens
//     useEffect(() => {
//         if (isOpen && userId) {
//             // Refetch user data when dialog opens
//             refetch();
//             setIsLoadingPermissions(true);
//         } else if (isOpen) {
//             // Reset when opening without userId
//             setSelectedPermissions([]);
//             setIsLoadingPermissions(false);
//         }
//     }, [isOpen, userId, refetch]);

//     // Set user data when API responds
//     useEffect(() => {
//         if (userData?.data) {
//             const user = userData.data;

//             // Set current permissions
//             const userPermissions = user.permissions || [];
//             setSelectedPermissions(userPermissions);

//             setIsLoadingPermissions(false);
//         }
//     }, [userData]);

//     // Show error if API call fails
//     useEffect(() => {
//         if (isError && isOpen) {
//             toast.error(t('users.permissions.error.loadFailed'));
//             setIsLoadingPermissions(false);
//         }
//     }, [isError, isOpen, t]);

//     // Handle permission toggle
//     const handlePermissionToggle = (permissionId: number) => {
//         setSelectedPermissions(prev => {
//             if (prev.includes(permissionId)) {
//                 return prev.filter(id => id !== permissionId);
//             } else {
//                 return [...prev, permissionId];
//             }
//         });
//     };

//     // Handle select all permissions in a category
//     const handleSelectAllCategory = (category: PermissionCategory) => {
//         const categoryPermissionIds = category.permissions.map(p => p.id);
//         const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));

//         setSelectedPermissions(prev => {
//             if (allSelected) {
//                 // Remove all permissions from this category
//                 return prev.filter(id => !categoryPermissionIds.includes(id));
//             } else {
//                 // Add all permissions from this category
//                 const newPermissions = [...prev];
//                 categoryPermissionIds.forEach(id => {
//                     if (!newPermissions.includes(id)) {
//                         newPermissions.push(id);
//                     }
//                 });
//                 return newPermissions;
//             }
//         });
//     };

//     // Check if all permissions in a category are selected
//     const isCategoryAllSelected = (category: PermissionCategory): boolean => {
//         const categoryPermissionIds = category.permissions.map(p => p.id);
//         return categoryPermissionIds.length > 0 &&
//             categoryPermissionIds.every(id => selectedPermissions.includes(id));
//     };

//     // Handle form submission
//     const onSubmit = async () => {
//         try {
//             // Validate at least one permission is selected
//             if (selectedPermissions.length === 0) {
//                 toast.error(t('users.add.validation.selectPermission'));
//                 return;
//             }

//             // Create a copy and sort it
//             const sortedPermissions = [...selectedPermissions].sort((a, b) => a - b);

//             // Prepare payload according to API requirements
//             const payload = {
//                 userId: userId,
//                 permissions: sortedPermissions
//             };

//             const res = await setPermissions(payload);
//             const result = handleApiResponse(res);

//             if (result.success) {
//                 toast.success(t('users.permissions.success.update'));
//                 handleClose();
//             } else {
//                 toast.error(result.error || t('users.permissions.error.updateFailed'));
//             }
//         } catch (error: any) {
//             toast.error(error?.data?.error || error?.error || t('users.permissions.error.generic'));
//         }
//     };

//     // Handle dialog close
//     const handleClose = () => {
//         setSelectedPermissions([]);
//         setIsLoadingPermissions(true);
//         onOpenChange(false);
//     };

//     // Show loading state while fetching data
//     if (isLoadingUser && isOpen) {
//         return (
//             <Dialog open={isOpen} onOpenChange={onOpenChange}>
//                 <DialogContent className="sm:max-w-[600px] p-6">
//                     <div className="flex items-center justify-center py-12">
//                         <div className="text-center">
//                             <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
//                             <p className="text-gray-600">{t('users.permissions.loading')}</p>
//                         </div>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         );
//     }

//     // Show error state if data loading fails
//     if (isError && isOpen) {
//         return (
//             <Dialog open={isOpen} onOpenChange={onOpenChange}>
//                 <DialogContent className="sm:max-w-[600px] p-6">
//                     <div className="text-center py-8">
//                         <div className="text-red-500 mb-4">
//                             <X className="h-12 w-12 mx-auto" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                             {t('users.permissions.error.title')}
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             {t('users.permissions.error.message')}
//                         </p>
//                         <Button onClick={handleClose}>
//                             {t('users.delete.cancel')}
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//         );
//     }

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[700px]p-0 rounded-2xl">
//                 <form onSubmit={(e) => {
//                     e.preventDefault();
//                     onSubmit();
//                 }}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <Shield className="h-6 w-6 text-purple-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t('users.permissions.title')}
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1 text-sm">
//                                     {t('users.permissions.subtitle')}
//                                 </p>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     {/* Content */}
//                     <div className="p-6  max-h-[65vh] overflow-y-auto ">
//                         <div className="space-y-6">
//                             {/* Permissions Section */}
//                             <div className="space-y-4">
//                                 <div className="flex items-center justify-between">
//                                     <div className="flex items-center gap-2">
//                                         <div className="p-2 bg-purple-50 rounded-lg">
//                                             <Key className="h-4 w-4 text-purple-600" />
//                                         </div>
//                                         <div>
//                                             <h3 className="text-lg font-semibold">{t('users.add.permissions')}</h3>
//                                             <p className="text-sm text-gray-500">
//                                                 {t('users.permissions.selectSubtitle')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">
//                                             {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
//                                         </span>
//                                         <Button
//                                             type="button"
//                                             variant="outline"
//                                             size="sm"
//                                             onClick={() => setSelectedPermissions([])}
//                                             disabled={isLoadingPermissions}
//                                             className="text-xs"
//                                         >
//                                             {t('users.permissions.clearAll')}
//                                         </Button>
//                                     </div>
//                                 </div>

//                                 {/* Loading state for permissions */}
//                                 {isLoadingPermissions ? (
//                                     <div className="border border-gray-200 rounded-lg p-8 text-center">
//                                         <Loader className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-3" />
//                                         <p className="text-gray-600">{t('users.permissions.loading')}</p>
//                                     </div>
//                                 ) : (
//                                     <>
//                                         {/* Permissions List */}
//                                         <div className="border border-gray-200 rounded-lg p-4 space-y-4 max-h-[350px] overflow-y-auto">
//                                             {permissionCategories.map((category) => (
//                                                 <div key={category.name} className="space-y-3">
//                                                     {/* Category Header */}
//                                                     <div className="flex items-center justify-between">
//                                                         <div className="flex items-center gap-3">
//                                                             <div className="p-2 bg-gray-100 rounded-lg">
//                                                                 {category.icon}
//                                                             </div>
//                                                             <div>
//                                                                 <h4 className="font-medium ">
//                                                                     {t(`users.permissions.categories.${category.name}`)}
//                                                                 </h4>
//                                                                 <p className="text-xs ">
//                                                                     {category.permissions.length} {t('users.add.permissionsCount')}
//                                                                 </p>
//                                                             </div>
//                                                         </div>
//                                                         <div className="flex items-center gap-2">
//                                                             <span className="text-xs ">
//                                                                 {category.permissions.filter(p => selectedPermissions.includes(p.id)).length}/{category.permissions.length}
//                                                             </span>
//                                                             <Checkbox
//                                                                 checked={isCategoryAllSelected(category)}
//                                                                 onCheckedChange={() => handleSelectAllCategory(category)}
//                                                                 disabled={isLoadingPermissions}
//                                                                 className="h-4 w-4"
//                                                             />
//                                                         </div>
//                                                     </div>

//                                                     {/* Category Permissions */}
//                                                     <div className="grid grid-cols-2 gap-3 pl-11">
//                                                         {category.permissions.map((permission) => (
//                                                             <div
//                                                                 key={permission.id}
//                                                                 className="flex items-center space-x-2"
//                                                             >
//                                                                 <Checkbox
//                                                                     id={`permission-${permission.id}`}
//                                                                     checked={selectedPermissions.includes(permission.id)}
//                                                                     onCheckedChange={() => handlePermissionToggle(permission.id)}
//                                                                     disabled={isLoadingPermissions}
//                                                                     className="h-4 w-4"
//                                                                 />
//                                                                 <Label
//                                                                     htmlFor={`permission-${permission.id}`}
//                                                                     className="text-sm font-normal cursor-pointer"
//                                                                 >
//                                                                     {t(`users.permissions.actions.${permission.id}`)}
//                                                                 </Label>
//                                                             </div>
//                                                         ))}
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Validation Message */}
//                                         {selectedPermissions.length === 0 && !isLoadingPermissions && (
//                                             <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg">
//                                                 <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                                                 {t('users.add.validation.selectPermission')}
//                                             </div>
//                                         )}

//                                         {/* Current Permissions Summary */}
//                                         {selectedPermissions.length > 0 && (
//                                             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                                                 <div className="flex items-start gap-3">
//                                                     <div className="p-1.5 bg-blue-100 rounded">
//                                                         <Shield className="h-4 w-4 text-blue-600" />
//                                                     </div>
//                                                     <div>
//                                                         <h4 className="text-sm font-semibold text-blue-900 mb-1">
//                                                             {t('users.permissions.summary.title')}
//                                                         </h4>
//                                                         <p className="text-xs text-blue-700">
//                                                             {selectedPermissions.length} {t('users.permissions.summary.selected')}
//                                                         </p>
//                                                         {selectedPermissions.length <= 10 && (
//                                                             <p className="text-xs text-blue-600 mt-2">
//                                                                 {t('users.permissions.summary.list')}: {[...selectedPermissions].sort((a, b) => a - b).join(', ')}
//                                                             </p>
//                                                         )}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </>
//                                 )}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <DialogFooter className="p-6 pt-4 border-t border-gray-100">
//                         <DialogClose asChild>
//                             <Button
//                                 variant="outline"
//                                 type="button"
//                                 onClick={handleClose}
//                                 disabled={isUpdating}
//                                 className="flex items-center gap-2"
//                             >
//                                 <X className="h-4 w-4" />
//                                 {t('users.add.cancel')}
//                             </Button>
//                         </DialogClose>
//                         <Button
//                             type="submit"
//                             disabled={isUpdating || isLoadingPermissions || selectedPermissions.length === 0}
//                             className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
//                         >
//                             {isUpdating ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t('users.permissions.updating')}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Shield className="h-4 w-4" />
//                                     {t('users.permissions.updateButton')}
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }

"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { usePermissionPutMutation } from "@/api/feature/users/putSlice";
import { useGetUsersByIdQuery } from "@/api/feature/users/getSlice";
import {
    Key,
    Loader,
    X,
    User,
    ChefHat,
    Tag,
    ShoppingBag,
    Package,
    Cpu,
    FileText,
    Layers,
    Scale,
    Shield
} from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from "react-i18next";
import { useFilterMealsQuery } from "@/api/feature/meals/getSlice";
import { useFilterMachinesQuery } from "@/api/feature/machines/getSlice";
import { useFilterArticlesQuery } from "@/api/feature/articles/getSlices";

interface SetUserPermissionsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

// Interface for permission category
interface PermissionCategory {
    name: string;
    icon: React.ReactNode;
    permissions: Array<{
        id: number;
    }>;
}

export default function SetUserPermissions({ isOpen, onOpenChange, userId }: SetUserPermissionsProps) {
    const { t } = useTranslation();

    // Fetch user data by ID to get current permissions
    const { data: userData, isLoading: isLoadingUser, isError, refetch } = useGetUsersByIdQuery(userId, {
        skip: !userId || !isOpen
    });
    const { data: mealsData } = useFilterMealsQuery({ page: 1, size: 100 });
    const { data: machinesData } = useFilterMachinesQuery({ page: 1, size: 100 });
    const { data: articlesData } = useFilterArticlesQuery({ page: 1, size: 100 });

    const [setPermissions, { isLoading: isUpdating }] = usePermissionPutMutation();
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
    const [selectedMealPermissions, setSelectedMealPermissions] = useState<string[]>([]);
    const [selectedMachinePermissions, setSelectedMachinePermissions] = useState<string[]>([]);
    const [selectedArticlePermissions, setSelectedArticlePermissions] = useState<string[]>([]);

    // Define permission categories with labels and icons
    const permissionCategories: PermissionCategory[] = [
        {
            name: "USERS",
            icon: <User className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.USERS.CREATE },
                { id: PERMISSIONS.USERS.UPDATE },
                { id: PERMISSIONS.USERS.DELETE },
                { id: PERMISSIONS.USERS.SHOW },
                { id: PERMISSIONS.USERS.SET_PERMISSIONS },
            ]
        },
        {
            name: "MEALS",
            icon: <ChefHat className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.MEALS.CREATE },
                { id: PERMISSIONS.MEALS.UPDATE },
                { id: PERMISSIONS.MEALS.DELETE },
                { id: PERMISSIONS.MEALS.SHOW },
            ]
        },
        {
            name: "MEAL_CATEGORIES",
            icon: <Tag className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.MEAL_CATEGORIES.CREATE },
                { id: PERMISSIONS.MEAL_CATEGORIES.UPDATE },
                { id: PERMISSIONS.MEAL_CATEGORIES.DELETE },
                { id: PERMISSIONS.MEAL_CATEGORIES.SHOW },
            ]
        },
        {
            name: "BRANDS",
            icon: <ShoppingBag className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.BRANDS.CREATE },
                { id: PERMISSIONS.BRANDS.UPDATE },
                { id: PERMISSIONS.BRANDS.DELETE },
                { id: PERMISSIONS.BRANDS.SHOW },
            ]
        },
        {
            name: "INGREDIENTS",
            icon: <Package className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.INGREDIENTS.CREATE },
                { id: PERMISSIONS.INGREDIENTS.UPDATE },
                { id: PERMISSIONS.INGREDIENTS.DELETE },
                { id: PERMISSIONS.INGREDIENTS.SHOW },
            ]
        },
        {
            name: "MACHINES",
            icon: <Cpu className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.MACHINES.CREATE },
                { id: PERMISSIONS.MACHINES.UPDATE },
                { id: PERMISSIONS.MACHINES.DELETE },
                { id: PERMISSIONS.MACHINES.SHOW },
            ]
        },
        {
            name: "ARTICLES",
            icon: <FileText className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.ARTICLES.CREATE },
                { id: PERMISSIONS.ARTICLES.UPDATE },
                { id: PERMISSIONS.ARTICLES.DELETE },
                { id: PERMISSIONS.ARTICLES.SHOW },
            ]
        },
        {
            name: "ARTICLE_CATEGORIES",
            icon: <Layers className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.ARTICLE_CATEGORIES.CREATE },
                { id: PERMISSIONS.ARTICLE_CATEGORIES.UPDATE },
                { id: PERMISSIONS.ARTICLE_CATEGORIES.DELETE },
                { id: PERMISSIONS.ARTICLE_CATEGORIES.SHOW },
            ]
        },
        {
            name: "UNITS",
            icon: <Scale className="h-4 w-4" />,
            permissions: [
                { id: PERMISSIONS.UNITS.CREATE },
                { id: PERMISSIONS.UNITS.UPDATE },
                { id: PERMISSIONS.UNITS.DELETE },
                { id: PERMISSIONS.UNITS.SHOW },
            ]
        },
    ];

    // Load user data when dialog opens
    useEffect(() => {
        if (isOpen && userId) {
            // Refetch user data when dialog opens
            refetch();
            setIsLoadingPermissions(true);
        } else if (isOpen) {
            // Reset when opening without userId
            setSelectedPermissions([]);
            setIsLoadingPermissions(false);
        }
    }, [isOpen, userId, refetch]);

    // Set user data when API responds
    useEffect(() => {
        if (userData?.data) {
            const user = userData.data;

            // Set current permissions
            const userPermissions = user.permissions || [];
            setSelectedPermissions(userPermissions);

            setIsLoadingPermissions(false);
        }
    }, [userData]);

    // Show error if API call fails
    useEffect(() => {
        if (isError && isOpen) {
            toast.error(t('users.permissions.error.loadFailed'));
            setIsLoadingPermissions(false);
        }
    }, [isError, isOpen, t]);
    useEffect(() => {
        if (userData?.data) {
            const user = userData.data;

            setSelectedPermissions(user.permissions || []);
            setSelectedMealPermissions(user.mealPermissions || []);
            setSelectedMachinePermissions(user.machinePermissions || []);
            setSelectedArticlePermissions(user.articlePermissions || []);

            setIsLoadingPermissions(false);
        }
    }, [userData]);

    // Handle permission toggle
    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

    // Handle select all permissions in a category
    const handleSelectAllCategory = (category: PermissionCategory) => {
        const categoryPermissionIds = category.permissions.map(p => p.id);
        const allSelected = categoryPermissionIds.every(id => selectedPermissions.includes(id));

        setSelectedPermissions(prev => {
            if (allSelected) {
                // Remove all permissions from this category
                return prev.filter(id => !categoryPermissionIds.includes(id));
            } else {
                // Add all permissions from this category
                const newPermissions = [...prev];
                categoryPermissionIds.forEach(id => {
                    if (!newPermissions.includes(id)) {
                        newPermissions.push(id);
                    }
                });
                return newPermissions;
            }
        });
    };

    // Check if all permissions in a category are selected
    const isCategoryAllSelected = (category: PermissionCategory): boolean => {
        const categoryPermissionIds = category.permissions.map(p => p.id);
        return categoryPermissionIds.length > 0 &&
            categoryPermissionIds.every(id => selectedPermissions.includes(id));
    };
    // @ts-ignore
    const toggleEntityPermission = (
        id: string,
        // @ts-ignore
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setSelected(prev =>
            prev.includes(id)
                ? prev.filter(x => x !== id)
                : [...prev, id]
        );
    };

    // Handle form submission
    const onSubmit = async () => {
        try {
            if (
                selectedPermissions.length === 0 &&
                selectedMealPermissions.length === 0 &&
                selectedMachinePermissions.length === 0 &&
                selectedArticlePermissions.length === 0
            ) {
                toast.error(t('users.add.validation.selectPermission'));
                return;
            }

            const payload = {
                userId,
                permissions: [...selectedPermissions].sort((a, b) => a - b),
                mealPermissions: selectedMealPermissions,
                machinePermissions: selectedMachinePermissions,
                articlePermissions: selectedArticlePermissions,
            };

            const res = await setPermissions(payload);
            const result = handleApiResponse(res);

            if (result.success) {
                toast.success(result.error)
                handleClose();
            } else {
                toast.error(result.error || t('users.permissions.error.updateFailed'));
            }
        } catch (error: any) {
            toast.error(
                error?.data?.error ||
                error?.error ||
                t('users.permissions.error.generic')
            );
        }
    };


    // Handle dialog close
    const handleClose = () => {
        setSelectedPermissions([]);
        setSelectedMealPermissions([]);
        setSelectedMachinePermissions([]);
        setSelectedArticlePermissions([]);
        setIsLoadingPermissions(true);
        onOpenChange(false);
    };


    // Show loading state while fetching data
    if (isLoadingUser && isOpen) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-6">
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">{t('users.permissions.loading')}</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    // Show error state if data loading fails
    if (isError && isOpen) {
        return (
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[600px] p-6">
                    <div className="text-center py-8">
                        <div className="text-red-500 mb-4">
                            <X className="h-12 w-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {t('users.permissions.error.title')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('users.permissions.error.message')}
                        </p>
                        <Button onClick={handleClose}>
                            {t('users.delete.cancel')}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]p-0 rounded-2xl">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Shield className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('users.permissions.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('users.permissions.subtitle')}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="p-6  max-h-[65vh] overflow-y-auto ">
                        <div className="space-y-6">
                            {/* Permissions Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Key className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">{t('users.add.permissions')}</h3>
                                            <p className="text-sm text-gray-500">
                                                {t('users.permissions.selectSubtitle')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                            {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
                                        </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedPermissions([])}
                                            disabled={isLoadingPermissions}
                                            className="text-xs"
                                        >
                                            {t('users.permissions.clearAll')}
                                        </Button>
                                    </div>
                                </div>

                                {/* Loading state for permissions */}
                                {isLoadingPermissions ? (
                                    <div className="border border-gray-200 rounded-lg p-8 text-center">
                                        <Loader className="h-6 w-6 animate-spin text-blue-600 mx-auto mb-3" />
                                        <p className="text-gray-600">{t('users.permissions.loading')}</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Permissions List */}
                                        <div className="border border-gray-200 rounded-lg p-4 space-y-4 max-h-[350px] overflow-y-auto">
                                            {permissionCategories.map((category) => (
                                                <div key={category.name} className="space-y-3">
                                                    {/* Category Header */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                                {category.icon}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium ">
                                                                    {t(`users.permissions.categories.${category.name}`)}
                                                                </h4>
                                                                <p className="text-xs ">
                                                                    {category.permissions.length} {t('users.add.permissionsCount')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs ">
                                                                {category.permissions.filter(p => selectedPermissions.includes(p.id)).length}/{category.permissions.length}
                                                            </span>
                                                            <Checkbox
                                                                checked={isCategoryAllSelected(category)}
                                                                onCheckedChange={() => handleSelectAllCategory(category)}
                                                                disabled={isLoadingPermissions}
                                                                className="h-4 w-4"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Category Permissions */}
                                                    <div className="grid grid-cols-2 gap-3 pl-11">
                                                        {category.permissions.map((permission) => (
                                                            <div
                                                                key={permission.id}
                                                                className="flex items-center space-x-2"
                                                            >
                                                                <Checkbox
                                                                    id={`permission-${permission.id}`}
                                                                    checked={selectedPermissions.includes(permission.id)}
                                                                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                                                                    disabled={isLoadingPermissions}
                                                                    className="h-4 w-4"
                                                                />
                                                                <Label
                                                                    htmlFor={`permission-${permission.id}`}
                                                                    className="text-sm font-normal cursor-pointer"
                                                                >
                                                                    {t(`users.permissions.actions.${permission.id}`)}
                                                                </Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Validation Message */}
                                        {selectedPermissions.length === 0 && !isLoadingPermissions && (
                                            <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg">
                                                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                                {t('users.add.validation.selectPermission')}
                                            </div>
                                        )}

                                        {/* Current Permissions Summary */}
                                        {selectedPermissions.length > 0 && (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 bg-blue-100 rounded">
                                                        <Shield className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-blue-900 mb-1">
                                                            {t('users.permissions.summary.title')}
                                                        </h4>
                                                        <p className="text-xs text-blue-700">
                                                            {selectedPermissions.length} {t('users.permissions.summary.selected')}
                                                        </p>
                                                        {selectedPermissions.length <= 10 && (
                                                            <p className="text-xs text-blue-600 mt-2">
                                                                {t('users.permissions.summary.list')}: {[...selectedPermissions].sort((a, b) => a - b).join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            {/* MEALS PERMISSIONS */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <ChefHat className="h-4 w-4 text-orange-600" />
                                    {t('meals.add.nameLabel')}
                                </h3>

                                <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-3">
                                    {mealsData?.data?.values?.map((meal: any) => (
                                        <div key={meal.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedMealPermissions.includes(meal.id)}
                                                onCheckedChange={() =>
                                                    toggleEntityPermission(
                                                        meal.id,
                                                        selectedMealPermissions,
                                                        setSelectedMealPermissions
                                                    )
                                                }
                                            />
                                            <Label className="text-sm cursor-pointer">
                                                {meal.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MACHINES PERMISSIONS */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Cpu className="h-4 w-4 text-blue-600" />
                                    {t('machines.add.title')}
                                </h3>

                                <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-3">
                                    {machinesData?.data?.values?.map((machine: any) => (
                                        <div key={machine.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedMachinePermissions.includes(machine.id)}
                                                onCheckedChange={() =>
                                                    toggleEntityPermission(
                                                        machine.id,
                                                        selectedMachinePermissions,
                                                        setSelectedMachinePermissions
                                                    )
                                                }
                                            />
                                            <Label className="text-sm cursor-pointer">
                                                {machine.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ARTICLES PERMISSIONS */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-600" />
                                    {t('articles.add.title')}
                                </h3>

                                <div className="border border-gray-200 rounded-lg p-4 grid grid-cols-2 gap-3">
                                    {articlesData?.data?.values?.map((article: any) => (
                                        <div key={article.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={selectedArticlePermissions.includes(article.id)}
                                                onCheckedChange={() =>
                                                    toggleEntityPermission(
                                                        article.id,
                                                        selectedArticlePermissions,
                                                        setSelectedArticlePermissions
                                                    )
                                                }
                                            />
                                            <Label className="text-sm cursor-pointer">
                                                {article.title || article.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                type="button"
                                onClick={handleClose}
                                disabled={isUpdating}
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                {t('users.add.cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isUpdating || isLoadingPermissions || selectedPermissions.length === 0}
                            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('users.permissions.updating')}
                                </>
                            ) : (
                                <>
                                    <Shield className="h-4 w-4" />
                                    {t('users.permissions.updateButton')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}