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
// import { useUserPostMutation } from "@/api/feature/users/postSlice";
// import {
//     Plus,
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
//     Scale,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";
// import { PERMISSIONS } from "@/constants/permissions";
// import { useTranslation } from "react-i18next";

// import PhoneInput from 'react-phone-number-input';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// interface AddUserProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// interface AddUserPayload {
//     userName: string;
//     email: string;
//     password: string;
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

// export default function AddUser({ isOpen, onOpenChange }: AddUserProps) {
//     const { t } = useTranslation();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//         setValue,
//         watch,
//         trigger,
//     } = useForm<AddUserPayload>({
//         defaultValues: {
//             userName: "",
//             email: "",
//             password: "",
//             phoneNumber: "",
//             code: "",
//             permissions: []
//         },
//         mode: "onBlur"
//     });

//     const [createUser, { isLoading }] = useUserPostMutation();
//     const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
//     const [phoneError, setPhoneError] = useState<string>("");
//     const [countryCode, setCountryCode] = useState<string>("");
//     const phoneValue = watch("phoneNumber");

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

//     useEffect(() => {
//         if (isOpen) {
//             reset({
//                 userName: "",
//                 email: "",
//                 password: "",
//                 phoneNumber: "",
//                 code: "",
//                 permissions: []
//             });
//             setSelectedPermissions([]);
//             setPhoneError("");
//             setCountryCode("");
//         }
//     }, [isOpen, reset]);

//     const handlePermissionToggle = (permissionId: number) => {
//         setSelectedPermissions(prev => {
//             if (prev.includes(permissionId)) {
//                 return prev.filter(id => id !== permissionId);
//             } else {
//                 return [...prev, permissionId];
//             }
//         });
//     };

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

//     const isCategoryAllSelected = (category: PermissionCategory): boolean => {
//         const categoryPermissionIds = category.permissions.map(p => p.id);
//         return categoryPermissionIds.length > 0 &&
//             categoryPermissionIds.every(id => selectedPermissions.includes(id));
//     };

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

//     const handlePhoneBlur = () => {
//         if (phoneValue) {
//             validatePhoneNumber(phoneValue);
//         }
//         trigger("phoneNumber");
//     };

//     const handlePhoneChange = (value: string | undefined) => {
//         setValue("phoneNumber", value || "");
//         if (value) {
//             validatePhoneNumber(value);
//         }
//     };

//     const onSubmit = async (data: AddUserPayload) => {
//         try {
//             if (!validatePhoneNumber(data.phoneNumber)) {
//                 return;
//             }

//             if (selectedPermissions.length === 0) {
//                 toast.error(t('users.add.validation.selectPermission'));
//                 return;
//             }

//             const payload = {
//                 userName: data.userName,
//                 email: data.email,
//                 phoneNumber: data.phoneNumber,
//                 region: countryCode || data.code,
//                 password: data.password,
//                 permissions: selectedPermissions.sort((a, b) => a - b)
//             };
//             const res = await createUser(payload);
//             const result = handleApiResponse(res);

//             if (result.success) {
//                 toast.success(t('users.add.success'));
//                 reset();
//                 setSelectedPermissions([]);
//                 setPhoneError("");
//                 setCountryCode("");
//                 onOpenChange(false);
//             } else {
//                 toast.error(result.error || t('users.add.error'));
//             }
//         } catch (error: any) {
//             console.error("Error adding user:", error);
//             toast.error(error?.data?.error || error?.error || t('users.add.genericError'));
//         }
//     };

//     const handleClose = () => {
//         reset();
//         setSelectedPermissions([]);
//         setPhoneError("");
//         setCountryCode("");
//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <User className="h-6 w-6 text-blue-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t('users.add.title')}
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1 text-sm">
//                                     {t('users.add.subtitle')}
//                                 </p>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     {/* Content */}
//                     <div className="p-6 max-h-[65vh] overflow-y-auto ">
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

