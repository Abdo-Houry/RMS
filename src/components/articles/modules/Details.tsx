import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetArticleByIdQuery, useGetArticleByIdStaffQuery } from "@/api/feature/articles/getSlices";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, Tag, Image as ImageIcon, X } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";

interface DetailsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    articleId: string;
}

export default function Details({ isOpen, onOpenChange, articleId }: DetailsProps) {
    // استخدام الـ hook بدلاً من useState و useEffect
    const { isStaff, isLoading: roleLoading } = useUserRole();

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading, isError } = isStaff
        ? useGetArticleByIdStaffQuery(articleId, {
            skip: !isOpen && !isStaff || roleLoading,
        })
        : useGetArticleByIdQuery(articleId, {
            skip: !isOpen && isStaff || roleLoading,
        });

    const article = data?.data;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold ">
                                    Article Details
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 mt-1">
                                    Clean, modern and elegant styled article view
                                </DialogDescription>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
                    {/* Loading state skeleton */}
                    {isLoading ? (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-28" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-32" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-48 w-full rounded-lg" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <FileText className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="text-red-500 font-medium text-lg">Failed to load article details</p>
                            <p className="text-gray-500 mt-1">Please try again later</p>
                        </div>
                    ) : (
                        <ScrollArea className="max-h-[500px] pr-4">
                            <div className="space-y-6">

                                {/* Title Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <FileText className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg ">Title</h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        {article?.title}
                                    </p>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Content Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <FileText className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg ">Content</h3>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {article?.body}
                                        </p>
                                    </div>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Category Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Tag className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg ">Category</h3>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="px-4 py-2 text-base bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200"
                                    >
                                        {article?.articleCategoryName}
                                    </Badge>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Image Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg ">Featured Image</h3>
                                    </div>

                                    {article?.imagePath ? (
                                        <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            <img
                                                src={
                                                    article.imagePath.startsWith("http")
                                                        ? article.imagePath
                                                        : `${import.meta.env.VITE_BASE_URL}/${article.imagePath}`
                                                }
                                                alt="Article Image"
                                                className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">No image available</p>
                                            <p className="text-gray-400 text-sm mt-1">This article doesn't have a featured image</p>
                                        </div>
                                    )}
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
                        className="flex items-center gap-2 border-gray-300  hover: transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
