
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
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { useUsersPutMutation } from "@/api/feature/users/putSlice";
// import { useGetUsersByIdQuery } from "@/api/feature/users/getSlice";
// import {
//     Pencil,
//     X,
//     User,
//     Loader,
//     Key,
//     ChefHat,
//     Tag,
//     ShoppingBag,
//     Package,
//     Cpu,
//     FileText,
//     Layers,
//     Scale
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";
// import { PERMISSIONS } from "@/constants/permissions";
// import { useTranslation } from "react-i18next";

// // استيراد مكتبة إدخال رقم الهاتف
// import PhoneInput from 'react-phone-number-input';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// interface EditUserProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     userId: string;
// }

// interface EditUserPayload {
//     userName: string;
//     email: string;
//     phoneNumber: string;
//     code: string;
//     permissions: number[];
// }

// // Interface for permission category
// interface PermissionCategory {
//     name: string;
//     icon: React.ReactNode;
//     permissions: Array<{
//         id: number;
//     }>;
// }

// export default function EditUser({ isOpen, onOpenChange, userId }: EditUserProps) {
//     const { t } = useTranslation();

//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//         setValue,
//         watch,
//         trigger,
//     } = useForm<EditUserPayload>({
//         defaultValues: {
//             userName: "",
//             email: "",
//             phoneNumber: "",
//             code: "",
//             permissions: []
//         },
//         mode: "onBlur"
//     });

//     // Fetch user data by ID
//     const { data: userData, isLoading: isLoadingUser, isError } = useGetUsersByIdQuery(userId, {
//         skip: !userId || !isOpen
//     });

//     const [updateUser, { isLoading: isUpdating }] = useUsersPutMutation();
//     const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
//     const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
//     const [phoneError, setPhoneError] = useState<string>("");
//     const [countryCode, setCountryCode] = useState<string>("");

//     // مشاهدة قيمة رقم الهاتف
//     const phoneValue = watch("phoneNumber");

//     // استخراج رمز البلد من رقم الهاتف
//     useEffect(() => {
//         if (phoneValue) {
//             try {
//                 const phoneInputElement = document.querySelector('.PhoneInputCountrySelect');
//                 if (phoneInputElement) {
//                     const selectedCountry = (phoneInputElement as HTMLSelectElement).value;
//                     if (selectedCountry && selectedCountry.length === 2) {
//                         setCountryCode(selectedCountry.toUpperCase());
//                         setValue("code", selectedCountry.toUpperCase());
//                     }
//                 }
//             } catch (error) {
//                 setCountryCode("");
//                 setValue("code", "");
//             }
//         } else {
//             setCountryCode("");
//             setValue("code", "");
//         }
//     }, [phoneValue, setValue]);

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

//     // Load user data when dialog opens or userData changes
//     useEffect(() => {
//         if (isOpen && userData?.data) {
//             const user = userData.data;

//             // Set form values from API response
//             setValue("userName", user.userName || "");
//             setValue("email", user.email || "");
//             setValue("phoneNumber", user.phoneNumber || "");
//             setValue("code", user.code || "");

//             // إذا كان هناك رمز بلد مخزن، ضعيه في state
//             if (user.code) {
//                 setCountryCode(user.code);
//             }

//             // Set permissions from API response
//             const userPermissions = user.permissions || [];
//             setSelectedPermissions(userPermissions);

//             setIsLoadingPermissions(false);
//             setPhoneError("");
//         } else if (isOpen) {
//             // Reset form when opening without data
//             reset({
//                 userName: "",
//                 email: "",
//                 phoneNumber: "",
//                 code: "",
//                 permissions: []
//             });
//             setSelectedPermissions([]);
//             setCountryCode("");
//             setPhoneError("");
//             setIsLoadingPermissions(false);
//         }
//     }, [isOpen, userData, reset, setValue]);

