// import { Button } from "@/components/ui/button"
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
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
// import { useGetArticleByIdQuery } from "@/api/feature/articles/getSlices"
// import { useFilterCategoryQuery } from "@/api/feature/category/getSlice"
// import { useEffect, useState, useRef } from "react"
// import { useTranslation } from 'react-i18next'
// import { X, Upload, Image as ImageIcon, FileText, Tag, AlignLeft, Type, Save, Loader, ChevronLeft, ChevronRight } from "lucide-react"
// import { useArticlePutMutation } from "@/api/feature/articles/putSlices"
// import { handleApiResponse } from "@/hooks/apiErrorHandler"
// import { SimpleEditor, type SimpleEditorRef } from "./Editor"
// import { Card, CardContent } from "@/components/ui/card"
// import i18n from "@/i18n"

// interface PopupEditProps {
//     isOpen: boolean
//     onOpenChange: (open: boolean) => void
//     articleId?: string
// }

// interface ImagePreview {
//     id: string
//     url: string
//     file?: File
//     isExisting?: boolean
//     path?: string
//     name?: string
// }


// export default function Edit({ isOpen, onOpenChange, articleId }: PopupEditProps) {
//     const { t } = useTranslation()
//     const [editArticle, { isLoading }] = useArticlePutMutation()
//     const { data: articleData, isLoading: isLoadingArticle } = useGetArticleByIdQuery(articleId!, {
//         skip: !articleId,
//     })
//     const { data: categoriesData, isLoading: isLoadingCategories } = useFilterCategoryQuery({
//         page: 1,
//         size: 10,
//         key: undefined,
//     })

//     const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
//     const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
//     const [currentImageIndex, setCurrentImageIndex] = useState(0)
//     const editorRef = useRef<SimpleEditorRef>(null)
//     const fileInputRef = useRef<HTMLInputElement>(null)

//     const schema = z.object({
//         title: z.string().min(1, { message: t('articles.edit.titleRequired') }).max(100, { message: t('articles.edit.titleTooLong') }),
//         body: z.string().min(10, { message: t('articles.edit.contentRequired') }),
//         articleCategoryId: z.string().min(1, t('articles.edit.categoryRequired')),
//     })

//     type FormDataPost = z.infer<typeof schema>

//     const { register, handleSubmit, formState: { errors }, control, reset, setValue, watch } = useForm<FormDataPost>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             title: "",
//             body: "",
//             articleCategoryId: "",
//         }
//     })

//     const bodyContent = watch("body")

//     // Load article data when component opens
//     useEffect(() => {
//         if (isOpen && articleData?.data) {
//             const article = articleData.data

//             setValue('title', article.title)
//             setValue('body', article.body || "")
//             setValue('articleCategoryId', article.articleCategoryId)

//             // Set existing images
//             if (article.images && Array.isArray(article.images) && article.images.length > 0) {
//                 const existingImages: ImagePreview[] = article.images.map((imgPath: string, index: number) => ({
//                     id: `existing-${index}`,
//                     url: `${import.meta.env.VITE_BASE_URL}/${imgPath}`,
//                     path: imgPath,
//                     name: `Image ${index + 1}`,
//                     isExisting: true
//                 }))
//                 setSelectedImages(existingImages)
//             } else if (article.imagePath) {
//                 // Fallback for old data format
//                 const existingImage: ImagePreview = {
//                     id: 'existing-0',
//                     url: `${import.meta.env.VITE_BASE_URL}/${article.imagePath}`,
//                     path: article.imagePath,
//                     name: 'Article Image',
//                     isExisting: true
//                 }
//                 setSelectedImages([existingImage])
//             }

//             // Reset images to remove
//             setImagesToRemove([])
//             setCurrentImageIndex(0)
//         }
//     }, [isOpen, articleData, setValue])

//     // Handle new image selection
//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files
//         if (files && files.length > 0) {
//             const newImages: ImagePreview[] = []

//             for (let i = 0; i < files.length; i++) {
//                 const file = files[i]
//                 if (file && file.type.startsWith('image/')) {
//                     const imageUrl = URL.createObjectURL(file)
//                     newImages.push({
//                         id: `new-${Date.now()}-${i}`,
//                         url: imageUrl,
//                         file: file,
//                         name: file.name,
//                         isExisting: false
//                     })
//                 }
//             }

