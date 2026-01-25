"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGetMealsByIdQuery, useGetMealsByIdStaffQuery } from "@/api/feature/meals/getSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChefHat, Utensils, Tag, Image as ImageIcon, Info, X } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { useTranslation } from "react-i18next";

interface DetailsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    mealId: string;
}

export default function DetailsMeal({ isOpen, onOpenChange, mealId }: DetailsProps) {
    const { isStaff, isLoading: roleLoading } = useUserRole(); // استخدام الـ hook

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useGetMealsByIdStaffQuery(mealId, {
            skip: !isOpen && !isStaff || roleLoading,
        })
        : useGetMealsByIdQuery(mealId, {
            skip: !isOpen && isStaff || roleLoading,
        });

    const meal = data?.data;
    const { t } = useTranslation();
    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //             <div className="flex items-center gap-3">
        //                 <div className="p-2 bg-white rounded-xl shadow-sm">
        //                     <ChefHat className="h-6 w-6 text-orange-600" />
        //                 </div>
        //                 <div>
        //                     <DialogTitle className="text-2xl font-bold ">
        //                         Meal Details
        //                     </DialogTitle>
        //                     <p className="text-gray-600 mt-1 text-sm">
        //                         Complete information about the meal
        //                     </p>
        //                 </div>
        //             </div>
        //         </DialogHeader>

        //         {isLoading ? (
        //             <div className="space-y-6 p-6">
        //                 <div className="space-y-3">
        //                     <Skeleton className="h-6 w-32" />
        //                     <Skeleton className="h-4 w-full" />
        //                 </div>
        //                 <div className="space-y-3">
        //                     <Skeleton className="h-6 w-28" />
        //                     <Skeleton className="h-8 w-32" />
        //                 </div>
        //                 <div className="space-y-3">
        //                     <Skeleton className="h-6 w-24" />
        //                     <Skeleton className="h-48 w-full rounded-lg" />
        //                 </div>
        //                 <div className="space-y-3">
        //                     <Skeleton className="h-6 w-36" />
        //                     <Skeleton className="h-32 w-full rounded-lg" />
        //                 </div>
        //             </div>
        //         ) : (
        //             <ScrollArea className="max-h-[70vh] pr-2">
        //                 <div className="space-y-6 p-6">
        //                     {/* Name Section */}
        //                     <div className="space-y-3">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-orange-50 rounded-lg">
        //                                 <Tag className="h-4 w-4 text-orange-600" />
        //                             </div>
        //                             <h3 className="font-semibold text-lg">Meal Name</h3>
        //                         </div>
        //                         <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        //                             {meal?.name}
        //                         </p>
        //                     </div>

        //                     {/* Description Section */}
        //                     <div className="space-y-3">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-blue-50 rounded-lg">
        //                                 <Info className="h-4 w-4 text-blue-600" />
        //                             </div>
        //                             <h3 className="font-semibold text-lg">Description</h3>
        //                         </div>
        //                         <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        //                             {meal?.description}
        //                         </p>
        //                     </div>

        //                     {/* Category Section */}
        //                     <div className="space-y-3">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-purple-50 rounded-lg">
        //                                 <Tag className="h-4 w-4 text-purple-600" />
        //                             </div>
        //                             <h3 className="font-semibold text-lg">Category</h3>
        //                         </div>
        //                         <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 font-medium">
        //                             {meal?.mealCategoryName}
        //                         </div>
        //                     </div>

        //                     {/* Image Section */}
        //                     {meal?.imagePath && (
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-green-50 rounded-lg">
        //                                     <ImageIcon className="h-4 w-4 text-green-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Meal Image</h3>
        //                             </div>
        //                             <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        //                                 <img
        //                                     src={`${import.meta.env.VITE_BASE_URL}/${meal.imagePath}`}
        //                                     alt={meal?.name}
        //                                     className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        //                                 />
        //                             </div>
        //                         </div>
        //                     )}

        //                     {/* Ingredients Section */}
        //                     <div className="space-y-3">
        //                         <div className="flex items-center justify-between">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-red-50 rounded-lg">
        //                                     <Utensils className="h-4 w-4 text-red-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Ingredients</h3>
        //                             </div>
        //                             <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        //                                 {meal?.ingredients?.length || 0} items
        //                             </span>
        //                         </div>

        //                         {meal?.ingredients?.length > 0 ? (
        //                             <div className=" border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        //                                 <table className="w-full">
        //                                     <thead className=" border-b border-gray-200">
        //                                         <tr>
        //                                             <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
        //                                                 Ingredient
        //                                             </th>
        //                                             <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
        //                                                 Image
        //                                             </th>
        //                                             <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
        //                                                 Quantity
        //                                             </th>
        //                                         </tr>
        //                                     </thead>
        //                                     <tbody className="divide-y divide-gray-200">
        //                                         {meal.ingredients.map((ing: any) => (
        //                                             <tr
        //                                                 key={ing.id}
        //                                                 className=" transition-colors duration-150"
        //                                             >
        //                                                 <td className="px-4 py-3">
        //                                                     <div className="text-sm font-medium">
        //                                                         {ing.name}
        //                                                     </div>
        //                                                 </td>
        //                                                 <td className="px-4 py-3">
        //                                                     {ing.imagePath ? (
        //                                                         <img
        //                                                             src={`${import.meta.env.VITE_BASE_URL}/${ing.imagePath}`}
        //                                                             alt={ing.name}
        //                                                             className="w-10 h-10 rounded-lg object-cover border border-gray-200"
        //                                                         />
        //                                                     ) : (
        //                                                         <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
        //                                                             <Utensils className="h-4 w-4 text-gray-400" />
        //                                                         </div>
        //                                                     )}
        //                                                 </td>
        //                                                 <td className="px-4 py-3">
        //                                                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
        //                                                         {ing.quantity}
        //                                                     </span>
        //                                                 </td>
        //                                             </tr>
        //                                         ))}
        //                                     </tbody>
        //                                 </table>
        //                             </div>
        //                         ) : (
        //                             <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        //                                 <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        //                                 <p className="text-gray-500 font-medium">No ingredients available</p>
        //                                 <p className="text-gray-400 text-sm mt-1">
        //                                     This meal doesn't have any ingredients added yet.
        //                                 </p>
        //                             </div>
        //                         )}
        //                     </div>
        //                 </div>
        //             </ScrollArea>
        //         )}

        //         {/* Footer */}
        //         <DialogFooter className="p-6 pt-4 border-t border-gray-100  ">
        //             <Button
        //                 type="button"
        //                 variant="outline"
        //                 onClick={() => onOpenChange(false)}
        //                 className="flex items-center gap-2 border-gray-300   hover transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //             >
        //                 <X className="h-4 w-4" />
        //                 Close
        //             </Button>
        //         </DialogFooter>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <ChefHat className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                {t("meals.details.title")}
                            </DialogTitle>
                            <p className="text-gray-600 mt-1 text-sm">
                                {t("meals.details.subtitle")}
                            </p>
                        </div>
                    </div>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-6 p-6">
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-28" />
                            <Skeleton className="h-8 w-32" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-48 w-full rounded-lg" />
                        </div>
                        <div className="space-y-3">
                            <Skeleton className="h-6 w-36" />
                            <Skeleton className="h-32 w-full rounded-lg" />
                        </div>
                    </div>
                ) : (
                    <ScrollArea className="max-h-[70vh] pr-2">
                        <div className="space-y-6 p-6">
                            {/* Name Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <Tag className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t("meals.details.nameLabel")}</h3>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {meal?.name}
                                </p>
                            </div>

                            {/* Description Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Info className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t("meals.details.descriptionLabel")}</h3>
                                </div>
                                <p className="text-gray-700 leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {meal?.description}
                                </p>
                            </div>

                            {/* Category Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <Tag className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t("meals.details.categoryLabel")}</h3>
                                </div>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 font-medium">
                                    {meal?.mealCategoryName}
                                </div>
                            </div>

                            {/* Image Section */}
                            {meal?.imagePath && (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t("meals.details.imageLabel")}</h3>
                                    </div>
                                    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img
                                            src={`${import.meta.env.VITE_BASE_URL}/${meal.imagePath}`}
                                            alt={meal?.name}
                                            className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Ingredients Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <Utensils className="h-4 w-4 text-red-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t("meals.details.ingredientsLabel")}</h3>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {t("meals.details.itemsCount", { count: meal?.ingredients?.length || 0 })}
                                    </span>
                                </div>

                                {meal?.ingredients?.length > 0 ? (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                        <table className="w-full">
                                            <thead className="border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                        {t("meals.details.ingredient")}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                        {t("meals.details.image")}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                        {t("meals.details.quantity")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {meal.ingredients.map((ing: any) => (
                                                    <tr
                                                        key={ing.id}
                                                        className="transition-colors duration-150"
                                                    >
                                                        <td className="px-4 py-3">
                                                            <div className="text-sm font-medium">
                                                                {ing.name}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {ing.imagePath ? (
                                                                <img
                                                                    src={`${import.meta.env.VITE_BASE_URL}/${ing.imagePath}`}
                                                                    alt={ing.name}
                                                                    className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                                                                    <Utensils className="h-4 w-4 text-gray-400" />
                                                                </div>
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                                                {ing.quantity}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">{t("meals.details.noIngredients")}</p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            {t("meals.details.noIngredientsDesc")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                )}

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        {t("meals.details.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}