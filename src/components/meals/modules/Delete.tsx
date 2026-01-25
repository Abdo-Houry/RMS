"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useDeleteMealsMutation } from "@/api/feature/meals/deleteSlice";
import { Trash2, AlertTriangle, X, Loader } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface DeleteProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mealId: string;
}

export default function DeleteMeal({ isOpen, onOpenChange, mealId }: DeleteProps) {
    const [deleteMeal, { isLoading }] = useDeleteMealsMutation();

    const handleDelete = async () => {
        try {
            const res = await deleteMeal(mealId);
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error);
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
    };
    const { t } = useTranslation()
    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden ">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
        //             <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
        //                 <AlertTriangle className="h-6 w-6 text-red-600" />
        //             </div>
        //             <DialogTitle className="text-xl font-bold ">
        //                 Delete Meal
        //             </DialogTitle>
        //             <p className="text-gray-600 mt-2 text-base">
        //                 Are you sure you want to delete this meal?
        //                 <br />
        //                 <span className="font-semibold text-red-600">
        //                     This action cannot be undone.
        //                 </span>
        //             </p>
        //         </DialogHeader>

        //         {/* Footer */}
        //         <DialogFooter className="p-6 pt-4 border-t border-gray-100">
        //             <Button
        //                 type="button"
        //                 variant="outline"
        //                 onClick={handleClose}
        //                 disabled={isLoading}
        //                 className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //             >
        //                 <X className="h-4 w-4" />
        //                 Cancel
        //             </Button>
        //             <Button
        //                 type="button"
        //                 variant="destructive"
        //                 onClick={handleDelete}
        //                 disabled={isLoading}
        //                 className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //             >
        //                 {isLoading ? (
        //                     <>
        //                         <Loader className="h-4 w-4 animate-spin" />
        //                         Deleting...
        //                     </>
        //                 ) : (
        //                     <>
        //                         <Trash2 className="h-4 w-4" />
        //                         Delete Meal
        //                     </>
        //                 )}
        //             </Button>
        //         </DialogFooter>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
                    <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
                        <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <DialogTitle className="text-xl font-bold">
                        {t("meals.delete.title")}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2 text-base">
                        {t("meals.delete.description")}
                        <br />
                        <span className="font-semibold text-red-600">
                            {t("meals.delete.warning")}
                        </span>
                    </p>
                </DialogHeader>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        {t("meals.delete.cancel")}
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="h-4 w-4 animate-spin" />
                                {t("meals.delete.deleting")}
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                {t("meals.delete.delete")}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}