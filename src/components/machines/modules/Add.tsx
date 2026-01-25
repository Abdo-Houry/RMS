// "use client";

// import { useState, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import {
//     Dialog,
//     DialogContent,
//     DialogHeader,
//     DialogTitle,
//     DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "react-toastify";
// import { X, Plus, Upload, Image as ImageIcon, Tag, Cpu, Loader } from "lucide-react";
// import { useMachinesPostMutation } from "@/api/feature/machines/postSlice";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";
// import {
//     Carousel,
//     CarouselContent,
//     CarouselItem,
//     CarouselNext,
//     CarouselPrevious,
// } from "@/components/ui/carousel"
// import { Card, CardContent } from "@/components/ui/card"
// import { useTranslation } from "react-i18next";

// interface AddMachineProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
// }

// interface ImagePreview {
//     id: string
//     url: string
//     file: File
// }

// export default function AddMachine({ isOpen, onOpenChange }: AddMachineProps) {
//     const { t } = useTranslation();
//     const schema = z.object({
//         name: z.string().min(1, t('machines.add.validation.nameRequired')),
//         images: z.custom<FileList | null>()
//             .refine((files) => files && files.length > 0, t('machines.add.validation.imageRequired'))
//             .refine((files) => files && files.length <= 10, t('machines.add.validation.maxImages'))
//             .refine((files) => {
//                 if (!files) return false;
//                 for (let i = 0; i < files.length; i++) {
//                     if (files[i]?.size > 5 * 1024 * 1024) {
//                         return false
//                     }
//                 }
//                 return true
//             }, t('machines.add.validation.imageSize'))
//             .refine((files) => {
//                 if (!files) return false;
//                 for (let i = 0; i < files.length; i++) {
//                     if (!files[i]?.type.startsWith('image/')) {
//                         return false
//                     }
//                 }
//                 return true
//             }, t('machines.add.validation.imageType')),
//         details: z.array(z.object({
//             key: z.string().min(1, t('machines.add.validation.keyRequired')),
//             value: z.string().min(1, t('machines.add.validation.valueRequired')),
//         })),
//     });
//     type FormData = z.infer<typeof schema>;

