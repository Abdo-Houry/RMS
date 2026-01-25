"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteMachinesMutation } from "@/api/feature/machines/deleteSlice";
import { toast } from "react-toastify";
import { Trash2, AlertTriangle, X, Loader } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface DeleteMachineProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    machineId: string;
}

export default function DeleteMachine({ isOpen, onOpenChange, machineId }: DeleteMachineProps) {
    const { t } = useTranslation();
    const [deleteMachine, { isLoading }] = useDeleteMachinesMutation();

    const handleDelete = async () => {
        try {
            const res = await deleteMachine(machineId);
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

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-md p-0 rounded-2xl overflow-hidden">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
        //             <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
        //                 <AlertTriangle className="h-6 w-6 text-red-600" />
        //             </div>
        //             <DialogTitle className="text-xl font-bold">
        //                 Delete Machines
        //             </DialogTitle>
        //             <p className="text-gray-600 mt-2 text-base">
        //                 Are you sure you want to delete this Machines?
        //                 <br />
        //                 <span className="font-semibold text-red-600">
        //                     This action cannot be undone.
        //                 </span>
        //             </p>
        //         </DialogHeader>

        //         {/* Footer */}
        //         <DialogFooter className="flex justify-end gap-3 p-6">
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
        //                         Delete Machine
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
                        {t('machines.delete.title')}
                    </DialogTitle>
                    <p className="text-gray-600 mt-2 text-base">
                        {t('machines.delete.description')}
                        <br />
                        <span className="font-semibold text-red-600">
                            {t('machines.delete.warning')}
                        </span>
                    </p>
                </DialogHeader>

                {/* Footer */}
                <DialogFooter className="flex justify-end gap-3 p-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isLoading}
                        className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        {t('machines.delete.cancel')}
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
                                {t('machines.delete.deleting')}
                            </>
                        ) : (
                            <>
                                <Trash2 className="h-4 w-4" />
                                {t('machines.delete.deleteBtn')}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}