//     // Show error if API call fails
//     useEffect(() => {
//         if (isError && isOpen) {
//             toast.error(t('users.edit.error.loadFailed'));
//         }
//     }, [isError, isOpen, t]);

//     // التحقق من صحة رقم الهاتف
//     const validatePhoneNumber = (phone: string): boolean => {
//         if (!phone) {
//             setPhoneError(t('users.add.validation.phoneRequired'));
//             return false;
//         }

//         // التحقق من أن الرقم يحتوي على رمز الدولة
//         if (!phone.startsWith('+')) {
//             setPhoneError(t('users.add.validation.phoneCountryCode'));
//             return false;
//         }

//         // استخدام المكتبة للتحقق من صحة الرقم
//         if (!isValidPhoneNumber(phone)) {
//             setPhoneError(t('users.add.validation.phoneInvalid'));
//             return false;
//         }

//         setPhoneError("");
//         return true;
//     };

//     // عند فقدان التركيز من حقل الهاتف
//     const handlePhoneBlur = () => {
//         if (phoneValue) {
//             validatePhoneNumber(phoneValue);
//         }
//         trigger("phoneNumber");
//     };

//     // Handle phone number change
//     const handlePhoneChange = (value: string | undefined) => {
//         setValue("phoneNumber", value || "");
//         if (value) {
//             validatePhoneNumber(value);
//         }
//     };

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
//     const onSubmit = async (data: EditUserPayload) => {
//         try {
//             // التحقق من صحة رقم الهاتف قبل الإرسال
//             if (!validatePhoneNumber(data.phoneNumber)) {
//                 return;
//             }

//             // // Validate at least one permission is selected
//             // if (selectedPermissions.length === 0) {
//             //     toast.error(t('users.add.validation.selectPermission'));
//             //     return;
//             // }

//             // Prepare payload according to API requirements
//             const payload = {
//                 userId: userId,
//                 userName: data.userName,
//                 email: data.email,
//                 phoneNumber: data.phoneNumber,
//                 region: countryCode || data.code,
//                 // permissions: selectedPermissions.sort((a, b) => a - b)
//                 permissions: selectedPermissions.slice().sort((a, b) => a - b)
//             };

//             const res = await updateUser(payload);
//             const result = handleApiResponse(res);

//             if (result.success) {
//                 toast.success(t('users.edit.success'));
//                 handleClose();
//             } else {
//                 toast.error(result.error || t('users.edit.error.updateFailed'));
//             }
//         } catch (error: any) {
//             console.error("Error updating user:", error);
//             toast.error(error?.data?.error || error?.error || t('users.edit.error.generic'));
//         }
//     };

//     // Handle dialog close
//     const handleClose = () => {
//         reset();
//         setSelectedPermissions([]);
//         setCountryCode("");
//         setPhoneError("");
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
//                             <p className="text-gray-600">{t('users.edit.loading')}</p>
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
//                             {t('users.edit.error.title')}
//                         </h3>
//                         <p className="text-gray-600 mb-6">
//                             {t('users.edit.error.message')}
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
//             <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <Pencil className="h-6 w-6 text-blue-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t('users.edit.title')}
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1 text-sm">
//                                     {t('users.edit.subtitle')}
//                                 </p>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     {/* Content */}
//                     <div className="p-6  max-h-[65vh] overflow-y-auto">
//                         <div className="space-y-6">
//                             {/* Basic Information */}
//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-semibold">{t('users.add.basicInfo')}</h3>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     {/* Username */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="userName" className="text-sm font-medium">
//                                             {t('users.add.username')} *
//                                         </Label>
//                                         <Input
//                                             id="userName"
//                                             {...register("userName", {
//                                                 required: t('users.add.validation.usernameRequired'),
//                                                 minLength: {
//                                                     value: 2,
//                                                     message: t('users.add.validation.usernameMinLength')
//                                                 }
//                                             })}
//                                             disabled={isLoadingPermissions}
//                                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                             placeholder={t('users.add.placeholders.username')}
//                                         />
//                                         {errors.userName && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
//                                         )}
//                                     </div>