//                                     {/* Password */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="password" className="text-sm font-medium">
//                                             {t('users.add.password')} *
//                                         </Label>
//                                         <Input
//                                             id="password"
//                                             type="password"
//                                             {...register("password", {
//                                                 required: t('users.add.validation.passwordRequired'),
//                                                 minLength: {
//                                                     value: 6,
//                                                     message: t('users.add.validation.passwordMinLength')
//                                                 }
//                                             })}
//                                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                             placeholder={t('users.add.placeholders.password')}
//                                         />
//                                         {errors.password && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
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
//                                                 {t('users.add.permissionsSubtitle')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">
//                                             {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Permissions List */}
//                                 <div className="border border-gray-200 rounded-lg p-4 space-y-4 max-h-[350px] overflow-y-auto">
//                                     {permissionCategories.map((category) => (
//                                         <div key={category.name} className="space-y-3">
//                                             {/* Category Header */}
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="p-2 bg-gray-100 rounded-lg">
//                                                         {category.icon}
//                                                     </div>
//                                                     <div>
//                                                         <h4 className="font-medium text-gray-900">
//                                                             {t(`users.permissions.categories.${category.name}`)}
//                                                         </h4>
//                                                         <p className="text-xs text-gray-500">
//                                                             {category.permissions.length} {t('users.add.permissionsCount')}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="text-xs text-gray-500">
//                                                         {category.permissions.filter(p => selectedPermissions.includes(p.id)).length}/{category.permissions.length}
//                                                     </span>
//                                                     <Checkbox
//                                                         checked={isCategoryAllSelected(category)}
//                                                         onCheckedChange={() => handleSelectAllCategory(category)}
//                                                         className="h-4 w-4"
//                                                     />
//                                                 </div>
//                                             </div>

//                                             {/* Category Permissions */}
//                                             <div className="grid grid-cols-2 gap-3 pl-11">
//                                                 {category.permissions.map((permission) => (
//                                                     <div
//                                                         key={permission.id}
//                                                         className="flex items-center space-x-2"
//                                                     >
//                                                         <Checkbox
//                                                             id={`permission-${permission.id}`}
//                                                             checked={selectedPermissions.includes(permission.id)}
//                                                             onCheckedChange={() => handlePermissionToggle(permission.id)}
//                                                             className="h-4 w-4"
//                                                         />
//                                                         <Label
//                                                             htmlFor={`permission-${permission.id}`}
//                                                             className="text-sm font-normal cursor-pointer"
//                                                         >
//                                                             {t(`users.permissions.actions.${permission.id}`)}
//                                                         </Label>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Validation Message */}
//                                 {selectedPermissions.length === 0 && (
//                                     <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg">
//                                         <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                                         {t('users.add.validation.selectPermission')}
//                                     </div>
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
//                                 className="flex items-center gap-2"
//                             >
//                                 <X className="h-4 w-4" />
//                                 {t('users.add.cancel')}
//                             </Button>
//                         </DialogClose>
//                         <Button
//                             type="submit"
//                             disabled={isLoading || selectedPermissions.length === 0 || !!phoneError}
//                             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t('users.add.adding')}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Plus className="h-4 w-4" />
//                                     {t('users.add.addUser')}
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
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
// import { useUserPostMutation } from "@/api/feature/users/postSlice";
// import {
//     Plus,
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
//     Scale,
// } from "lucide-react";
// import { useEffect, useState } from "react";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";
// import { PERMISSIONS } from "@/constants/permissions";
// import { useTranslation } from "react-i18next";

// import PhoneInput from 'react-phone-number-input';
// import { isValidPhoneNumber } from 'react-phone-number-input';
// import 'react-phone-number-input/style.css';

// interface AddUserProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// interface AddUserPayload {
//     userName: string;
//     email: string;
//     password: string;
//     phoneNumber: string;
//     code: string;
//     permissions: number[];
//     active: boolean;
//     limitAccess: boolean;
//     activeFrom?: string;
//     activeTo?: string;
// }

