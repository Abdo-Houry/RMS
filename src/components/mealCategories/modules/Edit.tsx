"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetCategoryMealByIdQuery } from "@/api/feature/mealCategories/getSlice";
import { useCategoryMealPutMutation } from "@/api/feature/mealCategories/putSlice";
import { X, Edit, Loader, Type } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface PopupEditProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categoryMealId?: string;
}

interface FormData {
    name: string;
}

export default function EditCategoryMeal({ isOpen, onOpenChange, categoryMealId }: PopupEditProps) {
    const { t } = useTranslation();
    const { data, isLoading } = useGetCategoryMealByIdQuery(categoryMealId!);
    const [updateMeal, { isLoading: isUpdating }] = useCategoryMealPutMutation();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: { name: "" },
    });

    useEffect(() => {
        if (data?.data) {
            reset({
                name: data.data.name,
            });
        }
    }, [data, reset]);

    const onSubmit = async (formData: FormData) => {
        try {
            const fd = new FormData();
            fd.append("mealCategoryId", categoryMealId || "");
            fd.append("name", formData.name);
            const res: any = await updateMeal(fd);
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error);
                handleClose();
            } else {
                toast.error(result.error);
            }

        } catch (err: any) {
            toast.error(err.error);
        }
    };

    const handleClose = () => {
        reset();
        onOpenChange(false);
    };

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             {/* Header */}
        //             <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Edit className="h-6 w-6 text-orange-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold ">
        //                             Edit Meal Category
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1 text-sm">
        //                             Update meal category information
        //                         </p>
        //                     </div>
        //                 </div>
        //             </DialogHeader>

        //             {/* Content */}
        //             <div className="p-6">
        //                 <div className="space-y-6">
        //                     {/* Name Field */}
        //                     <div className="space-y-3">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-blue-50 rounded-lg">
        //                                 <Type className="h-4 w-4 text-blue-600" />
        //                             </div>
        //                             <Label htmlFor="name" className="text-sm font-semibold ">
        //                                 Category Name
        //                             </Label>
        //                         </div>
        //                         <Input
        //                             id="name"
        //                             {...register("name", {
        //                                 required: "Category name is required",
        //                                 minLength: {
        //                                     value: 1,
        //                                     message: "Category name is required"
        //                                 }
        //                             })}
        //                             disabled={isLoading}
        //                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
        //                             placeholder="Enter category name (e.g., Breakfast, Lunch, Dinner...)"
        //                         />
        //                         {errors.name && (
        //                             <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                                 {errors.name.message}
        //                             </div>
        //                         )}
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Footer */}
        //             <DialogFooter className="p-6 pt-4 border-t border-gray-100">
        //                 <DialogClose asChild>
        //                     <Button
        //                         variant="outline"
        //                         type="button"
        //                         onClick={handleClose}
        //                         disabled={isUpdating}
        //                         className="flex items-center gap-2 border-gray-300  transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                     >
        //                         <X className="h-4 w-4" />
        //                         Cancel
        //                     </Button>
        //                 </DialogClose>
        //                 <Button
        //                     type="submit"
        //                     disabled={isUpdating || isLoading}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //                 >
        //                     {isUpdating ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Updating...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Edit className="h-4 w-4" />
        //                             Update Category
        //                         </>
        //                     )}
        //                 </Button>
        //             </DialogFooter>
        //         </form>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Edit className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('categories.edit.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('categories.edit.subtitle')}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="p-6">
                        <div className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Type className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <Label htmlFor="name" className="text-sm font-semibold">
                                        {t('categories.edit.categoryName')}
                                    </Label>
                                </div>
                                <Input
                                    id="name"
                                    {...register("name", {
                                        required: t('categories.edit.nameRequired'),
                                        minLength: {
                                            value: 1,
                                            message: t('categories.edit.nameRequired')
                                        }
                                    })}
                                    disabled={isLoading}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                    placeholder={t('categories.edit.categoryNamePlaceholder')}
                                />
                                {errors.name && (
                                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                        {errors.name.message}
                                    </div>
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
                                className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t('categories.edit.cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isUpdating || isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('categories.edit.updating')}
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" />
                                    {t('categories.edit.update')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}