//                                     {/* Email */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="email" className="text-sm font-medium">
//                                             {t('users.add.email')} *
//                                         </Label>
//                                         <Input
//                                             id="email"
//                                             type="email"
//                                             {...register("email", {
//                                                 required: t('users.add.validation.emailRequired'),
//                                                 pattern: {
//                                                     value: /^\S+@\S+$/i,
//                                                     message: t('users.add.validation.emailInvalid')
//                                                 }
//                                             })}
//                                             disabled={isLoadingPermissions}
//                                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                             placeholder={t('users.add.placeholders.email')}
//                                         />
//                                         {errors.email && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
//                                         )}
//                                     </div>

//                                     {/* Phone Number */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="phoneNumber" className="text-sm font-medium">
//                                             {t('users.add.phoneNumber')} *
//                                         </Label>
//                                         <div className="custom-phone-input">
//                                             <PhoneInput
//                                                 international
//                                                 defaultCountry="SA"
//                                                 value={phoneValue}
//                                                 onChange={handlePhoneChange}
//                                                 onBlur={handlePhoneBlur}
//                                                 placeholder={t('users.add.placeholders.phone')}
//                                                 className="phone-input-custom"
//                                             />
//                                         </div>
//                                         {phoneError && (
//                                             <p className="text-red-500 text-xs mt-1">{phoneError}</p>
//                                         )}
//                                         {errors.phoneNumber && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
//                                         )}
//                                     </div>
//                                 </div>
//                             </div>

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
//                                                 {t('users.edit.permissionsSubtitle')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">
//                                             {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
//                                         </span>
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
//                             disabled={isUpdating || isLoadingPermissions || selectedPermissions.length === 0 || !!phoneError}
//                             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
//                         >
//                             {isUpdating ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t('users.edit.updating')}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Pencil className="h-4 w-4" />
//                                     {t('users.edit.updateButton')}
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useUsersPutMutation } from "@/api/feature/users/putSlice";
import { useGetUsersByIdQuery } from "@/api/feature/users/getSlice";
import {
    Pencil,
    X,
    User,
    Loader,
    Key,
    ChefHat,
    Tag,
    ShoppingBag,
    Package,
    Cpu,
    FileText,
    Layers,
    Scale
} from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from "react-i18next";

// استيراد مكتبة إدخال رقم الهاتف
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ar from 'react-phone-number-input/locale/ar';
import en from 'react-phone-number-input/locale/en';
interface EditUserProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

interface EditUserPayload {
    userName: string;
    email: string;
    phoneNumber: string;
    code: string;
    permissions: number[];
    active: boolean;
    limitAccess: boolean;
    activeFrom: string; // أو Date إذا حبيت تستخدم date picker
    activeTo: string;   // أو Date
}


// Interface for permission category
interface PermissionCategory {
    name: string;
    icon: React.ReactNode;
    permissions: Array<{
        id: number;
    }>;
}

