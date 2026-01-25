"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { EditUnitPayload } from "@/types/Units";
import { useUnitsPutMutation } from "@/api/feature/units/putSlice";
import { useGetUnitsByIdQuery } from "@/api/feature/units/getSlice";
import { Ruler, X, Edit, Loader } from "lucide-react";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface EditUnitProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  unitId: string;
}

export default function EditUnit({ isOpen, onOpenChange, unitId }: EditUnitProps) {
  const {t} = useTranslation();
  const { data, isLoading } = useGetUnitsByIdQuery(unitId);
  const [updateUnit, { isLoading: isUpdating }] = useUnitsPutMutation();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditUnitPayload>({
    defaultValues: { unitId, name: "" },
  });

  useEffect(() => {
    if (data?.data) {
      reset({ unitId: data.data.id, name: data.data.name });
    }
  }, [data, reset]);

  const onSubmit = async (formData: EditUnitPayload) => {
    try {
      const res = await updateUnit(formData);
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
    // <Dialog open={isOpen} onOpenChange={onOpenChange}>
    //   <DialogContent className="sm:max-w-[450px] p-0 rounded-2xl overflow-hidden ">
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       {/* Header */}
    //       <DialogHeader className="p-6 pb-4 border-b border-gray-100">
    //         <div className="flex items-center gap-3">
    //           <div className="p-2 bg-white rounded-xl shadow-sm">
    //             <Edit className="h-6 w-6 text-orange-600" />
    //           </div>
    //           <div>
    //             <DialogTitle className="text-2xl font-bold ">
    //               Edit Unit
    //             </DialogTitle>
    //             <p className="text-gray-600 mt-1 text-sm">
    //               Update unit information
    //             </p>
    //           </div>
    //         </div>
    //       </DialogHeader>

    //       {/* Content */}
    //       <div className="p-6">
    //         <div className="space-y-6">
    //           {/* Name Field */}
    //           <div className="space-y-3">
    //             <div className="flex items-center gap-2">
    //               <div className="p-2 bg-blue-50 rounded-lg">
    //                 <Ruler className="h-4 w-4 text-blue-600" />
    //               </div>
    //               <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
    //                 Unit Name
    //               </Label>
    //             </div>
    //             <Input
    //               id="name"
    //               {...register("name", {
    //                 required: "Unit name is required",
    //                 minLength: {
    //                   value: 1,
    //                   message: "Unit name is required"
    //                 }
    //               })}
    //               disabled={isLoading}
    //               className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
    //               placeholder="Enter unit name (e.g., gram, kilogram, liter...)"
    //             />
    //             {errors.name && (
    //               <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
    //                 <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
    //                 {errors.name.message}
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       </div>

    //       {/* Footer */}
    //       <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
    //         <DialogClose asChild>
    //           <Button
    //             variant="outline"
    //             type="button"
    //             onClick={handleClose}
    //             disabled={isUpdating}
    //             className="flex items-center gap-2 border-gray-300  transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
    //           >
    //             <X className="h-4 w-4" />
    //             Cancel
    //           </Button>
    //         </DialogClose>
    //         <Button
    //           type="submit"
    //           disabled={isUpdating || isLoading}
    //           className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
    //         >
    //           {isUpdating ? (
    //             <>
    //               <Loader className="h-4 w-4 animate-spin" />
    //               Updating...
    //             </>
    //           ) : (
    //             <>
    //               <Edit className="h-4 w-4" />
    //               Update Unit
    //             </>
    //           )}
    //         </Button>
    //       </DialogFooter>
    //     </form>
    //   </DialogContent>
    // </Dialog>
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
                  {t("units.edit.title")}
                </DialogTitle>
                <p className="text-gray-600 mt-1 text-sm">
                  {t("units.edit.subtitle")}
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
                    <Ruler className="h-4 w-4 text-blue-600" />
                  </div>
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    {t("units.edit.nameLabel")}
                  </Label>
                </div>
                <Input
                  id="name"
                  {...register("name", {
                    required: t("units.edit.nameRequired"),
                    minLength: {
                      value: 1,
                      message: t("units.edit.nameRequired")
                    }
                  })}
                  disabled={isLoading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                  placeholder={t("units.edit.namePlaceholder")}
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
                variant="outline"
                type="button"
                onClick={handleClose}
                disabled={isUpdating}
                className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
              >
                <X className="h-4 w-4" />
                {t("units.edit.cancel")}
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isUpdating || isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  {t("units.edit.saving")}
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  {t("units.edit.save")}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}