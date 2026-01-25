"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from 'react-toastify'
import { useEffect, useState, useRef } from "react"
import { X, Upload, Image as ImageIcon, Save, Loader, ChevronLeft, ChevronRight, Tag } from "lucide-react"
import { handleApiResponse } from "@/hooks/apiErrorHandler"
import { Card, CardContent } from "@/components/ui/card"
import { useBrandsPutMutation } from "@/api/feature/brands/putSlices";
import { useGetBrandsByIdQuery } from "@/api/feature/brands/getSlices";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";

interface PopupEditProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    brandId?: string
}

interface ImagePreview {
    id: string
    url: string
    file?: File
    isExisting?: boolean
    path?: string
    name?: string
}

export default function Edit({ isOpen, onOpenChange, brandId }: PopupEditProps) {
    const { t } = useTranslation();
    const [editBrand, { isLoading }] = useBrandsPutMutation()
    const { data: brandData, isLoading: isLoadingBrand } = useGetBrandsByIdQuery(brandId!, {
        skip: !brandId,
    })

    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // const schema = z.object({
    //     name: z.string().min(1, { message: "Brand name is required" }).max(100, { message: "Name is too long" }),
    // })
    const schema = z.object({
        name: z.string().min(1, { message: t("brands.edit.nameRequired") }).max(100, { message: t("brands.edit.nameTooLong") }),
    })
    type FormDataPost = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormDataPost>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
        }
    })

    // Load brand data when component opens
    useEffect(() => {
        if (isOpen && brandData?.data) {
            const brand = brandData.data

            setValue('name', brand.name)

            // Set existing images
            if (brand.images && Array.isArray(brand.images) && brand.images.length > 0) {
                const existingImages: ImagePreview[] = brand.images.map((imgPath: string, index: number) => ({
                    id: `existing-${index}`,
                    url: `${import.meta.env.VITE_BASE_URL}/${imgPath}`,
                    path: imgPath,
                    name: `Image ${index + 1}`,
                    isExisting: true
                }))
                setSelectedImages(existingImages)
            } else if (brand.imagePath) {
                // Fallback for old data format
                const existingImage: ImagePreview = {
                    id: 'existing-0',
                    url: `${import.meta.env.VITE_BASE_URL}/${brand.imagePath}`,
                    path: brand.imagePath,
                    name: 'Brand Image',
                    isExisting: true
                }
                setSelectedImages([existingImage])
            }

            // Reset images to remove
            setImagesToRemove([])
            setCurrentImageIndex(0)
        }
    }, [isOpen, brandData, setValue])

    // Handle new image selection
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
            } else if (imageToRemove && !imageToRemove.isExisting) {
                // Clean up URL for new images
                URL.revokeObjectURL(imageToRemove.url)
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
    const isRTL = i18n.language === "ar";

    // Handle remove all new images
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

    const onSubmit = async (data: FormDataPost) => {
        try {
            if (!brandId) {
                toast.error("Brand ID is missing")
                return
            }

            const formData = new FormData()
            formData.append('brandId', brandId)
            formData.append('name', data.name)

            // Add images to remove
            imagesToRemove.forEach(path => {
                formData.append('imagesToRemove', path)
            })

            // Add new images
            const newImages = selectedImages.filter(img => !img.isExisting)
            newImages.forEach(img => {
                if (img.file) {
                    formData.append('imagesToAdd', img.file)
                }
            })

            const res = await editBrand(formData)
            const result = handleApiResponse(res)
            if (result.success) {
                toast.success(result.error || "Brand updated successfully!")
                handleClose()
            } else {
                toast.error(result.error)
            }

        } catch (err: any) {
            toast.error(err.error || "An error occurred")
        }
    }

    const handleClose = () => {
        // Clean up URLs
        selectedImages.forEach(img => {
            if (!img.isExisting) {
                URL.revokeObjectURL(img.url)
            }
        })

        reset()
        setSelectedImages([])
        setImagesToRemove([])
        setCurrentImageIndex(0)

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        onOpenChange(false)
    }

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             {/* Header */}
        //             <DialogHeader className="p-6 pb-4 border-b border-gray-100">
        //                 <div className="flex items-center gap-3">
        //                     <div className="p-2 bg-white rounded-xl shadow-sm">
        //                         <Tag className="h-6 w-6 text-blue-600" />
        //                     </div>
        //                     <div>
        //                         <DialogTitle className="text-2xl font-bold">
        //                             Edit Brand
        //                         </DialogTitle>
        //                         <DialogDescription className="mt-1">
        //                             Make changes to your brand here. Click save when you're done.
        //                         </DialogDescription>
        //                     </div>
        //                 </div>
        //             </DialogHeader>

        //             {/* Content */}
        //             <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
        //                 {/* Name Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center gap-2">
        //                         <div className="p-2 bg-blue-50 rounded-lg">
        //                             <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        //                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
        //                             </svg>
        //                         </div>
        //                         <Label htmlFor="name" className="text-sm font-semibold">
        //                             Brand Name
        //                         </Label>
        //                     </div>
        //                     <Input
        //                         id="name"
        //                         type="text"
        //                         {...register("name")}
        //                         disabled={isLoadingBrand}
        //                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
        //                         placeholder="Enter brand name..."
        //                     />
        //                     {errors.name && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.name.message}
        //                         </div>
        //                     )}
        //                 </div>

        //                 {/* Image Upload Field */}
        //                 <div className="space-y-3">
        //                     <div className="flex items-center justify-between">
        //                         <div className="flex items-center gap-2">
        //                             <div className="p-2 bg-orange-50 rounded-lg">
        //                                 <ImageIcon className="h-4 w-4 text-orange-600" />
        //                             </div>
        //                             <Label htmlFor="images" className="text-sm font-semibold">
        //                                 Brand Images/Logo
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
        //                             disabled={isLoadingBrand}
        //                             ref={fileInputRef}
        //                             className="hidden"
        //                         />
        //                         <label htmlFor="images" className="cursor-pointer block">
        //                             <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
        //                             <p className="text-sm font-medium mb-1">
        //                                 Click to add new images
        //                             </p>
        //                             <p className="text-xs text-gray-500">
        //                                 Supports: PNG, JPG, JPEG, WEBP • Max: 5MB each
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
        //                                     {imagesToRemove.length > 0 && (
        //                                         <span className="text-red-600">
        //                                             {imagesToRemove.length} marked for removal
        //                                         </span>
        //                                     )}
        //                                 </span>
        //                             </div>

        //                             {/* Custom Carousel Implementation */}
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
        //                                                         alt={image.name || `Image ${index + 1}`}
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
        //                                                     <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
        //                                                         <span>{index + 1} / {selectedImages.length}</span>
        //                                                     </div>

        //                                                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        //                                                         <div className="text-white text-xs truncate">
        //                                                             {image.name || `Image ${index + 1}`}
        //                                                         </div>
        //                                                         {image.file && (
        //                                                             <div className="text-white/80 text-[10px]">
        //                                                                 {(image.file.size / 1024 / 1024).toFixed(2)} MB
        //                                                             </div>
        //                                                         )}
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
        //                 </div>
        //             </div>

        //             {/* Footer */}
        //             <DialogFooter className="p-6 pt-4 border-t border-gray-100">
        //                 <Button
        //                     type="button"
        //                     variant="outline"
        //                     onClick={handleClose}
        //                     className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
        //                 >
        //                     <X className="h-4 w-4" />
        //                     Cancel
        //                 </Button>

        //                 <Button
        //                     type="submit"
        //                     disabled={isLoading || isLoadingBrand}
        //                     className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
        //                 >
        //                     {isLoading ? (
        //                         <>
        //                             <Loader className="h-4 w-4 animate-spin" />
        //                             Saving Changes...
        //                         </>
        //                     ) : (
        //                         <>
        //                             <Save className="h-4 w-4" />
        //                             Save Changes
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
                                <Tag className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-2xl font-bold">
                                    {t("brands.edit.title")}
                                </DialogTitle>
                                <DialogDescription className="mt-1">
                                    {t("brands.edit.subtitle")}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Content */}
                    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
                        {/* Name Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <Label htmlFor="name" className="text-sm font-semibold">
                                    {t("brands.edit.nameLabel")}
                                </Label>
                            </div>
                            <Input
                                id="name"
                                type="text"
                                {...register("name")}
                                disabled={isLoadingBrand}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                placeholder={t("brands.edit.namePlaceholder")}
                            />
                            {errors.name && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.name.message}
                                </div>
                            )}
                        </div>

                        {/* Image Upload Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-orange-50 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-orange-600" />
                                    </div>
                                    <Label htmlFor="images" className="text-sm font-semibold">
                                        {t("brands.edit.imagesLabel")}
                                    </Label>
                                </div>

                                {selectedImages.some(img => !img.isExisting) && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAllNewImages}
                                        className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                    >
                                        {t("brands.edit.removeNewImages")}
                                    </button>
                                )}
                            </div>

                            {/* Images Summary */}
                            {selectedImages.length > 0 && (
                                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <span>
                                            <span className="font-medium">{selectedImages.length}</span>{" "}
                                            {t(`brands.edit.imagesSummary${selectedImages.length === 1 ? '' : '_plural'}`, {
                                                total: selectedImages.length
                                            })}
                                        </span>
                                        <div className="text-xs">
                                            <span className="text-blue-600">
                                                {t("brands.edit.existingCount", { count: selectedImages.filter(img => img.isExisting).length })}
                                            </span>
                                            {selectedImages.some(img => !img.isExisting) && (
                                                <span className="ml-2 text-green-600">
                                                    {t("brands.edit.newCount", { count: selectedImages.filter(img => !img.isExisting).length })}
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
                                    disabled={isLoadingBrand}
                                    ref={fileInputRef}
                                    className="hidden"
                                />
                                <label htmlFor="images" className="cursor-pointer block">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("brands.edit.clickToAdd")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("brands.edit.uploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {/* Images Preview */}
                            {selectedImages.length > 0 && (
                                <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold">
                                            {t("brands.edit.imagesPreview")}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {imagesToRemove.length > 0 && (
                                                <span className="text-red-600">
                                                    {t("brands.edit.markedForRemoval", { count: imagesToRemove.length })}
                                                </span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Custom Carousel Implementation */}
                                    <div className="relative overflow-hidden rounded-lg">
                                        <div
                                            // className="flex transition-transform duration-300 ease-in-out"
                                            // style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                                            className="flex transition-transform duration-300 ease-in-out h-full"
                                            dir="ltr"
                                            style={{
                                                transform: `translateX(-${currentImageIndex * 100}%)`
                                            }}
                                        >
                                            {selectedImages.map((image, index) => (
                                                <div key={image.id} className="w-full flex-shrink-0">
                                                    <Card className="border-0 shadow-none">
                                                        <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
                                                            <img
                                                                src={image.url}
                                                                alt={image.name || `Image ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                            {/* Delete Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveImage(image.id)}
                                                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                                                                title={t("brands.edit.removeImage")}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>

                                                            {/* Image Info */}
                                                            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                                                <span>{index + 1} / {selectedImages.length}</span>
                                                            </div>

                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                                <div className="text-white text-xs truncate">
                                                                    {image.name || `Image ${index + 1}`}
                                                                </div>
                                                                {image.file && (
                                                                    <div className="text-white/80 text-[10px]">
                                                                        {(image.file.size / 1024 / 1024).toFixed(2)} MB
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Navigation Arrows */}
                                        {selectedImages.length > 1 && (
                                            <>
                                                {/* <button
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
                                                </button> */}
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
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-6 pt-4 border-t border-gray-100">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t("brands.edit.cancel")}
                        </Button>

                        <Button
                            type="submit"
                            disabled={isLoading || isLoadingBrand}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("brands.edit.saving")}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {t("brands.edit.save")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}