export default function EditUser({ isOpen, onOpenChange, userId }: EditUserProps) {
    const { t, i18n } = useTranslation();
    const labels = i18n.language === 'ar' ? ar : en;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
        trigger,
    } = useForm<EditUserPayload>({
        defaultValues: {
            userName: "",
            email: "",
            phoneNumber: "",
            code: "",
            permissions: [],
            active: true,
            limitAccess: true,
            activeFrom: new Date().toISOString(),
            activeTo: new Date().toISOString()
        },
        mode: "onBlur"
    });

    // Fetch user data by ID
    const { data: userData, isLoading: isLoadingUser, isError } = useGetUsersByIdQuery(userId, {
        skip: !userId || !isOpen
    });

    const [updateUser, { isLoading: isUpdating }] = useUsersPutMutation();
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [isLoadingPermissions, setIsLoadingPermissions] = useState(true);
    const [phoneError, setPhoneError] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("");

    // مشاهدة قيمة رقم الهاتف
    const phoneValue = watch("phoneNumber");

    // استخراج رمز البلد من رقم الهاتف
    useEffect(() => {
        if (phoneValue) {
            try {
                const phoneInputElement = document.querySelector('.PhoneInputCountrySelect');
                if (phoneInputElement) {
                    const selectedCountry = (phoneInputElement as HTMLSelectElement).value;
                    if (selectedCountry && selectedCountry.length === 2) {
                        setCountryCode(selectedCountry.toUpperCase());
                        setValue("code", selectedCountry.toUpperCase());
                    }
                }
            } catch (error) {
                setCountryCode("");
                setValue("code", "");
            }
        } else {
            setCountryCode("");
            setValue("code", "");
        }
    }, [phoneValue, setValue]);

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

    // Load user data when dialog opens or userData changes
    useEffect(() => {
        if (isOpen && userData?.data) {
            const user = userData.data;

            setValue("userName", user.userName || "");
            setValue("email", user.email || "");
            setValue("phoneNumber", user.phoneNumber || "");
            setValue("code", user.region || "");
            setCountryCode(user.region || "");

            setSelectedPermissions(user.permissions || []);

            // الحقول الجديدة
            setValue("active", user.active ?? true);
            setValue("limitAccess", user.limitAccess ?? true);
            setValue("activeFrom", user.activeFrom ? new Date(user.activeFrom).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));
            setValue("activeTo", user.activeTo ? new Date(user.activeTo).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16));

            setIsLoadingPermissions(false);
            setPhoneError("");
        }
    }, [isOpen, userData, reset, setValue]);


    // Show error if API call fails
    useEffect(() => {
        if (isError && isOpen) {
            toast.error(t('users.edit.error.loadFailed'));
        }
    }, [isError, isOpen, t]);

    // التحقق من صحة رقم الهاتف
    const validatePhoneNumber = (phone: string): boolean => {
        if (!phone) {
            setPhoneError(t('users.add.validation.phoneRequired'));
            return false;
        }

        // التحقق من أن الرقم يحتوي على رمز الدولة
        if (!phone.startsWith('+')) {
            setPhoneError(t('users.add.validation.phoneCountryCode'));
            return false;
        }

        // استخدام المكتبة للتحقق من صحة الرقم
        if (!isValidPhoneNumber(phone)) {
            setPhoneError(t('users.add.validation.phoneInvalid'));
            return false;
        }

        setPhoneError("");
        return true;
    };

    // عند فقدان التركيز من حقل الهاتف
    const handlePhoneBlur = () => {
        if (phoneValue) {
            validatePhoneNumber(phoneValue);
        }
        trigger("phoneNumber");
    };

    // Handle phone number change
    const handlePhoneChange = (value: string | undefined) => {
        setValue("phoneNumber", value || "");
        if (value) {
            validatePhoneNumber(value);
        }
    };

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

    // Handle form submission
    const onSubmit = async (data: EditUserPayload) => {
        try {
            // التحقق من صحة رقم الهاتف قبل الإرسال
            if (!validatePhoneNumber(data.phoneNumber)) {
                return;
            }

            // // Validate at least one permission is selected
            // if (selectedPermissions.length === 0) {
            //     toast.error(t('users.add.validation.selectPermission'));
            //     return;
            // }

            // Prepare payload according to API requirements
            const payload = {
                userId: userId,
                userName: data.userName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                region: countryCode || data.code,
                permissions: selectedPermissions.slice().sort((a, b) => a - b),
                active: data.active,
                limitAccess: data.limitAccess,
                activeFrom: new Date(data.activeFrom).toISOString(),
                activeTo: new Date(data.activeTo).toISOString()
            };


            const res = await updateUser(payload);
            const result = handleApiResponse(res);

            if (result.success) {
                toast.success(result.error)
                handleClose();
            } else {
                toast.error(result.error || t('users.edit.error.updateFailed'));
            }
        } catch (error: any) {
            console.error("Error updating user:", error);
            toast.error(error?.data?.error || error?.error || t('users.edit.error.generic'));
        }
    };

    // Handle dialog close
    const handleClose = () => {
        reset();
        setSelectedPermissions([]);
        setCountryCode("");
        setPhoneError("");
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
                            <p className="text-gray-600">{t('users.edit.loading')}</p>
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
                            {t('users.edit.error.title')}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {t('users.edit.error.message')}
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
            <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Pencil className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('users.edit.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('users.edit.subtitle')}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="p-6  max-h-[65vh] overflow-y-auto">
                        <div className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">{t('users.add.basicInfo')}</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Username */}
                                    <div className="space-y-2">
                                        <Label htmlFor="userName" className="text-sm font-medium">
                                            {t('users.add.username')} *
                                        </Label>
                                        <Input
                                            id="userName"
                                            {...register("userName", {
                                                required: t('users.add.validation.usernameRequired'),
                                                minLength: {
                                                    value: 2,
                                                    message: t('users.add.validation.usernameMinLength')
                                                }
                                            })}
                                            disabled={isLoadingPermissions}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder={t('users.add.placeholders.username')}
                                        />
                                        {errors.userName && (
                                            <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium">
                                            {t('users.add.email')} *
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email", {
                                                required: t('users.add.validation.emailRequired'),
                                                pattern: {
                                                    value: /^\S+@\S+$/i,
                                                    message: t('users.add.validation.emailInvalid')
                                                }
                                            })}
                                            disabled={isLoadingPermissions}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder={t('users.add.placeholders.email')}
                                        />
                                        {errors.email && (
                                            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                                        )}
                                    </div>

                                    {/* Phone Number */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber" className="text-sm font-medium">
                                            {t('users.add.phoneNumber')} *
                                        </Label>
                                        <div className="custom-phone-input">
                                            <PhoneInput
                                                international
                                                defaultCountry="SA"
                                                value={phoneValue}
                                                onChange={handlePhoneChange}
                                                onBlur={handlePhoneBlur}
                                                placeholder={t('users.add.placeholders.phone')}
                                                className="phone-input-custom"
                                                labels={labels}
                                            />
                                        </div>
                                        {phoneError && (
                                            <p className="text-red-500 text-xs mt-1">{phoneError}</p>
                                        )}
                                        {errors.phoneNumber && (
                                            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber.message}</p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {/* Active */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="active"
                                                checked={watch("active")}
                                                onCheckedChange={(checked: any) => setValue("active", checked)}
                                                // {...register("active")}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="active">{t('users.add.active')}</Label>
                                        </div>

                                        {/* Limit Access */}
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="limitAccess"
                                                checked={watch("limitAccess")}
                                                onCheckedChange={(checked: any) => setValue("limitAccess", checked)}
                                                // {...register("limitAccess")}
                                                className="h-4 w-4"
                                            />
                                            <Label htmlFor="limitAccess">{t('users.add.limitAccess')}</Label>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        {/* Active From */}
                                        <div className="space-y-1">
                                            <Label htmlFor="activeFrom">{t('users.add.activeFrom')}</Label>
                                            <Input
                                                id="activeFrom"
                                                type="datetime-local"
                                                {...register("activeFrom")}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>

                                        {/* Active To */}
                                        <div className="space-y-1">
                                            <Label htmlFor="activeTo">{t('users.add.activeTo')}</Label>
                                            <Input
                                                id="activeTo"
                                                type="datetime-local"
                                                {...register("activeTo")}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>

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
                                                {t('users.edit.permissionsSubtitle')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                            {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
                                        </span>
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
                                    </>
                                )}
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
                            disabled={isUpdating || isLoadingPermissions || selectedPermissions.length === 0 || !!phoneError}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('users.edit.updating')}
                                </>
                            ) : (
                                <>
                                    <Pencil className="h-4 w-4" />
                                    {t('users.edit.updateButton')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}