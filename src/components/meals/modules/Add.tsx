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
// import {
//     Select,
//     SelectTrigger,
//     SelectValue,
//     SelectContent,
//     SelectGroup,
//     SelectItem,
// } from "@/components/ui/select";
// import { Controller, useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { toast } from "react-toastify";
// import {
//     X,
//     Plus,
//     Upload,
//     Image as ImageIcon,
//     Tag,
//     Utensils,
//     ChefHat,
//     Loader,
//     Video,
//     GripVertical,
//     Trash2,
//     ArrowUp,
//     ArrowDown,
// } from "lucide-react";

// import { useFilterIngredientsQuery } from "@/api/feature/Ingredients/getSlice";
// import { useMealsPostMutation } from "@/api/feature/meals/postSlice";
// import { useFilterCategoryMealQuery } from "@/api/feature/mealCategories/getSlice";
// import { handleApiResponse } from "@/hooks/apiErrorHandler";
// import { useTranslation } from "react-i18next";

// interface AddMealProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
// }



// export default function AddMeal({ isOpen, onOpenChange }: AddMealProps) {
//     const { t } = useTranslation()
//     // const schema = z.object({
//     //     name: z.string().min(1, "Name is required"),
//     //     description: z.string().min(1, "Description is required"),
//     //     mealCategoryId: z.string().min(1, "Category is required"),
//     //     images: z
//     //         .array(
//     //             z.object({
//     //                 image: z.instanceof(File),
//     //                 index: z.number().min(0),
//     //             })
//     //         )
//     //         .min(1, "At least one image is required")
//     //         .refine(
//     //             (images) =>
//     //                 images.every(
//     //                     (img) => img.image.size <= 5 * 1024 * 1024 // 5MB
//     //                 ),
//     //             "Max 5MB per image"
//     //         )
//     //         .refine(
//     //             (images) =>
//     //                 images.every((img) =>
//     //                     ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
//     //                         img.image.type
//     //                     )
//     //                 ),
//     //             "Only JPEG, PNG, JPG, WEBP images are allowed"
//     //         ),
//     //     videos: z
//     //         .array(z.instanceof(File))
//     //         .optional()
//     //         .refine(
//     //             (videos) =>
//     //                 !videos ||
//     //                 videos.every((vid) => vid.size <= 50 * 1024 * 1024), // 50MB
//     //             "Max 50MB per video"
//     //         ),
//     //     ingredients: z.array(
//     //         z.object({
//     //             ingredientId: z.string().min(1, "Ingredient required"),
//     //             quantity: z.number().min(1, "Quantity required"),
//     //         })
//     //     ),
//     // });
//     // Schema التعديل لدعم الصور والفيديوهات المتعددة
//     const schema = z.object({
//         name: z.string().min(1, t("meals.add.nameRequired")),
//         description: z.string().min(1, t("meals.add.descriptionRequired")),
//         mealCategoryId: z.string().min(1, t("meals.add.categoryRequired")),
//         images: z
//             .array(
//                 z.object({
//                     image: z.instanceof(File),
//                     index: z.number().min(0),
//                 })
//             )
//             .min(1, t("meals.add.imagesRequired"))
//             .refine(
//                 (images) =>
//                     images.every(
//                         (img) => img.image.size <= 5 * 1024 * 1024 // 5MB
//                     ),
//                 t("meals.add.imageSize")
//             )
//             .refine(
//                 (images) =>
//                     images.every((img) =>
//                         ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
//                             img.image.type
//                         )
//                     ),
//                 t("meals.add.imageType")
//             ),
//         videos: z
//             .array(z.instanceof(File))
//             .optional()
//             .refine(
//                 (videos) =>
//                     !videos ||
//                     videos.every((vid) => vid.size <= 50 * 1024 * 1024), // 50MB
//                 t("meals.add.videoSize")
//             ),
//         ingredients: z.array(
//             z.object({
//                 ingredientId: z.string().min(1, t("meals.add.ingredientRequired")),
//                 quantity: z.number().min(1, t("meals.add.quantityRequired")),
//             })
//         ),
//     });
//     type FormData = z.infer<typeof schema>;
//     const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
//     const [videosPreviews, setVideosPreviews] = useState<string[]>([]);
//     const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

//     const imageInputRef = useRef<HTMLInputElement>(null);
//     const videoInputRef = useRef<HTMLInputElement>(null);

//     const { data: ingredientsData, isLoading: isLoadingIngredients } =
//         useFilterIngredientsQuery({ page: 1, size: 50 });
//     const ingredients = ingredientsData?.data?.values || [];

//     const { data: categoriesData, isLoading: isLoadingCategories } =
//         useFilterCategoryMealQuery({ page: 1, size: 50 });
//     const categories = categoriesData?.data?.values || [];

//     const [addMeal, { isLoading }] = useMealsPostMutation();

//     const {
//         register,
//         handleSubmit,
//         control,
//         reset,
//         setValue,
//         watch,
//         formState: { errors },
//     } = useForm<FormData>({
//         resolver: zodResolver(schema),
//         defaultValues: {
//             name: "",
//             description: "",
//             mealCategoryId: "",
//             images: [],
//             videos: [],
//             ingredients: [],
//         },
//     });

//     const {
//         fields: ingredientFields,
//         append: appendIngredient,
//         remove: removeIngredient,
//     } = useFieldArray({ control, name: "ingredients" });