//             setSelectedImages(prev => [...prev, ...newImages])
//         }
//     }
//     const handleRemoveImage = (id: string) => {
//         setSelectedImages(prev => {
//             const imageToRemove = prev.find(img => img.id === id)
//             const newImages = prev.filter(img => img.id !== id)

//             // If it's an existing image with a valid path, add to removal list
//             if (imageToRemove?.isExisting && imageToRemove.path) {
//                 // Type assertion to ensure it's a string
//                 const path = imageToRemove.path as string
//                 setImagesToRemove(prev => [...prev, path])
//             }

//             // Adjust current index if needed
//             if (newImages.length > 0) {
//                 const newIndex = Math.min(currentImageIndex, newImages.length - 1)
//                 setCurrentImageIndex(newIndex)
//             } else {
//                 setCurrentImageIndex(0)
//             }

//             return newImages
//         })
//     }
//     // Handle remove all new images
//     const handleRemoveAllNewImages = () => {
//         // Only remove new images, keep existing ones
//         const existingImages = selectedImages.filter(img => img.isExisting)
//         const newImages = selectedImages.filter(img => !img.isExisting)

//         // Clean up URLs for new images
//         newImages.forEach(img => {
//             if (!img.isExisting) {
//                 URL.revokeObjectURL(img.url)
//             }
//         })

//         setSelectedImages(existingImages)

//         // Reset file input
//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }
//     }

//     // Formatting functions
//     const formatText = (command: string) => {
//         editorRef.current?.execCommand(command)
//     }

//     // Reset editor styles
//     const resetStyles = () => {
//         editorRef.current?.execCommand('removeFormat')
//     }

//     // Clear editor
//     const clearEditor = () => {
//         editorRef.current?.clear()
//     }

//     const onSubmit = async (data: FormDataPost) => {
//         try {
//             if (!articleId) {
//                 toast.error(t('articles.edit.missingId'))
//                 return
//             }

//             const formData = new FormData()
//             formData.append('articleId', articleId)
//             formData.append('title', data.title)
//             formData.append('body', data.body || "")
//             formData.append('articleCategoryId', data.articleCategoryId)

//             // Add images to remove
//             imagesToRemove.forEach(path => {
//                 formData.append('imagesToRemove', path)
//             })

//             // Add new images
//             const newImages = selectedImages.filter(img => !img.isExisting)
//             newImages.forEach(img => {
//                 if (img.file) {
//                     formData.append('imagesToAdd', img.file)
//                 }
//             })

//             const res = await editArticle(formData)
//             const result = handleApiResponse(res)
//             if (result.success) {
//                 toast.success(result.error)
//                 handleClose()
//             } else {
//                 toast.error(result.error)
//             }

//         } catch (err: any) {
//             toast.error(err.error || "An error occurred")
//         }
//     }

//     const handleClose = () => {
//         // Clean up URLs
//         selectedImages.forEach(img => {
//             if (!img.isExisting) {
//                 URL.revokeObjectURL(img.url)
//             }
//         })

//         reset()
//         setSelectedImages([])
//         setImagesToRemove([])
//         setCurrentImageIndex(0)
//         clearEditor()

//         if (fileInputRef.current) {
//             fileInputRef.current.value = ''
//         }

//         onOpenChange(false)
//     }

