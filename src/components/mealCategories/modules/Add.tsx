"use client";
import { useCategoryMealPostMutation } from "@/api/feature/mealCategories/postSlices";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Plus, X, Utensils, Loader, Type } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface AddCategoryProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    name: string;
}

export default function AddCategoryMeal({ isOpen, onOpenChange }: AddCategoryProps) {
    const {t} = useTranslation();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        defaultValues: {
            name: ""
        }
    });
    const [createMeal, { isLoading }] = useCategoryMealPostMutation();

    const onSubmit = async (formData: FormData) => {
        try {
            const form = new FormData();
            form.append("name", formData.name);
            const res: any = await createMeal(form);
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error);
                reset();
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            toast.error(error.error);
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
        //             <DialogHeader className="p-6 pb-4  border-b border-gray-100">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Utensils className="h-6 w-6 text-orange-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold">
        //                             Add Meal Category
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1 text-sm">
        //                             Create a new meal category
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
        //                             <Label htmlFor="name" className="text-sm font-semibold">
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
        //                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
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
        //                         className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                     >
        //                         <X className="h-4 w-4" />
        //                         Cancel
        //                     </Button>
        //                 </DialogClose>
        //                 <Button
        //                     type="submit"
        //                     disabled={isLoading}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //                 >
        //                     {isLoading ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Creating...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Plus className="h-4 w-4" />
        //                             Create Category
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
                                <Utensils className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('categories.add.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('categories.add.subtitle')}
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
                                        {t('categories.add.categoryName')}
                                    </Label>
                                </div>
                                <Input
                                    id="name"
                                    {...register("name", {
                                        required: t('categories.add.nameRequired'),
                                        minLength: {
                                            value: 1,
                                            message: t('categories.add.nameRequired')
                                        }
                                    })}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                                    placeholder={t('categories.add.categoryNamePlaceholder')}
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
                                className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t('categories.add.cancel')}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('categories.add.creating')}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    {t('categories.add.create')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}