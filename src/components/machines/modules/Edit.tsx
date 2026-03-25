"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { X, Plus, Upload, Image as ImageIcon, Tag, Edit, ChevronLeft, ChevronRight, Loader, FileText } from "lucide-react";
import { useGetMachinesByIdQuery } from "@/api/feature/machines/getSlice";
import { useMachinesPutMutation } from "@/api/feature/machines/putSlice";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";


interface ImagePreview {
    id: string
    url: string
    file?: File
    isExisting?: boolean
    path?: string
    name?: string
}
import { useParams, useNavigate } from "react-router-dom";

export default function EditMachine() {
    const { id: machineId } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { t } = useTranslation();
    const schema = z.object({
        name: z.string().min(1, t('validation.nameRequired')),
        // description: z.string().min(1, t('validation.descriptionRequired')),
        description: z.string(),
        details: z.array(
            z.object({
                id: z.string().optional(),
                key: z.string().min(1, t('validation.keyRequired')),
                value: z.string().min(1, t('validation.valueRequired')),
            })
        ),
    });

    type FormData = z.infer<typeof schema>;

    // const { data, isLoading } = useGetMachinesByIdQuery(machineId, { skip: !machineId });
    const { data, isLoading } = useGetMachinesByIdQuery(machineId!, {
        skip: !machineId,
    });
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [removedDetails, setRemovedDetails] = useState<string[]>([]);
    const [updateMachine, { isLoading: isUpdating }] = useMachinesPutMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    // @ts-ignore
    const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { name: "", details: [] },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "details" });

    // Fill form with API data
    useEffect(() => {
        if (data?.data) {
            const machine = data.data;
            reset({
                name: machine.name,
                description: machine.description || "",
                details: machine.details?.map((d: any) => ({ id: d.id, key: d.key, value: d.value })) || [],
            });

            // Reset states
            setRemovedDetails([]);
            setImagesToRemove([]);
            setCurrentImageIndex(0);

            // Set existing images
            if (machine.images && Array.isArray(machine.images) && machine.images.length > 0) {
                const existingImages: ImagePreview[] = machine.images.map((imgPath: string, index: number) => ({
                    id: `existing-${index}`,
                    url: `${import.meta.env.VITE_BASE_URL}/${imgPath}`,
                    path: imgPath,
                    name: `Image ${index + 1}`,
                    isExisting: true
                }));
                setSelectedImages(existingImages);
            } else if (machine.imagePath) {
                // Fallback for old data format
                const existingImage: ImagePreview = {
                    id: 'existing-0',
                    url: `${import.meta.env.VITE_BASE_URL}/${machine.imagePath}`,
                    path: machine.imagePath,
                    name: 'Machine Image',
                    isExisting: true
                };
                setSelectedImages([existingImage]);
            } else {
                setSelectedImages([]);
            }
        }
    }, [data, reset]);

    // Handle new image selection
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages: ImagePreview[] = [];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file && file.type.startsWith('image/')) {
                    const imageUrl = URL.createObjectURL(file);
                    newImages.push({
                        id: `new-${Date.now()}-${i}`,
                        url: imageUrl,
                        file: file,
                        name: file.name,
                        isExisting: false
                    });
                }
            }

            setSelectedImages(prev => [...prev, ...newImages]);
        }
    };

    const handleRemoveImage = (id: string) => {
        setSelectedImages(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            const newImages = prev.filter(img => img.id !== id);

            // If it's an existing image with a valid path, add to removal list
            if (imageToRemove?.isExisting && imageToRemove.path) {
                const path = imageToRemove.path as string;
                setImagesToRemove(prev => [...prev, path]);
            } else if (imageToRemove && !imageToRemove.isExisting) {
                // Clean up URL for new images
                URL.revokeObjectURL(imageToRemove.url);
            }

            // Adjust current index if needed
            if (newImages.length > 0) {
                const newIndex = Math.min(currentImageIndex, newImages.length - 1);
                setCurrentImageIndex(newIndex);
            } else {
                setCurrentImageIndex(0);
            }

            return newImages;
        });
    };

    // Handle remove all new images
    const handleRemoveAllNewImages = () => {
        // Only remove new images, keep existing ones
        const existingImages = selectedImages.filter(img => img.isExisting);
        const newImages = selectedImages.filter(img => !img.isExisting);

        // Clean up URLs for new images
        newImages.forEach(img => {
            if (!img.isExisting) {
                URL.revokeObjectURL(img.url);
            }
        });

        setSelectedImages(existingImages);

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDeleteDetail = (index: number) => {
        const detail = fields[index];
        if (detail.id) setRemovedDetails(prev => [...prev, detail.id]);
        remove(index);
    };
    const handleClose = () => {
        navigate(-1);
    };
    const onSubmit = async (formData: FormData) => {
        if (!machineId) {
            toast.error("Machine ID is missing");
            return;
        }

        try {
            const payload = new FormData();
            // payload.append("machineId", machineId);
            payload.append("machineId", machineId as string);

            payload.append("name", formData.name);
            payload.append("description", formData.description || '');
            // Handle images
            // Add images to remove
            imagesToRemove.forEach(path => {
                payload.append('imagesToRemove', path);
            });

            // Add new images
            const newImages = selectedImages.filter(img => !img.isExisting);
            newImages.forEach(img => {
                if (img.file) {
                    payload.append('imagesToAdd', img.file);
                }
            });

            // Handle details
            const originalDetails = data?.data?.details || [];
            const currentDetails = formData.details;

            // detailsToAdd
            currentDetails.filter(d => !d.id).forEach((d, i) => {
                payload.append(`detailsToAdd[${i}][key]`, d.key);
                payload.append(`detailsToAdd[${i}][value]`, d.value);
            });

            // detailsToRemove = removed + missing
            const detailsToRemove = [
                ...removedDetails,
                ...originalDetails.filter((od: any) => !currentDetails.some(cd => cd.id === od.id)).map((d: any) => d.id)
            ];
            detailsToRemove.forEach((id, i) => payload.append(`detailsToRemove[${i}]`, id));

            const res = await updateMachine(payload);
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
    useEffect(() => {
        if (!machineId) {
            navigate("/machines");
        }
    }, [machineId, navigate]);


    if (isLoading) return <Loader className="mx-auto mt-20" />;
    const isRTL = i18n.language === "ar";

    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3">

            <form onSubmit={handleSubmit(onSubmit)} className="p-2 border rounded-2xl">
                {/* Header */}
                <div className="mb-6 border-b pb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl shadow-sm">
                            <Edit className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold">
                                {t('machines.edit.title')}
                            </div>
                            <p className="text-gray-600 mt-1 text-sm">
                                {t('machines.edit.subtitle')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="pr-2 space-y-6 p-6">
                    {/* Name Field */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Tag className="h-4 w-4 text-amber-600" />
                            </div>
                            <Label className="text-sm font-semibold">
                                {t('machines.edit.machineName')}
                            </Label>
                        </div>
                        <Input
                            id="name"
                            {...register("name")}
                            disabled={isLoading}
                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                            placeholder={t('machines.edit.machineNamePlaceholder')}
                        />
                        {errors.name && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {errors.name.message}
                            </div>
                        )}
                    </div>
                    {/* Description Field */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <FileText className="h-4 w-4 text-purple-600" /> {/* تأكد من استيراد FileText */}
                            </div>
                            <Label className="text-sm font-semibold">
                                {t('machines.edit.machineDescription')}
                            </Label>
                        </div>
                        <textarea
                            id="description"
                            {...register("description")}
                            disabled={isLoading}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 min-h-[120px] resize-y disabled:bg-gray-100"
                            placeholder={t('machines.edit.machineDescriptionPlaceholder')}
                        />
                        {errors.description && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {errors.description.message}
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
                                <Label htmlFor="machine-images" className="text-sm font-semibold">
                                    {t('machines.edit.machineImages')}
                                </Label>
                            </div>

                            {selectedImages.some(img => !img.isExisting) && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAllNewImages}
                                    className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                >
                                    {t('machines.edit.removeNewImages')}
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
                                        {selectedImages.filter(img => img.isExisting).length} existing
                                        {selectedImages.some(img => !img.isExisting) && (
                                            <span className="ml-2">
                                                • {selectedImages.filter(img => !img.isExisting).length} new
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/30">
                            <Input
                                type="file"
                                id="machine-images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                disabled={isLoading}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <label htmlFor="machine-images" className="cursor-pointer block">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                <p className="text-sm font-medium mb-1">
                                    {t('machines.edit.clickToAddImages')}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {t('machines.edit.uploadSupport')}
                                </p>
                            </label>
                        </div>

                        {/* Images Preview */}
                        {selectedImages.length > 0 && (
                            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold">
                                        {selectedImages.some(img => !img.isExisting)
                                            ? t('machines.edit.newImagesPreview')
                                            : t('machines.edit.currentMachineImages')}
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
                                        className="flex transition-transform duration-300 ease-in-out h-full"
                                        dir="ltr"
                                        style={{
                                            transform: `translateX(-${currentImageIndex * 100}%)`
                                        }}
                                    >
                                        {selectedImages.map((image, index) => (
                                            <div key={image.id} className="w-full flex-shrink-0">
                                                <div className="relative">
                                                    <img
                                                        src={image.url}
                                                        alt={image.name || `Image ${index + 1}`}
                                                        className="w-full h-48 object-cover transition-transform duration-200 hover:scale-105"
                                                    />
                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(image.id)}
                                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                                                        title={t('machines.edit.removeImage')}
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
                                                onClick={() =>
                                                    setCurrentImageIndex(prev => {
                                                        if (isRTL) {
                                                            return prev < selectedImages.length - 1 ? prev + 1 : 0;
                                                        }
                                                        return prev > 0 ? prev - 1 : selectedImages.length - 1;
                                                    })
                                                }
                                                className={`absolute top-1/2 -translate-y-1/2
    ${isRTL ? 'right-3' : 'left-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2
    transition-all duration-200 z-10`}
                                                aria-label="Previous image"
                                            >
                                                {isRTL ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setCurrentImageIndex(prev => {
                                                        if (isRTL) {
                                                            return prev > 0 ? prev - 1 : selectedImages.length - 1;
                                                        }
                                                        return prev < selectedImages.length - 1 ? prev + 1 : 0;
                                                    })
                                                }
                                                className={`absolute top-1/2 -translate-y-1/2
    ${isRTL ? 'left-3' : 'right-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2
    transition-all duration-200 z-10`}
                                                aria-label="Next image"
                                            >
                                                {isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
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
                                                    ? 'bg-amber-500 scale-125'
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
                            <Label className="text-sm font-semibold">
                                {t('machines.edit.machineSpecifications')}
                            </Label>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start">
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder={t('machines.edit.specKeyPlaceholder')}
                                            {...register(`details.${index}.key` as const)}
                                            disabled={isLoading}
                                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                        />
                                        {errors.details?.[index]?.key && (
                                            <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <Input
                                            placeholder={t('machines.edit.specValuePlaceholder')}
                                            {...register(`details.${index}.value` as const)}
                                            disabled={isLoading}
                                            className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
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
                            className="w-full border-dashed border-gray-300 text-gray-600  transition-all duration-200 rounded-lg py-2.5 disabled:opacity-50"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('machines.edit.addSpecification')}
                        </Button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        {t('machines.edit.cancel')}
                    </Button>

                    <Button type="submit" disabled={isUpdating}>
                        {t('machines.edit.updateMachine')}
                    </Button>
                </div>

            </form>

        </div>
    );
}
