"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag, Image as ImageIcon, X } from "lucide-react";
import { useGetBrandsByIdQuery } from "@/api/feature/brands/getSlices";
import { useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useTranslation } from "react-i18next";

interface DetailsProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    brandId: string;
}

export default function Details({ isOpen, onOpenChange, brandId }: DetailsProps) {
    const { t } = useTranslation();
    const { data, isLoading, isError } = useGetBrandsByIdQuery(brandId, {
        skip: !isOpen,
    });

    const brand = data?.data;
    // @ts-ignore
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //             <div className="flex items-center justify-between">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Tag className="h-6 w-6 text-blue-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold">
        //                             Brand Details
        //                         </DialogTitle>
        //                         <DialogDescription className="text-gray-600 mt-1">
        //                             View detailed information about the brand
        //                         </DialogDescription>
        //                     </div>
        //                 </div>
        //             </div>
        //         </DialogHeader>

        //         {/* Content */}
        //         <div className="flex-1 p-6 max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
        //             {/* Loading state skeleton */}
        //             {isLoading ? (
        //                 <div className="space-y-6">
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-32" />
        //                         <Skeleton className="h-4 w-full" />
        //                         <Skeleton className="h-4 w-3/4" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-28" />
        //                         <Skeleton className="h-8 w-32" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-24" />
        //                         <Skeleton className="h-8 w-40" />
        //                     </div>
        //                     <div className="space-y-3">
        //                         <Skeleton className="h-6 w-20" />
        //                         <Skeleton className="h-48 w-full rounded-lg" />
        //                     </div>
        //                 </div>
        //             ) : isError ? (
        //                 <div className="text-center py-8">
        //                     <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
        //                         <Tag className="h-8 w-8 text-red-500" />
        //                     </div>
        //                     <p className="text-red-500 font-medium text-lg">Failed to load brand details</p>
        //                     <p className="text-gray-500 mt-1">Please try again later</p>
        //                 </div>
        //             ) : (
        //                 <ScrollArea className="max-h-[500px] pr-4">
        //                     <div className="space-y-6">

        //                         {/* Name Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-blue-50 rounded-lg">
        //                                     <Tag className="h-4 w-4 text-blue-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">Brand Name</h3>
        //                             </div>
        //                             <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        //                                 {brand?.name}
        //                             </p>
        //                         </div>



        //                         <Separator className="bg-gray-200" />

        //                         {/* Images Section */}
        //                         <div className="space-y-3">
        //                             <div className="flex items-center gap-2">
        //                                 <div className="p-2 bg-orange-50 rounded-lg">
        //                                     <ImageIcon className="h-4 w-4 text-orange-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg">
        //                                     Brand Images ({brand?.images?.length || 0})
        //                                 </h3>
        //                             </div>

        //                             {brand?.images && brand.images.length > 0 ? (
        //                                 <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
        //                                     <div className="flex items-center justify-between mb-3">
        //                                         <span className="text-sm font-semibold">Images Gallery</span>
        //                                         <span className="text-xs text-gray-500">
        //                                             {brand.images.length} image{brand.images.length !== 1 ? 's' : ''}
        //                                         </span>
        //                                     </div>

        //                                     {/* Carousel Component */}
        //                                     <Carousel
        //                                         className="w-full"
        //                                         opts={{
        //                                             align: "start",
        //                                             loop: true,
        //                                         }}
        //                                     >
        //                                         <CarouselContent>
        //                                             {brand.images.map((imagePath: string, index: number) => (
        //                                                 <CarouselItem key={index}>
        //                                                     <div className="p-1">
        //                                                         <Card className="border-0 shadow-none">
        //                                                             <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
        //                                                                 <img
        //                                                                     src={
        //                                                                         imagePath.startsWith("http")
        //                                                                             ? imagePath
        //                                                                             : `${import.meta.env.VITE_BASE_URL}/${imagePath}`
        //                                                                     }
        //                                                                     alt={`Brand image ${index + 1}`}
        //                                                                     className="w-full h-full object-cover"
        //                                                                     onError={(e) => {
        //                                                                         (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
        //                                                                     }}
        //                                                                 />
        //                                                                 {/* Image Info */}
        //                                                                 <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
        //                                                                     {index + 1} / {brand.images.length}
        //                                                                 </div>
        //                                                                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        //                                                                     <div className="text-white text-xs truncate">
        //                                                                         {imagePath.split('/').pop()}
        //                                                                     </div>
        //                                                                 </div>
        //                                                             </CardContent>
        //                                                         </Card>
        //                                                     </div>
        //                                                 </CarouselItem>
        //                                             ))}
        //                                         </CarouselContent>

        //                                         {/* Show navigation only if there are multiple images */}
        //                                         {brand.images.length > 1 && (
        //                                             <>
        //                                                 <CarouselPrevious className="left-2 h-8 w-8" />
        //                                                 <CarouselNext className="right-2 h-8 w-8" />
        //                                             </>
        //                                         )}
        //                                     </Carousel>


        //                                 </div>
        //                             ) : brand?.imagePath ? (
        //                                 // Fallback for old data format
        //                                 <div className="space-y-2">
        //                                     <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
        //                                         <img
        //                                             src={
        //                                                 brand.imagePath.startsWith("http")
        //                                                     ? brand.imagePath
        //                                                     : `${import.meta.env.VITE_BASE_URL}/${brand.imagePath}`
        //                                             }
        //                                             alt="Brand image"
        //                                             className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
        //                                             onError={(e) => {
        //                                                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
        //                                             }}
        //                                         />
        //                                     </div>
        //                                     <p className="text-sm text-gray-500 text-center">Brand logo/image</p>
        //                                 </div>
        //                             ) : (
        //                                 <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        //                                     <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
        //                                     <p className="text-gray-500 font-medium">No images available</p>
        //                                     <p className="text-gray-400 text-sm mt-1">This brand doesn't have any images</p>
        //                                 </div>
        //                             )}
        //                         </div>
        //                     </div>
        //                 </ScrollArea>
        //             )}
        //         </div>

        //         {/* Footer */}
        //         <DialogFooter className="p-6 pt-4 border-t border-gray-100">
        //             <Button
        //                 variant="outline"
        //                 onClick={() => onOpenChange(false)}
        //                 className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
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
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Tag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("brands.details.title")}
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 mt-1">
                                    {t("brands.details.subtitle")}
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
                                <Skeleton className="h-8 w-32" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-8 w-40" />
                            </div>
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-48 w-full rounded-lg" />
                            </div>
                        </div>
                    ) : isError ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Tag className="h-8 w-8 text-red-500" />
                            </div>
                            <p className="text-red-500 font-medium text-lg">
                                {t("brands.details.error.title")}
                            </p>
                            <p className="text-gray-500 mt-1">
                                {t("brands.details.error.description")}
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="max-h-[500px] pr-4">
                            <div className="space-y-6">

                                {/* Name Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Tag className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">
                                            {t("brands.details.nameLabel")}
                                        </h3>
                                    </div>
                                    <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        {brand?.name}
                                    </p>
                                </div>

                                <Separator className="bg-gray-200" />

                                {/* Images Section */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">
                                            {t("brands.details.imagesLabel", { count: brand?.images?.length || 0 })}
                                        </h3>
                                    </div>

                                    {brand?.images && brand.images.length > 0 ? (
                                        <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-sm font-semibold">
                                                    {t("brands.details.imagesGallery")}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {brand.images.length} {t(`brands.add.imagesSelected${brand.images.length === 1 ? '' : '_plural'}`, {
                                                        count: brand.images.length
                                                    })}
                                                </span>
                                            </div>

                                            {/* Carousel Component */}
                                            <Carousel
                                                className="w-full"
                                                opts={{
                                                    align: "start",
                                                    loop: true,
                                                }}
                                            >
                                                <CarouselContent>
                                                    {brand.images.map((imagePath: string, index: number) => (
                                                        <CarouselItem key={index}>
                                                            <div className="p-1">
                                                                <Card className="border-0 shadow-none">
                                                                    <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
                                                                        <img
                                                                            src={
                                                                                imagePath.startsWith("http")
                                                                                    ? imagePath
                                                                                    : `${import.meta.env.VITE_BASE_URL}/${imagePath}`
                                                                            }
                                                                            alt={t("brands.details.imageAlt", { index: index + 1 })}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => {
                                                                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                                            }}
                                                                        />
                                                                        {/* Image Info */}
                                                                        <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
                                                                            {index + 1} / {brand.images.length}
                                                                        </div>
                                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                                            <div className="text-white text-xs truncate">
                                                                                {imagePath.split('/').pop()}
                                                                            </div>
                                                                        </div>
                                                                    </CardContent>
                                                                </Card>
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>

                                                {/* Show navigation only if there are multiple images */}
                                                {brand.images.length > 1 && (
                                                    <>
                                                        <CarouselPrevious className="left-2 h-8 w-8" />
                                                        <CarouselNext className="right-2 h-8 w-8" />
                                                    </>
                                                )}
                                            </Carousel>
                                        </div>
                                    ) : brand?.imagePath ? (
                                        // Fallback for old data format
                                        <div className="space-y-2">
                                            <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                <img
                                                    src={
                                                        brand.imagePath.startsWith("http")
                                                            ? brand.imagePath
                                                            : `${import.meta.env.VITE_BASE_URL}/${brand.imagePath}`
                                                    }
                                                    alt="Brand image"
                                                    className="w-full h-64 object-cover transition-transform duration-300 hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                                                    }}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-500 text-center">Brand logo/image</p>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                            <p className="text-gray-500 font-medium">
                                                {t("brands.details.noImages")}
                                            </p>
                                            <p className="text-gray-400 text-sm mt-1">
                                                {t("brands.details.noImagesDesc")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>

                {/* Footer */}
                <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-2 border-gray-300 hover:bg-gray-50 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        {t("brands.details.close")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}