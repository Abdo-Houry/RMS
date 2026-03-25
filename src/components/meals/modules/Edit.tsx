"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { toast } from "react-toastify";
import { X, Plus, Upload, Image as ImageIcon, Tag, Utensils, ChefHat, Loader, Edit, Video, GripVertical, Trash2, ArrowUp, ArrowDown } from "lucide-react";

import { useGetMealsByIdQuery } from "@/api/feature/meals/getSlice";
import { useMealsPutMutation } from "@/api/feature/meals/putSlice";
import { useFilterIngredientsQuery } from "@/api/feature/Ingredients/getSlice";
import { useFilterCategoryMealQuery } from "@/api/feature/mealCategories/getSlice";
import { handleApiResponse } from "@/hooks/apiErrorHandler";
import { useTranslation } from "react-i18next";

interface MealImage {
    id: string;
    index: number;
    image: string;
    imageFile?: File;
    previewUrl?: string;
}


interface IngredientData {
    id?: string;
    ingredientId: string;
    quantity: number;
}

import { useParams, useNavigate } from "react-router-dom";



export default function EditMealPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const mealId = id!;
    const { t } = useTranslation()
    const schema = z.object({
        name: z.string().min(1, t("meals.edit.nameRequired")),
        description: z.string().min(1, t("meals.edit.descriptionRequired")),
        mealCategoryId: z.string().min(1, t("meals.edit.categoryRequired")),
        ingredients: z.array(
            z.object({
                id: z.string().optional(),
                ingredientId: z.string().min(1, t("meals.edit.ingredientRequired")),
                quantity: z.number().min(1, t("meals.edit.quantityRequired")),
            })
        ),
    });

    type FormData = z.infer<typeof schema>;
    const [editMeal, { isLoading: isUpdating }] = useMealsPutMutation();

    const { data: mealData, isLoading: isLoadingMeal } =
        useGetMealsByIdQuery(mealId!, {
            skip: !mealId,
        });

    const { data: ingredientsData, isLoading: isLoadingIngredients } = useFilterIngredientsQuery({ page: 1, size: 200 });
    const { data: categoriesData, isLoading: isLoadingCategories } = useFilterCategoryMealQuery({ page: 1, size: 200 });

    // حالات للصور والفيديوهات
    const [allImages, setAllImages] = useState<MealImage[]>([]);
    // const [currentVideos, setCurrentVideos] = useState<MealVideo[]>([]);
    const [currentVideos, setCurrentVideos] = useState<string[]>([]);
    const [newVideos, setNewVideos] = useState<File[]>([]);
    const [newVideosPreviews, setNewVideosPreviews] = useState<string[]>([]);
    const [draggedImageIndex, setDraggedImageIndex] = useState<number | null>(null);
    const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);
    const [videosToRemove, setVideosToRemove] = useState<string[]>([]);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const ingredientOptions = ingredientsData?.data?.values || [];
    const categories = categoriesData?.data?.values || [];

    const { control, handleSubmit, reset, setValue, formState: { errors } } =
        useForm<FormData>({
            resolver: zodResolver(schema),
            defaultValues: {
                name: "",
                description: "",
                mealCategoryId: "",
                ingredients: [],
            },
        });

    const { fields: ingredientFields, append: appendIngredient, remove: removeIngredient } = useFieldArray({
        control,
        name: "ingredients",
    });

    // تحميل بيانات الوجبة عند فتح المكون
    useEffect(() => {
        if (mealData?.data) {
            const meal = mealData.data;

            // setValue('name', meal.name);
            // setValue('description', meal.description);
            // setValue('mealCategoryId', meal.mealCategoryId);

            // تحميل المكونات
            // setValue('ingredients', meal.ingredients.map((ing: IngredientData) => ({
            //     id: ing.id,
            //     ingredientId: ing.ingredientId,
            //     quantity: ing.quantity,
            // })));
            reset({
                name: meal.name,
                description: meal.description,
                mealCategoryId: meal.mealCategoryId,
                ingredients: meal.ingredients.map((ing: IngredientData) => ({
                    id: ing.id,
                    ingredientId: ing.ingredientId,
                    quantity: ing.quantity,
                }))
            });
            // تحميل الصور الحالية مع الترتيب حسب الفهرس
            if (meal.images && meal.images.length > 0) {
                const sortedImages = [...meal.images].sort((a, b) => a.index - b.index);
                setAllImages(sortedImages.map(img => ({
                    id: img.id,
                    index: img.index,
                    image: img.image,
                    previewUrl: `${import.meta.env.VITE_BASE_URL}/${img.image}`
                })));
            } else {
                setAllImages([]);
            }

            // تحميل الفيديوهات الحالية
            if (meal.videos && meal.videos.length > 0) {
                // setCurrentVideos(meal.videos.map((vid: any) => ({
                //     videoPath: vid.videoPath
                // })));
                setCurrentVideos(meal.videos);

            } else {
                setCurrentVideos([]);
            }

            // إعادة تعيين حالات الإزالة
            setImagesToRemove([]);
            setVideosToRemove([]);
            setNewVideos([]);
            setNewVideosPreviews([]);
        }
    }, [mealData, setValue, reset]);

    // معالجة إضافة صور جديدة
    const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);

        // إنشاء كائنات للصور الجديدة
        const newImageObjects: MealImage[] = newFiles.map((file, idx) => {
            const previewUrl = URL.createObjectURL(file);
            return {
                id: `new-${Date.now()}-${idx}`, // ID مؤقت للصور الجديدة
                index: allImages.length + idx, // الفهرس التالي
                image: "", // سيتم تعبئته لاحقاً
                imageFile: file,
                previewUrl: previewUrl
            };
        });

        setAllImages(prev => [...prev, ...newImageObjects]);

        // إعادة تعيين الإدخال
        if (imageInputRef.current) {
            imageInputRef.current.value = "";
        }
    };

    // معالجة إضافة فيديوهات جديدة
    const handleVideosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: File[] = Array.from(files);
        const newPreviews: string[] = [];

        // إنشاء URLs للعرض
        newFiles.forEach((file) => {
            const previewUrl = URL.createObjectURL(file);
            newPreviews.push(previewUrl);
        });

        setNewVideos(prev => [...prev, ...newFiles]);
        setNewVideosPreviews(prev => [...prev, ...newPreviews]);

        // إعادة تعيين الإدخال
        if (videoInputRef.current) {
            videoInputRef.current.value = "";
        }
    };

    // Drag & Drop لجميع الصور (قديمة + جديدة)
    const handleDragStart = (index: number) => {
        setDraggedImageIndex(index);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, _: number) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetIndex: number) => {
        e.preventDefault();
        if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

        // إعادة ترتيب الصور
        const newAllImages = [...allImages];
        const [draggedImage] = newAllImages.splice(draggedImageIndex, 1);
        newAllImages.splice(targetIndex, 0, draggedImage);

        // تحديث الفهارس
        const updatedImages = newAllImages.map((img, idx) => ({
            ...img,
            index: idx
        }));

        setAllImages(updatedImages);
        setDraggedImageIndex(null);
    };

    const handleDragEnd = () => {
        setDraggedImageIndex(null);
    };

    // نقل صورة لأعلى
    const moveImageUp = (index: number) => {
        if (index === 0) return;

        const newAllImages = [...allImages];
        [newAllImages[index], newAllImages[index - 1]] = [newAllImages[index - 1], newAllImages[index]];

        // تحديث الفهارس
        const updatedImages = newAllImages.map((img, idx) => ({
            ...img,
            index: idx
        }));

        setAllImages(updatedImages);
    };

    // نقل صورة لأسفل
    const moveImageDown = (index: number) => {
        if (index === allImages.length - 1) return;

        const newAllImages = [...allImages];
        [newAllImages[index], newAllImages[index + 1]] = [newAllImages[index + 1], newAllImages[index]];

        // تحديث الفهارس
        const updatedImages = newAllImages.map((img, idx) => ({
            ...img,
            index: idx
        }));

        setAllImages(updatedImages);
    };

    // إزالة صورة (سواء قديمة أو جديدة)
    const removeImage = (index: number) => {
        const imageToRemove = allImages[index];

        if (imageToRemove.id.startsWith('new-')) {
            // صورة جديدة: نحرر الذاكرة
            if (imageToRemove.previewUrl) {
                URL.revokeObjectURL(imageToRemove.previewUrl);
            }
        } else {
            // صورة قديمة: نضيف للإزالة
            setImagesToRemove(prev => [...prev, imageToRemove.id]);
        }

        // إزالة من العرض
        const newAllImages = allImages.filter((_, i) => i !== index);
        // تحديث الفهارس
        const updatedImages = newAllImages.map((img, idx) => ({
            ...img,
            index: idx
        }));

        setAllImages(updatedImages);
    };

    // إزالة فيديو جديد
    const removeNewVideo = (index: number) => {
        // إلغاء URL للذاكرة
        if (newVideosPreviews[index]) {
            URL.revokeObjectURL(newVideosPreviews[index]);
        }

        const newVideosCopy = [...newVideos];
        const newPreviewsCopy = [...newVideosPreviews];

        newVideosCopy.splice(index, 1);
        newPreviewsCopy.splice(index, 1);

        setNewVideos(newVideosCopy);
        setNewVideosPreviews(newPreviewsCopy);
    };

    const removeCurrentVideo = (index: number) => {
        const videoPath = currentVideos[index];

        setVideosToRemove(prev => [...prev, videoPath]);
        setCurrentVideos(prev => prev.filter((_, i) => i !== index));
    };

    // إغلاق الحوار
    const handleClose = () => {
        reset();
        setAllImages([]);
        setCurrentVideos([]);
        setNewVideos([]);
        setImagesToRemove([]);
        setVideosToRemove([]);

        // تنظيف URLs للذاكرة للصور الجديدة
        allImages.forEach(img => {
            if (img.previewUrl && img.id.startsWith('new-')) {
                URL.revokeObjectURL(img.previewUrl);
            }
        });

        // تنظيف URLs للذاكرة للفيديوهات الجديدة
        newVideosPreviews.forEach(url => URL.revokeObjectURL(url));

        setNewVideosPreviews([]);
        setDraggedImageIndex(null);

        navigate("/meals");
    };
    const [uploadProgress, setUploadProgress] = useState(0);
    const onSubmit = async (formData: FormData) => {
        try {
            if (!mealId) {
                toast.error("Meal ID is missing");
                return;
            }
            const sortedImages = [...allImages].sort((a, b) => a.index - b.index);

            const originalIngredients = mealData?.data?.ingredients || [];
            const currentIngredients = formData.ingredients || [];

            const form = new FormData();
            form.append("mealId", mealId);
            form.append("name", formData.name);
            form.append("description", formData.description);
            form.append("mealCategoryId", formData.mealCategoryId);

            // Ingredients to add (new ones without id)
            const ingredientsToAdd = currentIngredients.filter((i) => !i.id);
            ingredientsToAdd.forEach((ing, i) => {
                form.append(`ingredientsToAdd[${i}][ingredientId]`, ing.ingredientId);
                form.append(`ingredientsToAdd[${i}][quantity]`, ing.quantity.toString());
            });

            // Ingredients to remove
            const ingredientsToRemove = originalIngredients
                .filter((old: IngredientData) => !currentIngredients.some((cur) => cur.id === old.id))
                .map((i: IngredientData) => i.id);

            ingredientsToRemove.forEach((id: string, i: number) => {
                form.append(`ingredientsToRemove[${i}]`, id);
            });

            // Images to remove
            imagesToRemove.forEach((id: string, i: number) => {
                form.append(`imagesToRemove[${i}]`, id);
            });

            sortedImages.forEach((img, i) => {
                form.append(`images[${i}].index`, img.index.toString());

                if (img.id.startsWith("new-")) {
                    // صورة جديدة
                    form.append(
                        `images[${i}].id`,
                        "00000000-0000-0000-0000-000000000000"
                    );
                    if (img.imageFile) {
                        form.append(`images[${i}].image`, img.imageFile);
                    }
                } else {
                    // صورة قديمة
                    form.append(`images[${i}].id`, img.id);
                }
            });

            // Videos to remove
            if (videosToRemove.length > 0) {
                videosToRemove.forEach(path => {
                    if (path) {
                        form.append("videosToRemove", path);
                    }
                });
            }


            // Videos to add
            newVideos.forEach((video, _index) => {
                form.append(`videosToAdd`, video);
            });



            // const res = await editMeal(form);
            const res = await editMeal({
                data: form,
                onProgress: (percent) => {
                    console.log("Upload:", percent);
                    setUploadProgress(percent);
                },
            });
            const result = handleApiResponse(res);

            if (result.success) {
                toast.success(result.error)
                handleClose();
            } else {
                toast.error(result.error || "Failed to update meal");
            }

        } catch (err: any) {
            toast.error(err?.data?.error || err?.error || "An error occurred");
        }
    };

    // if (isLoadingMeal) return <Loader className="mx-auto mt-20" />;
    if (isLoadingMeal || isLoadingCategories || isLoadingIngredients)
        return <Loader className="mx-auto mt-20" />;
    return (
        <div className="sm:max-w-4xl w-full mx-auto my-3">
            <div className="rounded-2xl shadow  overflow-hidden">
                <form onSubmit={handleSubmit(onSubmit)} className="p-2 border rounded-2xl">
                    {/* Header */}
                    <div className="p-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl shadow-sm">
                                <Edit className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">
                                    {t("meals.edit.title")}
                                </h1>
                                <p className="text-gray-600 mt-1 text-sm">
                                    {t("meals.edit.subtitle")}
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
                                    {t("meals.edit.categoryLabel")}
                                </Label>
                            </div>
                            {/* <Controller
                                name="mealCategoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value || ""}
                                        onValueChange={field.onChange}
                                        disabled={isLoadingMeal || isLoadingCategories}
                                    >
                                        <SelectTrigger className="w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
                                            <SelectValue placeholder={
                                                isLoadingCategories ? t("meals.edit.loadingCategories") : t("meals.edit.selectCategory")
                                            } />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-lg">
                                            <SelectGroup>
                                                {isLoadingCategories ? (
                                                    <SelectItem value="loading" disabled>
                                                        {t("meals.edit.loadingCategories")}
                                                    </SelectItem>
                                                ) : categories.length > 0 ? (
                                                    categories.map((c: any) => (
                                                        <SelectItem
                                                            key={c.id}
                                                            value={c.id}
                                                            className="focus:bg-amber-50 focus:text-amber-600 rounded-md"
                                                        >
                                                            {c.name}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="no-data" disabled>
                                                        {t("meals.edit.noCategories")}
                                                    </SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            /> */}
                            <Controller
                                name="mealCategoryId"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        disabled={isLoadingMeal || isLoadingCategories}
                                        className="w-full border border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg p-2 disabled:bg-gray-100"
                                    >
                                        <option value=""
                                            className="
                                        bg-white text-black
                                        dark:bg-zinc-900 dark:text-white
                                        "
                                        >
                                            {isLoadingCategories
                                                ? t("meals.edit.loadingCategories")
                                                : t("meals.edit.selectCategory")}
                                        </option>

                                        {categories.map((c: any) => (
                                            <option key={c.id} value={c.id}
                                                className="
                                                bg-white text-black
                                                dark:bg-zinc-900 dark:text-white
                                            "
                                            >
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
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
                                <div className="p-2 bg-amber-50 rounded-lg">
                                    <Tag className="h-4 w-4 text-amber-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("meals.edit.nameLabel")}
                                </Label>
                            </div>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field }) => (
                                    <Input
                                        id="name"
                                        {...field}
                                        disabled={isLoadingMeal}
                                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                        placeholder={t("meals.edit.namePlaceholder")}
                                    />
                                )}
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
                                    {t("meals.edit.descriptionLabel")}
                                </Label>
                            </div>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <Input
                                        id="description"
                                        {...field}
                                        disabled={isLoadingMeal}
                                        className="border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                        placeholder={t("meals.edit.descriptionPlaceholder")}
                                    />
                                )}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                                    {errors.description.message}
                                </div>
                            )}
                        </div>



                        {/* All Images */}
                        {allImages.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <ImageIcon className="h-4 w-4 text-green-600" />
                                        </div>
                                        <Label className="text-sm font-semibold">
                                            {t("meals.edit.allImagesLabel", { count: allImages.length })}
                                        </Label>
                                    </div>
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                        {t("meals.edit.dragToReorder")}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {allImages.map((img, index) => (
                                        <div
                                            key={img.id}
                                            draggable
                                            onDragStart={() => handleDragStart(index)}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDrop={(e) => handleDrop(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className={`flex items-center gap-3 p-3 border rounded-lg bg-white ${draggedImageIndex === index
                                                ? "border-amber-500 shadow-lg"
                                                : "border-gray-200"
                                                } transition-all duration-200`}
                                        >
                                            {/* Drag Handle */}
                                            <div
                                                className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
                                                title={t("meals.edit.dragToReorder")}
                                            >
                                                <GripVertical className="h-5 w-5" />
                                            </div>

                                            {/* Image Preview */}
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                                                    <img
                                                        src={img.previewUrl || `${import.meta.env.VITE_BASE_URL}/${img.image}`}
                                                        alt={`Meal image ${index + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute top-1 right-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                                                        {img.index + 1}
                                                    </div>
                                                    {img.id.startsWith('new-') && (
                                                        <div className="absolute bottom-1 right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
                                                            {t("meals.edit.new")}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {img.id.startsWith('new-')
                                                            ? t("meals.edit.newImage", { index: index + 1 })
                                                            : t("meals.edit.currentImage", { index: index + 1 })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Index: {img.index}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Move Buttons */}
                                            <div className="flex flex-col gap-1">
                                                <button
                                                    type="button"
                                                    onClick={() => moveImageUp(index)}
                                                    disabled={index === 0}
                                                    className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={t("meals.edit.moveUp")}
                                                >
                                                    <ArrowUp className="h-4 w-4" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => moveImageDown(index)}
                                                    disabled={index === allImages.length - 1}
                                                    className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title={t("meals.edit.moveDown")}
                                                >
                                                    <ArrowDown className="h-4 w-4" />
                                                </button>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                title={t("meals.edit.removeImage")}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Images */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-green-50 rounded-lg">
                                    <ImageIcon className="h-4 w-4 text-green-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("meals.edit.addImagesLabel")}
                                </Label>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-amber-400 hover:bg-amber-50/30">
                                <Input
                                    type="file"
                                    id="newImages"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImagesChange}
                                    ref={imageInputRef}
                                />
                                <label htmlFor="newImages" className="cursor-pointer block">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("meals.edit.clickToUploadImages")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("meals.edit.imagesUploadHelp")}
                                    </p>
                                </label>
                            </div>
                        </div>

                        {/* Current Videos */}
                        {currentVideos.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Video className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <Label className="text-sm font-semibold">
                                            {t("meals.edit.currentVideosLabel", { count: currentVideos.length })}
                                        </Label>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {currentVideos.map((_, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white">
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                                                    <Video className="h-6 w-6 text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {t("meals.edit.currentVideo", { index: index + 1 })}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Video file
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCurrentVideo(index)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                title={t("meals.edit.removeVideo")}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add New Videos */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Video className="h-4 w-4 text-blue-600" />
                                </div>
                                <Label className="text-sm font-semibold">
                                    {t("meals.edit.addVideosLabel")}
                                </Label>
                            </div>

                            {/* Upload Area */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50/30">
                                <Input
                                    type="file"
                                    id="newVideos"
                                    accept="video/*"
                                    multiple
                                    onChange={handleVideosChange}
                                    ref={videoInputRef}
                                />
                                <label htmlFor="newVideos" className="cursor-pointer block">
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3 transition-colors duration-200" />
                                    <p className="text-sm font-medium mb-1">
                                        {t("meals.edit.clickToUploadVideos")}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {t("meals.edit.videosUploadHelp")}
                                    </p>
                                </label>
                            </div>

                            {/* New Videos List */}
                            {newVideos.length > 0 && (
                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-semibold">
                                            {t("meals.edit.newVideosLabel", { count: newVideos.length })}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {newVideos.map((video, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white"
                                            >
                                                <div className="flex-1 flex items-center gap-3">
                                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden border bg-gray-100 flex items-center justify-center">
                                                        <Video className="h-6 w-6 text-gray-400" />
                                                        <div className="absolute top-1 right-1 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded">
                                                            {t("meals.edit.new")}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium">
                                                            {video.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {(video.size / 1024 / 1024).toFixed(2)} MB
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeNewVideo(index)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                                                    title={t("meals.edit.removeVideo")}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Ingredients Field */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-red-50 rounded-lg">
                                        <ChefHat className="h-4 w-4 text-red-600" />
                                    </div>
                                    <Label className="text-sm font-semibold">
                                        {t("meals.edit.ingredientsLabel")}
                                    </Label>
                                </div>
                                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                    {t("meals.add.imagesAdded", { count: ingredientFields.length })}
                                </span>
                            </div>

                            <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                                {ingredientFields.map((field, index) => (
                                    <div key={field.id} className="flex gap-3 items-start group">
                                        <div className="flex-1">
                                            <Controller
                                                control={control}
                                                name={`ingredients.${index}.ingredientId`}
                                                render={({ field }) => (
                                                    // <Select
                                                    //     value={field.value}
                                                    //     onValueChange={field.onChange}
                                                    //     disabled={isLoadingMeal || isLoadingIngredients}
                                                    // >
                                                    //     <SelectTrigger className="w-full border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100">
                                                    //         <SelectValue placeholder={
                                                    //             isLoadingIngredients ? t("meals.edit.loadingIngredients") : t("meals.edit.selectIngredient")
                                                    //         } />
                                                    //     </SelectTrigger>
                                                    //     <SelectContent className="rounded-lg">
                                                    //         <SelectGroup>
                                                    //             {isLoadingIngredients ? (
                                                    //                 <SelectItem value="loading" disabled>
                                                    //                     {t("meals.edit.loadingIngredients")}
                                                    //                 </SelectItem>
                                                    //             ) : ingredientOptions.length > 0 ? (
                                                    //                 ingredientOptions.map((ing: any) => (
                                                    //                     <SelectItem
                                                    //                         key={ing.id}
                                                    //                         value={ing.id}
                                                    //                         className="focus:bg-amber-50 focus:text-amber-600 rounded-md"
                                                    //                     >
                                                    //                         {ing.name}
                                                    //                     </SelectItem>
                                                    //                 ))
                                                    //             ) : (
                                                    //                 <SelectItem value="no-data" disabled>
                                                    //                     {t("meals.edit.noIngredients")}
                                                    //                 </SelectItem>
                                                    //             )}
                                                    //         </SelectGroup>
                                                    //     </SelectContent>
                                                    // </Select>
                                                    <select
                                                        {...field}
                                                        disabled={isLoadingMeal || isLoadingIngredients}
                                                        className="w-full border border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg p-2 disabled:bg-gray-100"
                                                    >
                                                        <option value=""
                                                            className="
                                                bg-white text-black
                                                dark:bg-zinc-900 dark:text-white
                                            "
                                                        >
                                                            {isLoadingIngredients
                                                                ? t("meals.edit.loadingIngredients")
                                                                : t("meals.edit.selectIngredient")}
                                                        </option>

                                                        {ingredientOptions.map((ing: any) => (
                                                            <option key={ing.id} value={ing.id}
                                                                className="
                                                bg-white text-black
                                                dark:bg-zinc-900 dark:text-white
                                            ">
                                                                {ing.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            />
                                            {errors.ingredients?.[index]?.ingredientId && (
                                                <p className="text-red-500 text-xs mt-1">{errors.ingredients[index]?.ingredientId?.message}</p>
                                            )}
                                        </div>
                                        <div className="w-24">
                                            <Controller
                                                control={control}
                                                name={`ingredients.${index}.quantity`}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        className="w-24 border-gray-300 focus:border-amber-500 focus:ring-amber-500 transition-colors duration-200 rounded-lg disabled:bg-gray-100"
                                                        {...field}
                                                        disabled={isLoadingMeal}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                        placeholder={t("meals.edit.quantityPlaceholder")}
                                                    />
                                                )}
                                            />
                                            {errors.ingredients?.[index]?.quantity && (
                                                <p className="text-red-500 text-xs mt-1">{errors.ingredients[index]?.quantity?.message}</p>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeIngredient(index)}
                                            disabled={isLoadingMeal}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 mt-1 disabled:opacity-50"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                onClick={() => appendIngredient({ ingredientId: "", quantity: 1 })}
                                disabled={isLoadingMeal}
                                variant="outline"
                                className="w-full border-dashed border-gray-300 transition-all duration-200 rounded-lg py-2.5 disabled:opacity-50"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t("meals.edit.addIngredient")}
                            </Button>
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                            <div className="px-6 pb-4">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div
                                        className="bg-amber-600 h-3 rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-center mt-1">
                                    {uploadProgress}%
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isLoadingMeal || isUpdating}
                            className="flex items-center gap-2 border-gray-300 transition-all duration-200 rounded-lg px-6 py-2.5 font-medium"
                        >
                            <X className="h-4 w-4" />
                            {t("meals.edit.cancel")}
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                isUpdating ||
                                isLoadingMeal ||
                                (uploadProgress > 0 && uploadProgress < 100)
                            }
                            className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-sm hover:shadow-md transition-all duration-200 rounded-lg px-6 py-2.5 font-medium disabled:opacity-50"
                        >
                            {isUpdating ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    {t("meals.edit.updating")}
                                </>
                            ) : uploadProgress > 0 && uploadProgress < 100 ? (
                                `${uploadProgress}%`
                            ) : (
                                <>
                                    <Edit className="h-4 w-4" />
                                    {t("meals.edit.update")}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}