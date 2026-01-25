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
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { AddUnitPayload } from "@/types/Units";
import { useUnitsPostMutation } from "@/api/feature/units/postSlcie";
import { Plus, X, Ruler, Loader } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface AddUnitProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddUnit({ isOpen, onOpenChange }: AddUnitProps) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<AddUnitPayload>({
        defaultValues: {
            name: ""
        }
    });
    const [createUnit, { isLoading }] = useUnitsPostMutation();

    const onSubmit = async (data: AddUnitPayload) => {
        try {
            const res = await createUnit(data);
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
    const { t } = useTranslation();
    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             {/* Header */}
        //             <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Ruler className="h-6 w-6 text-blue-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold ">
        //                             Add New Unit
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1 text-sm">
        //                             Create a new measurement unit
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
        //                                 <Ruler className="h-4 w-4 text-blue-600" />
        //                             </div>
        //                             <Label htmlFor="name" className="text-sm font-semibold ">
        //                                 Unit Name
        //                             </Label>
        //                         </div>
        //                         <Input
        //                             id="name"
        //                             {...register("name", {
        //                                 required: "Unit name is required",
        //                                 minLength: {
        //                                     value: 1,
        //                                     message: "Unit name is required"
        //                                 }
        //                             })}
        //                             className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
        //                             placeholder="Enter unit name (e.g., gram, kilogram, liter...)"
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
        //             <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
        //                 <DialogClose asChild>
        //                     <Button
        //                         variant="outline"
        //                         type="button"
        //                         onClick={handleClose}
        //                         className="flex items-center gap-2 border-gray-300  transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                     >
        //                         <X className="h-4 w-4" />
        //                         Cancel
        //                     </Button>
        //                 </DialogClose>
        //                 <Button
        //                     type="submit"
        //                     disabled={isLoading}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //                 >
        //                     {isLoading ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Adding Unit...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Plus className="h-4 w-4" />
        //                             Add Unit
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
                                <Ruler className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("units.add.title")}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t("units.add.subtitle")}
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
                                        <Ruler className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <Label htmlFor="name" className="text-sm font-semibold">
                                        {t("units.add.nameLabel")}
                                    </Label>
                                </div>
                                <Input
                                    id="name"
                                    {...register("name", {
                                        required: t("units.add.nameRequired"),
                                        minLength: {
                                            value: 1,
                                            message: t("units.add.nameRequired")
                                        }
                                    })}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                                    placeholder={t("units.add.namePlaceholder")}
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
                                {t("units.add.cancel")}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("units.add.adding")}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    {t("units.add.add")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}