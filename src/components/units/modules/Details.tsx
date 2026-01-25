"use client";

import { useGetUnitsByIdQuery, useGetUnitsByIdStaffQuery } from "@/api/feature/units/getSlice";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Ruler, X, Info } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole"; // استيراد الـ hook
import { useTranslation } from "react-i18next";

interface DetailsUnitProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    unitId: string;
}

export default function DetailsUnit({ isOpen, onOpenChange, unitId }: DetailsUnitProps) {
    const { isStaff, isLoading: roleLoading } = useUserRole(); // استخدام الـ hook

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading } = isStaff
        ? useGetUnitsByIdStaffQuery(unitId, {
            skip: !isOpen && !isStaff || roleLoading,
        })
        : useGetUnitsByIdQuery(unitId, {
            skip: !isOpen && isStaff || roleLoading,
        });

    const unit = data?.data;
    const {t} = useTranslation();
    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden ">
        //         {/* Header */}
        //         <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //             <div className="flex items-center justify-between">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Ruler className="h-6 w-6 text-blue-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold ">
        //                             Unit Details
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1">
        //                             Complete information about the measurement unit
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
        //             ) : unit ? (
        //                 <div className="space-y-6">
        //                     {/* Name Section */}
        //                     <div className="space-y-3">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-blue-50 rounded-lg">
        //                                 <Ruler className="h-4 w-4 text-blue-600" />
        //                             </div>
        //                             <h3 className="font-semibold text-lg ">Unit Name</h3>
        //                         </div>
        //                         <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
        //                             {unit.name}
        //                         </p>
        //                     </div>
        //                 </div>
        //             ) : (
        //                 <div className="text-center py-8">
        //                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
        //                         <Info className="h-8 w-8 text-gray-400" />
        //                     </div>
        //                     <p className="text-gray-500 font-medium text-lg">No details available</p>
        //                     <p className="text-gray-400 mt-1">The unit information could not be loaded</p>
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
                                <Ruler className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("units.details.title")}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1">
                                    {t("units.details.subtitle")}
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
                    ) : unit ? (
                        <div className="space-y-6">
                            {/* Name Section */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Ruler className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-lg">
                                        {t("units.details.nameLabel")}
                                    </h3>
                                </div>
                                <p className="text-gray-700 text-lg leading-relaxed bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    {unit.name}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Info className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium text-lg">
                                {t("units.details.error.title")}
                            </p>
                            <p className="text-gray-400 mt-1">
                                {t("units.details.error.description")}
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
                            {t("units.details.close")}
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}