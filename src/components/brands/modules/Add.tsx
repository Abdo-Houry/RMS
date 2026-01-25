"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from 'react-toastify'
import { useState, useRef } from "react"
import { X, Upload, Image as ImageIcon, Plus } from "lucide-react"
import { handleApiResponse } from "@/hooks/apiErrorHandler"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useBrandsPostMutation } from "@/api/feature/brands/postSlices";
import { useTranslation } from "react-i18next";

interface PopupAddProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
}

interface ImagePreview {
    id: string
    url: string
    file: File
}

export default function AddBrand({ isOpen, onOpenChange }: PopupAddProps) {
    const { t } = useTranslation()
    const [addBrand, { isLoading }] = useBrandsPostMutation()
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)
    const schema = z.object({
        name: z.string().min(1, { message: t("brands.add.nameRequired") }).max(100, { message: t("brands.add.nameTooLong") }),
        images: z.custom<FileList | null>()
            .refine((files) => files && files.length > 0, t("brands.add.imagesRequired"))
            .refine((files) => files && files.length <= 10, t("brands.add.maxImages"))
            .refine((files) => {
                if (!files) return false;
                for (let i = 0; i < files.length; i++) {
                    if (files[i]?.size > 5 * 1024 * 1024) {
                        return false
                    }
                }
                return true
            }, t("brands.add.imageSize"))
            .refine((files) => {
                if (!files) return false;
                for (let i = 0; i < files.length; i++) {
                    if (!files[i]?.type.startsWith('image/')) {
                        return false
                    }
                }
                return true
            }, t("brands.add.imageType")),
    })
    // const schema = z.object({
    //     name: z.string().min(1, { message: "Brand name is required" }).max(100, { message: "Name is too long" }),
    //     images: z.custom<FileList | null>()
    //         .refine((files) => files && files.length > 0, 'At least one image is required')
    //         .refine((files) => files && files.length <= 10, 'Maximum 10 images allowed')
    //         .refine((files) => {
    //             if (!files) return false;
    //             for (let i = 0; i < files.length; i++) {
    //                 if (files[i]?.size > 5 * 1024 * 1024) {
    //                     return false
    //                 }
    //             }
    //             return true
    //         }, 'Each image must be less than 5MB')
    //         .refine((files) => {
    //             if (!files) return false;
    //             for (let i = 0; i < files.length; i++) {
    //                 if (!files[i]?.type.startsWith('image/')) {
    //                     return false
    //                 }
    //             }
    //             return true
    //         }, 'Only image files are allowed'),
    // })

    type FormDataPost = z.infer<typeof schema>

    const { register, handleSubmit, formState: { errors }, reset, setValue, trigger } = useForm<FormDataPost>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            images: null
        }
    })

    // Helper function to create a FileList from File array
    const createFileList = (files: File[]): FileList => {
        const dataTransfer = new DataTransfer()
        files.forEach(file => {
            dataTransfer.items.add(file)
        })
        return dataTransfer.files
    }

    // Handle multiple image selection and preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            const newImages: ImagePreview[] = []

            for (let i = 0; i < files.length; i++) {
                const file = files[i]
                if (file && file.type.startsWith('image/')) {
                    const imageUrl = URL.createObjectURL(file)
                    newImages.push({
                        id: Date.now() + i + Math.random().toString(36),
                        url: imageUrl,
                        file: file
                    })
                }
            }

            // Add new images to existing ones
            setSelectedImages(prev => [...prev, ...newImages])

            // Update form value with all files
            const allFiles = [...selectedImages.map(img => img.file), ...newImages.map(img => img.file)]
            const newFileList = createFileList(allFiles)

            setValue("images", newFileList)
            trigger("images")
        }
    }

    // Handle image removal
    const handleRemoveImage = (id: string) => {
        setSelectedImages(prev => {
            const imageToRemove = prev.find(img => img.id === id)
            const newImages = prev.filter(img => img.id !== id)

            // Clean up URL
            if (imageToRemove) {
                URL.revokeObjectURL(imageToRemove.url)
            }

            // Update form value
            const newFileList = createFileList(newImages.map(img => img.file))
            setValue("images", newFileList)

            // Update file input
            if (fileInputRef.current) {
                const dt = new DataTransfer()
                newImages.forEach(img => dt.items.add(img.file))
                fileInputRef.current.files = dt.files
            }

            trigger("images")

            return newImages
        })
    }

    // Handle remove all images
    const handleRemoveAllImages = () => {
        // Clean up URLs
        selectedImages.forEach(img => URL.revokeObjectURL(img.url))

        setSelectedImages([])
        setValue("images", null)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }

        trigger("images")
    }

    const onSubmit = async (data: FormDataPost) => {
        try {
            const formData = new FormData();

            // Add name
            formData.append('name', data.name);

            // Add images
            if (data.images) {
                for (let i = 0; i < data.images.length; i++) {
                    formData.append('images', data.images[i]);
                }
            }

            // Send request
            const res = await addBrand(formData)
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error || "Brand added successfully!");
                resetForm();
                onOpenChange(false);
            } else {
                toast.error(result.error);
            }
        } catch (error: any) {
            toast.error(error.error || "An error occurred");
        }
    }

    const resetForm = () => {
        // Clean up URLs
        selectedImages.forEach(img => URL.revokeObjectURL(img.url))

        reset({
            name: "",
            images: null
        })
        setSelectedImages([])

        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleClose = () => {
        resetForm()
        onOpenChange(false)
    }

    return (
        // <Dialog open={isOpen} onOpenChange={onOpenChange}>
        //     <DialogContent className="sm:max-w-[500px] rounded-2xl">
        //         <form onSubmit={handleSubmit(onSubmit)}>
        //             <DialogHeader className="text-center pb-4 border-b">
        //                 <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        //                     Add New Brand
        //                 </DialogTitle>
        //                 <p className="text-sm text-gray-500 mt-1">
        //                     Create a new brand with logo/images
        //                 </p>
        //             </DialogHeader>

        //             <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
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
        //                         className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
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
        //                             id="images"
        //                             type="file"
        //                             accept="image/*"
        //                             multiple
        //                             {...register("images")}
        //                             onChange={handleImageChange}
        //                             ref={fileInputRef}
        //                         />
        //                         <label htmlFor="images" className="cursor-pointer block">
        //                             <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
        //                             <p className="text-sm font-medium mb-1">Click to upload images</p>
        //                             <p className="text-xs text-gray-500">Supports: PNG, JPG, JPEG, WEBP • Max: 5MB each • Max: 10 images</p>
        //                         </label>
        //                     </div>

        //                     {errors.images && (
        //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
        //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
        //                             {errors.images.message}
        //                         </div>
        //                     )}

        //                     {/* Images Preview as Carousel */}
        //                     {selectedImages.length > 0 && (
        //                         <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
        //                             <div className="flex items-center justify-between mb-3">
        //                                 <span className="text-sm font-semibold">Images Preview</span>
        //                                 <span className="text-xs text-gray-500">
        //                                     {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
        //                                 </span>
        //                             </div>

        //                             {/* Carousel Component */}
        //                             <Carousel className="w-full">
        //                                 <CarouselContent>
        //                                     {selectedImages.map((image, index) => (
        //                                         <CarouselItem key={image.id}>
        //                                             <div className="p-1">
        //                                                 <Card className="border-0 shadow-none">
        //                                                     <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
        //                                                         <img
        //                                                             src={image.url}
        //                                                             alt={`Preview ${index + 1}`}
        //                                                             className="w-full h-full object-cover"
        //                                                         />
        //                                                         {/* Delete Button */}
        //                                                         <button
        //                                                             type="button"
        //                                                             onClick={() => handleRemoveImage(image.id)}
        //                                                             className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
        //                                                             title="Remove image"
        //                                                         >
        //                                                             <X className="h-4 w-4" />
        //                                                         </button>
        //                                                         {/* Image Info */}
        //                                                         <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
        //                                                             {index + 1} / {selectedImages.length}
        //                                                         </div>
        //                                                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        //                                                             <div className="text-white text-xs truncate">
        //                                                                 {image.file.name}
        //                                                             </div>
        //                                                             <div className="text-white/80 text-[10px]">
        //                                                                 {(image.file.size / 1024 / 1024).toFixed(2)} MB
        //                                                             </div>
        //                                                         </div>
        //                                                     </CardContent>
        //                                                 </Card>
        //                                             </div>
        //                                         </CarouselItem>
        //                                     ))}
        //                                 </CarouselContent>

        //                                 {/* Show navigation only if there are multiple images */}
        //                                 {selectedImages.length > 1 && (
        //                                     <>
        //                                         <CarouselPrevious className="left-2 h-8 w-8" />
        //                                         <CarouselNext className="right-2 h-8 w-8" />
        //                                     </>
        //                                 )}
        //                             </Carousel>
        //                         </div>
        //                     )}
        //                 </div>
        //             </div>

        //             <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
        //                 <DialogClose asChild>
        //                     <Button
        //                         type="button"
        //                         variant="outline"
        //                         onClick={handleClose}
        //                         className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-lg py-2.5"
        //                     >
        //                         Cancel
        //                     </Button>
        //                 </DialogClose>
        //                 <Button
        //                     type="submit"
        //                     disabled={isLoading}
        //                     className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg py-2.5 font-semibold"
        //                 >
        //                     {isLoading ? (
        //                         <div className="flex items-center gap-2 justify-center">
        //                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
        //                             Adding...
        //                         </div>
        //                     ) : (
        //                         <div className="flex items-center gap-2 justify-center">
        //                             <Plus className="h-4 w-4" />
        //                             Add Brand
        //                         </div>
        //                     )}
        //                 </Button>
        //             </DialogFooter>
        //         </form>
        //     </DialogContent>
        // </Dialog>
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader className="text-center pb-4 border-b">
                        <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            {t("brands.add.title")}
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            {t("brands.add.subtitle")}
                        </p>
                    </DialogHeader>

                    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
                        {/* Name Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                </div>
                                <Label htmlFor="name" className="text-sm font-semibold">
                                    {t("brands.add.nameLabel")}
                                </Label>
                            </div>
                            <Input
                                id="name"
                                type="text"
                                {...register("name")}
                                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                                placeholder={t("brands.add.namePlaceholder")}
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
                                        {t("brands.add.imagesLabel")}
                                    </Label>
                                </div>

                                {selectedImages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveAllImages}
                                        className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                    >
                                        {t("brands.add.removeAll")}
                                    </button>
                                )}
                            </div>

                            {/* Selected images counter */}
                            {selectedImages.length > 0 && (
                                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                    <span className="font-medium">{selectedImages.length}</span>{" "}
                                    {t(`brands.add.imagesSelected${selectedImages.length === 1 ? '' : '_plural'}`, {
                                        count: selectedImages.length
                                    })}
                                </div>
                            )}

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
                                <Input
                                    id="images"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    {...register("images")}
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                                <label htmlFor="images" className="cursor-pointer block">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("brands.add.clickToUpload")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("brands.add.uploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {errors.images && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.images.message}
                                </div>
                            )}

                            {/* Images Preview as Carousel */}
                            {selectedImages.length > 0 && (
                                <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold">
                                            {t("brands.add.imagesPreview")}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {selectedImages.length} {t(`brands.add.imagesSelected${selectedImages.length === 1 ? '' : '_plural'}`, {
                                                count: selectedImages.length
                                            })}
                                        </span>
                                    </div>

                                    {/* Carousel Component */}
                                    <Carousel className="w-full">
                                        <CarouselContent>
                                            {selectedImages.map((image, index) => (
                                                <CarouselItem key={image.id}>
                                                    <div className="p-1">
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
                                                                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                                    title={t("brands.add.removeImage")}
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                                {/* Image Info */}
                                                                <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
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
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>

                                        {/* Show navigation only if there are multiple images */}
                                        {selectedImages.length > 1 && (
                                            <>
                                                <CarouselPrevious className="left-2 h-8 w-8" />
                                                <CarouselNext className="right-2 h-8 w-8" />
                                            </>
                                        )}
                                    </Carousel>
                                </div>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-lg py-2.5"
                            >
                                {t("brands.add.cancel")}
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg py-2.5 font-semibold"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    {t("brands.add.adding")}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 justify-center">
                                    <Plus className="h-4 w-4" />
                                    {t("brands.add.add")}
                                </div>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}