//     const {
//         fields: imageFields,
//         append: appendImage,
//         remove: removeImage,
//         update: updateImage,
//     } = useFieldArray({ control, name: "images" });

//     const watchVideos = watch("videos") || [];

//     // Handle image files
//     const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files) return;

//         const newImages: File[] = Array.from(files);
//         const newPreviews: string[] = [];

//         // Create preview URLs
//         newImages.forEach((file) => {
//             const previewUrl = URL.createObjectURL(file);
//             newPreviews.push(previewUrl);
//         });

//         // Add images with index
//         const currentLength = imageFields.length;
//         const imagesWithIndex = newImages.map((file, idx) => ({
//             image: file,
//             index: currentLength + idx,
//         }));

//         appendImage(imagesWithIndex);
//         setImagesPreviews((prev) => [...prev, ...newPreviews]);

//         // Reset input
//         if (imageInputRef.current) {
//             imageInputRef.current.value = "";
//         }
//     };

//     // Handle video files
//     const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files) return;

//         const newVideos: File[] = Array.from(files);
//         const newPreviews: string[] = [];

//         // Create preview URLs for videos
//         newVideos.forEach((file) => {
//             const previewUrl = URL.createObjectURL(file);
//             newPreviews.push(previewUrl);
//         });

//         // Add videos to form
//         const currentVideos = watchVideos;
//         setValue("videos", [...currentVideos, ...newVideos]);
//         setVideosPreviews((prev) => [...prev, ...newPreviews]);

//         // Reset input
//         if (videoInputRef.current) {
//             videoInputRef.current.value = "";
//         }
//     };

//     // Handle drag and drop for images manually
//     const handleDragStart = (index: number) => {
//         setDraggedImageIndex(index);
//     };
//     // @ts-ignore
//     const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
//         e.preventDefault();
//     };

//     const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
//         e.preventDefault();
//         if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

//         // Reorder images and previews
//         const newImages = [...imageFields];
//         const newPreviews = [...imagesPreviews];

//         const draggedImage = newImages[draggedImageIndex];
//         const draggedPreview = newPreviews[draggedImageIndex];

//         // Remove dragged item
//         newImages.splice(draggedImageIndex, 1);
//         newPreviews.splice(draggedImageIndex, 1);

//         // Insert at target position
//         newImages.splice(targetIndex, 0, draggedImage);
//         newPreviews.splice(targetIndex, 0, draggedPreview);

//         // Update form with new order and indices
//         newImages.forEach((_, index) => {
//             updateImage(index, {
//                 ...newImages[index],
//                 index: index,
//             });
//         });

//         setImagesPreviews(newPreviews);
//         setDraggedImageIndex(null);
//     };

//     const handleDragEnd = () => {
//         setDraggedImageIndex(null);
//     };

//     // Move image up
//     const moveImageUp = (index: number) => {
//         if (index === 0) return;

//         const newImages = [...imageFields];
//         const newPreviews = [...imagesPreviews];

//         // Swap with previous item
//         [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
//         [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];

//         // Update form with new order and indices
//         newImages.forEach((_, idx) => {
//             updateImage(idx, {
//                 ...newImages[idx],
//                 index: idx,
//             });
//         });

//         setImagesPreviews(newPreviews);
//     };

//     // Move image down
//     const moveImageDown = (index: number) => {
//         if (index === imageFields.length - 1) return;

//         const newImages = [...imageFields];
//         const newPreviews = [...imagesPreviews];

//         // Swap with next item
//         [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
//         [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];

//         // Update form with new order and indices
//         newImages.forEach((_, idx) => {
//             updateImage(idx, {
//                 ...newImages[idx],
//                 index: idx,
//             });
//         });

//         setImagesPreviews(newPreviews);
//     };

//     const removeImageItem = (index: number) => {
//         removeImage(index);
//         // Revoke object URL to prevent memory leaks
//         if (imagesPreviews[index]) {
//             URL.revokeObjectURL(imagesPreviews[index]);
//         }
//         setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
//     };

//     const removeVideoItem = (index: number) => {
//         const newVideos = [...watchVideos];
//         const newPreviews = [...videosPreviews];

//         // Revoke object URL
//         if (videosPreviews[index]) {
//             URL.revokeObjectURL(videosPreviews[index]);
//         }

//         newVideos.splice(index, 1);
//         newPreviews.splice(index, 1);

//         setValue("videos", newVideos);
//         setVideosPreviews(newPreviews);
//     };

//     const resetForm = () => {
//         reset();
//         // Clean up all object URLs
//         imagesPreviews.forEach((url) => URL.revokeObjectURL(url));
//         videosPreviews.forEach((url) => URL.revokeObjectURL(url));
//         setImagesPreviews([]);
//         setVideosPreviews([]);
//         setDraggedImageIndex(null);
//     };

//     const handleClose = () => {
//         resetForm();
//         onOpenChange(false);
//     };

//     const onSubmit = async (data: FormData) => {
//         try {
//             const formData = new FormData();

//             formData.append("name", data.name);
//             formData.append("description", data.description);
//             formData.append("mealCategoryId", data.mealCategoryId);

//             // images
//             data.images.forEach((img, index) => {
//                 formData.append(`images[${index}].index`, index.toString());
//                 formData.append(`images[${index}].image`, img.image); // File
//             });