// // Interface for permission category
// interface PermissionCategory {
//     name: string;
//     icon: React.ReactNode;
//     permissions: Array<{
//         id: number;
//     }>;
// }

// export default function AddUser({ isOpen, onOpenChange }: AddUserProps) {
//     const { t } = useTranslation();
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//         setValue,
//         watch,
//         trigger,
//     } = useForm<AddUserPayload>({
//         defaultValues: {
//             userName: "",
//             email: "",
//             password: "",
//             phoneNumber: "",
//             code: "",
//             permissions: [],
//             active: true,
//             limitAccess: true,
//             activeFrom: "",
//             activeTo: ""
//         },
//         mode: "onBlur"
//     });

//     const [createUser, { isLoading }] = useUserPostMutation();
//     const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
//     const [phoneError, setPhoneError] = useState<string>("");
//     const [countryCode, setCountryCode] = useState<string>("");
//     const phoneValue = watch("phoneNumber");

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

//     useEffect(() => {
//         if (isOpen) {
//             reset({
//                 userName: "",
//                 email: "",
//                 password: "",
//                 phoneNumber: "",
//                 code: "",
//                 permissions: []
//             });
//             setSelectedPermissions([]);
//             setPhoneError("");
//             setCountryCode("");
//         }
//     }, [isOpen, reset]);

//     const handlePermissionToggle = (permissionId: number) => {
//         setSelectedPermissions(prev => {
//             if (prev.includes(permissionId)) {
//                 return prev.filter(id => id !== permissionId);
//             } else {
//                 return [...prev, permissionId];
//             }
//         });
//     };

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

//     const isCategoryAllSelected = (category: PermissionCategory): boolean => {
//         const categoryPermissionIds = category.permissions.map(p => p.id);
//         return categoryPermissionIds.length > 0 &&
//             categoryPermissionIds.every(id => selectedPermissions.includes(id));
//     };

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

//     const handlePhoneBlur = () => {
//         if (phoneValue) {
//             validatePhoneNumber(phoneValue);
//         }
//         trigger("phoneNumber");
//     };

//     const handlePhoneChange = (value: string | undefined) => {
//         setValue("phoneNumber", value || "");
//         if (value) {
//             validatePhoneNumber(value);
//         }
//     };

//     const onSubmit = async (data: AddUserPayload) => {
//         try {
//             if (!validatePhoneNumber(data.phoneNumber)) {
//                 return;
//             }

//             if (selectedPermissions.length === 0) {
//                 toast.error(t('users.add.validation.selectPermission'));
//                 return;
//             }

//             // const payload = {
//             //     userName: data.userName,
//             //     email: data.email,
//             //     phoneNumber: data.phoneNumber,
//             //     region: countryCode || data.code,
//             //     password: data.password,
//             //     permissions: selectedPermissions.sort((a, b) => a - b)
//             // };
//             const payload = {
//                 permissions: selectedPermissions.sort((a, b) => a - b),
//                 userName: data.userName,
//                 email: data.email,
//                 phoneNumber: data.phoneNumber,
//                 region: countryCode || data.code,
//                 password: data.password,
//                 active: data.active,
//                 limitAccess: data.limitAccess,
//                 activeFrom: data.limitAccess ? data.activeFrom : null,
//                 activeTo: data.limitAccess ? data.activeTo : null
//             };

//             const res = await createUser(payload);
//             const result = handleApiResponse(res);

//             if (result.success) {
//                 toast.success(t('users.add.success'));
//                 reset();
//                 setSelectedPermissions([]);
//                 setPhoneError("");
//                 setCountryCode("");
//                 onOpenChange(false);
//             } else {
//                 toast.error(result.error || t('users.add.error'));
//             }
//         } catch (error: any) {
//             console.error("Error adding user:", error);
//             toast.error(error?.data?.error || error?.error || t('users.add.genericError'));
//         }
//     };

