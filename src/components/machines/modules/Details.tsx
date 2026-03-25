"use client";

import { useState, useEffect } from "react";
import { useGetMachinesByIdQuery, useGetMachinesByIdStaffQuery } from "@/api/feature/machines/getSlice";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Cpu, X, Image as ImageIcon, Tag, Settings, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";


export default function DetailsMachine() {
    const { id: machineId } = useParams<{ id: string }>();
    const navigate = useNavigate()
    const { t } = useTranslation();
    const { isStaff, isLoading: roleLoading } = useUserRole();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [machineImages, setMachineImages] = useState<string[]>([]);

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useGetMachinesByIdStaffQuery(machineId, {
            skip: !isStaff || roleLoading,
        })
        : useGetMachinesByIdQuery(machineId, {
            skip: isStaff || roleLoading,
        });

    const machine = data?.data;

    // تحديث الصور عند تغيير البيانات
    useEffect(() => {
        if (machine) {
            // إذا كان هناك مصفوفة images، استخدمها
            if (machine.images && Array.isArray(machine.images) && machine.images.length > 0) {
                const imageUrls = machine.images.map((imgPath: string) =>
                    imgPath.startsWith("http") ? imgPath : `${import.meta.env.VITE_BASE_URL}/${imgPath}`
                );
                setMachineImages(imageUrls);
                setCurrentImageIndex(0);
            }
            // إذا لم يكن هناك images ولكن هناك imagePath كاحتياطي للنظام القديم
            else if (machine.imagePath) {
                const imageUrl = machine.imagePath.startsWith("http")
                    ? machine.imagePath
                    : `${import.meta.env.VITE_BASE_URL}/${machine.imagePath}`;
                setMachineImages([imageUrl]);
                setCurrentImageIndex(0);
            } else {
                setMachineImages([]);
            }
        }
    }, [machine]);

    const handlePreviousImage = () => {
        setCurrentImageIndex(prev =>
            prev > 0 ? prev - 1 : machineImages.length - 1
        );
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev =>
            prev < machineImages.length - 1 ? prev + 1 : 0
        );
    };

    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3  mt-6 overflow-hidden">

            {/* Header */}
            <div className="p-6 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl shadow-sm">
                        <Cpu className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t("machines.details.title")}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {t("machines.details.subtitle")}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 pr-2 space-y-6 py-4">
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
                    <ScrollArea className="pr-4">
                        <div className="space-y-6">

                            {/* Name Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Tag className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t('machines.details.machineName')}</h3>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {machine?.name}
                                </p>
                            </div>

                            <Separator className="bg-gray-200" />
                            {/* Description Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-purple-50 rounded-lg">
                                        <FileText className="h-4 w-4 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t('machines.details.machineDescription')}</h3>
                                </div>
                                <p className="text-gray-700 text-base leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200 whitespace-pre-line">
                                    {machine?.description || t('machines.details.noDescription')}
                                </p>
                            </div>

                            <Separator className="bg-gray-200" />
                            {/* Image Section with Carousel */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-orange-50 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{t('machines.details.machineImage')}</h3>
                                    </div>
                                    {machineImages.length > 1 && (
                                        <span className="text-sm text-gray-500">
                                            {currentImageIndex + 1} / {machineImages.length}
                                        </span>
                                    )}
                                </div>

                                {machineImages.length > 0 ? (
                                    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        {/* Carousel Container */}
                                        <div className="relative h-64 overflow-hidden">
                                            <div
                                                className="flex transition-transform duration-300 ease-in-out h-full"
                                                style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                            >
                                                {machineImages.map((imageUrl, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-full flex-shrink-0 h-full"
                                                    >
                                                        <img
                                                            src={imageUrl}
                                                            alt={`${machine?.name} - Image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Navigation Arrows */}
                                            {machineImages.length > 1 && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={handlePreviousImage}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                        aria-label="Previous image"
                                                    >
                                                        <ChevronLeft className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={handleNextImage}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                        aria-label="Next image"
                                                    >
                                                        <ChevronRight className="h-5 w-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>

                                        {/* Dots Navigation */}
                                        {machineImages.length > 1 && (
                                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
                                                {machineImages.map((_, index) => (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${currentImageIndex === index
                                                            ? 'bg-white scale-125'
                                                            : 'bg-white/50 hover:bg-white/70'
                                                            }`}
                                                        aria-label={`Go to image ${index + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">{t('machines.details.noImage')}</p>
                                        <p className="text-gray-400 text-sm mt-1">{t('machines.details.noImageDescription')}</p>
                                    </div>
                                )}
                            </div>

                            <Separator className="bg-gray-200" />

                            {/* Specifications Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <Settings className="h-4 w-4 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{t('machines.details.machineSpecifications')}</h3>
                                </div>

                                {machine?.details?.length > 0 ? (
                                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                        <table className="w-full">
                                            <thead className="border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                        {t('machines.details.specification')}
                                                    </th>
                                                    <th className="px-4 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                                                        {t('machines.details.value')}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {machine.details.map((d: any, i: number) => (
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
                                    <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                        <Settings className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-500 font-medium">{t('machines.details.noSpecifications')}</p>
                                        <p className="text-gray-400 text-sm mt-1">{t('machines.details.noSpecificationsDescription')}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </ScrollArea>
                )}
            </div>
            {/* Footer */}
            <div className="p-6 pt-4 border-t border-gray-100">
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2"
                >
                    <X className="h-4 w-4" />
                    {t("machines.details.close")}
                </Button>
            </div>
        </div>
    );
}