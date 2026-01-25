// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useGetCategoryMealByIdQuery } from "@/api/feature/mealCategories/getSlice";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Utensils } from "lucide-react";

// interface DetailsProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     categoryMealId: string;
// }

// export default function DetailsCategoryMeal({ isOpen, onOpenChange, categoryMealId }: DetailsProps) {
//     const { data, isLoading } = useGetCategoryMealByIdQuery(categoryMealId);

//     if (isLoading) return null;

//     const meal = data?.data;

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md p-6">
//                 <DialogHeader className="pb-2 border-b">
//                     <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
//                         <Utensils className="h-5 w-5 text-primary" />
//                         Category Meal Details
//                     </DialogTitle>
//                 </DialogHeader>

//                 <Card className="mt-4 shadow-sm border rounded-xl">
//                     <CardContent className="p-2 space-y-2">
//                         <div className="flex items-center gap-1">
//                             <span className="text-sm text-muted-foreground">Name</span>
//                             <Badge variant="secondary" className="px-3 py-1 text-base">
//                                 {meal?.name}
//                             </Badge>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 <DialogFooter className="mt-6">
//                     <DialogClose asChild>
//                         <Button variant="outline" className="w-full">
//                             Close
//                         </Button>
//                     </DialogClose>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
// "use client";

// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useGetCategoryMealByIdQuery } from "@/api/feature/mealCategories/getSlice";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Utensils, X, Info, Tag } from "lucide-react";

// interface DetailsProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     categoryMealId: string;
// }

// export default function DetailsCategoryMeal({ isOpen, onOpenChange, categoryMealId }: DetailsProps) {
//     const { data, isLoading } = useGetCategoryMealByIdQuery(categoryMealId);

//     const meal = data?.data;

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
//                 {/* Header */}
//                 <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                     <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <Utensils className="h-6 w-6 text-orange-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold ">
//                                     Meal Category Details
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1">
//                                     Complete information about the meal category
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </DialogHeader>

//                 {/* Content */}
//                 <div className="flex-1 p-6">
//                     {isLoading ? (
//                         <div className="space-y-6">
//                             <div className="space-y-3">
//                                 <Skeleton className="h-6 w-32" />
//                                 <Skeleton className="h-12 w-full rounded-lg" />
//                             </div>
//                             <div className="space-y-3">
//                                 <Skeleton className="h-6 w-28" />
//                                 <Skeleton className="h-8 w-40 rounded-full" />
//                             </div>
//                         </div>
//                     ) : meal ? (
//                         <ScrollArea className="max-h-[400px] pr-4">
//                             <div className="space-y-6">
//                                 {/* Name Section */}
//                                 <div className="space-y-3">
//                                     <div className="flex items-center gap-2">
//                                         <div className="p-2 bg-blue-50 rounded-lg">
//                                             <Tag className="h-4 w-4 text-blue-600" />
//                                         </div>
//                                         <h3 className="font-semibold text-lg">Category Name</h3>
//                                     </div>
//                                     <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
//                                         {meal.name}
//                                     </p>
//                                 </div>



//                                 <Separator className="bg-gray-200" />

//                                 {/* Type Section */}
//                                 <div className="space-y-3">
//                                     <div className="flex items-center gap-2">
//                                         <div className="p-2 bg-purple-50 rounded-lg">
//                                             <Utensils className="h-4 w-4 text-purple-600" />
//                                         </div>
//                                         <h3 className="font-semibold text-lg">Category Type</h3>
//                                     </div>
//                                     <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
//                                         <p className="text-purple-800 font-medium">Meal Category</p>
//                                         <p className="text-purple-600 text-sm mt-1">This category is used for organizing meals</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </ScrollArea>
//                     ) : (
//                         <div className="text-center py-8">
//                             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
//                                 <Info className="h-8 w-8 text-gray-400" />
//                             </div>
//                             <p className="font-medium text-lg">No details available</p>
//                             <p className=" mt-1">The meal category information could not be loaded</p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer */}
//                 <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
//                     <DialogClose asChild>
//                         <Button
//                             variant="outline"
//                             className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
//                         >
//                             <X className="h-4 w-4" />
//                             Close
//                         </Button>
//                     </DialogClose>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetCategoryMealByIdQuery, useGetCategoryMealByIdStaffQuery } from "@/api/feature/mealCategories/getSlice";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Utensils, X, Info, Tag, Calendar } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { useTranslation } from "react-i18next";