//             // videos
//             data.videos?.forEach((video) => {
//                 formData.append("videos", video); // array of files
//             });

//             // ingredients
//             data.ingredients.forEach((i, index) => {
//                 formData.append(
//                     `ingredients[${index}].ingredientId`,
//                     i.ingredientId
//                 );
//                 formData.append(
//                     `ingredients[${index}].quantity`,
//                     i.quantity.toString()
//                 );
//             });


//             const res = await addMeal(formData);
//             const result = handleApiResponse(res);

//             if (result.success) {
//                 toast.success("Meal added successfully!");
//                 resetForm();
//                 onOpenChange(false);
//             } else {
//                 toast.error(result.error || "Failed to add meal");
//             }
//         } catch (error: any) {
//             toast.error(error?.error || "An error occurred");
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-[600px] p-0 rounded-2xl overflow-hidden">
//                 <form onSubmit={handleSubmit(onSubmit)}>
//                     {/* Header */}
//                     <DialogHeader className="p-6 pb-4 border-b border-gray-100">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-white rounded-xl shadow-sm">
//                                 <ChefHat className="h-6 w-6 text-orange-600" />
//                             </div>
//                             <div>
//                                 <DialogTitle className="text-2xl font-bold">
//                                     {t("meals.add.title")}
//                                 </DialogTitle>
//                                 <p className="text-gray-600 mt-1 text-sm">
//                                     {t("meals.add.subtitle")}
//                                 </p>
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
//                                     {t("meals.add.categoryLabel")}
//                                 </Label>
//                             </div>
//                             <Controller
//                                 name="mealCategoryId"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <Select
//                                         value={field.value}
//                                         onValueChange={field.onChange}
//                                         disabled={isLoadingCategories}
//                                     >
//                                         <SelectTrigger className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
//                                             <SelectValue
//                                                 placeholder={
//                                                     isLoadingCategories
//                                                         ? t("meals.add.loadingCategories")
//                                                         : t("meals.add.selectCategory")
//                                                 }
//                                             />
//                                         </SelectTrigger>
//                                         <SelectContent className="rounded-lg">
//                                             <SelectGroup>
//                                                 {isLoadingCategories ? (
//                                                     <SelectItem
//                                                         value="loading"
//                                                         disabled
//                                                     >
//                                                         {t("meals.add.loadingCategories")}
//                                                     </SelectItem>
//                                                 ) : categories.length > 0 ? (
//                                                     categories.map((c: any) => (
//                                                         <SelectItem
//                                                             key={c.id}
//                                                             value={c.id}
//                                                             className="focus:bg-orange-50 focus:text-orange-600 rounded-md"
//                                                         >
//                                                             {c.name}
//                                                         </SelectItem>
//                                                     ))
//                                                 ) : (
//                                                     <SelectItem
//                                                         value="no-data"
//                                                         disabled
//                                                     >
//                                                         {t("meals.add.noCategories")}
//                                                     </SelectItem>
//                                                 )}
//                                             </SelectGroup>
//                                         </SelectContent>
//                                     </Select>
//                                 )}
//                             />
//                             {errors.mealCategoryId && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.mealCategoryId.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Name Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-orange-50 rounded-lg">
//                                     <Tag className="h-4 w-4 text-orange-600" />
//                                 </div>
//                                 <Label className="text-sm font-semibold">
//                                     {t("meals.add.nameLabel")}
//                                 </Label>
//                             </div>
//                             <Input
//                                 id="name"
//                                 {...register("name")}
//                                 className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg"
//                                 placeholder={t("meals.add.namePlaceholder")}
//                             />
//                             {errors.name && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.name.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Description Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center gap-2">
//                                 <div className="p-2 bg-blue-50 rounded-lg">
//                                     <Utensils className="h-4 w-4 text-blue-600" />
//                                 </div>
//                                 <Label className="text-sm font-semibold">
//                                     {t("meals.add.descriptionLabel")}
//                                 </Label>
//                             </div>
//                             <Input
//                                 id="description"
//                                 {...register("description")}
//                                 className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg"
//                                 placeholder={t("meals.add.descriptionPlaceholder")}
//                             />
//                             {errors.description && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.description.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Images Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-green-50 rounded-lg">
//                                         <ImageIcon className="h-4 w-4 text-green-600" />
//                                     </div>
//                                     <Label className="text-sm font-semibold">
//                                         {t("meals.add.imagesLabel")}
//                                     </Label>
//                                 </div>
//                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                                     {t("meals.add.imagesAdded", { count: imageFields.length })}
//                                 </span>
//                             </div>

//                             {/* Upload Area */}
//                             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-orange-400 hover:bg-orange-50/30">
//                                 <Input
//                                     type="file"
//                                     id="images"
//                                     accept="image/*"
//                                     multiple
//                                     onChange={handleImagesChange}
//                                     ref={imageInputRef}
//                                 />
//                                 <label
//                                     htmlFor="images"
//                                     className="cursor-pointer block"
//                                 >
//                                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
//                                     <p className="text-sm font-medium mb-1">
//                                         {t("meals.add.clickToUploadImages")}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         {t("meals.add.imagesUploadHelp")}
//                                     </p>
//                                 </label>
//                             </div>