//     const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
//     const [addMachine, { isLoading }] = useMachinesPostMutation();
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     const {
//         register,
//         handleSubmit,
//         control,
//         reset,
//         setValue,
//         trigger,
//         formState: { errors },
//     } = useForm<FormData>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             details: [],
//             images: null,
//         },
//     });

//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: "details",
//     });

//     // Helper function to create a FileList from File array
//     const createFileList = (files: File[]): FileList => {
//         const dataTransfer = new DataTransfer()
//         files.forEach(file => {
//             dataTransfer.items.add(file)
//         })
//         return dataTransfer.files
//     }

//     const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (files && files.length > 0) {
//             const newImages: ImagePreview[] = [];

//             for (let i = 0; i < files.length; i++) {
//                 const file = files[i];
//                 if (file && file.type.startsWith('image/')) {
//                     const imageUrl = URL.createObjectURL(file);
//                     newImages.push({
//                         id: Date.now() + i + Math.random().toString(36),
//                         url: imageUrl,
//                         file: file
//                     });
//                 }
//             }

//             // Add new images to existing ones
//             setSelectedImages(prev => [...prev, ...newImages]);

//             // Update form value with all files
//             const allFiles = [...selectedImages.map(img => img.file), ...newImages.map(img => img.file)]
//             const newFileList = createFileList(allFiles);

//             setValue("images", newFileList);
//             trigger("images");
//         }
//     };

//     const handleRemoveImage = (id: string) => {
//         setSelectedImages(prev => {
//             const imageToRemove = prev.find(img => img.id === id);
//             const newImages = prev.filter(img => img.id !== id);

//             // Clean up URL
//             if (imageToRemove) {
//                 URL.revokeObjectURL(imageToRemove.url);
//             }

//             // Update form value
//             const newFileList = createFileList(newImages.map(img => img.file));
//             setValue("images", newFileList);

//             // Update file input
//             if (fileInputRef.current) {
//                 const dt = new DataTransfer();
//                 newImages.forEach(img => dt.items.add(img.file));
//                 fileInputRef.current.files = dt.files;
//             }

//             trigger("images");

//             return newImages;
//         });
//     };

//     const handleRemoveAllImages = () => {
//         // Clean up URLs
//         selectedImages.forEach(img => URL.revokeObjectURL(img.url));

//         setSelectedImages([]);
//         setValue("images", null);

//         // Reset file input
//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }

//         trigger("images");
//     };

//     const onSubmit = async (data: FormData) => {
//         try {
//             const formData = new FormData();
//             formData.append("name", data.name);

//             // Add all images
//             if (data.images) {
//                 for (let i = 0; i < data.images.length; i++) {
//                     formData.append("images", data.images[i]);
//                 }
//             }

//             // إرسال التفاصيل بالشكل المطلوب
//             data.details.forEach((d, i) => {
//                 formData.append(`details[${i}][key]`, d.key);
//                 formData.append(`details[${i}][value]`, d.value);
//             });

//             const res: any = await addMachine(formData);
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
//     };

//     const resetForm = () => {
//         // Clean up URLs
//         selectedImages.forEach(img => URL.revokeObjectURL(img.url));

//         reset();
//         setSelectedImages([]);

//         if (fileInputRef.current) {
//             fileInputRef.current.value = '';
//         }
//     };

//     const handleClose = () => {
//         resetForm();
//         onOpenChange(false);
//     };

//     return (
//         // <Dialog open={isOpen} onOpenChange={onOpenChange}>
//         //     <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
//         //         <form onSubmit={handleSubmit(onSubmit)}>
//         //             {/* Header */}
//         //             <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//         //                 <div className="flex items-center gap-3">
//         //                     <div className="p-2 bg-white rounded-xl shadow-sm">
//         //                         <Cpu className="h-6 w-6 text-cyan-600" />
//         //                     </div>
//         //                     <div>
//         //                         <DialogTitle className="text-2xl font-bold">
//         //                             Add New Machine
//         //                         </DialogTitle>
//         //                         <p className="text-gray-600 mt-1 text-sm">
//         //                             Add a new machine with specifications and images
//         //                         </p>
//         //                     </div>
//         //                 </div>
//         //             </DialogHeader>

//         //             {/* Content */}
//         //             <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
//         //                 {/* Name Field */}
//         //                 <div className="space-y-3">
//         //                     <div className="flex items-center gap-2">
//         //                         <div className="p-2 bg-cyan-50 rounded-lg">
//         //                             <Tag className="h-4 w-4 text-cyan-600" />
//         //                         </div>
//         //                         <Label className="text-sm font-semibold">
//         //                             Machine Name
//         //                         </Label>
//         //                     </div>
//         //                     <Input
//         //                         id="name"
//         //                         {...register("name")}
//         //                         className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
//         //                         placeholder="Enter machine name..."
//         //                     />
//         //                     {errors.name && (
//         //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//         //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//         //                             {errors.name.message}
//         //                         </div>
//         //                     )}
//         //                 </div>

//         //                 {/* Image Field */}
//         //                 <div className="space-y-3">
//         //                     <div className="flex items-center justify-between">
//         //                         <div className="flex items-center gap-2">
//         //                             <div className="p-2 bg-orange-50 rounded-lg">
//         //                                 <ImageIcon className="h-4 w-4 text-orange-600" />
//         //                             </div>
//         //                             <Label htmlFor="machine-images" className="text-sm font-semibold">
//         //                                 Machine Images
//         //                             </Label>
//         //                         </div>

//         //                         {selectedImages.length > 0 && (
//         //                             <button
//         //                                 type="button"
//         //                                 onClick={handleRemoveAllImages}
//         //                                 className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
//         //                             >
//         //                                 Remove All
//         //                             </button>
//         //                         )}
//         //                     </div>

//         //                     {/* Images Summary */}
//         //                     {selectedImages.length > 0 && (
//         //                         <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
//         //                             <span className="font-medium">{selectedImages.length}</span> image{selectedImages.length !== 1 ? 's' : ''} selected
//         //                         </div>
//         //                     )}

//         //                     {/* Upload Area */}
//         //                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50/30">
//         //                         <Input
//         //                             type="file"
//         //                             id="machine-images"
//         //                             accept="image/*"
//         //                             multiple
//         //                             {...register("images")}
//         //                             onChange={handleImageChange}
//         //                             ref={fileInputRef}
//         //                         // className="hidden"
//         //                         />
//         //                         <label htmlFor="machine-images" className="cursor-pointer block">
//         //                             <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
//         //                             <p className="text-sm font-medium mb-1">
//         //                                 Click to upload images
//         //                             </p>
//         //                             <p className="text-xs text-gray-500">
//         //                                 Supports: PNG, JPG, JPEG • Max: 5MB each • Max: 10 images
//         //                             </p>
//         //                         </label>
//         //                     </div>

//         //                     {/* Images Preview as Carousel */}
//         //                     {selectedImages.length > 0 && (
//         //                         <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
//         //                             <div className="flex items-center justify-between mb-3">
//         //                                 <span className="text-sm font-semibold">Images Preview</span>
//         //                                 <span className="text-xs text-gray-500">
//         //                                     {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
//         //                                 </span>
//         //                             </div>

//         //                             {/* Carousel Component */}
//         //                             <Carousel className="w-full">
//         //                                 <CarouselContent>
//         //                                     {selectedImages.map((image, index) => (
//         //                                         <CarouselItem key={image.id}>
//         //                                             <div className="p-1">
//         //                                                 <Card className="border-0 shadow-none">
//         //                                                     <CardContent className="relative p-0 rounded-lg overflow-hidden aspect-video">
//         //                                                         <img
//         //                                                             src={image.url}
//         //                                                             alt={`Preview ${index + 1}`}
//         //                                                             className="w-full h-full object-cover"
//         //                                                         />
//         //                                                         {/* Delete Button */}
//         //                                                         <button
//         //                                                             type="button"
//         //                                                             onClick={() => handleRemoveImage(image.id)}
//         //                                                             className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
//         //                                                             title="Remove image"
//         //                                                         >
//         //                                                             <X className="h-4 w-4" />
//         //                                                         </button>
//         //                                                         {/* Image Info */}
//         //                                                         <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
//         //                                                             {index + 1} / {selectedImages.length}
//         //                                                         </div>
//         //                                                         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
//         //                                                             <div className="text-white text-xs truncate">
//         //                                                                 {image.file.name}
//         //                                                             </div>
//         //                                                             <div className="text-white/80 text-[10px]">
//         //                                                                 {(image.file.size / 1024 / 1024).toFixed(2)} MB
//         //                                                             </div>
//         //                                                         </div>
//         //                                                     </CardContent>
//         //                                                 </Card>
//         //                                             </div>
//         //                                         </CarouselItem>
//         //                                     ))}
//         //                                 </CarouselContent>

//         //                                 {/* Show navigation only if there are multiple images */}
//         //                                 {selectedImages.length > 1 && (
//         //                                     <>
//         //                                         <CarouselPrevious className="left-2 h-8 w-8" />
//         //                                         <CarouselNext className="right-2 h-8 w-8" />
//         //                                     </>
//         //                                 )}
//         //                             </Carousel>
//         //                         </div>
//         //                     )}

//         //                     {errors.images && (
//         //                         <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//         //                             <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//         //                             {errors.images.message}
//         //                         </div>
//         //                     )}
//         //                 </div>

//         //                 {/* Details Field */}
//         //                 <div className="space-y-3">
//         //                     <div className="flex items-center gap-2">
//         //                         <div className="p-2 bg-green-50 rounded-lg">
//         //                             <Tag className="h-4 w-4 text-green-600" />
//         //                         </div>
//         //                         <Label className="text-sm font-semibold">
//         //                             Machine Specifications
//         //                         </Label>
//         //                     </div>

//         //                     <div className="space-y-3">
//         //                         {fields.map((field, index) => (
//         //                             <div key={field.id} className="flex gap-3 items-start">
//         //                                 <div className="flex-1 space-y-2">
//         //                                     <Input
//         //                                         placeholder="Specification (e.g., Power, Capacity)"
//         //                                         {...register(`details.${index}.key` as const)}
//         //                                         className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
//         //                                     />
//         //                                     {errors.details?.[index]?.key && (
//         //                                         <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
//         //                                     )}
//         //                                 </div>
//         //                                 <div className="flex-1 space-y-2">
//         //                                     <Input
//         //                                         placeholder="Value (e.g., 1500W, 50L)"
//         //                                         {...register(`details.${index}.value` as const)}
//         //                                         className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
//         //                                     />
//         //                                     {errors.details?.[index]?.value && (
//         //                                         <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
//         //                                     )}
//         //                                 </div>
//         //                                 <button
//         //                                     type="button"
//         //                                     onClick={() => remove(index)}
//         //                                     className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1"
//         //                                 >
//         //                                     <X className="h-4 w-4" />
//         //                                 </button>
//         //                             </div>
//         //                         ))}
//         //                     </div>

//         //                     <Button
//         //                         type="button"
//         //                         onClick={() => append({ key: "", value: "" })}
//         //                         variant="outline"
//         //                         className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-lg py-2.5"
//         //                     >
//         //                         <Plus className="h-4 w-4 mr-2" />
//         //                         Add Specification
//         //                     </Button>
//         //                 </div>
//         //             </div>

//         //             {/* Footer */}
//         //             <DialogFooter className="p-6 pt-4 border-t border-gray-100">
//         //                 <Button
//         //                     type="button"
//         //                     variant="outline"
//         //                     onClick={handleClose}
//         //                     disabled={isLoading}
//         //                     className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
//         //                 >
//         //                     <X className="h-4 w-4" />
//         //                     Cancel
//         //                 </Button>
//         //                 <Button
//         //                     type="submit"
//         //                     disabled={isLoading || selectedImages.length === 0}
//         //                     className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
//         //                 >
//         //                     {isLoading ? (
//         //                         <>
//         //                             <Loader className="h-4 w-4 animate-spin" />
//         //                             Adding...
//         //                         </>
//         //                     ) : (
//         //                         <>
//         //                             <Plus className="h-4 w-4" />
//         //                             Add Machine
//         //                         </>
//         //                     )}
//         //                 </Button>
//         //             </DialogFooter>
//         //         </form>
//         //     </DialogContent>
//         // </Dialog>
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[500px] p-0 rounded-2xl overflow-hidden">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <Cpu className="h-6 w-6 text-cyan-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t('machines.add.title')}
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1 text-sm">
//                                     {t('machines.add.subtitle')}
//                                 </p>
//                             </div>
//                         </div>
//                     </DialogHeader>

