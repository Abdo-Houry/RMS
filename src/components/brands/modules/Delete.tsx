"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { AlertTriangle, Trash2, X, Loader } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useDeleteBrandsMutation } from "@/api/feature/brands/deleteSlices";
import { useTranslation } from "react-i18next";

interface DeleteProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brandId: string;
}

export default function Delete({ isOpen, onOpenChange, brandId }: DeleteProps) {
    const {t} = useTranslation();
    const [deleteBrand, { isLoading }] = useDeleteBrandsMutation();

    const handleDelete = async () => {
        try {
            const res = await deleteBrand(brandId)
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error || "Brand deleted successfully!");
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            toast.error(error.error || "An error occurred while deleting the brand");
        }
    };

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
        //         <div className="flex flex-col">
        //             {/* Header */}
        //             <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
        //                 <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
        //                     <AlertTriangle className="h-6 w-6 text-red-600" />
        //                 </div>
        //                 <DialogTitle className="text-xl font-bold">
        //                     Delete Brand
        //                 </DialogTitle>
        //                 <DialogDescription className="mt-2 text-base">
        //                     Are you sure you want to delete this brand?
        //                     <br />
        //                     <span className="font-semibold text-red-600">
        //                         This action cannot be undone.
        //                     </span>
        //                 </DialogDescription>
        //             </DialogHeader>

        //             {/* Warning Message */}
        //             <div className="px-6 py-4 bg-amber-50 border-y border-amber-200">
        //                 <div className="flex items-start gap-3">
        //                     <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
        //                     <div className="text-sm text-amber-800">
        //                         <p className="font-medium mb-1">Warning:</p>
        //                         <p>
        //                             Deleting this brand will permanently remove all associated data including:
        //                         </p>
        //                         <ul className="list-disc list-inside mt-1 ml-2">
        //                             <li>Brand images/logo</li>
        //                             <li>Brand information</li>
        //                             <li>Associated products (if any)</li>
        //                         </ul>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Footer */}
        //             <DialogFooter className="flex justify-end gap-3 p-6">
        //                 <DialogClose asChild>
        //                     <Button
        //                         variant="outline"
        //                         className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                     >
        //                         <X className="h-4 w-4" />
        //                         Cancel
        //                     </Button>
        //                 </DialogClose>

        //                 <Button
        //                     variant="destructive"
        //                     onClick={handleDelete}
        //                     disabled={isLoading}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        //                 >
        //                     {isLoading ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Deleting...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Trash2 className="h-4 w-4" />
        //                             Delete Brand
        //                         </>
        //                     )}
        //                 </Button>
        //             </DialogFooter>
        //         </div>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
                <div className="flex flex-col">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
                        <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            {t("brands.delete.title")}
                        </DialogTitle>
                        <DialogDescription className="mt-2 text-base">
                            {t("brands.delete.description")}
                            <br />
                            <span className="font-semibold text-red-600">
                                {t("brands.delete.warning")}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Warning Message */}
                    <div className="px-6 py-4 bg-amber-50 border-y border-amber-200">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm text-amber-800">
                                <p className="font-medium mb-1">
                                    {t("brands.delete.warningTitle")}
                                </p>
                                <p>
                                    {t("brands.delete.warningDesc")}
                                </p>
                                <ul className="list-disc list-inside mt-1 ml-2">
                                    <li>{t("brands.delete.warningItem1")}</li>
                                    <li>{t("brands.delete.warningItem2")}</li>
                                    <li>{t("brands.delete.warningItem3")}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-3 p-6">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t("brands.delete.cancel")}
                            </Button>
                        </DialogClose>

                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("brands.delete.deleting")}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    {t("brands.delete.delete")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}