//     const handleClose = () => {
//         reset();
//         setSelectedPermissions([]);
//         setPhoneError("");
//         setCountryCode("");
//         onOpenChange(false);
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <User className="h-6 w-6 text-blue-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t('users.add.title')}
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1 text-sm">
//                                     {t('users.add.subtitle')}
//                                 </p>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     {/* Content */}
//                     <div className="p-6 max-h-[65vh] overflow-y-auto ">
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

//                                     {/* Password */}
//                                     <div className="space-y-2">
//                                         <Label htmlFor="password" className="text-sm font-medium">
//                                             {t('users.add.password')} *
//                                         </Label>
//                                         <Input
//                                             id="password"
//                                             type="password"
//                                             {...register("password", {
//                                                 required: t('users.add.validation.passwordRequired'),
//                                                 minLength: {
//                                                     value: 6,
//                                                     message: t('users.add.validation.passwordMinLength')
//                                                 }
//                                             })}
//                                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                                             placeholder={t('users.add.placeholders.password')}
//                                         />
//                                         {errors.password && (
//                                             <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
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
//                                                 {t('users.add.permissionsSubtitle')}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         <span className="text-sm text-gray-600">
//                                             {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
//                                         </span>
//                                     </div>
//                                 </div>

//                                 {/* Permissions List */}
//                                 <div className="border border-gray-200 rounded-lg p-4 space-y-4 max-h-[350px] overflow-y-auto">
//                                     {permissionCategories.map((category) => (
//                                         <div key={category.name} className="space-y-3">
//                                             {/* Category Header */}
//                                             <div className="flex items-center justify-between">
//                                                 <div className="flex items-center gap-3">
//                                                     <div className="p-2 bg-gray-100 rounded-lg">
//                                                         {category.icon}
//                                                     </div>
//                                                     <div>
//                                                         <h4 className="font-medium text-gray-900">
//                                                             {t(`users.permissions.categories.${category.name}`)}
//                                                         </h4>
//                                                         <p className="text-xs text-gray-500">
//                                                             {category.permissions.length} {t('users.add.permissionsCount')}
//                                                         </p>
//                                                     </div>
//                                                 </div>
//                                                 <div className="flex items-center gap-2">
//                                                     <span className="text-xs text-gray-500">
//                                                         {category.permissions.filter(p => selectedPermissions.includes(p.id)).length}/{category.permissions.length}
//                                                     </span>
//                                                     <Checkbox
//                                                         checked={isCategoryAllSelected(category)}
//                                                         onCheckedChange={() => handleSelectAllCategory(category)}
//                                                         className="h-4 w-4"
//                                                     />
//                                                 </div>
//                                             </div>

//                                             {/* Category Permissions */}
//                                             <div className="grid grid-cols-2 gap-3 pl-11">
//                                                 {category.permissions.map((permission) => (
//                                                     <div
//                                                         key={permission.id}
//                                                         className="flex items-center space-x-2"
//                                                     >
//                                                         <Checkbox
//                                                             id={`permission-${permission.id}`}
//                                                             checked={selectedPermissions.includes(permission.id)}
//                                                             onCheckedChange={() => handlePermissionToggle(permission.id)}
//                                                             className="h-4 w-4"
//                                                         />
//                                                         <Label
//                                                             htmlFor={`permission-${permission.id}`}
//                                                             className="text-sm font-normal cursor-pointer"
//                                                         >
//                                                             {t(`users.permissions.actions.${permission.id}`)}
//                                                         </Label>
//                                                     </div>
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>

//                                 {/* Validation Message */}
//                                 {selectedPermissions.length === 0 && (
//                                     <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg">
//                                         <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
//                                         {t('users.add.validation.selectPermission')}
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="flex items-center gap-6">
//                                 <div className="flex items-center gap-2">
//                                     <Checkbox
//                                         checked={watch("active")}
//                                         onCheckedChange={(value) => setValue("active", Boolean(value))}
//                                     />
//                                     <Label>{t('users.add.active')}</Label>
//                                 </div>