//                     {/* Content */}
//                     <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-6 p-6">
//                         {/* Name Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-cyan-50 rounded-lg">
//                                     <Tag className="h-4 w-4 text-cyan-600" />
//                                 </div>
//                                 <Label className="text-sm font-semibold">
//                                     {t('machines.add.machineName')}
//                                 </Label>
//                             </div>
//                             <Input
//                                 id="name"
//                                 {...register("name")}
//                                 className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
//                                 placeholder={t('machines.add.machineNamePlaceholder')}
//                             />
//                             {errors.name && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.name.message}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Image Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-orange-50 rounded-lg">
//                                         <ImageIcon className="h-4 w-4 text-orange-600" />
//                                     </div>
//                                     <Label htmlFor="machine-images" className="text-sm font-semibold">
//                                         {t('machines.add.machineImages')}
//                                     </Label>
//                                 </div>

//                                 {selectedImages.length > 0 && (
//                                     <button
//                                         type="button"
//                                         onClick={handleRemoveAllImages}
//                                         className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
//                                     >
//                                         {t('machines.add.removeAll')}
//                                     </button>
//                                 )}
//                             </div>

//                             {/* Images Summary */}
//                             {selectedImages.length > 0 && (
//                                 <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
//                                     <span className="font-medium">{selectedImages.length}</span> image{selectedImages.length !== 1 ? 's' : ''} selected
//                                 </div>
//                             )}

