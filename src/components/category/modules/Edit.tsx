import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCategoryPutMutation } from "@/api/feature/category/putSlice";
import { useGetCategoryByIdQuery } from "@/api/feature/category/getSlice";
import { useEffect } from "react";
import { X, Edit, Loader, Type } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from 'react-i18next'

interface PopupEditProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId?: string;
}

export default function EditCategory({ isOpen, onOpenChange, categoryId }: PopupEditProps) {

    const { data: categoryData, isLoading: isLoadingCat } = useGetCategoryByIdQuery(categoryId!, {
        skip: !categoryId,
    });

    const [updateCategory, { isLoading }] = useCategoryPutMutation();
    const { t } = useTranslation()

    const schema = z.object({
        name: z.string().min(1, t('category.edit.nameRequired')),
    });

    type FormData = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        },
    });

    // Load old data
    useEffect(() => {
        if (isOpen && categoryData?.data) {
            setValue("name", categoryData.data.name);
        }
    }, [isOpen, categoryData, setValue]);

    const onSubmit = async (data: FormData) => {
        try {
            if (!categoryId) {
                toast.error("Category ID missing");
                return;
            }

            const payload = {
                articleCategoryId: categoryId,
                name: data.name,
            };

            const res = await updateCategory(payload);
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
                                    {t('category.edit.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('category.edit.subtitle')}
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
                                        {t('category.edit.nameLabel')}
                                    </Label>
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={t('category.edit.namePlaceholder')}
                                    disabled={isLoadingCat}
                                    {...register("name")}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
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
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={isLoading}
                                className="flex items-center gap-2 border-gray-300transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t('category.edit.cancel')}
                            </Button>
                        </DialogClose>

                        <Button
                            type="submit"
                            disabled={isLoading || isLoadingCat}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t('category.edit.saving')}
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" />
                                    {t('category.edit.save')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}