interface DetailsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    categoryMealId: string;
}

export default function DetailsCategoryMeal({ isOpen, onOpenChange, categoryMealId }: DetailsProps) {
    const { t } = useTranslation();
    const { isStaff, isLoading: roleLoading } = useUserRole(); // استخدام الـ hook

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useGetCategoryMealByIdStaffQuery(categoryMealId, {
            skip: !isOpen && !isStaff || roleLoading,
        })
        : useGetCategoryMealByIdQuery(categoryMealId, {
            skip: !isOpen && isStaff || roleLoading,
        });

    const meal = data?.data;

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //             <div className="flex items-center justify-between">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Utensils className="h-6 w-6 text-orange-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold ">
        //                             Meal Category Details
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1">
        //                             Complete information about the meal category
        //                         </p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </DialogHeader>

        //         {/* Content */}
        //         <div className="flex-1 p-6">
        //             {isLoading ? (
        //                 <div className="space-y-6">
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-32" />
        //                         <Skeleton className="h-12 w-full rounded-lg" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-28" />
        //                         <Skeleton className="h-8 w-40 rounded-full" />
        //                     </div>
        //                 </div>
        //             ) : meal ? (
        //                 <ScrollArea className="max-h-[400px] pr-4">
        //                     <div className="space-y-6">
        //                         {/* Name Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-blue-50 rounded-lg">
        //                                     <Tag className="h-4 w-4 text-blue-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Category Name</h3>
        //                             </div>
        //                             <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        //                                 {meal.name}
        //                             </p>
        //                         </div>

        //                         <Separator className="bg-gray-200" />

        //                         {/* Type Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-purple-50 rounded-lg">
        //                                     <Utensils className="h-4 w-4 text-purple-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Category Type</h3>
        //                             </div>
        //                             <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        //                                 <p className="text-purple-800 font-medium">Meal Category</p>
        //                                 <p className="text-purple-600 text-sm mt-1">This category is used for organizing meals</p>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </ScrollArea>
        //             ) : (
        //                 <div className="text-center py-8">
        //                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
        //                         <Info className="h-8 w-8 text-gray-400" />
        //                     </div>
        //                     <p className="font-medium text-lg">No details available</p>
        //                     <p className=" mt-1">The meal category information could not be loaded</p>
        //                 </div>
        //             )}
        //         </div>

        //         {/* Footer */}
        //         <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
        //             <DialogClose asChild>
        //                 <Button
        //                     variant="outline"
        //                     className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                 >
        //                     <X className="h-4 w-4" />
        //                     Close
        //                 </Button>
        //             </DialogClose>
        //         </DialogFooter>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Utensils className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t('categories.details.title')}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1">
                                    {t('categories.details.subtitle')}
                                </p>
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
                    ) : meal ? (
                        <ScrollArea className="max-h-[400px] pr-4">
                            <div className="space-y-6">
                                {/* Name Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Tag className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">
                                            {t('categories.details.categoryName')}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        {meal.name}
                                    </p>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Type Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Utensils className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">
                                            {t('categories.details.categoryType')}
                                        </h3>
                                    </div>
                                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                                        <p className="text-purple-800 font-medium">
                                            {t('categories.details.categoryTypeLabel')}
                                        </p>
                                        <p className="text-purple-600 text-sm mt-1">
                                            {t('categories.details.categoryTypeDescription')}
                                        </p>
                                    </div>
                                </div>

                                {/* Additional Information (if available) */}
                                {meal.createdAt && (
                                    <>
                                        <Separator className="bg-gray-200" />
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-green-50 rounded-lg">
                                                    <Calendar className="h-4 w-4 text-green-600" />
                                                </div>
                                                <h3 className="font-semibold text-lg">
                                                    {t('categories.details.createdAt')}
                                                </h3>
                                            </div>
                                            <p className="text-gray-700 bg-green-50 rounded-lg p-4 border border-green-200">
                                                {new Date(meal.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </ScrollArea>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Info className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="font-medium text-lg">
                                {t('categories.details.noDetails')}
                            </p>
                            <p className="text-gray-600 mt-1">
                                {t('categories.details.noDetailsDescription')}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t('categories.details.close')}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}