//                             {/* Images List with Manual Reordering */}
//                             {imageFields.length > 0 && (
//                                 <div className="mt-4">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className="text-sm font-semibold">
//                                             {t("meals.add.imagesCount", { count: imageFields.length })}
//                                         </span>
//                                         <span className="text-xs text-gray-500">
//                                             {t("meals.add.dragToReorder")}
//                                         </span>
//                                     </div>
//                                     <div className="space-y-3">
//                                         {imageFields.map((field, index) => (
//                                             <div
//                                                 key={field.id}
//                                                 draggable
//                                                 onDragStart={() => handleDragStart(index)}
//                                                 onDragOver={(e) => handleDragOver(e, index)}
//                                                 onDrop={(e) => handleDrop(e, index)}
//                                                 onDragEnd={handleDragEnd}
//                                                 className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${draggedImageIndex === index
//                                                     ? "border-orange-500 shadow-lg"
//                                                     : "border-gray-200"
//                                                     } transition-all duration-200`}
//                                             >
//                                                 {/* Drag Handle */}
//                                                 <div
//                                                     className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
//                                                     title={t("meals.add.dragToReorder")}
//                                                 >
//                                                     <GripVertical className="h-5 w-5" />
//                                                 </div>

//                                                 {/* Image Preview */}
//                                                 <div className="flex-1 flex items-center gap-3">
//                                                     <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
//                                                         <img
//                                                             src={imagesPreviews[index]}
//                                                             alt={`Meal image ${index + 1}`}
//                                                             className="w-full h-full object-cover"
//                                                         />
//                                                         <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
//                                                             {index + 1}
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex-1">
//                                                         <p className="text-sm font-medium">
//                                                             {field.image.name}
//                                                         </p>
//                                                         <p className="text-xs text-gray-500">
//                                                             {(field.image.size / 1024 / 1024).toFixed(2)} MB •{" "}
//                                                             {field.image.type}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 {/* Move Buttons */}
//                                                 <div className="flex flex-col gap-1">
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => moveImageUp(index)}
//                                                         disabled={index === 0}
//                                                         className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
//                                                         title={t("meals.add.moveUp")}
//                                                     >
//                                                         <ArrowUp className="h-4 w-4" />
//                                                     </button>
//                                                     <button
//                                                         type="button"
//                                                         onClick={() => moveImageDown(index)}
//                                                         disabled={index === imageFields.length - 1}
//                                                         className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
//                                                         title={t("meals.add.moveDown")}
//                                                     >
//                                                         <ArrowDown className="h-4 w-4" />
//                                                     </button>
//                                                 </div>