//     const categories = categoriesData?.data?.values || []
//     const isRTL = i18n.language === "ar";

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <FileText className="h-6 w-6 text-blue-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t('articles.edit.title')}
//                                 </DialogTitle>
//                                 <DialogDescription className="mt-1">
//                                     {t('articles.edit.subtitle')}
//                                 </DialogDescription>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     {/* Content */}
//                     <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
//                         {/* Category Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-purple-50 rounded-lg">
//                                     <Tag className="h-4 w-4 text-purple-600" />
//                                 </div>
//                                 <Label className="text-sm font-semibold">
//                                     {t('articles.edit.categoryLabel')}
//                                 </Label>
//                             </div>
//                             <Controller
//                                 name="articleCategoryId"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select
//                                         onValueChange={field.onChange}
//                                         value={field.value}
//                                         disabled={isLoadingArticle || isLoadingCategories}
//                                     >
//                                         <SelectTrigger className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
//                                             <SelectValue placeholder={
//                                                 isLoadingCategories ? t('articles.edit.loadingCategories') : t('articles.edit.chooseCategory')
//                                             } />
//                                         </SelectTrigger>
//                                         <SelectContent className="rounded-lg">
//                                             <SelectGroup>
//                                                 {isLoadingCategories ? (
//                                                     <SelectItem value="loading" disabled>
//                                                         <div className="flex items-center gap-2">
//                                                             <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
//                                                             {t('articles.edit.loadingCategories')}
//                                                         </div>
//                                                     </SelectItem>
//                                                 ) : categories.length > 0 ? (
//                                                     categories.map((category: any) => (
//                                                         <SelectItem
//                                                             key={category.id}
//                                                             value={category.id}
//                                                             className="focus:bg-blue-50 focus:text-blue-600 rounded-md"
//                                                         >
//                                                             {category.name}
//                                                         </SelectItem>
//                                                     ))
//                                                 ) : (
//                                                     <SelectItem value="no-data" disabled>
//                                                         {t('articles.edit.noCategories')}
//                                                     </SelectItem>
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
//                                     {t('articles.edit.titleLabel')}
//                                 </Label>
//                             </div>
//                             <Input
//                                 id="title"
//                                 type="text"
//                                 {...register("title")}
//                                 disabled={isLoadingArticle}
//                                 className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
//                                 placeholder={t('articles.edit.titlePlaceholder')}
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
//                                         {t('articles.edit.contentLabel')}
//                                     </Label>
//                                 </div>

//                                 {/* Character count */}
//                                 <div className="text-xs text-gray-500">
//                                     {(bodyContent || '').replace(/<[^>]*>/g, '').length} {t('articles.edit.characters')}
//                                 </div>
//                             </div>

//                             {/* Toolbar */}
//                             <div className="flex flex-wrap gap-2 mb-2 p-2 rounded-lg">
//                                 <div className="flex items-center gap-1">
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => formatText('bold')}
//                                         className="h-8 w-8 p-0 font-bold"
//                                         title="Bold (Ctrl+B)"
//                                         disabled={isLoadingArticle}
//                                     >
//                                         B
//                                     </Button>

//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => formatText('italic')}
//                                         className="h-8 w-8 p-0 italic"
//                                         title="Italic (Ctrl+I)"
//                                         disabled={isLoadingArticle}
//                                     >
//                                         I
//                                     </Button>

//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         size="sm"
//                                         onClick={() => formatText('underline')}
//                                         className="h-8 w-8 p-0 underline"
//                                         title="Underline (Ctrl+U)"
//                                         disabled={isLoadingArticle}
//                                     >
//                                         U
//                                     </Button>
//                                 </div>

//                                 <Separator orientation="vertical" className="h-8" />

//                                 <Button
//                                     type="button"
//                                     variant="outline"
//                                     size="sm"
//                                     onClick={resetStyles}
//                                     className="h-8 px-3"
//                                     title={t('articles.edit.removeFormatting')}
//                                     disabled={isLoadingArticle}
//                                 >
//                                     {t('articles.edit.clearFormat')}
//                                 </Button>
//                             </div>

//                             {/* Editor */}
//                             <Controller
//                                 name="body"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <SimpleEditor
//                                         ref={editorRef}
//                                         value={field.value || ""}
//                                         onChange={(value) => field.onChange(value || "")}
//                                         placeholder={t('articles.edit.editorPlaceholder')}
//                                         className="min-h-[120px]"
//                                     />
//                                 )}
//                             />

//                             <div className="text-xs text-gray-500 mt-2">
//                                 <p>{t('articles.edit.shortcuts')}</p>
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
//                                         {t('articles.edit.imagesLabel')}
//                                     </Label>
//                                 </div>

