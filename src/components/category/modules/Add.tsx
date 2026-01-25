import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useCategoryPostMutation } from "@/api/feature/category/postSlice";
import { Plus, X, Tag, Loader, Type } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from 'react-i18next'

interface PopupAddProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export default function AddCategory({ isOpen, onOpenChange }: PopupAddProps) {

    const [createCategory, { isLoading }] = useCategoryPostMutation();
    const { t } = useTranslation()

    // Validation schema
    const schema = z.object({
        name: z
            .string()
            .min(1, t('category.add.nameRequired'))
            .max(100, t('category.add.nameTooLong')),
    });

    type FormData = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: ""
        }
    });

    // Submit handler
    const onSubmit = async (data: FormData) => {
        try {
            const res = await createCategory(data);
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
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden ">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Tag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('category.add.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t('category.add.subtitle')}
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
                                    <Label htmlFor="name" className="text-sm font-semibold ">
                                        {t('category.add.nameLabel')}
                                    </Label>
                                </div>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder={t('category.add.namePlaceholder')}
                                    {...register("name")}
                                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
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
                                className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                            >
                                <X className="h-4 w-4" />
                                {t('category.add.cancel')}
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
                                    {t('category.add.adding')}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    {t('category.add.add')}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
