// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogClose,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import {
//     Select,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select"
// import { Separator } from "@/components/ui/separator"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Controller, useForm } from "react-hook-form"
// import { z } from "zod"
// import { toast } from 'react-toastify'
// import { useArticlePostMutation } from "@/api/feature/articles/postSlices"
// import { useFilterCategoryQuery } from "@/api/feature/category/getSlice"
// import { useState, useRef, useEffect } from "react"
// import { useTranslation } from 'react-i18next'
// import { X, Upload, Image as ImageIcon, FileText, Tag, Type, AlignLeft } from "lucide-react"
// import { handleApiResponse } from "@/hooks/apiErrorHandler"
// import { SimpleEditor, type SimpleEditorRef } from "./Editor"
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel"
// import { Card, CardContent } from "@/components/ui/card"

// interface PopupAddProps {
//     isOpen: boolean
//     onOpenChange: (open: boolean) => void
// }

// interface ImagePreview {
//     id: string
//     url: string
//     file: File
// }

// export default function AddArticle({ isOpen, onOpenChange }: PopupAddProps) {
//     const [addArticle, { isLoading }] = useArticlePostMutation()
//     const { data, isLoading: isLoadingCategory } = useFilterCategoryQuery({
//         page: 1,
//         size: 10,
//         key: undefined,
//     })
//     const categoryData = data?.data?.values || []
//     const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
//     const editorRef = useRef<SimpleEditorRef>(null)
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const schema = z.object({
//         title: z.string().min(1, { message: "Article title is required" }).max(100, { message: "Title is too long" }),
//         body: z.string().min(10, { message: "Article content is required" }),
//         images: z.custom<FileList | null>()
//             .refine((files) => files && files.length > 0, 'At least one image is required')
//             .refine((files) => files && files.length <= 10, 'Maximum 10 images allowed')
//             .refine((files) => {
//                 if (!files) return false;
//                 for (let i = 0; i < files.length; i++) {
//                     if (files[i]?.size > 5 * 1024 * 1024) {
//                         return false
//                     }
//                 }
//                 return true
//             }, 'Each image must be less than 5MB')
//             .refine((files) => {
//                 if (!files) return false;
//                 for (let i = 0; i < files.length; i++) {
//                     if (!files[i]?.type.startsWith('image/')) {
//                         return false
//                     }
//                 }
//                 return true
//             }, 'Only image files are allowed'),
//         articleCategoryId: z.string().min(1, 'Article category is required'),
//     })

//     type FormDataPost = z.infer<typeof schema>

//     const { register, handleSubmit, formState: { errors }, control, reset, watch, setValue, trigger } = useForm<FormDataPost>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             articleCategoryId: "",
//             images: null
//         }
//     })

//     const bodyContent = watch("body")
//     const { t } = useTranslation()

//     // Handle multiple image selection and preview
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files
//         if (files && files.length > 0) {
//             const newImages: ImagePreview[] = []

//             for (let i = 0; i < files.length; i++) {
//                 const file = files[i]
//                 if (file && file.type.startsWith('image/')) {
//                     const imageUrl = URL.createObjectURL(file)
//                     newImages.push({
//                         id: Date.now() + i + Math.random().toString(36),
//                         url: imageUrl,
//                         file: file
//                     })
//                 }
//             }

//             // Add new images to existing ones
//             setSelectedImages(prev => [...prev, ...newImages])

//             // Update form value with all files
//             const allFiles = [...selectedImages.map(img => img.file), ...newImages.map(img => img.file)]
//             const newFileList = createFileList(allFiles)

//             setValue("images", newFileList)
//             trigger("images")
//         }
//     }

//     // Helper function to create a FileList from File array
//     const createFileList = (files: File[]): FileList => {
//         const dataTransfer = new DataTransfer()
//         files.forEach(file => {
//             dataTransfer.items.add(file)
//         })
//         return dataTransfer.files
//     }

//     // Handle image removal
//     const handleRemoveImage = (id: string) => {
//         setSelectedImages(prev => {
//             const newImages = prev.filter(img => img.id !== id)

//             // Update form value
//             const newFileList = createFileList(newImages.map(img => img.file))
//             setValue("images", newFileList)

//             // Update file input
//             if (fileInputRef.current) {
//                 const dt = new DataTransfer()
//                 newImages.forEach(img => dt.items.add(img.file))
//                 fileInputRef.current.files = dt.files
//             }

//             trigger("images")

//             return newImages
//         })
//     }

//     // Handle remove all images
//     const handleRemoveAllImages = () => {
//         // Clean up URLs
//         selectedImages.forEach(img => URL.revokeObjectURL(img.url))

//         setSelectedImages([])
//         setValue("images", null)

//         // Reset file input
//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }

//         trigger("images")
//     }

//     // Clean up URLs
//     useEffect(() => {
//         return () => {
//             selectedImages.forEach(img => URL.revokeObjectURL(img.url))
//         }
//     }, [])

//     // Formatting functions
//     const formatText = (command: string) => {
//         editorRef.current?.execCommand(command)
//     }

//     const resetStyles = () => {
//         editorRef.current?.execCommand('removeFormat')
//     }

//     const clearEditor = () => {
//         editorRef.current?.clear()
//     }

//     const onSubmit = async (data: FormDataPost) => {
//         try {
//             const dataToSend = new FormData();

//             dataToSend.append('title', data.title);
//             dataToSend.append('body', data.body);
//             dataToSend.append('articleCategoryId', data.articleCategoryId);

//             if (data.images) {
//                 for (let i = 0; i < data.images.length; i++) {
//                     dataToSend.append('images', data.images[i]);
//                 }
//             }

//             const res = await addArticle(dataToSend)
//             const result = handleApiResponse(res);
//             if (result.success) {
//                 toast.success(result.error);
//                 resetForm();
//                 onOpenChange(false);
//             } else {
//                 toast.error(result.error);
//             }
//         } catch (error: any) {
//             toast.error(error.error);
//         }
//     }

//     const resetForm = () => {
//         // Clean up URLs
//         selectedImages.forEach(img => URL.revokeObjectURL(img.url))

//         reset({
//             articleCategoryId: "",
//             images: null
//         })
//         setSelectedImages([])
//         clearEditor()

//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }
//     }

//     const handleClose = () => {
//         resetForm()
//         onOpenChange(false)
//     }

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[600px] rounded-2xl">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     <DialogHeader className="text-center pb-4 border-b ">
//                         <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                             {t('articles.add.title')}
//                         </DialogTitle>
//                         <p className="text-sm text-gray-500 mt-1">
//                             {t('articles.add.subtitle')}
//                         </p>
//                     </DialogHeader>
//                     <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 py-4">
//                         {/* Category Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-purple-50 rounded-lg">
//                                     <Tag className="h-4 w-4 text-purple-600" />
//                                 </div>
//                                 <Label className="text-sm font-semibold">{t('articles.add.categoryLabel')}</Label>
//                             </div>
//                             <Controller
//                                 name="articleCategoryId"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select onValueChange={field.onChange} value={field.value}>
//                                         <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg">
//                                             <SelectValue placeholder={isLoadingCategory ? t('articles.add.loadingCategories') : t('articles.add.chooseCategory')} />
//                                         </SelectTrigger>
//                                         <SelectContent className="rounded-lg">
//                                             <SelectGroup>
//                                                 {isLoadingCategory ? (
//                                                     <SelectItem value="loading" disabled>
//                                                         <div className="flex items-center gap-2">
//                                                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
//                                                             {t('articles.add.loadingCategories')}
//                                                         </div>
//                                                     </SelectItem>
//                                                 ) : categoryData.length > 0 ? (
//                                                     categoryData.map((category: any) => (
//                                                         <SelectItem key={category.id} value={category.id} className="focus:bg-blue-50 focus:text-blue-600 rounded-md">
//                                                             {category.name}
//                                                         </SelectItem>
//                                                     ))
//                                                 ) : (
//                                                     <SelectItem value="no-data" disabled>{t('articles.add.noCategories')}</SelectItem>
//                                                 )}
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                             {errors.articleCategoryId && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.articleCategoryId.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Title Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-blue-50 rounded-lg">
//                                     <Type className="h-4 w-4 text-blue-600" />
//                                 </div>
//                                 <Label htmlFor="title" className="text-sm font-semibold">
//                                     {t('articles.add.titleLabel')}
//                                 </Label>
//                             </div>
//                             <Input
//                                 id="title"
//                                 type="text"
//                                 {...register("title")}
//                                 className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
//                                 placeholder={t('articles.add.titlePlaceholder')}
//                             />
//                             {errors.title && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.title.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Content Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-green-50 rounded-lg">
//                                         <AlignLeft className="h-4 w-4 text-green-600" />
//                                     </div>
//                                     <Label htmlFor="body" className="text-sm font-semibold">
//                                         {t('articles.add.contentLabel')}
//                                     </Label>
//                                 </div>

//                                 <div className="text-xs text-gray-500">
//                                     {bodyContent ? bodyContent.replace(/<[^>]*>/g, '').length : 0} {t('articles.add.characters')}
//                                 </div>
//                             </div>

//                             {/* Toolbar */}
//                             <div className="flex flex-wrap gap-2 mb-2">
//                                 <Button type="button" variant="outline" size="sm" onClick={() => formatText('bold')} className="h-8 px-3" title="Bold (Ctrl+B)">B</Button>
//                                 <Button type="button" variant="outline" size="sm" onClick={() => formatText('italic')} className="h-8 px-3" title="Italic (Ctrl+I)">I</Button>
//                                 <Button type="button" variant="outline" size="sm" onClick={() => formatText('underline')} className="h-8 px-3" title="Underline (Ctrl+U)">U</Button>
//                                 <Separator orientation="vertical" className="h-8" />
//                                 <Button type="button" variant="outline" size="sm" onClick={resetStyles} className="h-8 px-3" title="Remove Formatting">Clear Format</Button>
//                             </div>

//                             {/* Editor */}
//                             <Controller
//                                 name="body"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <SimpleEditor
//                                         ref={editorRef}
//                                         value={field.value}
//                                         onChange={field.onChange}
//                                         placeholder={t('articles.add.editorPlaceholder')}
//                                         className="min-h-[150px]"
//                                     />
//                                 )}
//                             />

//                             <div className="text-xs text-gray-500">
//                                 <p>{t('articles.add.shortcuts')}</p>
//                             </div>

//                             {errors.body && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.body.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Image Upload Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-orange-50 rounded-lg">
//                                         <ImageIcon className="h-4 w-4 text-orange-600" />
//                                     </div>
//                                     <Label htmlFor="images" className="text-sm font-semibold">
//                                         {t('articles.add.imagesLabel')}
//                                     </Label>
//                                 </div>

//                                 {selectedImages.length > 0 && (
//                                     <button
//                                         type="button"
//                                         onClick={handleRemoveAllImages}
//                                         className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
//                                     >
//                                         {t('articles.add.removeAll')}
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Selected images counter */}
//                             {selectedImages.length > 0 && (
//                                 <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
//                                     {t('articles.add.selectedImages', { count: selectedImages.length })}
//                                 </div>
//                             )}

//                             {/* Upload Area */}
//                             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
//                                 <Input
//                                     id="images"
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     {...register("images")}
//                                     onChange={handleImageChange}
//                                     ref={fileInputRef}
//                                 />
//                                 <label htmlFor="images" className="cursor-pointer block">
//                                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
//                                     <p className="text-sm font-medium mb-1">{t('articles.add.clickToUpload')}</p>
//                                     <p className="text-xs text-gray-500">{t('articles.add.uploadHelp')}</p>
//                                 </label>
//                             </div>

//                             {errors.images && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.images.message}
//                                 </div>
//                             )}

//                             {/* Images Preview as Carousel */}
//                             {selectedImages.length > 0 && (
//                                 <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className="text-sm font-semibold">{t('articles.add.imagesPreview')}</span>
//                                         <span className="text-xs text-gray-500">
//                                             {t('articles.add.selectedImages', { count: selectedImages.length })}
//                                         </span>
//                                     </div>

//                                     {/* Carousel Component */}
//                                     <Carousel className="w-full">
//                                         <CarouselContent>
//                                             {selectedImages.map((image, index) => (
//                                                 <CarouselItem key={image.id}>
//                                                     <div className="p-1">
//                                                         <Card className="border-0 shadow-none">
//                                                             <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
//                                                                 <img
//                                                                     src={image.url}
//                                                                     alt={`Preview ${index + 1}`}
//                                                                     className="w-full h-full object-cover"
//                                                                 />
//                                                                 {/* Delete Button */}
//                                                                 <button
//                                                                     type="button"
//                                                                     onClick={() => handleRemoveImage(image.id)}
//                                                                     className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
//                                                                     title={t('articles.add.removeImage')}
//                                                                 >
//                                                                     <X className="h-4 w-4" />
//                                                                 </button>
//                                                                 {/* Image Info */}
//                                                                 <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
//                                                                     {index + 1} / {selectedImages.length}
//                                                                 </div>
//                                                                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//                                                                     <div className="text-white text-xs truncate">
//                                                                         {image.file.name}
//                                                                     </div>
//                                                                     <div className="text-white/80 text-[10px]">
//                                                                         {(image.file.size / 1024 / 1024).toFixed(2)} MB
//                                                                     </div>
//                                                                 </div>
//                                                             </CardContent>
//                                                         </Card>
//                                                     </div>
//                                                 </CarouselItem>
//                                             ))}
//                                         </CarouselContent>

//                                         {/* Show navigation only if there are multiple images */}
//                                         {selectedImages.length > 1 && (
//                                             <>
//                                                 <CarouselPrevious className="left-2 h-8 w-8" />
//                                                 <CarouselNext className="right-2 h-8 w-8" />
//                                             </>
//                                         )}
//                                     </Carousel>
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     <DialogFooter className="mt-6 pt-4 border-t border-gray-100">
//                         <DialogClose asChild>
//                             <Button
//                                 type="button"
//                                 variant="outline"
//                                 onClick={handleClose}
//                                 className="flex-1 border-gray-300 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-lg py-2.5"
//                             >
//                                 {t('articles.add.cancel')}
//                             </Button>
//                         </DialogClose>
//                         <Button
//                             type="submit"
//                             disabled={isLoading}
//                             className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg py-2.5 font-semibold"
//                         >
//                             {isLoading ? (
//                                 <div className="flex items-center gap-2 justify-center">
//                                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                                     {t('articles.add.publishing')}
//                                 </div>
//                             ) : (
//                                 <div className="flex items-center gap-2 justify-center">
//                                     <FileText className="h-4 w-4" />
//                                     {t('articles.add.publish')}
//                                 </div>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
"use client";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-toastify"
import { useArticlePostMutation } from "@/api/feature/articles/postSlices"
import { useFilterCategoryQuery } from "@/api/feature/category/getSlice"
import { useState, useRef, useEffect } from "react"
import { useTranslation } from "react-i18next"
import {
    X,
    Upload,
    Image as ImageIcon,
    FileText,
    Tag,
    Type,
    AlignLeft,
    Video
} from "lucide-react"
import { handleApiResponse } from "@/hooks/apiErrorHandler"
import { SimpleEditor, type SimpleEditorRef } from "./Editor"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"

interface ImagePreview {
    id: string
    url: string
    file: File
}
interface VideoPreview {
    id: string
    url: string
    file: File
}
export default function CreateArticle() {
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [addArticle, { isLoading }] = useArticlePostMutation()
    const { data, isLoading: isLoadingCategory } = useFilterCategoryQuery({
        page: 1,
        size: 10,
        key: undefined,
    })

    const categoryData = data?.data?.values || []
    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
    const [selectedVideos, setSelectedVideos] = useState<VideoPreview[]>([])
    const editorRef = useRef<SimpleEditorRef>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    // ================= Schema =================
    // const schema = z.object({
    //     title: z.string().min(1).max(100),
    //     body: z.string().min(10),
    //     articleCategoryId: z.string().min(1),
    //     images: z.custom<FileList | null>()
    //         .refine(files => files && files.length > 0, 'At least one image is required')
    // })
    const schema = z.object({
        title: z.string().min(1).max(100),
        body: z.string().min(10),
        articleCategoryId: z.string().min(1),

        images: z.custom<FileList | null>()
            .refine(files => files && files.length > 0, 'At least one image is required'),

        videos: z.custom<FileList | null>().optional(),
    })

    type FormDataPost = z.infer<typeof schema>

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        watch,
        setValue,
        trigger
    } = useForm<FormDataPost>({
        resolver: zodResolver(schema),
        defaultValues: {
            articleCategoryId: "",
            images: null,
            videos: null
        }
    })

    const bodyContent = watch("body")

    // ================= Images =================
    const createFileList = (files: File[]): FileList => {
        const dt = new DataTransfer()
        files.forEach(file => dt.items.add(file))
        return dt.files
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newImages: ImagePreview[] = Array.from(files).map(file => ({
            id: crypto.randomUUID(),
            file,
            url: URL.createObjectURL(file)
        }))

        const allImages = [...selectedImages, ...newImages]
        setSelectedImages(allImages)
        setValue("images", createFileList(allImages.map(i => i.file)))
        trigger("images")
    }

    const handleRemoveImage = (id: string) => {
        const filtered = selectedImages.filter(img => img.id !== id)
        setSelectedImages(filtered)
        setValue("images", createFileList(filtered.map(i => i.file)))
        trigger("images")
    }

    const handleRemoveAllImages = () => {
        selectedImages.forEach(img => URL.revokeObjectURL(img.url))
        setSelectedImages([])
        setValue("images", null)
        if (fileInputRef.current) fileInputRef.current.value = ""
        trigger("images")
    }

    useEffect(() => {
        return () => {
            selectedImages.forEach(img => URL.revokeObjectURL(img.url))
        }
    }, [])
    useEffect(() => {
        return () => {
            selectedVideos.forEach(v => URL.revokeObjectURL(v.url))
        }
    }, [])

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newVideos: VideoPreview[] = Array.from(files).map(file => ({
            id: crypto.randomUUID(),
            file,
            url: URL.createObjectURL(file),
        }))

        const allVideos = [...selectedVideos, ...newVideos]
        setSelectedVideos(allVideos)

        setValue(
            "videos",
            createFileList(allVideos.map(v => v.file))
        )
        trigger("videos")
    }

    const handleRemoveVideo = (id: string) => {
        const filtered = selectedVideos.filter(v => v.id !== id)

        filtered.forEach(v => URL.revokeObjectURL(v.url))

        setSelectedVideos(filtered)
        setValue(
            "videos",
            filtered.length ? createFileList(filtered.map(v => v.file)) : null
        )
        trigger("videos")
    }

    const handleRemoveAllVideos = () => {
        selectedVideos.forEach(v => URL.revokeObjectURL(v.url))
        setSelectedVideos([])
        setValue("videos", null)

        if (videoInputRef.current) videoInputRef.current.value = ""
        trigger("videos")
    }

    // ================= Editor =================
    const formatText = (cmd: string) => editorRef.current?.execCommand(cmd)
    const resetStyles = () => editorRef.current?.execCommand("removeFormat")
    const clearEditor = () => editorRef.current?.clear()

    // ================= Submit =================
    const onSubmit = async (data: FormDataPost) => {
 
        const fd = new FormData()
        fd.append("title", data.title)
        fd.append("body", data.body)
        fd.append("articleCategoryId", data.articleCategoryId)

        // data.images && Array.from(data.images).forEach(img => fd.append("images", img))
        data.images &&
            Array.from(data.images).forEach(img =>
                fd.append("images", img)
            )

        data.videos &&
            Array.from(data.videos).forEach(video =>
                fd.append("videos", video)
            )

      
        const res = await addArticle(fd)
        const result = handleApiResponse(res)

        if (result.success) {
            toast.success(result.error)
            resetForm()
            navigate(-1)
        } else {
            toast.error(result.error)
        }
    }

    // const resetForm = () => {
    //     reset()
    //     setSelectedImages([])
    //     clearEditor()
    //     if (fileInputRef.current) fileInputRef.current.value = ""
    // }
    const resetForm = () => {
        reset()
        setSelectedImages([])
        setSelectedVideos([])
        clearEditor()

        if (fileInputRef.current) fileInputRef.current.value = ""
        if (videoInputRef.current) videoInputRef.current.value = ""
    }

    // ================= UI =================
    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3">
            {/* Header */}
            <div className="border-b pb-4 mb-6 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t("articles.add.title")}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {t("articles.add.subtitle")}
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-2 border rounded-2xl">
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Tag className="h-4 w-4 text-purple-600" />
                            </div>
                            <Label className="text-sm font-semibold">{t('articles.add.categoryLabel')}</Label>
                        </div>
                        <Controller
                            name="articleCategoryId"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg">
                                        <SelectValue placeholder={isLoadingCategory ? t('articles.add.loadingCategories') : t('articles.add.chooseCategory')} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-lg">
                                        <SelectGroup>
                                            {isLoadingCategory ? (
                                                <SelectItem value="loading" disabled>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                                                        {t('articles.add.loadingCategories')}
                                                    </div>
                                                </SelectItem>
                                            ) : categoryData.length > 0 ? (
                                                categoryData.map((category: any) => (
                                                    <SelectItem key={category.id} value={category.id} className="focus:bg-blue-50 focus:text-blue-600 rounded-md">
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            ) : (
                                                <SelectItem value="no-data" disabled>{t('articles.add.noCategories')}</SelectItem>
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.articleCategoryId && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {errors.articleCategoryId.message}
                            </div>
                        )}
                    </div>
                    {/* Title Field */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Type className="h-4 w-4 text-blue-600" />
                            </div>
                            <Label htmlFor="title" className="text-sm font-semibold">
                                {t('articles.add.titleLabel')}
                            </Label>
                        </div>
                        <Input
                            id="title"
                            type="text"
                            {...register("title")}
                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg"
                            placeholder={t('articles.add.titlePlaceholder')}
                        />
                        {errors.title && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {errors.title.message}
                            </div>
                        )}
                    </div>
                    {/* Content Field */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <AlignLeft className="h-4 w-4 text-green-600" />
                                </div>
                                <Label htmlFor="body" className="text-sm font-semibold">
                                    {t('articles.add.contentLabel')}
                                </Label>
                            </div>

                            <div className="text-xs text-gray-500">
                                {bodyContent ? bodyContent.replace(/<[^>]*>/g, '').length : 0} {t('articles.add.characters')}
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => formatText('bold')} className="h-8 px-3" title="Bold (Ctrl+B)">B</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => formatText('italic')} className="h-8 px-3" title="Italic (Ctrl+I)">I</Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => formatText('underline')} className="h-8 px-3" title="Underline (Ctrl+U)">U</Button>
                            <Separator orientation="vertical" className="h-8" />
                            <Button type="button" variant="outline" size="sm" onClick={resetStyles} className="h-8 px-3" title="Remove Formatting">Clear Format</Button>
                        </div>

                        {/* Editor */}
                        <Controller
                            name="body"
                            control={control}
                            render={({ field }) => (
                                <SimpleEditor
                                    ref={editorRef}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={t('articles.add.editorPlaceholder')}
                                    className="min-h-[150px]"
                                />
                            )}
                        />

                        <div className="text-xs text-gray-500">
                            <p>{t('articles.add.shortcuts')}</p>
                        </div>

                        {errors.body && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                {errors.body.message}
                            </div>
                        )}
                    </div>
                </div>
                <div className="space-y-6">
                    {/* Image Upload Field */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <ImageIcon className="h-4 w-4 text-orange-600" />
                                </div>
                                <Label htmlFor="images" className="text-sm font-semibold">
                                    {t('articles.add.imagesLabel')}
                                </Label>
                            </div>

                            {selectedImages.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAllImages}
                                    className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                >
                                    {t('articles.add.removeAll')}
                                </button>
                            )}
                        </div>

                        {/* Selected images counter */}
                        {selectedImages.length > 0 && (
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                {t('articles.add.selectedImages', { count: selectedImages.length })}
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
                                <p className="text-sm font-medium mb-1">{t('articles.add.clickToUpload')}</p>
                                <p className="text-xs text-gray-500">{t('articles.add.uploadHelp')}</p>
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
                                    <span className="text-sm font-semibold">{t('articles.add.imagesPreview')}</span>
                                    <span className="text-xs text-gray-500">
                                        {t('articles.add.selectedImages', { count: selectedImages.length })}
                                    </span>
                                </div>

                                {/* Carousel Component */}
                                <Carousel className="w-full" dir="ltr">
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
                                                                title={t('articles.add.removeImage')}
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
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Video className="h-4 w-4 text-purple-600" />
                                </div>
                                <Label className="text-sm font-semibold">{t('articles.add.videosLabel')}</Label>
                            </div>

                            {selectedVideos.length > 0 && (
                                <button
                                    type="button"
                                    onClick={handleRemoveAllVideos}
                                    className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                                >
                                    {t('articles.add.removeAll')}
                                </button>
                            )}
                        </div>

                        {/* Selected videos counter */}
                        {selectedVideos.length > 0 && (
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                {t('articles.add.selectedVideos', { count: selectedVideos.length })}
                            </div>
                        )}

                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
                            <Input
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={handleVideoChange}
                                // className="hidden"
                                id="videos"
                            />
                            <label htmlFor="videos" className="cursor-pointer block">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                <p className="text-sm font-medium mb-1">{t('articles.add.clickToUpload')}</p>
                                <p className="text-xs text-gray-500">{t('articles.add.uploadHelp')}</p>
                            </label>
                        </div>

                        {/* Videos Preview as Carousel */}
                        {selectedVideos.length > 0 && (
                            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold">{t('articles.add.videosPreview')}</span>
                                    <span className="text-xs text-gray-500">
                                        {t('articles.add.selectedVideos', { count: selectedVideos.length })}
                                    </span>
                                </div>

                                {/* Carousel Component */}
                                <Carousel className="w-full" dir="ltr">
                                    <CarouselContent>
                                        {selectedVideos.map((video, index) => (
                                            <CarouselItem key={video.id}>
                                                <div className="p-1">
                                                    <Card className="border-0 shadow-none">
                                                        <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
                                                            <video
                                                                src={video.url}
                                                                controls
                                                                className="w-full h-full object-cover rounded-lg"
                                                            />
                                                            {/* Delete Button */}
                                                            <button
                                                                type="button"
                                                                onClick={() => handleRemoveVideo(video.id)}
                                                                className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                                title={t('articles.add.removeVideo')}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                            {/* Video Info */}
                                                            <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
                                                                {index + 1} / {selectedVideos.length}
                                                            </div>
                                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                                <div className="text-white text-xs truncate">{video.file.name}</div>
                                                                <div className="text-white/80 text-[10px]">{(video.file.size / 1024 / 1024).toFixed(2)} MB</div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    {/* Show navigation only if multiple videos */}
                                    {selectedVideos.length > 1 && (
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

                {/* Footer */}
                <div className="flex gap-3 justify-end pt-6 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate(-1)}
                    >
                        {t("articles.add.cancel")}
                    </Button>

                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? t("articles.add.publishing") : t("articles.add.publish")}
                        <FileText className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