//                                 {selectedImages.some(img => !img.isExisting) && (
//                                     <button
//                                         type="button"
//                                         onClick={handleRemoveAllNewImages}
//                                         className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
//                                     >
//                                         {t('articles.edit.removeNew')}
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Images Summary */}
//                             {selectedImages.length > 0 && (
//                                 <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
//                                     <div className="flex items-center justify-between">
//                                         <span>
//                                             {selectedImages.length} {selectedImages.length === 1 ? t('articles.edit.image') : t('articles.edit.images')}
//                                         </span>
//                                         <div className="text-xs">
//                                             {selectedImages.filter(img => img.isExisting).length} {t('articles.edit.existing')}
//                                             {selectedImages.some(img => !img.isExisting) && (
//                                                 <span className="ml-2">
//                                                     • {selectedImages.filter(img => !img.isExisting).length} {t('articles.edit.new')}
//                                                 </span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Upload Area */}
//                             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
//                                 <Input
//                                     id="images"
//                                     type="file"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={handleImageChange}
//                                     disabled={isLoadingArticle}
//                                     ref={fileInputRef}
//                                     className="hidden"
//                                 />
//                                 <label htmlFor="images" className="cursor-pointer block">
//                                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
//                                     <p className="text-sm font-medium mb-1">
//                                         {t('articles.edit.clickToAdd')}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         {t('articles.edit.uploadHelp')}
//                                     </p>
//                                 </label>
//                             </div>

//                             {/* Images Preview */}
//                             {selectedImages.length > 0 && (
//                                 <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className="text-sm font-semibold">
//                                             {t('articles.edit.imagesPreview')}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                             {imagesToRemove.length > 0 && (
//                                                 <span className="text-red-600">
//                                                     {t('articles.edit.markedForRemoval', { count: imagesToRemove.length })}
//                                                 </span>
//                                             )}
//                                         </span>
//                                     </div>

//                                     {/* Custom Carousel Implementation */}
//                                     <div className="relative overflow-hidden rounded-lg">
//                                         <div
//                                             className="flex transition-transform duration-300 ease-in-out"
//                                             style={{ transform: `translateX(${isRTL ? currentImageIndex * 100 : -currentImageIndex * 100}%)` }}
//                                         >
//                                             {selectedImages.map((image, index) => (
//                                                 <div key={image.id} className="w-full flex-shrink-0">
//                                                     <Card className="border-0 shadow-none">
//                                                         <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
//                                                             <img
//                                                                 src={image.url}
//                                                                 alt={image.name || `Image ${index + 1}`}
//                                                                 className="w-full h-full object-cover"
//                                                             />
//                                                             {/* Delete Button */}
//                                                             <button
//                                                                 type="button"
//                                                                 onClick={() => handleRemoveImage(image.id)}
//                                                                 className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl z-10"
//                                                                 title="Remove image"
//                                                             >
//                                                                 <X className="h-4 w-4" />
//                                                             </button>

//                                                             {/* Image Info */}
//                                                             <div className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded flex items-center gap-1">

//                                                                 <span>{index + 1} / {selectedImages.length}</span>
//                                                             </div>

//                                                             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//                                                                 <div className="text-white text-xs truncate">
//                                                                     {image.name || `Image ${index + 1}`}
//                                                                 </div>
//                                                                 {image.file && (
//                                                                     <div className="text-white/80 text-[10px]">
//                                                                         {(image.file.size / 1024 / 1024).toFixed(2)} MB
//                                                                     </div>
//                                                                 )}
//                                                             </div>
//                                                         </CardContent>
//                                                     </Card>
//                                                 </div>
//                                             ))}
//                                         </div>

