// "use client";

// import { useDeleteUsersMutation } from "@/api/feature/users/deleteSlice";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
//     DialogClose,
// } from "@/components/ui/dialog";
// import { toast } from "react-toastify";
// import { AlertTriangle, Trash2, X, Loader } from "lucide-react";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";

// interface DeleteUserProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     userId: string;
// }

// export default function DeleteUser({ isOpen, onOpenChange, userId }: DeleteUserProps) {
//     const [deleteUser, { isLoading }] = useDeleteUsersMutation();

//     const handleDelete = async () => {
//         try {
//             const res = await deleteUser(userId);
//             const result = handleApiResponse(res);
//             if (result.success) {
//                 toast.success(result.error);
//                 onOpenChange(false);
//             } else {
//                 toast.error(result.error);
//             }
//         } catch (error: any) {
//             toast.error(error.error);
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
//                 <div className="flex flex-col">
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
//                         <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
//                             <AlertTriangle className="h-6 w-6 text-red-600" />
//                         </div>
//                         <DialogTitle className="text-xl font-bold">
//                             Delete User
//                         </DialogTitle>
//                         <p className="text-gray-600 mt-2 text-base">
//                             Are you sure you want to delete this user?
//                             <br />
//                             <span className="font-semibold text-red-600">
//                                 This action cannot be undone.
//                             </span>
//                         </p>
//                     </DialogHeader>

//                     {/* Footer */}
//                     <DialogFooter className="flex justify-end gap-3 p-6">
//                         <DialogClose asChild>
//                             <Button
//                                 variant="outline"
//                                 className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
//                             >
//                                 <X className="h-4 w-4" />
//                                 Cancel
//                             </Button>
//                         </DialogClose>

//                         <Button
//                             onClick={handleDelete}
//                             disabled={isLoading}
//                             className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     Deleting...
//                                 </>
//                             ) : (
//                                 <>
//                                     <Trash2 className="h-4 w-4" />
//                                     Delete User
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </div>
//             </DialogContent>
//         </Dialog>
//     );
// }
"use client";

import { useDeleteUsersMutation } from "@/api/feature/users/deleteSlice";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { AlertTriangle, Trash2, X, Loader } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface DeleteUserProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    userId: string;
}

export default function DeleteUser({ isOpen, onOpenChange, userId }: DeleteUserProps) {
    const { t } = useTranslation();
    const [deleteUser, { isLoading }] = useDeleteUsersMutation();

    const handleDelete = async () => {
        try {
            const res = await deleteUser(userId);
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error)
                onOpenChange(false);
            } else {
                toast.error(result.error || t('users.delete.error'));
            }
        } catch (error: any) {
            toast.error(error.error || t('users.delete.genericError'));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
                <div className="flex flex-col">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
                        <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold">
                            {t('users.delete.title')}
                        </DialogTitle>
                        <p className="text-gray-600 mt-2 text-base">
                            {t('users.delete.message')}
                            <br />
                            <span className="font-semibold text-red-600">
                                {t('users.delete.warning')}
                            </span>
                        </p>
                    </DialogHeader>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-3 p-6">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t('users.delete.cancel')}
                            </Button>
                        </DialogClose>

                        <Button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('users.delete.deleting')}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    {t('users.delete.deleteButton')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}