//                                 <div className="flex items-center gap-2">
//                                     <Checkbox
//                                         checked={watch("limitAccess")}
//                                         onCheckedChange={(value) => setValue("limitAccess", Boolean(value))}
//                                     />
//                                     <Label>{t('users.add.limitAccess')}</Label>
//                                 </div>
//                             </div>
//                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                 <div className="space-y-2">
//                                     <Label>{t('users.add.activeFrom')}</Label>
//                                     <Input
//                                         type="datetime-local"
//                                         onChange={(e) =>
//                                             setValue("activeFrom", new Date(e.target.value).toISOString())
//                                         }
//                                     />
//                                 </div>

//                                 <div className="space-y-2">
//                                     <Label>{t('users.add.activeTo')}</Label>
//                                     <Input
//                                         type="datetime-local"
//                                         onChange={(e) =>
//                                             setValue("activeTo", new Date(e.target.value).toISOString())
//                                         }
//                                     />
//                                 </div>
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
//                                 className="flex items-center gap-2"
//                             >
//                                 <X className="h-4 w-4" />
//                                 {t('users.add.cancel')}
//                             </Button>
//                         </DialogClose>
//                         <Button
//                             type="submit"
//                             disabled={isLoading || selectedPermissions.length === 0 || !!phoneError}
//                             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t('users.add.adding')}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Plus className="h-4 w-4" />
//                                     {t('users.add.addUser')}
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
import { useUserPostMutation } from "@/api/feature/users/postSlice";
import {
    Plus,
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
    Scale,
} from "lucide-react";
import { useEffect, useState } from "react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { PERMISSIONS } from "@/constants/permissions";
import { useTranslation } from "react-i18next";

import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import ar from 'react-phone-number-input/locale/ar';
import en from 'react-phone-number-input/locale/en';
import { useFilterArticlesQuery } from "@/api/feature/articles/getSlices";
import { useFilterMachinesQuery } from "@/api/feature/machines/getSlice";
import { useFilterMealsQuery } from "@/api/feature/meals/getSlice";

interface AddUserProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface AddUserPayload {
    userName: string;
    email: string;
    password: string;
    phoneNumber: string;
    code: string;
    permissions: number[];
    active: boolean;
    limitAccess: boolean;
    activeFrom?: string;
    activeTo?: string;
}

// Interface for permission category
interface PermissionCategory {
    name: string;
    icon: React.ReactNode;
    permissions: Array<{
        id: number;
    }>;
}