//                                         {/* Navigation Arrows */}
//                                         {selectedImages.length > 1 && (
//                                             <>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => setCurrentImageIndex(prev =>
//                                                         prev > 0 ? prev - 1 : selectedImages.length - 1
//                                                     )}
//                                                     className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
//                                                 >
//                                                     <ChevronLeft className="h-5 w-5" />
//                                                 </button>
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => setCurrentImageIndex(prev =>
//                                                         prev < selectedImages.length - 1 ? prev + 1 : 0
//                                                     )}
//                                                     className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
//                                                 >
//                                                     <ChevronRight className="h-5 w-5" />
//                                                 </button>
//                                             </>
//                                         )}
//                                     </div>


//                                     {/* Dots Navigation */}
//                                     {selectedImages.length > 1 && (
//                                         <div className="flex justify-center gap-1.5 mt-3">
//                                             {selectedImages.map((_, index) => (
//                                                 <button
//                                                     key={index}
//                                                     type="button"
//                                                     onClick={() => setCurrentImageIndex(index)}
//                                                     className={`w-2 h-2 rounded-full transition-all ${currentImageIndex === index
//                                                         ? 'bg-blue-500 scale-125'
//                                                         : 'bg-gray-300 hover:bg-gray-400'
//                                                         }`}
//                                                 />
//                                             ))}
//                                         </div>
//                                     )}

//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <DialogFooter className="p-6 pt-4 border-t border-gray-100">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={handleClose}
//                             className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
//                         >
//                             <X className="h-4 w-4" />
//                             {t('articles.edit.cancel')}
//                         </Button>

//                         <Button
//                             type="submit"
//                             disabled={isLoading || isLoadingArticle}
//                             className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t('articles.edit.saving')}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Save className="h-4 w-4" />
//                                     {t('articles.edit.save')}
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     )
// }
"use client"
import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "react-toastify"
import {
    X, Upload, Tag, AlignLeft, Type, FileText, Video, Loader,
    ImageIcon
} from "lucide-react"
import { SimpleEditor, type SimpleEditorRef } from "@/components/articles/modules/Editor"
import { useGetArticleByIdQuery } from "@/api/feature/articles/getSlices"
import { useFilterCategoryQuery } from "@/api/feature/category/getSlice"
import { useArticlePutMutation } from "@/api/feature/articles/putSlices"
import { handleApiResponse } from "@/hooks/apiErrorHandler"

import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"

interface ImagePreview {
    id: string
    url: string
    file?: File
    isExisting?: boolean
    path?: string
    name?: string
}

interface VideoPreview {
    id: string
    url: string
    file?: File
    name?: string
    isExisting?: boolean
    path?: string
}