//                             {/* Upload Area */}
//                             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50/30">
//                                 <Input
//                                     type="file"
//                                     id="machine-images"
//                                     accept="image/*"
//                                     multiple
//                                     {...register("images")}
//                                     onChange={handleImageChange}
//                                     ref={fileInputRef}
//                                 // className="hidden"
//                                 />
//                                 <label htmlFor="machine-images" className="cursor-pointer block">
//                                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
//                                     <p className="text-sm font-medium mb-1">
//                                         {t('machines.add.clickToUpload')}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         {t('machines.add.uploadSupport')}
//                                     </p>
//                                 </label>
//                             </div>

//                             {/* Images Preview as Carousel */}
//                             {selectedImages.length > 0 && (
//                                 <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className="text-sm font-semibold">{t('machines.add.imagesPreview')}</span>
//                                         <span className="text-xs text-gray-500">
//                                             {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
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
//                                                                     title={t('machines.add.removeImage')}
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

//                             {errors.images && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.images.message}
//                                 </div>
//                             )}
//                         </div>

//                         {/* Details Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-green-50 rounded-lg">
//                                     <Tag className="h-4 w-4 text-green-600" />
//                                 </div>
//                                 <Label className="text-sm font-semibold">
//                                     {t('machines.add.machineSpecifications')}
//                                 </Label>
//                             </div>

