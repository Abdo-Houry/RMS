
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { X, Plus, Upload, Image as ImageIcon, Tag, Scale, Loader, Edit, ChevronLeft, ChevronRight, Building2 } from "lucide-react";

import { useGetIngredientsByIdQuery } from "@/api/feature/Ingredients/getSlice";
import { useFilterUnitsQuery } from "@/api/feature/units/getSlice";
import { useIngredientsPutMutation } from "@/api/feature/Ingredients/putSlice";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useFilterBrandsQuery } from "@/api/feature/brands/getSlices";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

interface EditIngredientProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    ingredientId: string;
}

interface ImagePreview {
    id: string
    url: string
    file?: File
    isExisting?: boolean
    path?: string
    name?: string
}

const schema = z.object({
    name: z.string().min(1),
    unitId: z.string().min(1),
    brandId: z.string().optional(), // إضافة brandId اختيارية
    image: z.any().optional(),
    details: z.array(
        z.object({
            key: z.string().min(1),
            value: z.string().min(1),
            id: z.string().optional(),
        })
    ),
});

type FormData = z.infer<typeof schema>;

export default function EditIngredient({ isOpen, onOpenChange, ingredientId }: EditIngredientProps) {
    const { t } = useTranslation();
    const { data, isLoading } = useGetIngredientsByIdQuery(ingredientId);
    const { data: unitsData } = useFilterUnitsQuery({ page: 1, size: 50 });
    const { data: brandsData } = useFilterBrandsQuery({ page: 1, size: 50 }); // جلب الـ brands

    const units = unitsData?.data?.values || [];
    const brands = brandsData?.data?.values || [];

    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    // @ts-ignore
    const [removedDetails, setRemovedDetails] = useState<any[]>([]);
    const [updateIngredient, { isLoading: isUpdating }] = useIngredientsPutMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // @ts-ignore
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } =
        useForm<FormData>({
            resolver: zodResolver(schema),
            defaultValues: { name: "", unitId: "", brandId: "", details: [] },
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "details",
    });

    // --------------------
    // Fill form with data
    // --------------------
    useEffect(() => {
        if (isOpen && data?.data) {
            const ingredient = data.data;
            reset({
                name: ingredient.name,
                unitId: ingredient.unitId || "",
                brandId: ingredient.brandId || "",
                details: ingredient.details?.map((d: any) => ({ ...d })) || [],
            });

            // Set existing images
            setImagesToRemove([]);
            setCurrentImageIndex(0);

            if (ingredient.images && Array.isArray(ingredient.images) && ingredient.images.length > 0) {
                const existingImages: ImagePreview[] = ingredient.images.map((imgPath: string, index: number) => ({
                    id: `existing-${index}`,
                    url: `${import.meta.env.VITE_BASE_URL}/${imgPath}`,
                    path: imgPath,
                    name: `Image ${index + 1}`,
                    isExisting: true
                }))
                setSelectedImages(existingImages)
            } else if (ingredient.imagePath) {
                // Fallback for old data format
                const existingImage: ImagePreview = {
                    id: 'existing-0',
                    url: `${import.meta.env.VITE_BASE_URL}/${ingredient.imagePath}`,
                    path: ingredient.imagePath,
                    name: 'Ingredient Image',
                    isExisting: true
                }
                setSelectedImages([existingImage])
            } else {
                setSelectedImages([])
            }
        }
    }, [isOpen, data, reset]);

    // --------------------
    // Handle new image selection
    // --------------------
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const newImages: ImagePreview[] = []

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file && file.type.startsWith('image/')) {
                    const imageUrl = URL.createObjectURL(file)
                    newImages.push({
                        id: `new-${Date.now()}-${i}`,
                        url: imageUrl,
                        file: file,
                        name: file.name,
                        isExisting: false
                    })
                }
            }

            setSelectedImages(prev => [...prev, ...newImages])
        }
    }

    const handleRemoveImage = (id: string) => {
        setSelectedImages(prev => {
            const imageToRemove = prev.find(img => img.id === id)
            const newImages = prev.filter(img => img.id !== id)

            // If it's an existing image with a valid path, add to removal list
            if (imageToRemove?.isExisting && imageToRemove.path) {
                const path = imageToRemove.path as string
                setImagesToRemove(prev => [...prev, path])
            }

            // Adjust current index if needed
            if (newImages.length > 0) {
                const newIndex = Math.min(currentImageIndex, newImages.length - 1)
                setCurrentImageIndex(newIndex)
            } else {
                setCurrentImageIndex(0)
            }

            return newImages
        })
    }

    // --------------------
    // Handle remove all new images
    // --------------------
    const handleRemoveAllNewImages = () => {
        // Only remove new images, keep existing ones
        const existingImages = selectedImages.filter(img => img.isExisting)
        const newImages = selectedImages.filter(img => !img.isExisting)

        // Clean up URLs for new images
        newImages.forEach(img => {
            if (!img.isExisting) {
                URL.revokeObjectURL(img.url)
            }
        })

        setSelectedImages(existingImages)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    // --------------------
    // Handle close dialog
    // --------------------
    const handleClose = () => {
        // Clean up URLs
        selectedImages.forEach(img => {
            if (!img.isExisting) {
                URL.revokeObjectURL(img.url)
            }
        })

        reset();
        setSelectedImages([]);
        setImagesToRemove([]);
        setRemovedDetails([]);
        setCurrentImageIndex(0);

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        onOpenChange(false);
    };

    // --------------------
    // FIXED DELETE LOGIC
    // --------------------
    const handleDeleteDetail = (index: number) => {
        const detail = fields[index];

        if (detail.id) {
            setRemovedDetails(prev => [...prev, detail.id]);
        }

        remove(index);
    };

    // --------------------
    // SUBMIT
    // --------------------
    const onSubmit = async (formData: FormData) => {
        try {
            const payload = new FormData();

            payload.append("ingredientId", ingredientId);
            payload.append("name", formData.name);
            payload.append("unitId", formData.unitId);

            // إضافة brandId إذا كانت موجودة وليست فارغة
            if (formData.brandId && formData.brandId.trim() !== "") {
                payload.append("brandId", formData.brandId);
            }

            // -----------------------------
            // استخراج التفاصيل الأصلية من API
            // -----------------------------
            const originalDetails = data?.data?.details || [];

            // -----------------------------
            // تحديد التفاصيل الحالية بعد التعديل
            // -----------------------------
            const currentDetails = formData.details;

            // -----------------------------
            // 1) detailsToAdd = فقط العناصر التي ليس لديها id
            // -----------------------------
            const detailsToAdd = currentDetails.filter((d: any) => !d.id);

            detailsToAdd.forEach((d, index) => {
                payload.append(`detailsToAdd[${index}][key]`, d.key);
                payload.append(`detailsToAdd[${index}][value]`, d.value);
            });

            // -----------------------------
            // 2) detailsToRemove = العناصر القديمة التي اختفت بعد التعديل
            // -----------------------------
            const detailsToRemove = originalDetails
                .filter((od: any) => !currentDetails.some((cd) => cd.id === od.id))
                .map((d: any) => d.id);

            detailsToRemove.forEach((id: string, index: number) => {
                payload.append(`detailsToRemove[${index}]`, id);
            });

            // Add images to remove
            imagesToRemove.forEach(path => {
                payload.append('imagesToRemove', path)
            })

            // Add new images
            const newImages = selectedImages.filter(img => !img.isExisting)
            newImages.forEach(img => {
                if (img.file) {
                    payload.append('imagesToAdd', img.file)
                }
            })

            const res = await updateIngredient(payload);
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
    const isRTL = i18n.language === "ar";
    if (isLoading) return null;

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             {/* Header */}
        //             <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Edit className="h-6 w-6 text-orange-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold">
        //                             Edit Ingredient
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1 text-sm">
        //                             Update ingredient information and details
        //                         </p>
        //                     </div>
        //                 </div>
        //             </DialogHeader>

        //             {/* Content */}
        //             <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
        //                 {/* Name Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-blue-50 rounded-lg">
        //                             <Tag className="h-4 w-4 text-blue-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold ">
        //                             Ingredient Name
        //                         </Label>
        //                     </div>
        //                     <Input
        //                         id="name"
        //                         {...register("name")}
        //                         disabled={isLoading}
        //                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
        //                         placeholder="Enter ingredient name..."
        //                     />
        //                     {errors.name && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.name.message}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Unit Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-purple-50 rounded-lg">
        //                             <Scale className="h-4 w-4 text-purple-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold ">
        //                             Measurement Unit
        //                         </Label>
        //                     </div>
        //                     <Controller
        //                         name="unitId"
        //                         control={control}
        //                         render={({ field }) => (
        //                             <Select
        //                                 value={field.value}
        //                                 onValueChange={field.onChange}
        //                                 disabled={isLoading}
        //                             >
        //                                 <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
        //                                     <SelectValue placeholder="Select unit" />
        //                                 </SelectTrigger>
        //                                 <SelectContent className="rounded-lg">
        //                                     <SelectGroup>
        //                                         {units.map((u: any) => (
        //                                             <SelectItem
        //                                                 key={u.id}
        //                                                 value={u.id.toString()}
        //                                                 className="focus:bg-blue-50 focus:text-blue-600 rounded-md"
        //                                             >
        //                                                 {u.name}
        //                                             </SelectItem>
        //                                         ))}
        //                                     </SelectGroup>
        //                                 </SelectContent>
        //                             </Select>
        //                         )}
        //                     />
        //                     {errors.unitId && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.unitId.message}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Brand Field - الجديد */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-indigo-50 rounded-lg">
        //                             <Building2 className="h-4 w-4 text-indigo-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold ">
        //                             Brand (Optional)
        //                         </Label>
        //                     </div>
        //                     <Controller
        //                         name="brandId"
        //                         control={control}
        //                         render={({ field }) => (
        //                             <Select
        //                                 value={field.value}
        //                                 onValueChange={field.onChange}
        //                                 disabled={isLoading}
        //                             >
        //                                 <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
        //                                     <SelectValue placeholder="Select brand (optional)" />
        //                                 </SelectTrigger>
        //                                 <SelectContent className="rounded-lg">
        //                                     <SelectGroup>
        //                                         {brands.map((brand: any) => (
        //                                             <SelectItem
        //                                                 key={brand.id}
        //                                                 value={brand.id.toString()}
        //                                                 className="focus:bg-blue-50 focus:text-blue-600 rounded-md"
        //                                             >
        //                                                 {brand.name}
        //                                             </SelectItem>
        //                                         ))}
        //                                     </SelectGroup>
        //                                 </SelectContent>
        //                             </Select>
        //                         )}
        //                     />
        //                     {errors.brandId && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.brandId.message}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Image Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center justify-between">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-orange-50 rounded-lg">
        //                                 <ImageIcon className="h-4 w-4 text-orange-600" />
        //                             </div>
        //                             <Label htmlFor="images" className="text-sm font-semibold ">
        //                                 Ingredient Images
        //                             </Label>
        //                         </div>

        //                         {selectedImages.some(img => !img.isExisting) && (
        //                             <button
        //                                 type="button"
        //                                 onClick={handleRemoveAllNewImages}
        //                                 className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
        //                             >
        //                                 Remove New Images
        //                             </button>
        //                         )}
        //                     </div>

        //                     {/* Images Summary */}
        //                     {selectedImages.length > 0 && (
        //                         <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        //                             <div className="flex items-center justify-between">
        //                                 <span>
        //                                     <span className="font-medium">{selectedImages.length}</span> image{selectedImages.length !== 1 ? 's' : ''}
        //                                 </span>
        //                                 <div className="text-xs">
        //                                     {selectedImages.filter(img => img.isExisting).length} existing
        //                                     {selectedImages.some(img => !img.isExisting) && (
        //                                         <span className="ml-2">
        //                                             • {selectedImages.filter(img => !img.isExisting).length} new
        //                                         </span>
        //                                     )}
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     )}

        //                     {/* Upload Area */}
        //                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
        //                         <Input
        //                             id="images"
        //                             type="file"
        //                             accept="image/*"
        //                             multiple
        //                             onChange={handleImageChange}
        //                             disabled={isLoading}
        //                             ref={fileInputRef}
        //                         // className="hidden"
        //                         />
        //                         <label htmlFor="images" className="cursor-pointer block">
        //                             <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
        //                             <p className="text-sm font-medium  mb-1">
        //                                 Click to add new images
        //                             </p>
        //                             <p className="text-xs text-gray-500">
        //                                 Supports: PNG, JPG, JPEG • Max: 5MB each
        //                             </p>
        //                         </label>
        //                     </div>

        //                     {/* Images Preview */}
        //                     {selectedImages.length > 0 && (
        //                         <div className="mt-4 p-4 border border-gray-200 rounded-xl shadow-sm">
        //                             <div className="flex items-center justify-between mb-3">
        //                                 <span className="text-sm font-semibold ">
        //                                     {selectedImages.some(img => !img.isExisting)
        //                                         ? "New Images Preview"
        //                                         : "Current Ingredient Images"}
        //                                 </span>
        //                                 {selectedImages.length > 1 && (
        //                                     <span className="text-xs text-gray-500">
        //                                         {currentImageIndex + 1} of {selectedImages.length}
        //                                     </span>
        //                                 )}
        //                             </div>

        //                             {/* Carousel Implementation */}
        //                             <div className="relative overflow-hidden rounded-lg border">
        //                                 <div
        //                                     className="flex transition-transform duration-300 ease-in-out"
        //                                     style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        //                                 >
        //                                     {selectedImages.map((image, index) => (
        //                                         <div key={image.id} className="w-full flex-shrink-0">
        //                                             <div className="relative">
        //                                                 <img
        //                                                     src={image.url}
        //                                                     alt={image.name || `Image ${index + 1}`}
        //                                                     className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
        //                                                 />
        //                                                 {/* Delete Button */}
        //                                                 <button
        //                                                     type="button"
        //                                                     onClick={() => handleRemoveImage(image.id)}
        //                                                     className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
        //                                                     title="Remove image"
        //                                                 >
        //                                                     <X className="h-4 w-4" />
        //                                                 </button>
        //                                             </div>
        //                                         </div>
        //                                     ))}
        //                                 </div>

        //                                 {/* Navigation Arrows */}
        //                                 {selectedImages.length > 1 && (
        //                                     <>
        //                                         <button
        //                                             type="button"
        //                                             onClick={() => setCurrentImageIndex(prev =>
        //                                                 prev > 0 ? prev - 1 : selectedImages.length - 1
        //                                             )}
        //                                             className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
        //                                         >
        //                                             <ChevronLeft className="h-5 w-5" />
        //                                         </button>
        //                                         <button
        //                                             type="button"
        //                                             onClick={() => setCurrentImageIndex(prev =>
        //                                                 prev < selectedImages.length - 1 ? prev + 1 : 0
        //                                             )}
        //                                             className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
        //                                         >
        //                                             <ChevronRight className="h-5 w-5" />
        //                                         </button>
        //                                     </>
        //                                 )}
        //                             </div>

        //                             {/* Dots Navigation */}
        //                             {selectedImages.length > 1 && (
        //                                 <div className="flex justify-center gap-1.5 mt-3">
        //                                     {selectedImages.map((_, index) => (
        //                                         <button
        //                                             key={index}
        //                                             type="button"
        //                                             onClick={() => setCurrentImageIndex(index)}
        //                                             className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index
        //                                                 ? 'bg-blue-500 scale-125'
        //                                                 : 'bg-gray-300 hover:bg-gray-400'
        //                                                 }`}
        //                                         />
        //                                     ))}
        //                                 </div>
        //                             )}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Details Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-green-50 rounded-lg">
        //                             <Tag className="h-4 w-4 text-green-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold ">
        //                             Additional Details
        //                         </Label>
        //                     </div>

        //                     <div className="space-y-3">
        //                         {fields.map((field, index) => (
        //                             <div key={field.id} className="flex gap-3 items-start">
        //                                 <div className="flex-1 space-y-2">
        //                                     <Input
        //                                         placeholder="Key (e.g., Calories, Protein)"
        //                                         {...register(`details.${index}.key` as const)}
        //                                         disabled={isLoading}
        //                                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
        //                                     />
        //                                     {errors.details?.[index]?.key && (
        //                                         <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
        //                                     )}
        //                                 </div>
        //                                 <div className="flex-1 space-y-2">
        //                                     <Input
        //                                         placeholder="Value (e.g., 100kcal, 20g)"
        //                                         {...register(`details.${index}.value` as const)}
        //                                         disabled={isLoading}
        //                                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
        //                                     />
        //                                     {errors.details?.[index]?.value && (
        //                                         <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
        //                                     )}
        //                                 </div>
        //                                 <button
        //                                     type="button"
        //                                     onClick={() => handleDeleteDetail(index)}
        //                                     disabled={isLoading}
        //                                     className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1 disabled:opacity-50"
        //                                 >
        //                                     <X className="h-4 w-4" />
        //                                 </button>
        //                             </div>
        //                         ))}
        //                     </div>

        //                     <Button
        //                         type="button"
        //                         onClick={() => append({ key: "", value: "" })}
        //                         disabled={isLoading}
        //                         variant="outline"
        //                         className="w-full border-dashed border-gray-300 text-gray-600 transition-all duration-200 rounded-lg py-2.5"
        //                     >
        //                         <Plus className="h-4 w-4 mr-2" />
        //                         Add Detail Field
        //                     </Button>
        //                 </div>
        //             </div>

        //             {/* Footer */}
        //             <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
        //                 <Button
        //                     type="button"
        //                     variant="outline"
        //                     onClick={handleClose}
        //                     disabled={isLoading || isUpdating}
        //                     className="flex items-center gap-2 border-gray-300  transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                 >
        //                     <X className="h-4 w-4" />
        //                     Cancel
        //                 </Button>
        //                 <Button
        //                     type="submit"
        //                     disabled={isUpdating || isLoading}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //                 >
        //                     {isUpdating ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Updating...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Edit className="h-4 w-4" />
        //                             Update Ingredient
        //                         </>
        //                     )}
        //                 </Button>
        //             </DialogFooter>
        //         </form>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Header */}
                    <DialogHeader className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-sm">
                                <Edit className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("ingredients.edit.title")}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t("ingredients.edit.subtitle")}
                                </p>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
                        {/* Name Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Tag className="h-4 w-4 text-blue-600" />
                                </div>
                                <Label className="text-sm font-semibold ">
                                    {t("ingredients.edit.nameLabel")}
                                </Label>
                            </div>
                            <Input
                                id="name"
                                {...register("name")}
                                disabled={isLoading}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                placeholder={t("ingredients.edit.namePlaceholder")}
                            />
                            {errors.name && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        {/* Unit Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Scale className="h-4 w-4 text-purple-600" />
                                </div>
                                <Label className="text-sm font-semibold ">
                                    {t("ingredients.edit.unitLabel")}
                                </Label>
                            </div>
                            <Controller
                                name="unitId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
                                            <SelectValue placeholder={t("ingredients.edit.chooseUnit")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectGroup>
                                                {units.map((u: any) => (
                                                    <SelectItem
                                                        key={u.id}
                                                        value={u.id.toString()}
                                                        className="focus:bg-blue-50 focus:text-blue-600 rounded-md"
                                                    >
                                                        {u.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.unitId && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.unitId.message}
                                </div>
                            )}
                        </div>

                        {/* Brand Field - الجديد */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Building2 className="h-4 w-4 text-indigo-600" />
                                </div>
                                <Label className="text-sm font-semibold ">
                                    {t("ingredients.edit.brandLabel")}
                                </Label>
                            </div>
                            <Controller
                                name="brandId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isLoading}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
                                            <SelectValue placeholder={t("ingredients.edit.chooseBrand")} />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectGroup>
                                                {brands.map((brand: any) => (
                                                    <SelectItem
                                                        key={brand.id}
                                                        value={brand.id.toString()}
                                                        className="focus:bg-blue-50 focus:text-blue-600 rounded-md"
                                                    >
                                                        {brand.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.brandId && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.brandId.message}
                                </div>
                            )}
                        </div>

                        {/* Image Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <Label htmlFor="images" className="text-sm font-semibold ">
                                        {t("ingredients.edit.imagesLabel")}
                                    </Label>
                                </div>

                                {selectedImages.some(img => !img.isExisting) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAllNewImages}
                                        className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                    >
                                        {t("ingredients.edit.removeNew")}
                                    </button>
                                )}
                            </div>

                            {/* Images Summary */}
                            {selectedImages.length > 0 && (
                                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span>
                                            <span className="font-medium">{selectedImages.length}</span> image{selectedImages.length !== 1 ? 's' : ''}
                                        </span>
                                        <div className="text-xs">
                                            {selectedImages.filter(img => img.isExisting).length} {t("ingredients.edit.existing")}
                                            {selectedImages.some(img => !img.isExisting) && (
                                                <span className="ml-2">
                                                    • {selectedImages.filter(img => !img.isExisting).length} {t("ingredients.edit.new")}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                    disabled={isLoading}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer block">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium  mb-1">
                                        {t("ingredients.edit.clickToAdd")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("ingredients.edit.uploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {/* Images Preview */}
                            {selectedImages.length > 0 && (
                                <div className="mt-4 p-4 border border-gray-200 rounded-xl shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold ">
                                            {t("ingredients.edit.imagesPreview")}
                                        </span>
                                        {selectedImages.length > 1 && (
                                            <span className="text-xs text-gray-500">
                                                {currentImageIndex + 1} of {selectedImages.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Carousel Implementation */}
                                    <div className="relative overflow-hidden rounded-lg border">
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(${isRTL ? '' : '-'}${currentImageIndex * 100}%)` }}
                                        >
                                            {selectedImages.map((image, index) => (
                                                <div key={image.id} className="w-full flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            loading="lazy"
                                                            src={image.url}
                                                            alt={image.name || `Image ${index + 1}`}
                                                            className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
                                                        />
                                                        {/* Delete Button */}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(image.id)}
                                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                                                            title={t("ingredients.edit.removeImage")}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Navigation Arrows */}
                                        {selectedImages.length > 1 && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentImageIndex(prev =>
                                                        prev > 0 ? prev - 1 : selectedImages.length - 1
                                                    )}
                                                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                >
                                                    <ChevronLeft className="h-5 w-5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setCurrentImageIndex(prev =>
                                                        prev < selectedImages.length - 1 ? prev + 1 : 0
                                                    )}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                >
                                                    <ChevronRight className="h-5 w-5" />
                                                </button>
                                            </>
                                        )}
                                    </div>

                                    {/* Dots Navigation */}
                                    {selectedImages.length > 1 && (
                                        <div className="flex justify-center gap-1.5 mt-3">
                                            {selectedImages.map((_, index) => (
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
                            )}
                        </div>

                        {/* Details Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Tag className="h-4 w-4 text-green-600" />
                                </div>
                                <Label className="text-sm font-semibold ">
                                    {t("ingredients.edit.detailsLabel")}
                                </Label>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-start">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder={t("ingredients.edit.keyPlaceholder")}
                                                {...register(`details.${index}.key` as const)}
                                                disabled={isLoading}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                            />
                                            {errors.details?.[index]?.key && (
                                                <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder={t("ingredients.edit.valuePlaceholder")}
                                                {...register(`details.${index}.value` as const)}
                                                disabled={isLoading}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                            />
                                            {errors.details?.[index]?.value && (
                                                <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteDetail(index)}
                                            disabled={isLoading}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1 disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={() => append({ key: "", value: "" })}
                                disabled={isLoading}
                                variant="outline"
                                className="w-full border-dashed border-gray-300 text-gray-600 transition-all duration-200 rounded-lg py-2.5"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t("ingredients.edit.addDetail")}
                            </Button>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-6 pt-4 border-t border-gray-100 ">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading || isUpdating}
                            className="flex items-center gap-2 border-gray-300  transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t("ingredients.edit.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isUpdating || isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-purple-600 hover:from-orange-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("ingredients.edit.saving")}
                                </>
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" />
                                    {t("ingredients.edit.save")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}