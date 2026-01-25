import { useDeleteCategoryMutation } from "@/api/feature/category/deleteSlice";
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
import { useTranslation } from 'react-i18next'

interface DeleteProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId: string;
}

export default function Delete({ isOpen, onOpenChange, categoryId }: DeleteProps) {
    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();
    const { t } = useTranslation();

    const handleDelete = async () => {
        try {
            const res = await deleteCategory(categoryId);
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

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden">
                <div className="flex flex-col">
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 text-center border-b border-gray-100">
                        <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 bg-red-50 rounded-full">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold ">
                            {t('category.delete.title')}
                        </DialogTitle>
                        <DialogDescription className="text-gray-600 mt-2 text-base">
                            {t('category.delete.description')}
                            <br />
                            <span className="font-semibold text-red-600">
                                {t('category.delete.warning')}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {/* Footer */}
                    <DialogFooter className="flex justify-end gap-3 p-6">
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t('category.delete.cancel')}
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
                                    {t('category.delete.deleting')}
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    {t('category.delete.delete')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}