//                             <div className="space-y-3">
//                                 {fields.map((field, index) => (
//                                     <div key={field.id} className="flex gap-3 items-start">
//                                         <div className="flex-1 space-y-2">
//                                             <Input
//                                                 placeholder={t('machines.add.specKeyPlaceholder')}
//                                                 {...register(`details.${index}.key` as const)}
//                                                 className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
//                                             />
//                                             {errors.details?.[index]?.key && (
//                                                 <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
//                                             )}
//                                         </div>
//                                         <div className="flex-1 space-y-2">
//                                             <Input
//                                                 placeholder={t('machines.add.specValuePlaceholder')}
//                                                 {...register(`details.${index}.value` as const)}
//                                                 className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
//                                             />
//                                             {errors.details?.[index]?.value && (
//                                                 <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
//                                             )}
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() => remove(index)}
//                                             className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1"
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>

//                             <Button
//                                 type="button"
//                                 onClick={() => append({ key: "", value: "" })}
//                                 variant="outline"
//                                 className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 rounded-lg py-2.5"
//                             >
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 {t('machines.add.addSpecification')}
//                             </Button>
//                         </div>
//                     </div>

//                     {/* Footer */}
//                     <DialogFooter className="p-6 pt-4 border-t border-gray-100">
//                         <Button
//                             type="button"
//                             variant="outline"
//                             onClick={handleClose}
//                             disabled={isLoading}
//                             className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
//                         >
//                             <X className="h-4 w-4" />
//                             {t('machines.add.cancel')}
//                         </Button>
//                         <Button
//                             type="submit"
//                             disabled={isLoading || selectedImages.length === 0}
//                             className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t('machines.add.adding')}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Plus className="h-4 w-4" />
//                                     {t('machines.add.addMachineBtn')}
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { X, Plus, Upload, Image as ImageIcon, Tag, Cpu, Loader } from "lucide-react";
import { useMachinesPostMutation } from "@/api/feature/machines/postSlice";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

interface ImagePreview {
    id: string
    url: string
    file: File
}