//                                                 {/* Remove Button */}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeImageItem(index)}
//                                                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                                                     title={t("meals.add.removeImage")}
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                             {errors.images && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.images.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Videos Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-blue-50 rounded-lg">
//                                         <Video className="h-4 w-4 text-blue-600" />
//                                     </div>
//                                     <Label className="text-sm font-semibold">
//                                         {t("meals.add.videosLabel")}
//                                     </Label>
//                                 </div>
//                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                                     {t("meals.add.imagesAdded", { count: watchVideos.length })}
//                                 </span>
//                             </div>

//                             {/* Upload Area */}
//                             <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
//                                 <Input
//                                     type="file"
//                                     id="videos"
//                                     accept="video/*"
//                                     multiple
//                                     onChange={handleVideosChange}
//                                     ref={videoInputRef}
//                                 />
//                                 <label
//                                     htmlFor="videos"
//                                     className="cursor-pointer block"
//                                 >
//                                     <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
//                                     <p className="text-sm font-medium mb-1">
//                                         {t("meals.add.clickToUploadVideos")}
//                                     </p>
//                                     <p className="text-xs text-gray-500">
//                                         {t("meals.add.videosUploadHelp")}
//                                     </p>
//                                 </label>
//                             </div>

//                             {/* Videos List */}
//                             {watchVideos.length > 0 && (
//                                 <div className="mt-4">
//                                     <div className="flex items-center justify-between mb-3">
//                                         <span className="text-sm font-semibold">
//                                             {t("meals.add.videosCount", { count: watchVideos.length })}
//                                         </span>
//                                     </div>
//                                     <div className="space-y-3">
//                                         {watchVideos.map((video, index) => (
//                                             <div
//                                                 key={index}
//                                                 className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
//                                             >
//                                                 {/* Video Preview */}
//                                                 <div className="flex-1 flex items-center gap-3">
//                                                     <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
//                                                         <Video className="h-6 w-6 text-gray-400" />
//                                                         <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
//                                                             {index + 1}
//                                                         </div>
//                                                     </div>
//                                                     <div className="flex-1">
//                                                         <p className="text-sm font-medium">
//                                                             {video.name}
//                                                         </p>
//                                                         <p className="text-xs text-gray-500">
//                                                             {(video.size / 1024 / 1024).toFixed(2)} MB •{" "}
//                                                             {video.type}
//                                                         </p>
//                                                     </div>
//                                                 </div>

//                                                 {/* Remove Button */}
//                                                 <button
//                                                     type="button"
//                                                     onClick={() => removeVideoItem(index)}
//                                                     className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
//                                                     title={t("meals.add.removeVideo")}
//                                                 >
//                                                     <Trash2 className="h-4 w-4" />
//                                                 </button>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                             {errors.videos && (
//                                 <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
//                                     <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
//                                     {errors.videos.message}
//                                 </div>
//                             )}
//                         </div>
//                         {/* Ingredients Field */}
//                         <div className="space-y-3">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-2">
//                                     <div className="p-2 bg-red-50 rounded-lg">
//                                         <Utensils className="h-4 w-4 text-red-600" />
//                                     </div>
//                                     <Label className="text-sm font-semibold">
//                                         {t("meals.add.ingredientsLabel")}
//                                     </Label>
//                                 </div>
//                                 <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
//                                     {t("meals.add.imagesAdded", { count: ingredientFields.length })}
//                                 </span>
//                             </div>

//                             <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
//                                 {ingredientFields.map((field, index) => (
//                                     <div
//                                         key={field.id}
//                                         className="flex gap-3 items-start group"
//                                     >
//                                         <div className="flex-1">
//                                             <Controller
//                                                 name={`ingredients.${index}.ingredientId`}
//                                                 control={control}
//                                                 render={({ field }) => (
//                                                     <Select
//                                                         value={field.value}
//                                                         onValueChange={
//                                                             field.onChange
//                                                         }
//                                                         disabled={
//                                                             isLoadingIngredients
//                                                         }
//                                                     >
//                                                         <SelectTrigger className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
//                                                             <SelectValue
//                                                                 placeholder={
//                                                                     isLoadingIngredients
//                                                                         ? t("meals.add.loadingIngredients")
//                                                                         : t("meals.add.selectIngredient")
//                                                                 }
//                                                             />
//                                                         </SelectTrigger>
//                                                         <SelectContent className="rounded-lg">
//                                                             <SelectGroup>
//                                                                 {isLoadingIngredients ? (
//                                                                     <SelectItem
//                                                                         value="loading"
//                                                                         disabled
//                                                                     >
//                                                                         {t("meals.add.loadingIngredients")}
//                                                                     </SelectItem>
//                                                                 ) : ingredients.length >
//                                                                     0 ? (
//                                                                     ingredients.map(
//                                                                         (
//                                                                             ing: any
//                                                                         ) => (
//                                                                             <SelectItem
//                                                                                 key={
//                                                                                     ing.id
//                                                                                 }
//                                                                                 value={
//                                                                                     ing.id
//                                                                                 }
//                                                                                 className="focus:bg-orange-50 focus:text-orange-600 rounded-md"
//                                                                             >
//                                                                                 {
//                                                                                     ing.name
//                                                                                 }
//                                                                             </SelectItem>
//                                                                         )
//                                                                     )
//                                                                 ) : (
//                                                                     <SelectItem
//                                                                         value="no-data"
//                                                                         disabled
//                                                                     >
//                                                                         {t("meals.add.noIngredients")}
//                                                                     </SelectItem>
//                                                                 )}
//                                                             </SelectGroup>
//                                                         </SelectContent>
//                                                     </Select>
//                                                 )}
//                                             />
//                                             {errors.ingredients?.[index]
//                                                 ?.ingredientId && (
//                                                     <p className="text-red-500 text-xs mt-1">
//                                                         {
//                                                             errors.ingredients[
//                                                                 index
//                                                             ]?.ingredientId?.message
//                                                         }
//                                                     </p>
//                                                 )}
//                                         </div>
//                                         <div className="w-24">
//                                             <Input
//                                                 type="number"
//                                                 placeholder={t("meals.add.quantityPlaceholder")}
//                                                 {...register(
//                                                     `ingredients.${index}.quantity`,
//                                                     { valueAsNumber: true }
//                                                 )}
//                                                 className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg"
//                                             />
//                                             {errors.ingredients?.[index]
//                                                 ?.quantity && (
//                                                     <p className="text-red-500 text-xs mt-1">
//                                                         {
//                                                             errors.ingredients[
//                                                                 index
//                                                             ]?.quantity?.message
//                                                         }
//                                                     </p>
//                                                 )}
//                                         </div>
//                                         <button
//                                             type="button"
//                                             onClick={() =>
//                                                 removeIngredient(index)
//                                             }
//                                             className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-1"
//                                         >
//                                             <X className="h-4 w-4" />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>

//                             <Button
//                                 type="button"
//                                 onClick={() =>
//                                     appendIngredient({
//                                         ingredientId: "",
//                                         quantity: 1,
//                                     })
//                                 }
//                                 variant="outline"
//                                 className="w-full border-dashed border-gray-300 transition-all duration-200 rounded-lg py-2.5"
//                             >
//                                 <Plus className="h-4 w-4 mr-2" />
//                                 {t("meals.add.addIngredient")}
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
//                             {t("meals.add.cancel")}
//                         </Button>
//                         <Button
//                             type="submit"
//                             disabled={isLoading}
//                             className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
//                         >
//                             {isLoading ? (
//                                 <>
//                                     <Loader className="h-4 w-4 animate-spin" />
//                                     {t("meals.add.adding")}
//                                 </>
//                             ) : (
//                                 <>
//                                     <Plus className="h-4 w-4" />
//                                     {t("meals.add.add")}
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
import {
    DialogFooter
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
import {
    X,
    Plus,
    Upload,
    Image as ImageIcon,
    Tag,
    Utensils,
    ChefHat,
    Loader,
    Video,
    GripVertical,
    Trash2,
    ArrowUp,
    ArrowDown,
} from "lucide-react";

import { useFilterIngredientsQuery } from "@/api/feature/Ingredients/getSlice";
import { useMealsPostMutation } from "@/api/feature/meals/postSlice";
import { useFilterCategoryMealQuery } from "@/api/feature/mealCategories/getSlice";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

// interface AddMealProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
// }



export default function AddMealPage() {
    const navigate = useNavigate();
    const { t } = useTranslation()
    const schema = z.object({
        name: z.string().min(1, t("meals.add.nameRequired")),
        description: z.string().min(1, t("meals.add.descriptionRequired")),
        mealCategoryId: z.string().min(1, t("meals.add.categoryRequired")),
        images: z
            .array(
                z.object({
                    image: z.instanceof(File),
                    index: z.number().min(0),
                })
            )
            .min(1, t("meals.add.imagesRequired"))
            .refine(
                (images) =>
                    images.every(
                        (img) => img.image.size <= 5 * 1024 * 1024 // 5MB
                    ),
                t("meals.add.imageSize")
            )
            .refine(
                (images) =>
                    images.every((img) =>
                        ["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(
                            img.image.type
                        )
                    ),
                t("meals.add.imageType")
            ),
        videos: z
            .array(z.instanceof(File))
            .optional()
            .refine(
                (videos) =>
                    !videos ||
                    videos.every((vid) => vid.size <= 50 * 1024 * 1024), // 50MB
                t("meals.add.videoSize")
            ),
        ingredients: z.array(
            z.object({
                ingredientId: z.string().min(1, t("meals.add.ingredientRequired")),
                quantity: z.number().min(1, t("meals.add.quantityRequired")),
            })
        ),
    });
    type FormData = z.infer<typeof schema>;
    const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
    const [videosPreviews, setVideosPreviews] = useState<string[]>([]);
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const { data: ingredientsData, isLoading: isLoadingIngredients } =
        useFilterIngredientsQuery({ page: 1, size: 50 });
    const ingredients = ingredientsData?.data?.values || [];

    const { data: categoriesData, isLoading: isLoadingCategories } =
        useFilterCategoryMealQuery({ page: 1, size: 50 });
    const categories = categoriesData?.data?.values || [];

    const [addMeal, { isLoading }] = useMealsPostMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            description: "",
            mealCategoryId: "",
            images: [],
            videos: [],
            ingredients: [],
        },
    });

    const {
        fields: ingredientFields,
        append: appendIngredient,
        remove: removeIngredient,
    } = useFieldArray({ control, name: "ingredients" });

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
        update: updateImage,
    } = useFieldArray({ control, name: "images" });

    const watchVideos = watch("videos") || [];

    // Handle image files
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: File[] = Array.from(files);
        const newPreviews: string[] = [];

        // Create preview URLs
        newImages.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push(previewUrl);
        });

        // Add images with index
        const currentLength = imageFields.length;
        const imagesWithIndex = newImages.map((file, idx) => ({
            image: file,
            index: currentLength + idx,
        }));

        appendImage(imagesWithIndex);
        setImagesPreviews((prev) => [...prev, ...newPreviews]);

        // Reset input
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // Handle video files
    const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newVideos: File[] = Array.from(files);
        const newPreviews: string[] = [];

        // Create preview URLs for videos
        newVideos.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push(previewUrl);
        });

        // Add videos to form
        const currentVideos = watchVideos;
        setValue("videos", [...currentVideos, ...newVideos]);
        setVideosPreviews((prev) => [...prev, ...newPreviews]);

        // Reset input
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    // Handle drag and drop for images manually
    const handleDragStart = (index: number) => {
        setDraggedImageIndex(index);
    };
    // @ts-ignore
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

        // Reorder images and previews
        const newImages = [...imageFields];
        const newPreviews = [...imagesPreviews];

        const draggedImage = newImages[draggedImageIndex];
        const draggedPreview = newPreviews[draggedImageIndex];

        // Remove dragged item
        newImages.splice(draggedImageIndex, 1);
        newPreviews.splice(draggedImageIndex, 1);

        // Insert at target position
        newImages.splice(targetIndex, 0, draggedImage);
        newPreviews.splice(targetIndex, 0, draggedPreview);

        // Update form with new order and indices
        newImages.forEach((_, index) => {
            updateImage(index, {
                ...newImages[index],
                index: index,
            });
        });

        setImagesPreviews(newPreviews);
        setDraggedImageIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedImageIndex(null);
    };

    // Move image up
    const moveImageUp = (index: number) => {
        if (index === 0) return;

        const newImages = [...imageFields];
        const newPreviews = [...imagesPreviews];

        // Swap with previous item
        [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
        [newPreviews[index], newPreviews[index - 1]] = [newPreviews[index - 1], newPreviews[index]];

        // Update form with new order and indices
        newImages.forEach((_, idx) => {
            updateImage(idx, {
                ...newImages[idx],
                index: idx,
            });
        });

        setImagesPreviews(newPreviews);
    };

    // Move image down
    const moveImageDown = (index: number) => {
        if (index === imageFields.length - 1) return;

        const newImages = [...imageFields];
        const newPreviews = [...imagesPreviews];

        // Swap with next item
        [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
        [newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]];

        // Update form with new order and indices
        newImages.forEach((_, idx) => {
            updateImage(idx, {
                ...newImages[idx],
                index: idx,
            });
        });

        setImagesPreviews(newPreviews);
    };

    const removeImageItem = (index: number) => {
        removeImage(index);
        // Revoke object URL to prevent memory leaks
        if (imagesPreviews[index]) {
            URL.revokeObjectURL(imagesPreviews[index]);
        }
        setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const removeVideoItem = (index: number) => {
        const newVideos = [...watchVideos];
        const newPreviews = [...videosPreviews];

        // Revoke object URL
        if (videosPreviews[index]) {
            URL.revokeObjectURL(videosPreviews[index]);
        }

        newVideos.splice(index, 1);
        newPreviews.splice(index, 1);

        setValue("videos", newVideos);
        setVideosPreviews(newPreviews);
    };

    const resetForm = () => {
        reset();
        // Clean up all object URLs
        imagesPreviews.forEach((url) => URL.revokeObjectURL(url));
        videosPreviews.forEach((url) => URL.revokeObjectURL(url));
        setImagesPreviews([]);
        setVideosPreviews([]);
        setDraggedImageIndex(null);
    };

    const handleClose = () => {
        resetForm();
        navigate("/meals");
    };

    const onSubmit = async (data: FormData) => {
        try {
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("description", data.description);
            formData.append("mealCategoryId", data.mealCategoryId);

            // images
            data.images.forEach((img, index) => {
                formData.append(`images[${index}].index`, index.toString());
                formData.append(`images[${index}].image`, img.image); // File
            });

            // videos
            data.videos?.forEach((video) => {
                formData.append("videos", video); // array of files
            });

            // ingredients
            data.ingredients.forEach((i, index) => {
                formData.append(
                    `ingredients[${index}].ingredientId`,
                    i.ingredientId
                );
                formData.append(
                    `ingredients[${index}].quantity`,
                    i.quantity.toString()
                );
            });


            const res = await addMeal(formData);
            const result = handleApiResponse(res);

            if (result.success) {
                toast.success("Meal added successfully!");
                resetForm();
                navigate("/meals");
            } else {
                toast.error(result.error || "Failed to add meal");
            }
        } catch (error: any) {
            toast.error(error?.error || "An error occurred");
        }
    };

    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3">
            <div className="rounded-2xl shadow ">
                <form onSubmit={handleSubmit(onSubmit)} className="p-2 border rounded-2xl">
                    {/* Header */}
                    <div className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl shadow-sm">
                                <ChefHat className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {t("meals.add.title")}
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t("meals.add.subtitle")}
                                </p>
                            </div>
                        </div>
                    </div>
                    {/* Content */}
                    <div className="pr-2 space-y-6 p-6">
                        {/* Category Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-50 rounded-lg">
                                    <Tag className="h-4 w-4 text-purple-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("meals.add.categoryLabel")}
                                </Label>
                            </div>
                            <Controller
                                name="mealCategoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        disabled={isLoadingCategories}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
                                            <SelectValue
                                                placeholder={
                                                    isLoadingCategories
                                                        ? t("meals.add.loadingCategories")
                                                        : t("meals.add.selectCategory")
                                                }
                                            />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectGroup>
                                                {isLoadingCategories ? (
                                                    <SelectItem
                                                        value="loading"
                                                        disabled
                                                    >
                                                        {t("meals.add.loadingCategories")}
                                                    </SelectItem>
                                                ) : categories.length > 0 ? (
                                                    categories.map((c: any) => (
                                                        <SelectItem
                                                            key={c.id}
                                                            value={c.id}
                                                            className="focus:bg-orange-50 focus:text-orange-600 rounded-md"
                                                        >
                                                            {c.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem
                                                        value="no-data"
                                                        disabled
                                                    >
                                                        {t("meals.add.noCategories")}
                                                    </SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.mealCategoryId && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.mealCategoryId.message}
                                </div>
                            )}
                        </div>
                        {/* Name Field */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-orange-50 rounded-lg">
                                    <Tag className="h-4 w-4 text-orange-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("meals.add.nameLabel")}
                                </Label>
                            </div>
                            <Input
                                id="name"
                                {...register("name")}
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg"
                                placeholder={t("meals.add.namePlaceholder")}
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
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Utensils className="h-4 w-4 text-blue-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("meals.add.descriptionLabel")}
                                </Label>
                            </div>
                            <Input
                                id="description"
                                {...register("description")}
                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg"
                                placeholder={t("meals.add.descriptionPlaceholder")}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.description.message}
                                </div>
                            )}
                        </div>
                        {/* Images Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <ImageIcon className="h-4 w-4 text-green-600" />
                                    </div>
                                    <Label className="text-sm font-semibold">
                                        {t("meals.add.imagesLabel")}
                                    </Label>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {t("meals.add.imagesAdded", { count: imageFields.length })}
                                </span>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-orange-400 hover:bg-orange-50/30">
                                <Input
                                    type="file"
                                    id="images"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    ref={imageInputRef}
                                />
                                <label
                                    htmlFor="images"
                                    className="cursor-pointer block"
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("meals.add.clickToUploadImages")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("meals.add.imagesUploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {/* Images List with Manual Reordering */}
                            {imageFields.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold">
                                            {t("meals.add.imagesCount", { count: imageFields.length })}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {t("meals.add.dragToReorder")}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {imageFields.map((field, index) => (
                                            <div
                                                key={field.id}
                                                draggable
                                                onDragStart={() => handleDragStart(index)}
                                                onDragOver={(e) => handleDragOver(e, index)}
                                                onDrop={(e) => handleDrop(e, index)}
                                                onDragEnd={handleDragEnd}
                                                className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${draggedImageIndex === index
                                                    ? "border-orange-500 shadow-lg"
                                                    : "border-gray-200"
                                                    } transition-all duration-200`}
                                            >
                                                {/* Drag Handle */}
                                                <div
                                                    className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                                                    title={t("meals.add.dragToReorder")}
                                                >
                                                    <GripVertical className="h-5 w-5" />
                                                </div>

                                                {/* Image Preview */}
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                                        <img
                                                            src={imagesPreviews[index]}
                                                            alt={`Meal image ${index + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">
                                                            {field.image.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(field.image.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                                            {field.image.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Move Buttons */}
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => moveImageUp(index)}
                                                        disabled={index === 0}
                                                        className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title={t("meals.add.moveUp")}
                                                    >
                                                        <ArrowUp className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveImageDown(index)}
                                                        disabled={index === imageFields.length - 1}
                                                        className="p-1 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                        title={t("meals.add.moveDown")}
                                                    >
                                                        <ArrowDown className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeImageItem(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title={t("meals.add.removeImage")}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {errors.images && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.images.message}
                                </div>
                            )}
                        </div>
                        {/* Videos Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <Video className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <Label className="text-sm font-semibold">
                                        {t("meals.add.videosLabel")}
                                    </Label>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {t("meals.add.imagesAdded", { count: watchVideos.length })}
                                </span>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
                                <Input
                                    type="file"
                                    id="videos"
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideosChange}
                                    ref={videoInputRef}
                                />
                                <label
                                    htmlFor="videos"
                                    className="cursor-pointer block"
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("meals.add.clickToUploadVideos")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("meals.add.videosUploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {/* Videos List */}
                            {watchVideos.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold">
                                            {t("meals.add.videosCount", { count: watchVideos.length })}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {watchVideos.map((video, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                                            >
                                                {/* Video Preview */}
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                                                        <Video className="h-6 w-6 text-gray-400" />
                                                        <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                                            {index + 1}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">
                                                            {video.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(video.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                                            {video.type}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    type="button"
                                                    onClick={() => removeVideoItem(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title={t("meals.add.removeVideo")}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {errors.videos && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.videos.message}
                                </div>
                            )}
                        </div>
                        {/* Ingredients Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <Utensils className="h-4 w-4 text-red-600" />
                                    </div>
                                    <Label className="text-sm font-semibold">
                                        {t("meals.add.ingredientsLabel")}
                                    </Label>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {t("meals.add.imagesAdded", { count: ingredientFields.length })}
                                </span>
                            </div>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                {ingredientFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="flex gap-3 items-start group"
                                    >
                                        <div className="flex-1">
                                            <Controller
                                                name={`ingredients.${index}.ingredientId`}
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        disabled={
                                                            isLoadingIngredients
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
                                                            <SelectValue
                                                                placeholder={
                                                                    isLoadingIngredients
                                                                        ? t("meals.add.loadingIngredients")
                                                                        : t("meals.add.selectIngredient")
                                                                }
                                                            />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-lg">
                                                            <SelectGroup>
                                                                {isLoadingIngredients ? (
                                                                    <SelectItem
                                                                        value="loading"
                                                                        disabled
                                                                    >
                                                                        {t("meals.add.loadingIngredients")}
                                                                    </SelectItem>
                                                                ) : ingredients.length >
                                                                    0 ? (
                                                                    ingredients.map(
                                                                        (
                                                                            ing: any
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    ing.id
                                                                                }
                                                                                value={
                                                                                    ing.id
                                                                                }
                                                                                className="focus:bg-orange-50 focus:text-orange-600 rounded-md"
                                                                            >
                                                                                {
                                                                                    ing.name
                                                                                }
                                                                            </SelectItem>
                                                                        )
                                                                    )
                                                                ) : (
                                                                    <SelectItem
                                                                        value="no-data"
                                                                        disabled
                                                                    >
                                                                        {t("meals.add.noIngredients")}
                                                                    </SelectItem>
                                                                )}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                            {errors.ingredients?.[index]
                                                ?.ingredientId && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            errors.ingredients[
                                                                index
                                                            ]?.ingredientId?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <div className="w-24">
                                            <Input
                                                type="number"
                                                placeholder={t("meals.add.quantityPlaceholder")}
                                                {...register(
                                                    `ingredients.${index}.quantity`,
                                                    { valueAsNumber: true }
                                                )}
                                                className="border-gray-300 focus:border-orange-500 focus:ring-orange-500 transition-colors duration-200 rounded-lg"
                                            />
                                            {errors.ingredients?.[index]
                                                ?.quantity && (
                                                    <p className="text-red-500 text-xs mt-1">
                                                        {
                                                            errors.ingredients[
                                                                index
                                                            ]?.quantity?.message
                                                        }
                                                    </p>
                                                )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeIngredient(index)
                                            }
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-1"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={() =>
                                    appendIngredient({
                                        ingredientId: "",
                                        quantity: 1,
                                    })
                                }
                                variant="outline"
                                className="w-full border-dashed border-gray-300 transition-all duration-200 rounded-lg py-2.5"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t("meals.add.addIngredient")}
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
                            {t("meals.add.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("meals.add.adding")}
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
                                    {t("meals.add.add")}
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </div>
        </div>
    );
}