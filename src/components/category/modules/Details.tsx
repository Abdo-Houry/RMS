import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, X, FileText } from "lucide-react";
import { useGetCategoryByIdQuery, useGetCategoryByIdStaffQuery } from "@/api/feature/category/getSlice";
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { useTranslation } from 'react-i18next'

interface DetailsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categoryId: string;
}

export default function DetailsCategory({ isOpen, onOpenChange, categoryId }: DetailsProps) {
    const { isStaff, isLoading: roleLoading } = useUserRole();
    const { t } = useTranslation();

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading, isError } = isStaff
        ? useGetCategoryByIdStaffQuery(categoryId, {
            skip: !isOpen && !isStaff || roleLoading,
        })
        : useGetCategoryByIdQuery(categoryId, {
            skip: !isOpen && isStaff || roleLoading,
        });

    const category = data?.data;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Tag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('category.details.title')}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 mt-1">
                                    {t('category.details.subtitle')}
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 p-6">
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-12 w-full rounded-lg" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-8 w-40 rounded-full" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Tag className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="text-red-500 font-medium text-lg">Failed to load category details</p>
                            <p className="text-gray-500 mt-1">Please try again later</p>
                        </div>
                    ) : (
                        <ScrollArea className="max-h-[400px] pr-4">
                            <div className="space-y-6">
                                {/* Name Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Tag className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg ">{t('category.details.name')}</h3>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="px-4 py-2 text-base bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-blue-200"
                                    >
                                        {category?.name}
                                    </Badge>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Articles Count Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <FileText className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg ">{t('category.details.articlesCount')}</h3>
                                    </div>
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-200">
                                        <div className="flex items-center justify-between">
                                            <span className="text-green-800 font-medium">{t('category.details.totalArticles')}</span>
                                            <span className="text-2xl font-bold text-green-600 bg-white px-3 py-1 rounded-full border border-green-200">
                                                {category?.articlesCount ?? 0}
                                            </span>
                                        </div>
                                        <p className="text-green-600 text-sm mt-2">
                                            {t('category.details.articlesInCategory', { count: category?.articlesCount ?? 0 })}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </ScrollArea>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2 border-gray-300   transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        {t('category.details.close')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}