export default function AddMachinePage() {
    const { t } = useTranslation();

    const schema = z.object({
        name: z.string().min(1, t('machines.add.validation.nameRequired')),
        images: z.custom<FileList | null>()
            .refine((files) => files && files.length > 0, t('machines.add.validation.imageRequired'))
            .refine((files) => files && files.length <= 10, t('machines.add.validation.maxImages'))
            .refine((files) => {
                if (!files) return false;
                for (let i = 0; i < files.length; i++) {
                    if (files[i]?.size > 5 * 1024 * 1024) return false;
                }
                return true
            }, t('machines.add.validation.imageSize'))
            .refine((files) => {
                if (!files) return false;
                for (let i = 0; i < files.length; i++) {
                    if (!files[i]?.type.startsWith('image/')) return false;
                }
                return true
            }, t('machines.add.validation.imageType')),
        details: z.array(z.object({
            key: z.string().min(1, t('machines.add.validation.keyRequired')),
            value: z.string().min(1, t('machines.add.validation.valueRequired')),
        })),
    });

    type FormData = z.infer<typeof schema>;

    const [selectedImages, setSelectedImages] = useState<ImagePreview[]>([]);
    const [addMachine, { isLoading }] = useMachinesPostMutation();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, control, reset, setValue, trigger, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { details: [], images: null }
    });

    const { fields, append, remove } = useFieldArray({ control, name: "details" });

    const createFileList = (files: File[]): FileList => {
        const dataTransfer = new DataTransfer()
        files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const newImages: ImagePreview[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (file.type.startsWith('image/')) {
                    newImages.push({ id: Date.now() + i + Math.random().toString(36), url: URL.createObjectURL(file), file });
                }
            }
            setSelectedImages(prev => [...prev, ...newImages]);
            const allFiles = [...selectedImages.map(img => img.file), ...newImages.map(img => img.file)];
            setValue("images", createFileList(allFiles));
            trigger("images");
        }
    }

    const handleRemoveImage = (id: string) => {
        setSelectedImages(prev => {
            const imageToRemove = prev.find(img => img.id === id);
            const newImages = prev.filter(img => img.id !== id);
            if (imageToRemove) URL.revokeObjectURL(imageToRemove.url);
            setValue("images", createFileList(newImages.map(img => img.file)));
            if (fileInputRef.current) {
                const dt = new DataTransfer();
                newImages.forEach(img => dt.items.add(img.file));
                fileInputRef.current.files = dt.files;
            }
            trigger("images");
            return newImages;
        });
    }

    const handleRemoveAllImages = () => {
        selectedImages.forEach(img => URL.revokeObjectURL(img.url));
        setSelectedImages([]);
        setValue("images", null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        trigger("images");
    }
    const navigate = useNavigate();
    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            if (data.images) for (let i = 0; i < data.images.length; i++) formData.append("images", data.images[i]);
            data.details.forEach((d, i) => {
                formData.append(`details[${i}][key]`, d.key);
                formData.append(`details[${i}][value]`, d.value);
            });
            const res: any = await addMachine(formData);
            const result = handleApiResponse(res);
            if (result.success) {
                toast.success(result.error);
                resetForm();
                navigate(-1)
            } else toast.error(result.error);
        } catch (error: any) {
            toast.error(error.error);
        }
    }

    const resetForm = () => {
        selectedImages.forEach(img => URL.revokeObjectURL(img.url));
        reset();
        setSelectedImages([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3">
            <h1 className="text-2xl font-bold flex items-center gap-2"><Cpu className="h-6 w-6 text-cyan-600" /> {t('machines.add.title')}</h1>
            <p className="text-gray-600">{t('machines.add.subtitle')}</p>

            <form onSubmit={handleSubmit(onSubmit)} className="p-2 border rounded-2xl">
                {/* -------------------- Name Field -------------------- */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-cyan-50 rounded-lg">
                            <Tag className="h-4 w-4 text-cyan-600" />
                        </div>
                        <Label className="text-sm font-semibold">
                            {t('machines.add.machineName')}
                        </Label>
                    </div>
                    <Input
                        id="name"
                        {...register("name")}
                        className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
                        placeholder={t('machines.add.machineNamePlaceholder')}
                    />
                    {errors.name && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            {errors.name.message}
                        </div>
                    )}
                </div>

                {/* -------------------- Images Field -------------------- */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-orange-50 rounded-lg">
                                <ImageIcon className="h-4 w-4 text-orange-600" />
                            </div>
                            <Label htmlFor="machine-images" className="text-sm font-semibold">
                                {t('machines.add.machineImages')}
                            </Label>
                        </div>

                        {selectedImages.length > 0 && (
                            <button
                                type="button"
                                onClick={handleRemoveAllImages}
                                className="text-xs text-red-600 hover:text-red-700 transition-colors duration-200 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
                            >
                                {t('machines.add.removeAll')}
                            </button>
                        )}
                    </div>

                    {selectedImages.length > 0 && (
                        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                            <span className="font-medium">{selectedImages.length}</span> image{selectedImages.length !== 1 ? 's' : ''} selected
                        </div>
                    )}

                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-cyan-400 hover:bg-cyan-50/30">
                        <Input
                            type="file"
                            id="machine-images"
                            accept="image/*"
                            multiple
                            {...register("images")}
                            onChange={handleImageChange}
                            ref={fileInputRef}
                        />
                        <label htmlFor="machine-images" className="cursor-pointer block">
                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                            <p className="text-sm font-medium mb-1">{t('machines.add.clickToUpload')}</p>
                            <p className="text-xs text-gray-500">{t('machines.add.uploadSupport')}</p>
                        </label>
                    </div>

                    {selectedImages.length > 0 && (
                        <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold">{t('machines.add.imagesPreview')}</span>
                                <span className="text-xs text-gray-500">
                                    {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
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
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveImage(image.id)}
                                                            className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                                                            title={t('machines.add.removeImage')}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                        <div className="absolute top-0 left-0 bg-black/60 text-white text-xs px-2 py-1 rounded-br-lg">
                                                            {index + 1} / {selectedImages.length}
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                                            <div className="text-white text-xs truncate">{image.file.name}</div>
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
                                {selectedImages.length > 1 && (
                                    <>
                                        <CarouselPrevious className="left-2 h-8 w-8" />
                                        <CarouselNext className="right-2 h-8 w-8" />
                                    </>
                                )}
                            </Carousel>
                        </div>
                    )}

                    {errors.images && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                            {errors.images.message}
                        </div>
                    )}
                </div>

                {/* -------------------- Details Field -------------------- */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-green-50 rounded-lg">
                            <Tag className="h-4 w-4 text-green-600" />
                        </div>
                        <Label className="text-sm font-semibold">{t('machines.add.machineSpecifications')}</Label>
                    </div>

                    <div className="space-y-3">
                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-3 items-start">
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder={t('machines.add.specKeyPlaceholder')}
                                        {...register(`details.${index}.key` as const)}
                                        className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
                                    />
                                    {errors.details?.[index]?.key && (
                                        <p className="text-red-500 text-xs">{errors.details[index]?.key?.message}</p>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Input
                                        placeholder={t('machines.add.specValuePlaceholder')}
                                        {...register(`details.${index}.value` as const)}
                                        className="border-gray-300 focus:border-cyan-500 focus:ring-cyan-500 transition-colors duration-200 rounded-lg"
                                    />
                                    {errors.details?.[index]?.value && (
                                        <p className="text-red-500 text-xs">{errors.details[index]?.value?.message}</p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 mt-1"
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
                        className="w-full border-dashed border-gray-300 text-gray-600  transition-all duration-200 rounded-lg py-2.5"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        {t('machines.add.addSpecification')}
                    </Button>
                </div>

                {/* -------------------- Submit Button -------------------- */}
                <div className="flex justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                        disabled={isLoading}
                        className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                    >
                        <X className="h-4 w-4" />
                        {t('machines.add.cancel')}
                    </Button>

                    <Button
                        type="submit"
                        disabled={isLoading || selectedImages.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <Loader className="h-4 w-4 animate-spin" />
                                {t('machines.add.adding')}
                            </>
                        ) : (
                            <>
                                <Plus className="h-4 w-4" />
                                {t('machines.add.addMachineBtn')}
                            </>
                        )}
                    </Button>
                </div>
            </form>

        </div>
    )
}
