"use client";

import { useState } from "react";
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
import { X, Plus, Upload, Image as ImageIcon, Tag, Scale, Loader, Package, ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useFilterUnitsQuery } from "@/api/feature/units/getSlice";
import { useIngredientsPostMutation } from "@/api/feature/Ingredients/postSlice";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { Card, CardContent } from "@/components/ui/card";
import { useFilterBrandsQuery } from "@/api/feature/brands/getSlices";
import { useTranslation } from "react-i18next";

interface AddIngredientProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

interface ImagePreview {
    id: string;
    url: string;
    file: File;
}



export default function AddIngredient({ isOpen, onOpenChange }: AddIngredientProps) {
    const { t } = useTranslation();
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const schema = z.object({
        // name: z.string().min(1, "Name is required"),
        // unitId: z.string().min(1, "Unit is required"),
        // brandId: z.string().min(1, "Brand is required"),
        // images: z.instanceof(FileList)
        //     .refine(files => files.length > 0, "At least one image is required")
        //     .refine(files => files.length <= 10, "Maximum 10 images allowed")
        //     .refine(files => {
        //         for (let i = 0; i < files.length; i++) {
        //             if (files[i]?.size > 5 * 1024 * 1024) {
        //                 return false;
        //             }
        //         }
        //         return true;
        //     }, "Each image must be less than 5MB")
        //     .refine(files => {
        //         for (let i = 0; i < files.length; i++) {
        //             if (!files[i]?.type.startsWith('image/')) {
        //                 return false;
        //             }
        //         }
        //         return true;
        //     }, "Only image files are allowed"),
        // details: z.array(z.object({
        //     key: z.string().min(1, "Key required"),
        //     value: z.string().min(1, "Value required"),
        // })),
        name: z.string().min(1, t("ingredients.add.nameRequired")),
        unitId: z.string().min(1, t("ingredients.add.unitRequired")),
        brandId: z.string().min(1, t("ingredients.add.brandRequired")),
        images: z.instanceof(FileList)
            .refine(files => files.length > 0, t("ingredients.add.imagesRequired"))
            .refine(files => files.length <= 10, t("ingredients.add.maxImages"))
            .refine(files => {
                for (let i = 0; i < files.length; i++) {
                    if (files[i]?.size > 5 * 1024 * 1024) {
                        return false;
                    }
                }
                return true;
            }, t("ingredients.add.imageSize"))
            .refine(files => {
                for (let i = 0; i < files.length; i++) {
                    if (!files[i]?.type.startsWith('image/')) {
                        return false;
                    }
                }
                return true;
            }, t("ingredients.add.imageType")),
        details: z.array(z.object({
            key: z.string().min(1, t("ingredients.add.keyRequired")),
            value: z.string().min(1, t("ingredients.add.valueRequired")),
        })),
    });

    type FormData = z.infer<typeof schema>;
    // استعلامات API
    const { data: unitsData, isLoading: isLoadingUnits } = useFilterUnitsQuery({ page: 1, size: 50 });
    const { data: brandsData, isLoading: isLoadingBrands } = useFilterBrandsQuery({
        page: 1,
        size: 50,
        key: undefined
    });

    const units = unitsData?.data?.values || [];
    const brands = brandsData?.data?.values || [];

    const [addIngredient, { isLoading }] = useIngredientsPostMutation();

    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            details: [],
            images: null as any,
            brandId: ""
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "details" });

    // Handle multiple image selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages: ImagePreview[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file && file.type.startsWith('image/')) {
                    const imageUrl = URL.createObjectURL(file);
                    newImages.push({
                        id: Date.now() + i + Math.random().toString(36),
                        url: imageUrl,
                        file: file
                    });
                }
            }

            // Add new images to existing ones
            setSelectedImages(prev => [...prev, ...newImages]);

            // Update form value with all files
            const allFiles = [...selectedImages.map(img => img.file), ...newImages.map(img => img.file)];
            const newFileList = createFileList(allFiles);

            setValue("images", newFileList);
        }
    };

    // Helper function to create a FileList from File array
    const createFileList = (files: File[]): FileList => {
        const dataTransfer = new DataTransfer();
        files.forEach(file => {
            dataTransfer.items.add(file);
        });
        return dataTransfer.files;
    };

    // Handle image removal
    const handleRemoveImage = (id: string) => {
        setSelectedImages(prev => {
            const imageIndex = prev.findIndex(img => img.id === id);
            const newImages = prev.filter(img => img.id !== id);

            // Update form value
            const newFileList = createFileList(newImages.map(img => img.file));
            setValue("images", newFileList);

            // Adjust current index if needed
            if (imageIndex === currentImageIndex && newImages.length > 0) {
                const newIndex = Math.min(currentImageIndex, newImages.length - 1);
                setCurrentImageIndex(newIndex);
            } else if (newImages.length === 0) {
                setCurrentImageIndex(0);
            }

            return newImages;
        });
    };

    // Handle remove all images
    const handleRemoveAllImages = () => {
        // Clean up URLs
        selectedImages.forEach(img => URL.revokeObjectURL(img.url));

        setSelectedImages([]);
        setValue("images", new DataTransfer().files as FileList);
        setCurrentImageIndex(0);

        // Reset file input
        const fileInput = document.getElementById("images") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("unitId", data.unitId);
            formData.append("brandId", data.brandId); // إضافة الـ brandId

            // Append all images
            for (let i = 0; i < data.images.length; i++) {
                formData.append("images", data.images[i]);
            }

            data.details.forEach((d, i) => {
                formData.append(`details[${i}][key]`, d.key);
                formData.append(`details[${i}][value]`, d.value);
            });

            const res = await addIngredient(formData);
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error);
                resetForm();
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            toast.error(error.error);
        }
    };

    const resetForm = () => {
        // Clean up URLs
        selectedImages.forEach(img => URL.revokeObjectURL(img.url));

        reset({
            details: [],
            images: null as any,
            brandId: ""
        });
        setSelectedImages([]);
        setCurrentImageIndex(0);
    };

    const handleClose = () => {
        resetForm();
        onOpenChange(false);
    };

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             {/* Header */}
        //             <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Package className="h-6 w-6 text-blue-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold">
        //                             Add New Ingredient
        //                         </DialogTitle>
        //                         <p className="text-gray-600 mt-1 text-sm">
        //                             Create a new ingredient with details and images
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
        //                         <Label className="text-sm font-semibold">
        //                             Ingredient Name
        //                         </Label>
        //                     </div>
        //                     <Input
        //                         id="name"
        //                         {...register("name")}
        //                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
        //                         placeholder="Enter ingredient name..."
        //                     />
        //                     {errors.name && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.name.message}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Brand Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-indigo-50 rounded-lg">
        //                             <Building2 className="h-4 w-4 text-indigo-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold">
        //                             Brand
        //                         </Label>
        //                     </div>
        //                     <Controller
        //                         name="brandId"
        //                         control={control}
        //                         render={({ field }) => (
        //                             <Select onValueChange={field.onChange} value={field.value}>
        //                                 <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg">
        //                                     <SelectValue placeholder={isLoadingBrands ? "Loading brands..." : "Select brand"} />
        //                                 </SelectTrigger>
        //                                 <SelectContent className="rounded-lg">
        //                                     <SelectGroup>
        //                                         {isLoadingBrands ? (
        //                                             <SelectItem value="loading" disabled>
        //                                                 <div className="flex items-center gap-2">
        //                                                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        //                                                     Loading brands...
        //                                                 </div>
        //                                             </SelectItem>
        //                                         ) : brands.length > 0 ? (
        //                                             brands.map((brand: any) => (
        //                                                 <SelectItem
        //                                                     key={brand.id}
        //                                                     value={brand.id}
        //                                                     className="focus:bg-indigo-50 focus:text-indigo-600 rounded-md"
        //                                                 >
        //                                                     <div className="flex items-center gap-2">
        //                                                         <Building2 className="h-3 w-3" />
        //                                                         <span>{brand.name}</span>
        //                                                     </div>
        //                                                 </SelectItem>
        //                                             ))
        //                                         ) : (
        //                                             <SelectItem value="no-data" disabled>
        //                                                 No brands available
        //                                             </SelectItem>
        //                                         )}
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

        //                 {/* Unit Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-purple-50 rounded-lg">
        //                             <Scale className="h-4 w-4 text-purple-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold">
        //                             Measurement Unit
        //                         </Label>
        //                     </div>
        //                     <Controller
        //                         name="unitId"
        //                         control={control}
        //                         render={({ field }) => (
        //                             <Select onValueChange={field.onChange} value={field.value}>
        //                                 <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg">
        //                                     <SelectValue placeholder={isLoadingUnits ? "Loading units..." : "Select unit"} />
        //                                 </SelectTrigger>
        //                                 <SelectContent className="rounded-lg">
        //                                     <SelectGroup>
        //                                         {units.map((u: any) => (
        //                                             <SelectItem
        //                                                 key={u.id}
        //                                                 value={u.id}
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

        //                 {/* Images Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center justify-between">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-orange-50 rounded-lg">
        //                                 <ImageIcon className="h-4 w-4 text-orange-600" />
        //                             </div>
        //                             <Label className="text-sm font-semibold">
        //                                 Ingredient Images
        //                             </Label>
        //                         </div>

        //                         {selectedImages.length > 0 && (
        //                             <button
        //                                 type="button"
        //                                 onClick={handleRemoveAllImages}
        //                                 className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
        //                             >
        //                                 Remove All
        //                             </button>
        //                         )}
        //                     </div>

        //                     {/* Selected images counter */}
        //                     {selectedImages.length > 0 && (
        //                         <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
        //                             <span className="font-medium">{selectedImages.length}</span> image{selectedImages.length !== 1 ? 's' : ''} selected
        //                         </div>
        //                     )}

        //                     {/* Upload Area */}
        //                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
        //                         <Input
        //                             type="file"
        //                             id="images"
        //                             accept="image/*"
        //                             multiple
        //                             onChange={handleImageChange}
        //                         />
        //                         <label htmlFor="images" className="cursor-pointer block">
        //                             <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
        //                             <p className="text-sm font-medium mb-1">
        //                                 Click to upload images
        //                             </p>
        //                             <p className="text-xs text-gray-500">
        //                                 Supports: PNG, JPG, JPEG • Max: 5MB each • Max: 10 images
        //                             </p>
        //                         </label>
        //                     </div>

        //                     {/* Images Preview */}
        //                     {selectedImages.length > 0 && (
        //                         <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
        //                             <div className="flex items-center justify-between mb-3">
        //                                 <span className="text-sm font-semibold">
        //                                     Images Preview
        //                                 </span>
        //                                 <span className="text-xs text-gray-500">
        //                                     {currentImageIndex + 1} of {selectedImages.length}
        //                                 </span>
        //                             </div>

        //                             {/* Custom Carousel */}
        //                             <div className="relative overflow-hidden rounded-lg">
        //                                 <div
        //                                     className="flex transition-transform duration-300 ease-in-out"
        //                                     style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        //                                 >
        //                                     {selectedImages.map((image, index) => (
        //                                         <div key={image.id} className="w-full flex-shrink-0">
        //                                             <Card className="border-0 shadow-none">
        //                                                 <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
        //                                                     <img
        //                                                         src={image.url}
        //                                                         alt={`Preview ${index + 1}`}
        //                                                         className="w-full h-full object-cover"
        //                                                     />
        //                                                     {/* Delete Button */}
        //                                                     <button
        //                                                         type="button"
        //                                                         onClick={() => handleRemoveImage(image.id)}
        //                                                         className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
        //                                                         title="Remove image"
        //                                                     >
        //                                                         <X className="h-4 w-4" />
        //                                                     </button>
        //                                                     {/* Image Info */}
        //                                                     <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
        //                                                         {index + 1} / {selectedImages.length}
        //                                                     </div>
        //                                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        //                                                         <div className="text-white text-xs truncate">
        //                                                             {image.file.name}
        //                                                         </div>
        //                                                         <div className="text-white/80 text-[10px]">
        //                                                             {(image.file.size / 1024 / 1024).toFixed(2)} MB
        //                                                         </div>
        //                                                     </div>
        //                                                 </CardContent>
        //                                             </Card>
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

        //                     {errors.images && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.images.message}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Details Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-green-50 rounded-lg">
        //                             <Tag className="h-4 w-4 text-green-600" />
        //                         </div>
        //                         <Label className="text-sm font-semibold">
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
        //                                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
        //                                     />
        //                                     {errors.details?.[index]?.key && (
        //                                         <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
        //                                     )}
        //                                 </div>
        //                                 <div className="flex-1 space-y-2">
        //                                     <Input
        //                                         placeholder="Value (e.g., 100kcal, 20g)"
        //                                         {...register(`details.${index}.value` as const)}
        //                                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
        //                                     />
        //                                     {errors.details?.[index]?.value && (
        //                                         <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
        //                                     )}
        //                                 </div>
        //                                 <button
        //                                     type="button"
        //                                     onClick={() => remove(index)}
        //                                     className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1"
        //                                 >
        //                                     <X className="h-4 w-4" />
        //                                 </button>
        //                             </div>
        //                         ))}
        //                     </div>

        //                     <Button
        //                         type="button"
        //                         onClick={() => append({ key: "", value: "" })}
        //                         variant="outline"
        //                         className="w-full border-dashed border-gray-300 text-gray-600 transition-all duration-200 rounded-lg py-2.5"
        //                     >
        //                         <Plus className="h-4 w-4 mr-2" />
        //                         Add Detail Field
        //                     </Button>
        //                 </div>
        //             </div>

        //             {/* Footer */}
        //             <DialogFooter className="p-6 pt-4 border-t border-gray-100">
        //                 <Button
        //                     type="button"
        //                     variant="outline"
        //                     onClick={handleClose}
        //                     disabled={isLoading}
        //                     className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                 >
        //                     <X className="h-4 w-4" />
        //                     Cancel
        //                 </Button>
        //                 <Button
        //                     type="submit"
        //                     disabled={isLoading}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //                 >
        //                     {isLoading ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Adding...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Plus className="h-4 w-4" />
        //                             Add Ingredient
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
                                <Package className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("ingredients.add.title")}
                                </DialogTitle>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t("ingredients.add.subtitle")}
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
                                <Label className="text-sm font-semibold">
                                    {t("ingredients.add.nameLabel")}
                                </Label>
                            </div>
                            <Input
                                id="name"
                                {...register("name")}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                                placeholder={t("ingredients.add.namePlaceholder")}
                            />
                            {errors.name && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        {/* Brand Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-50 rounded-lg">
                                    <Building2 className="h-4 w-4 text-indigo-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("ingredients.add.brandLabel")}
                                </Label>
                            </div>
                            <Controller
                                name="brandId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg">
                                            <SelectValue placeholder={isLoadingBrands ?
                                                t("ingredients.add.loadingBrands") :
                                                t("ingredients.add.chooseBrand")}
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectGroup>
                                                {isLoadingBrands ? (
                                                    <SelectItem value="loading" disabled>
                                                        <div className="flex items-center gap-2">
                                                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                                            {t("ingredients.add.loadingBrands")}
                                                        </div>
                                                    </SelectItem>
                                                ) : brands.length > 0 ? (
                                                    brands.map((brand: any) => (
                                                        <SelectItem
                                                            key={brand.id}
                                                            value={brand.id}
                                                            className="focus:bg-indigo-50 focus:text-indigo-600 rounded-md"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Building2 className="h-3 w-3" />
                                                                <span>{brand.name}</span>
                                                            </div>
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-data" disabled>
                                                        {t("ingredients.add.noBrands")}
                                                    </SelectItem>
                                                )}
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

                        {/* Unit Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Scale className="h-4 w-4 text-purple-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("ingredients.add.unitLabel")}
                                </Label>
                            </div>
                            <Controller
                                name="unitId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg">
                                            <SelectValue placeholder={isLoadingUnits ?
                                                t("ingredients.add.loadingUnits") :
                                                t("ingredients.add.chooseUnit")}
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectGroup>
                                                {units.map((u: any) => (
                                                    <SelectItem
                                                        key={u.id}
                                                        value={u.id}
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

                        {/* Images Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <Label className="text-sm font-semibold">
                                        {t("ingredients.add.imagesLabel")}
                                    </Label>
                                </div>

                                {selectedImages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAllImages}
                                        className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                    >
                                        {t("ingredients.add.removeAll")}
                                    </button>
                                )}
                            </div>

                            {/* Selected images counter */}
                            {selectedImages.length > 0 && (
                                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <span className="font-medium">{selectedImages.length}</span>{" "}
                                    {t(`ingredients.add.selectedImages${selectedImages.length === 1 ? '' : '_plural'}`, {
                                        count: selectedImages.length
                                    })}
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
                                <Input
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="images" className="cursor-pointer block">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("ingredients.add.clickToUpload")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("ingredients.add.uploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {/* Images Preview */}
                            {selectedImages.length > 0 && (
                                <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold">
                                            {t("ingredients.add.imagesPreview")}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {currentImageIndex + 1} {t("ingredients.table.of")} {selectedImages.length}
                                        </span>
                                    </div>

                                    {/* Custom Carousel */}
                                    <div className="relative overflow-hidden rounded-lg">
                                        <div
                                            className="flex transition-transform duration-300 ease-in-out"
                                            style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                        >
                                            {selectedImages.map((image, index) => (
                                                <div key={image.id} className="w-full flex-shrink-0">
                                                    <Card className="border-0 shadow-none">
                                                        <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
                                                            <img
                                                                src={image.url}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {/* Delete Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(image.id)}
                                                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                                                                title={t("ingredients.add.removeImage")}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            {/* Image Info */}
                                                            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                                                {index + 1} / {selectedImages.length}
                                                            </div>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                                <div className="text-white text-xs truncate">
                                                                    {image.file.name}
                                                                </div>
                                                                <div className="text-white/80 text-[10px]">
                                                                    {(image.file.size / 1024 / 1024).toFixed(2)} MB
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
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

                            {errors.images && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.images.message}
                                </div>
                            )}
                        </div>

                        {/* Details Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <Tag className="h-4 w-4 text-green-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("ingredients.add.detailsLabel")}
                                </Label>
                            </div>

                            <div className="space-y-3">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-start">
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder={t("ingredients.add.keyPlaceholder")}
                                                {...register(`details.${index}.key` as const)}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                                            />
                                            {errors.details?.[index]?.key && (
                                                <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
                                            )}
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <Input
                                                placeholder={t("ingredients.add.valuePlaceholder")}
                                                {...register(`details.${index}.value` as const)}
                                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                                            />
                                            {errors.details?.[index]?.value && (
                                                <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1"
                                            title={t("ingredients.add.removeDetail")}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={() => append({ key: "", value: "" })}
                                variant="outline"
                                className="w-full border-dashed border-gray-300 text-gray-600 transition-all duration-200 rounded-lg py-2.5"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t("ingredients.add.addDetail")}
                            </Button>
                        </div>
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t("ingredients.add.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("ingredients.add.adding")}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    {t("ingredients.add.add")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}