export default function EditArticlePage() {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams()
    const articleId = id!

    const [editArticle, { isLoading }] = useArticlePutMutation()
    const { data: articleData, isLoading: isLoadingArticle } = useGetArticleByIdQuery(articleId)
    const { data: categoriesData, isLoading: isLoadingCategory } = useFilterCategoryQuery({ page: 1, size: 10 })

    const editorRef = useRef<SimpleEditorRef>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const videoInputRef = useRef<HTMLInputElement>(null)

    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([])
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([])
    // @ts-ignore
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [selectedVideos, setSelectedVideos] = useState<VideoPreview[]>([])
    const [videosToRemove, setVideosToRemove] = useState<string[]>([])
    // const [currentVideoIndex, setCurrentVideoIndex] = useState(0)

    const schema = z.object({
        title: z.string().min(1, t('articles.edit.titleRequired')).max(100, t('articles.edit.titleTooLong')),
        body: z.string().min(10, t('articles.edit.contentRequired')),
        articleCategoryId: z.string().min(1, t('articles.edit.categoryRequired'))
    })

    type FormDataPost = z.infer<typeof schema>

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormDataPost>({
        resolver: zodResolver(schema),
        defaultValues: { title: '', body: '', articleCategoryId: '' }
    })

    const bodyContent = watch("body")

    // Load existing article data including images & videos
    useEffect(() => {
        if (articleData?.data) {
            const article = articleData.data
            setValue('title', article.title)
            setValue('body', article.body || "")
            setValue('articleCategoryId', article.articleCategoryId)

            const existingImages: ImagePreview[] = (article.images || []).map((img: string, idx: number) => ({
                id: `existing-${idx}`,
                url: `${import.meta.env.VITE_BASE_URL}/${img}`,
                path: img,
                isExisting: true
            }))
            setSelectedImages(existingImages)

            const existingVideos: VideoPreview[] = (article.videos || []).map((vid: string, idx: number) => ({
                id: `existing-${idx}`,
                url: `${import.meta.env.VITE_BASE_URL}/${vid}`,
                path: vid,
                name: `Video ${idx + 1}`,
                isExisting: true
            }))
            setSelectedVideos(existingVideos)
        }
    }, [articleData, setValue])

    /** Image Handlers */
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newImages: ImagePreview[] = Array.from(files)
            .filter(f => f.type.startsWith("image/"))
            .map((file, idx) => ({
                id: `new-${Date.now()}-${idx}`,
                url: URL.createObjectURL(file),
                file,
                name: file.name,
                isExisting: false
            }))
        setSelectedImages(prev => [...prev, ...newImages])
    }

    const handleRemoveImage = (id: string) => {
        setSelectedImages(prev => {
            const imgToRemove = prev.find(img => img.id === id)
            const newImages = prev.filter(img => img.id !== id)
            if (imgToRemove?.isExisting && imgToRemove.path) setImagesToRemove(prev => Array.from(new Set([...prev, imgToRemove.path!])))
            if (imgToRemove && !imgToRemove.isExisting) URL.revokeObjectURL(imgToRemove.url)
            setCurrentImageIndex(prev => Math.min(prev, newImages.length - 1))
            return newImages
        })
    }

    const handleRemoveAllImages = () => {
        setSelectedImages(prev => {
            const existingPaths = prev.filter(img => img.isExisting && img.path).map(img => img.path!)
            setImagesToRemove(prev => Array.from(new Set([...prev, ...existingPaths])))
            prev.filter(img => !img.isExisting).forEach(img => URL.revokeObjectURL(img.url))
            return []
        })
    }

    /** Video Handlers */
    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return
        const newVideos: VideoPreview[] = Array.from(files)
            .filter(f => f.type.startsWith("video/"))
            .map((file, idx) => ({
                id: `new-video-${Date.now()}-${idx}`,
                url: URL.createObjectURL(file),
                file,
                name: file.name
            }))
        setSelectedVideos(prev => [...prev, ...newVideos])
    }

    const handleRemoveVideo = (id: string) => {
        setSelectedVideos(prev => {
            const vidToRemove = prev.find(v => v.id === id)
            const newVideos = prev.filter(v => v.id !== id)
            if (vidToRemove?.isExisting && vidToRemove.path) setVideosToRemove(prev => Array.from(new Set([...prev, vidToRemove.path!])))
            if (vidToRemove?.file) URL.revokeObjectURL(vidToRemove.url)
            return newVideos
        })
    }

    const handleRemoveAllVideos = () => {
        setSelectedVideos(prev => {
            const existingPaths = prev.filter(v => v.isExisting && v.path).map(v => v.path!)
            setVideosToRemove(prev => Array.from(new Set([...prev, ...existingPaths])))
            prev.forEach(v => { if (v.file) URL.revokeObjectURL(v.url) })
            return []
        })
    }

    /** Editor formatting functions */
    const formatText = (command: string) => {
        editorRef.current?.execCommand(command)
    }

    const resetStyles = () => {
        editorRef.current?.execCommand('removeFormat')
    }

    /** Submit */
    const onSubmit = async (data: FormDataPost) => {
        const formData = new FormData()
        formData.append('articleId', articleId)
        formData.append('title', data.title)
        formData.append('body', data.body)
        formData.append('articleCategoryId', data.articleCategoryId)
        imagesToRemove.forEach(p => formData.append('imagesToRemove', p))
        selectedImages.filter(img => !img.isExisting).forEach(img => img.file && formData.append('imagesToAdd', img.file))
        videosToRemove.forEach(p => formData.append('videosToRemove', p))
        selectedVideos.forEach(v => v.file && formData.append('videosToAdd', v.file))

        const res = await editArticle(formData)
        const result = handleApiResponse(res)
        if (result.success) {
            toast.success(t('articles.edit.success'))
            navigate("/article")
        } else {
            toast.error(result.error)
        }
    }

    const categories = categoriesData?.data?.values || []
    if (isLoadingArticle && isLoadingCategory) return <Loader className="mx-auto mt-20" />;

    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3">
            {/* Header */}
            <div className="border-b pb-4 mb-6 text-center">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t("articles.edit.title")}</h1>
                <p className="text-sm text-gray-500 mt-1">{t("articles.edit.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-2 border rounded-2xl">
                {/* Main Fields */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Category */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-purple-50 rounded-lg"><Tag className="h-4 w-4 text-purple-600" /></div>
                            <Label className="text-sm font-semibold">{t('articles.edit.categoryLabel')}</Label>
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
                                            {categories.length > 0 ? categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>) :
                                                <SelectItem value="no-data" disabled>{t('articles.add.noCategories')}</SelectItem>}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.articleCategoryId && <div className="text-red-500 text-sm">{errors.articleCategoryId.message}</div>}
                    </div>

                    {/* Title */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 rounded-lg"><Type className="h-4 w-4 text-blue-600" /></div>
                            <Label className="text-sm font-semibold">{t('articles.edit.titleLabel')}</Label>
                        </div>
                        <Input {...register("title")} placeholder={t('articles.edit.titlePlaceholder')} />
                        {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
                    </div>

                    {/* Body with Editor */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg"><AlignLeft className="h-4 w-4 text-green-600" /></div>
                                <Label className="text-sm font-semibold">{t('articles.edit.contentLabel')}</Label>
                            </div>
                            <div className="text-xs text-gray-500">{bodyContent ? bodyContent.replace(/<[^>]*>/g, '').length : 0} {t('articles.add.characters')}</div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                            <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={() => formatText('bold')}>B</Button>
                            <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={() => formatText('italic')}>I</Button>
                            <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={() => formatText('underline')}>U</Button>
                            <Separator orientation="vertical" className="h-8" />
                            <Button type="button" variant="outline" size="sm" className="h-8 px-3" onClick={resetStyles}>Clear Format</Button>
                        </div>

                        <Controller
                            name="body"
                            control={control}
                            render={({ field }) => (
                                <SimpleEditor ref={editorRef} value={field.value} onChange={field.onChange} className="min-h-[150px]" />
                            )}
                        />
                    </div>
                </div>

                {/* Sidebar for Images & Videos */}
                <div className="space-y-6">
                    {/* Images Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <ImageIcon className="h-4 w-4 text-orange-600" />
                                </div>
                                <Label htmlFor="images" className="text-sm font-semibold">
                                    {t('articles.edit.imagesLabel')}
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
                                onChange={handleImageChange}
                                ref={fileInputRef}
                                className="hidden"
                            />
                            <label htmlFor="images" className="cursor-pointer block">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                <p className="text-sm font-medium mb-1">{t('articles.add.clickToUpload')}</p>
                                <p className="text-xs text-gray-500">{t('articles.add.uploadHelp')}</p>
                            </label>
                        </div>

                        {/* Images Preview Carousel */}
                        {selectedImages.length > 0 && (
                            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold">{t('articles.add.imagesPreview')}</span>
                                    <span className="text-xs text-gray-500">
                                        {t('articles.add.selectedImages', { count: selectedImages.length })}
                                    </span>
                                </div>

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
                                                                className="w-full h-full object-cover rounded-lg"
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
                                                            {image.file && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                                    <div className="text-white text-xs truncate">{image.file.name}</div>
                                                                    <div className="text-white/80 text-[10px]">{(image.file.size / 1024 / 1024).toFixed(2)} MB</div>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

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
                    {/* Videos Section */}
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
                                ref={videoInputRef}
                                className="hidden"
                                id="videos"
                            />
                            <label htmlFor="videos" className="cursor-pointer block">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                <p className="text-sm font-medium mb-1">{t('articles.add.clickToUpload')}</p>
                                <p className="text-xs text-gray-500">{t('articles.add.uploadHelp')}</p>
                            </label>
                        </div>

                        {/* Videos Preview Carousel */}
                        {selectedVideos.length > 0 && (
                            <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm font-semibold">{t('articles.add.videosPreview')}</span>
                                    <span className="text-xs text-gray-500">
                                        {t('articles.add.selectedVideos', { count: selectedVideos.length })}
                                    </span>
                                </div>

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
                                                            {video.file && (
                                                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                                    <div className="text-white text-xs truncate">{video.file.name}</div>
                                                                    <div className="text-white/80 text-[10px]">{(video.file.size / 1024 / 1024).toFixed(2)} MB</div>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

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
                <div className="lg:col-span-3 flex justify-end gap-3 mt-4">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>{t("articles.add.cancel")}</Button>
                    <Button type="submit" disabled={isLoading}>{isLoading ? t("articles.add.publishing") : t("articles.add.publish")}<FileText className="ml-2 h-4 w-4" /></Button>
                </div>
            </form>
        </div>
    )
}
