
"use client";

import { useState } from "react";
import { useGetIngredientsByIdQuery, useGetIngredientsByIdStaffQuery } from "@/api/feature/Ingredients/getSlice";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Scale, Info, X, Image as ImageIcon, Tag, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

interface DetailsIngredientProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    ingredientId: string;
}

export default function DetailsIngredient({ isOpen, onOpenChange, ingredientId }: DetailsIngredientProps) {
    const { isStaff, isLoading: roleLoading } = useUserRole();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useGetIngredientsByIdStaffQuery(ingredientId, {
            skip: !isOpen && !isStaff || roleLoading,
        })
        : useGetIngredientsByIdQuery(ingredientId, {
            skip: !isOpen && isStaff || roleLoading,
        });

    const ingredient = data?.data;
    const images = ingredient?.images || [];
    const hasImages = images.length > 0;

    // Function to handle next image
    // const handleNextImage = () => {
    //     if (hasImages) {
    //         setCurrentImageIndex((prev) =>
    //             prev < images.length - 1 ? prev + 1 : 0
    //         );
    //     }
    // };

    // // Function to handle previous image
    // const handlePrevImage = () => {
    //     if (hasImages) {
    //         setCurrentImageIndex((prev) =>
    //             prev > 0 ? prev - 1 : images.length - 1
    //         );
    //     }
    // };
    const isRTL = i18n.language === "ar";

    const handlePreviousImage = () => {
        setCurrentImageIndex(prev => {
            if (isRTL) {
                return prev < images.length - 1 ? prev + 1 : 0;
            }
            return prev > 0 ? prev - 1 : images.length - 1;
        });
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev => {
            if (isRTL) {
                return prev > 0 ? prev - 1 : images.length - 1;
            }
            return prev < images.length - 1 ? prev + 1 : 0;
        });
    };


    const { t } = useTranslation()
    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //             <div className="flex items-center justify-between">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Package className="h-6 w-6 text-green-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold">
        //                             Ingredient Details
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1">
        //                             Complete information about the ingredient
        //                         </p>
        //                     </div>
        //                 </div>
        //             </div>
        //         </DialogHeader>

        //         {/* Content */}
        //         <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
        //             {isLoading ? (
        //                 <div className="space-y-6">
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-32" />
        //                         <Skeleton className="h-4 w-full" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-28" />
        //                         <Skeleton className="h-8 w-32" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-24" />
        //                         <Skeleton className="h-48 w-full rounded-lg" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-36" />
        //                         <Skeleton className="h-32 w-full rounded-lg" />
        //                     </div>
        //                 </div>
        //             ) : (
        //                 <ScrollArea className="max-h-[500px] pr-4">
        //                     <div className="space-y-6">

        //                         {/* Name Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-blue-50 rounded-lg">
        //                                     <Package className="h-4 w-4 text-blue-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Name</h3>
        //                             </div>
        //                             <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        //                                 {ingredient?.name}
        //                             </p>
        //                         </div>

        //                         <Separator className="bg-gray-200" />

        //                         {/* Unit Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-purple-50 rounded-lg">
        //                                     <Scale className="h-4 w-4 text-purple-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Measurement Unit</h3>
        //                             </div>
        //                             <Badge
        //                                 variant="secondary"
        //                                 className="px-4 py-2 text-base bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200"
        //                             >
        //                                 {ingredient?.unitName || "Not specified"}
        //                             </Badge>
        //                         </div>

        //                         <Separator className="bg-gray-200" />

        //                         {/* Brand Section */}
        //                         {ingredient?.brand && (
        //                             <>
        //                                 <div className="space-y-3">
        //                                     <div className="flex items-center gap-2">
        //                                         <div className="p-2 bg-indigo-50 rounded-lg">
        //                                             <Building2 className="h-4 w-4 text-indigo-600" />
        //                                         </div>
        //                                         <h3 className="font-semibold text-lg">Brand</h3>
        //                                     </div>
        //                                     <Badge
        //                                         variant="secondary"
        //                                         className="px-4 py-2 text-base bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200"
        //                                     >
        //                                         {ingredient?.brand || "Not specified"}
        //                                     </Badge>
        //                                 </div>
        //                                 <Separator className="bg-gray-200" />
        //                             </>
        //                         )}

        //                         {/* Images Section with Carousel */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-orange-50 rounded-lg">
        //                                     <ImageIcon className="h-4 w-4 text-orange-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Ingredient Images</h3>
        //                             </div>

        //                             {hasImages ? (
        //                                 <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
        //                                     <div className="flex items-center justify-between mb-3">
        //                                         <span className="text-sm font-semibold">
        //                                             Images Preview
        //                                         </span>
        //                                         <span className="text-xs text-gray-500">
        //                                             {currentImageIndex + 1} of {images.length}
        //                                         </span>
        //                                     </div>

        //                                     {/* Custom Carousel */}
        //                                     <div className="relative overflow-hidden rounded-lg">
        //                                         <div
        //                                             className="flex transition-transform duration-300 ease-in-out"
        //                                             style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        //                                         >
        //                                             {images.map((imagePath: string, index: number) => (
        //                                                 <div key={index} className="w-full flex-shrink-0">
        //                                                     <Card className="border-0 shadow-none">
        //                                                         <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
        //                                                             <img
        //                                                                 src={`${import.meta.env.VITE_BASE_URL}/${imagePath}`}
        //                                                                 alt={`${ingredient?.name} - Image ${index + 1}`}
        //                                                                 className="w-full h-full object-cover"
        //                                                             />
        //                                                             {/* Image Info */}
        //                                                             <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        //                                                                 {index + 1} / {images.length}
        //                                                             </div>
        //                                                         </CardContent>
        //                                                     </Card>
        //                                                 </div>
        //                                             ))}
        //                                         </div>

        //                                         {/* Navigation Arrows */}
        //                                         {images.length > 1 && (
        //                                             <>
        //                                                 <button
        //                                                     type="button"
        //                                                     onClick={handlePrevImage}
        //                                                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
        //                                                 >
        //                                                     <ChevronLeft className="h-5 w-5" />
        //                                                 </button>
        //                                                 <button
        //                                                     type="button"
        //                                                     onClick={handleNextImage}
        //                                                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
        //                                                 >
        //                                                     <ChevronRight className="h-5 w-5" />
        //                                                 </button>
        //                                             </>
        //                                         )}
        //                                     </div>

        //                                     {/* Dots Navigation */}
        //                                     {images.length > 1 && (
        //                                         <div className="flex justify-center gap-1.5 mt-3">
        //                                             {images.map((_: any, index: any) => (
        //                                                 <button
        //                                                     key={index}
        //                                                     type="button"
        //                                                     onClick={() => setCurrentImageIndex(index)}
        //                                                     className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index
        //                                                         ? 'bg-blue-500 scale-125'
        //                                                         : 'bg-gray-300 hover:bg-gray-400'
        //                                                         }`}
        //                                                 />
        //                                             ))}
        //                                         </div>
        //                                     )}
        //                                 </div>
        //                             ) : (
        //                                 <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        //                                     <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        //                                     <p className="text-gray-500 font-medium">No images available</p>
        //                                     <p className="text-gray-400 text-sm mt-1">This ingredient doesn't have any images</p>
        //                                 </div>
        //                             )}
        //                         </div>

        //                         <Separator className="bg-gray-200" />

        //                         {/* Additional Details Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-green-50 rounded-lg">
        //                                     <Tag className="h-4 w-4 text-green-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Additional Details</h3>
        //                             </div>

        //                             {ingredient?.details?.length > 0 ? (
        //                                 <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        //                                     <table className="w-full">
        //                                         <thead className="border-b border-gray-200">
        //                                             <tr>
        //                                                 <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
        //                                                     Key
        //                                                 </th>
        //                                                 <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
        //                                                     Value
        //                                                 </th>
        //                                             </tr>
        //                                         </thead>
        //                                         <tbody className="divide-y divide-gray-200">
        //                                             {ingredient.details.map((d: any, i: number) => (
        //                                                 <tr
        //                                                     key={i}
        //                                                     className="hover:bg-gray-50 transition-colors duration-150"
        //                                                 >
        //                                                     <td className="px-4 py-3 text-sm font-medium">
        //                                                         {d.key}
        //                                                     </td>
        //                                                     <td className="px-4 py-3 text-sm">
        //                                                         {d.value}
        //                                                     </td>
        //                                                 </tr>
        //                                             ))}
        //                                         </tbody>
        //                                     </table>
        //                                 </div>
        //                             ) : (
        //                                 <div className="text-center py-8 rounded-xl border border-dashed border-gray-300">
        //                                     <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        //                                     <p className="font-medium">No details available</p>
        //                                     <p className="text-sm mt-1">This ingredient doesn't have additional details</p>
        //                                 </div>
        //                             )}
        //                         </div>
        //                     </div>
        //                 </ScrollArea>
        //             )}
        //         </div>

        //         {/* Footer */}
        //         <DialogFooter className="p-6 pt-4 border-t border-gray-100">
        //             <DialogClose asChild>
        //                 <Button
        //                     variant="outline"
        //                     className="flex items-center gap-2 border-gray-300 hover:transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                 >
        //                     <X className="h-4 w-4" />
        //                     Close
        //                 </Button>
        //             </DialogClose>
        //         </DialogFooter>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
                {/* Header */}
                <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Package className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("ingredients.details.title")}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1">
                                    {t("ingredients.details.subtitle")}
                                </p>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
                    {isLoading ? (
                        <div className="space-y-6">
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
                        <ScrollArea className="max-h-[500px] pr-4">
                            <div className="space-y-6">

                                {/* Name Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Package className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t("ingredients.details.name")}</h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        {ingredient?.name}
                                    </p>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Unit Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg">
                                            <Scale className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t("ingredients.details.unit")}</h3>
                                    </div>
                                    <Badge
                                        variant="secondary"
                                        className="px-4 py-2 text-base bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border-purple-200"
                                    >
                                        {ingredient?.unitName || t("ingredients.details.notSpecified")}
                                    </Badge>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Brand Section */}
                                {ingredient?.brand && (
                                    <>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="p-2 bg-indigo-50 rounded-lg">
                                                    <Building2 className="h-4 w-4 text-indigo-600" />
                                                </div>
                                                <h3 className="font-semibold text-lg">{t("ingredients.details.brand")}</h3>
                                            </div>
                                            <Badge
                                                variant="secondary"
                                                className="px-4 py-2 text-base bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border-indigo-200"
                                            >
                                                {ingredient?.brand || t("ingredients.details.notSpecified")}
                                            </Badge>
                                        </div>
                                        <Separator className="bg-gray-200" />
                                    </>
                                )}

                                {/* Images Section with Carousel */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t("ingredients.details.images")}</h3>
                                    </div>

                                    {hasImages ? (
                                        <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold">
                                                    {t("ingredients.edit.imagesPreview")}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {currentImageIndex + 1} {t("ingredients.table.of")} {images.length}
                                                </span>
                                            </div>

                                            {/* Custom Carousel */}
                                            <div className="relative overflow-hidden rounded-lg">
                                                <div
                                                    className="flex transition-transform duration-300 ease-in-out h-full"
                                                    dir="ltr"
                                                    style={{
                                                        transform: `translateX(-${currentImageIndex * 100}%)`
                                                    }}
                                                >
                                                    {images.map((imagePath: string, index: number) => (
                                                        <div key={index} className="w-full flex-shrink-0">
                                                            <Card className="border-0 shadow-none">
                                                                <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
                                                                    <img
                                                                        src={`${import.meta.env.VITE_BASE_URL}/${imagePath}`}
                                                                        alt={`${ingredient?.name} - Image ${index + 1}`}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                    {/* Image Info */}
                                                                    <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                                        {index + 1} / {images.length}
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Navigation Arrows */}
                                                {images.length > 1 && (
                                                    <>
                                                        {/* <button
                                                            type="button"
                                                            onClick={handlePrevImage}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                        >
                                                            <ChevronLeft className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleNextImage}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                        >
                                                            <ChevronRight className="h-5 w-5" />
                                                        </button> */}
                                                        <button
                                                            type="button"
                                                            onClick={handlePreviousImage}
                                                            className={`absolute top-1/2 -translate-y-1/2 
                                                            ${isRTL ? 'right-3' : 'left-3'}
                                                            bg-black/50 hover:bg-black/70 text-white rounded-full p-2 
                                                            transition-all duration-200 z-10`}
                                                            aria-label="Previous image"
                                                        >
                                                            {isRTL ? (
                                                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            ) : (
                                                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleNextImage}
                                                            className={`absolute top-1/2 -translate-y-1/2 
                                                            ${isRTL ? 'left-3' : 'right-3'}
                                                            bg-black/50 hover:bg-black/70 text-white rounded-full p-2 
                                                            transition-all duration-200 z-10`}
                                                            aria-label="Next image"
                                                        >
                                                            {isRTL ? (
                                                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            ) : (
                                                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            )}
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Dots Navigation */}
                                            {images.length > 1 && (
                                                <div className="flex justify-center gap-1.5 mt-3">
                                                    {images.map((_: any, index: any) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index
                                                                ? 'bg-blue-500 scale-125'
                                                                : 'bg-gray-300 hover:bg-gray-400'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">{t("ingredients.details.noImages")}</p>
                                            <p className="text-gray-400 text-sm mt-1">{t("ingredients.details.noImagesDesc")}</p>
                                        </div>
                                    )}
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Additional Details Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <Tag className="h-4 w-4 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t("ingredients.details.details")}</h3>
                                    </div>

                                    {ingredient?.details?.length > 0 ? (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                            <table className="w-full">
                                                <thead className="border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                            {t("ingredients.details.key")}
                                                        </th>
                                                        <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                            {t("ingredients.details.value")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200">
                                                    {ingredient.details.map((d: any, i: number) => (
                                                        <tr
                                                            key={i}
                                                            className="transition-colors duration-150"
                                                        >
                                                            <td className="px-4 py-3 text-sm font-medium">
                                                                {d.key}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm">
                                                                {d.value}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 rounded-xl border border-dashed border-gray-300">
                                            <Info className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="font-medium">{t("ingredients.details.noDetails")}</p>
                                            <p className="text-sm mt-1">This ingredient doesn't have additional details</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-gray-300 hover:transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t("ingredients.details.close")}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}