export default function AddUser({ isOpen, onOpenChange }: AddUserProps) {
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
    } = useForm<AddUserPayload>({
        defaultValues: {
            userName: "",
            email: "",
            password: "",
            phoneNumber: "",
            code: "",
            permissions: [],
            active: true,
            limitAccess: true,
            activeFrom: "",
            activeTo: ""
        },
        mode: "onBlur"
    });

    const [createUser, { isLoading }] = useUserPostMutation();
    const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
    const [selectedMealPermissions, setSelectedMealPermissions] = useState<string[]>([]);
    const [selectedMachinePermissions, setSelectedMachinePermissions] = useState<string[]>([]);
    const [selectedArticlePermissions, setSelectedArticlePermissions] = useState<string[]>([]);

    const [phoneError, setPhoneError] = useState<string>("");
    const [countryCode, setCountryCode] = useState<string>("");
    const phoneValue = watch("phoneNumber");
    const { data: articlesData } = useFilterArticlesQuery({ page: 1, size: 100 });
    const { data: machinesData } = useFilterMachinesQuery({ page: 1, size: 100 });
    const { data: mealsData } = useFilterMealsQuery({ page: 1, size: 100 });

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

    useEffect(() => {
        if (isOpen) {
            reset({
                userName: "",
                email: "",
                password: "",
                phoneNumber: "",
                code: "",
                permissions: []
            });
            setSelectedPermissions([]);
            setPhoneError("");
            setCountryCode("");
        }
    }, [isOpen, reset]);

    const handlePermissionToggle = (permissionId: number) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permissionId)) {
                return prev.filter(id => id !== permissionId);
            } else {
                return [...prev, permissionId];
            }
        });
    };

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

    const isCategoryAllSelected = (category: PermissionCategory): boolean => {
        const categoryPermissionIds = category.permissions.map(p => p.id);
        return categoryPermissionIds.length > 0 &&
            categoryPermissionIds.every(id => selectedPermissions.includes(id));
    };

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

    const handlePhoneBlur = () => {
        if (phoneValue) {
            validatePhoneNumber(phoneValue);
        }
        trigger("phoneNumber");
    };

    const handlePhoneChange = (value: string | undefined) => {
        setValue("phoneNumber", value || "");
        if (value) {
            validatePhoneNumber(value);
        }
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

    const selectAllEntities = (
        allIds: string[],
        selected: string[],
        setSelected: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const isAllSelected = allIds.every(id => selected.includes(id));

        setSelected(prev =>
            isAllSelected
                ? prev.filter(id => !allIds.includes(id))
                : Array.from(new Set([...prev, ...allIds]))
        );
    };

    const onSubmit = async (data: AddUserPayload) => {
        try {
            if (!validatePhoneNumber(data.phoneNumber)) {
                return;
            }

            if (selectedPermissions.length === 0) {
                toast.error(t('users.add.validation.selectPermission'));
                return;
            }
            const payload = {
                permissions: selectedPermissions.sort((a, b) => a - b),
                userName: data.userName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                region: countryCode || data.code,
                password: data.password,
                active: data.active,
                limitAccess: data.limitAccess,
                activeFrom: data.limitAccess ? data.activeFrom : null,
                activeTo: data.limitAccess ? data.activeTo : null,

                machinePermissions: selectedMachinePermissions,
                articlePermissions: selectedArticlePermissions,
                mealPermissions: selectedMealPermissions,
            };


            const res = await createUser(payload);
            const result = handleApiResponse(res);

            if (result.success) {
                toast.success(t('users.add.success'));
                reset();
                setSelectedPermissions([]);
                setPhoneError("");
                setCountryCode("");
                onOpenChange(false);
            } else {
                toast.error(result.error || t('users.add.error'));
            }
        } catch (error: any) {
            console.error("Error adding user:", error);
            toast.error(error?.data?.error || error?.error || t('users.add.genericError'));
        }
    };

    const handleClose = () => {
        reset();
        setSelectedPermissions([]);
        setPhoneError("");
        setCountryCode("");
        onOpenChange(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <User className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('users.add.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('users.add.subtitle')}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="p-6 max-h-[65vh] overflow-y-auto ">
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

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-sm font-medium">
                                            {t('users.add.password')} *
                                        </Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            {...register("password", {
                                                required: t('users.add.validation.passwordRequired'),
                                                minLength: {
                                                    value: 6,
                                                    message: t('users.add.validation.passwordMinLength')
                                                }
                                            })}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder={t('users.add.placeholders.password')}
                                        />
                                        {errors.password && (
                                            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                                        )}
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
                                                {t('users.add.permissionsSubtitle')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">
                                            {t('users.add.selected')}: <span className="font-semibold">{selectedPermissions.length}</span>
                                        </span>
                                    </div>
                                </div>

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
                                                        <h4 className="font-medium text-gray-900">
                                                            {t(`users.permissions.categories.${category.name}`)}
                                                        </h4>
                                                        <p className="text-xs text-gray-500">
                                                            {category.permissions.length} {t('users.add.permissionsCount')}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-gray-500">
                                                        {category.permissions.filter(p => selectedPermissions.includes(p.id)).length}/{category.permissions.length}
                                                    </span>
                                                    <Checkbox
                                                        checked={isCategoryAllSelected(category)}
                                                        onCheckedChange={() => handleSelectAllCategory(category)}
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
                                {selectedPermissions.length === 0 && (
                                    <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-2 rounded-lg">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        {t('users.add.validation.selectPermission')}
                                    </div>
                                )}
                            </div>
                            {/* MACHINES */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Cpu className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            {t('machines.add.machineName')}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                            {selectedMachinePermissions.length}/{machinesData?.data?.values?.length || 0}
                                        </span>
                                        <Checkbox
                                            checked={
                                                machinesData?.data?.values?.length > 0 &&
                                                machinesData.data.values.every((m: any) =>
                                                    selectedMachinePermissions.includes(m.id)
                                                )
                                            }
                                            onCheckedChange={() =>
                                                selectAllEntities(
                                                    machinesData?.data?.values?.map((m: any) => m.id) || [],
                                                    selectedMachinePermissions,
                                                    setSelectedMachinePermissions
                                                )
                                            }
                                        />
                                    </div>
                                </div>

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
                                            <Label className="cursor-pointer text-sm">
                                                {machine.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ARTICLES */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <FileText className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            {t('articles.details.viewAll')}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                            {selectedArticlePermissions.length}/{articlesData?.data?.values?.length || 0}
                                        </span>
                                        <Checkbox
                                            checked={
                                                articlesData?.data?.values?.length > 0 &&
                                                articlesData.data.values.every((a: any) =>
                                                    selectedArticlePermissions.includes(a.id)
                                                )
                                            }
                                            onCheckedChange={() =>
                                                selectAllEntities(
                                                    articlesData?.data?.values?.map((a: any) => a.id) || [],
                                                    selectedArticlePermissions,
                                                    setSelectedArticlePermissions
                                                )
                                            }
                                        />
                                    </div>
                                </div>

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
                                            <Label className="cursor-pointer text-sm">
                                                {article.title || article.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* MEALS */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <ChefHat className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold">
                                            {t('meals.details.nameLabel')}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                            {selectedMealPermissions.length}/{mealsData?.data?.values?.length || 0}
                                        </span>
                                        <Checkbox
                                            checked={
                                                mealsData?.data?.values?.length > 0 &&
                                                mealsData.data.values.every((m: any) =>
                                                    selectedMealPermissions.includes(m.id)
                                                )
                                            }
                                            onCheckedChange={() =>
                                                selectAllEntities(
                                                    mealsData?.data?.values?.map((m: any) => m.id) || [],
                                                    selectedMealPermissions,
                                                    setSelectedMealPermissions
                                                )
                                            }
                                        />
                                    </div>
                                </div>

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
                                            <Label className="cursor-pointer text-sm">
                                                {meal.name}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={watch("active")}
                                        onCheckedChange={(value) => setValue("active", Boolean(value))}
                                    />
                                    <Label>{t('users.add.active')}</Label>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        checked={watch("limitAccess")}
                                        onCheckedChange={(value) => setValue("limitAccess", Boolean(value))}
                                    />
                                    <Label>{t('users.add.limitAccess')}</Label>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>{t('users.add.activeFrom')}</Label>
                                    <Input
                                        type="datetime-local"
                                        onChange={(e) =>
                                            setValue("activeFrom", new Date(e.target.value).toISOString())
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>{t('users.add.activeTo')}</Label>
                                    <Input
                                        type="datetime-local"
                                        onChange={(e) =>
                                            setValue("activeTo", new Date(e.target.value).toISOString())
                                        }
                                    />
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
                                className="flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                {t('users.add.cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isLoading || selectedPermissions.length === 0 || !!phoneError}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('users.add.adding')}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    {t('users.add.addUser')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}