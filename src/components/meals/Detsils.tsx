"use client";

import { Button } from "@/components/ui/button";
import { useGetMealsByIdQuery, useGetMealsByIdStaffQuery } from "@/api/feature/meals/getSlice";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ChefHat, Utensils, Image as ImageIcon, Video as VideoIcon, Info, Eye } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import DetailsIngredient from "@/components/Ingredients/modules/Details";

// Types
interface MealDetailsPageProps {
    mealId?: string;
}

export default function MealDetailsPage({ mealId: propMealId }: MealDetailsPageProps) {
    const navigate = useNavigate();
    const { id: paramId } = useParams<{ id: string }>();
    const mealId = propMealId || paramId;

    if (!mealId) {
        navigate("/meals");
        return null;
    }

    const { isStaff, isLoading: roleLoading } = useUserRole();

    const { data, isLoading, isError } = isStaff
        ? useGetMealsByIdStaffQuery(mealId, { skip: !isStaff || roleLoading })
        : useGetMealsByIdQuery(mealId, { skip: isStaff || roleLoading });

    const meal = data?.data;

    const handleGoBack = () => navigate(-1);
    const handleGoToMeals = () => navigate("/meals");

    const handleViewIngredientDetails = (ingredientId: string) => {
        setSelectedIngredientId(ingredientId);
        setIsDetailsOpen(true);
    };

    // Carousel state
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    // Dialog state for ingredient details
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedIngredientId, setSelectedIngredientId] = useState<string>("");

    // نسخة آمنة للصور والفيديوهات (immutable)
    const sortedImages = meal?.images ? [...meal.images].sort((a, b) => a.index - b.index) : [];
    const videos = meal?.videos || [];
    const { t } = useTranslation()
    const isRTL = i18n.language === "ar";

    return (
        // <div className="min-h-screen">
        //     <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        //         <div className="max-w-full mx-auto">
        //             <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        //                 {isLoading ? (
        //                     <div className="p-6 space-y-6">
        //                         <Skeleton className="h-8 w-3/4" />
        //                         <Skeleton className="h-4 w-full" />
        //                     </div>
        //                 ) : isError ? (
        //                     <div className="p-8 text-center">
        //                         <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
        //                             <ChefHat className="h-8 w-8 text-red-500" />
        //                         </div>
        //                         <h2 className="text-lg font-semibold text-red-600 mb-2">Failed to load meal details</h2>
        //                         <p className="mb-6">Please try again later</p>
        //                         <div className="flex flex-col sm:flex-row gap-3 justify-center">
        //                             <Button onClick={handleGoToMeals}>Back to Meals</Button>
        //                             <Button variant="outline" onClick={handleGoBack}>Go Back</Button>
        //                         </div>
        //                     </div>
        //                 ) : meal ? (
        //                     <div className="p-4 sm:p-6 lg:p-8 space-y-8">
        //                         {/* Header */}
        //                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        //                             <div>
        //                                 <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{meal.name}</h2>
        //                                 <p className="text-gray-600 mt-2">Complete information about the meal</p>
        //                             </div>
        //                             <Badge variant="secondary" className="px-4 py-2 text-sm sm:text-base bg-purple-100 text-purple-800 border-purple-200">
        //                                 {meal.mealCategoryName}
        //                             </Badge>
        //                         </div>
        //                         <Separator className="bg-gray-200" />

        //                         {/* Description */}
        //                         <div>
        //                             <div className="flex items-center gap-2 mb-4">
        //                                 <div className="p-2 bg-blue-50 rounded-lg">
        //                                     <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
        //                                 </div>
        //                                 <h3 className="font-semibold text-lg sm:text-xl">Description</h3>
        //                             </div>
        //                             <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
        //                                 <p className="text-gray-700 leading-relaxed">{meal.description || "No description available"}</p>
        //                             </div>
        //                         </div>

        //                         {/* Ingredients */}
        //                         <Separator className="bg-gray-200" />
        //                         <div>
        //                             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        //                                 <div className="flex items-center gap-2">
        //                                     <div className="p-2 bg-red-50 rounded-lg">
        //                                         <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
        //                                     </div>
        //                                     <h3 className="font-semibold text-lg sm:text-xl">Ingredients</h3>
        //                                 </div>
        //                                 <Badge variant="outline" className="px-3 py-1">{meal.ingredients?.length || 0} items</Badge>
        //                             </div>

        //                             {meal.ingredients?.length > 0 ? (
        //                                 <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        //                                     <div className="px-4 py-3 border-b border-gray-200 hidden sm:grid sm:grid-cols-3">
        //                                         <div className="text-sm font-semibold uppercase tracking-wider">Ingredient</div>
        //                                         <div className="text-sm font-semibold uppercase tracking-wider">Image</div>
        //                                         <div className="text-sm font-semibold uppercase tracking-wider">Quantity</div>
        //                                     </div>
        //                                     <div className="divide-y divide-gray-200">
        //                                         {meal.ingredients.map((ing: any) => (
        //                                             <div key={ing.id} className="p-4 sm:p-0">
        //                                                 {/* Mobile */}
        //                                                 <div className="sm:hidden space-y-3">
        //                                                     <div className="flex justify-between items-start">
        //                                                         <div className="font-medium">{ing.name}</div>
        //                                                         <Badge className="bg-orange-100 text-orange-800">{ing.quantity}</Badge>
        //                                                     </div>
        //                                                     {ing.imagePath && (
        //                                                         <div className="flex items-center gap-3">
        //                                                             <img
        //                                                                 src={`${import.meta.env.VITE_BASE_URL}/${ing.imagePath}`}
        //                                                                 alt={ing.name}
        //                                                                 className="w-16 h-16 rounded-lg object-cover border border-gray-200"
        //                                                             />
        //                                                             <span className="text-sm text-gray-600">Ingredient Image</span>
        //                                                         </div>
        //                                                     )}
        //                                                 </div>
        //                                                 {/* Desktop */}
        //                                                 <div className="hidden sm:grid sm:grid-cols-3 sm:px-4 sm:py-3">
        //                                                     <div className="text-sm font-medium flex items-center">{ing.name}</div>
        //                                                     <div>
        //                                                         {ing.imagePath ? (
        //                                                             <img
        //                                                                 src={`${import.meta.env.VITE_BASE_URL}/${ing.imagePath}`}
        //                                                                 alt={ing.name}
        //                                                                 className="w-12 h-12 rounded-lg object-cover border border-gray-200"
        //                                                             />
        //                                                         ) : (
        //                                                             <div className="w-12 h-12 rounded-lg bg-gray-100 border flex items-center justify-center">
        //                                                                 <Utensils className="h-5 w-5 text-gray-400" />
        //                                                             </div>
        //                                                         )}
        //                                                     </div>
        //                                                     <div>
        //                                                         <Badge className="bg-orange-100 text-orange-800 px-3 py-1">{ing.quantity}</Badge>
        //                                                     </div>
        //                                                 </div>
        //                                             </div>
        //                                         ))}
        //                                     </div>
        //                                 </div>
        //                             ) : (
        //                                 <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
        //                                     <Utensils className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
        //                                     <p className="text-gray-600 font-medium text-lg sm:text-xl">No ingredients available</p>
        //                                     <p className="text-sm sm:text-base mt-2">This meal doesn't have any ingredients added yet.</p>
        //                                 </div>
        //                             )}
        //                         </div>

        //                         {/* Images & Videos Carousel (أسفل الصفحة) */}
        //                         {(sortedImages.length > 0 || videos.length > 0) && (
        //                             <Separator className="bg-gray-200 mt-8" />
        //                         )}

        //                         {sortedImages.length > 0 && (
        //                             <div className="mt-6">
        //                                 <div className="flex items-center gap-2 mb-4">
        //                                     <div className="p-2 bg-green-50 rounded-lg">
        //                                         <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
        //                                     </div>
        //                                     <h3 className="font-semibold text-lg sm:text-xl">Images</h3>
        //                                 </div>
        //                                 <div className="relative overflow-hidden rounded-xl shadow-lg group">
        //                                     <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}>
        //                                         {sortedImages.map((img, idx) => (
        //                                             <div key={img.id} className="w-full flex-shrink-0">
        //                                                 <img
        //                                                     src={`${import.meta.env.VITE_BASE_URL}/${img.image}`}
        //                                                     alt={meal.name}
        //                                                     className="w-full h-auto max-h-[400px] object-cover rounded-lg"
        //                                                 />
        //                                             </div>
        //                                         ))}
        //                                     </div>
        //                                     {sortedImages.length > 1 && (
        //                                         <>
        //                                             <button
        //                                                 onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : sortedImages.length - 1))}
        //                                                 className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
        //                                             >‹</button>
        //                                             <button
        //                                                 onClick={() => setCurrentImageIndex(prev => (prev < sortedImages.length - 1 ? prev + 1 : 0))}
        //                                                 className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
        //                                             >›</button>
        //                                         </>
        //                                     )}
        //                                 </div>
        //                             </div>
        //                         )}

        //                         {videos.length > 0 && (
        //                             <div className="mt-6">
        //                                 <div className="flex items-center gap-2 mb-4">
        //                                     <div className="p-2 bg-purple-50 rounded-lg">
        //                                         <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
        //                                     </div>
        //                                     <h3 className="font-semibold text-lg sm:text-xl">Videos</h3>
        //                                 </div>
        //                                 <div className="relative overflow-hidden rounded-xl shadow-lg group">
        //                                     <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentVideoIndex * 100}%)` }}>
        //                                         {videos.map((vid: any, idx: any) => (
        //                                             <div key={idx} className="w-full flex-shrink-0">
        //                                                 <video
        //                                                     src={`${import.meta.env.VITE_BASE_URL}/${vid}`}
        //                                                     controls
        //                                                     className="w-full h-auto max-h-[400px] object-cover rounded-lg"
        //                                                 />
        //                                             </div>
        //                                         ))}
        //                                     </div>
        //                                     {videos.length > 1 && (
        //                                         <>
        //                                             <button
        //                                                 onClick={() => setCurrentVideoIndex(prev => (prev > 0 ? prev - 1 : videos.length - 1))}
        //                                                 className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
        //                                             >‹</button>
        //                                             <button
        //                                                 onClick={() => setCurrentVideoIndex(prev => (prev < videos.length - 1 ? prev + 1 : 0))}
        //                                                 className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
        //                                             >›</button>
        //                                         </>
        //                                     )}
        //                                 </div>
        //                             </div>
        //                         )}

        //                         {/* Footer */}
        //                         <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
        //                             <Button variant="outline" onClick={handleGoToMeals}>View All Meals</Button>
        //                             <Button onClick={handleGoBack}>Done</Button>
        //                         </div>
        //                     </div>
        //                 ) : null}
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="min-h-screen">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-full mx-auto">
                    <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {isLoading ? (
                            <div className="p-6 space-y-6">
                                <Skeleton className="h-8 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                        ) : isError ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ChefHat className="h-8 w-8 text-red-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-red-600 mb-2">
                                    {t("meals.page.error.title")}
                                </h2>
                                <p className="mb-6">
                                    {t("meals.page.error.description")}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button onClick={handleGoToMeals}>
                                        {t("meals.page.error.backToMeals")}
                                    </Button>
                                    <Button variant="outline" onClick={handleGoBack}>
                                        {t("meals.page.error.goBack")}
                                    </Button>
                                </div>
                            </div>
                        ) : meal ? (
                            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                                {/* Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">{meal.name}</h2>
                                        <p className="text-gray-600 mt-2">
                                            {t("meals.page.subtitle")}
                                        </p>
                                    </div>
                                    <Badge variant="secondary" className="px-4 py-2 text-sm sm:text-base bg-purple-100 text-purple-800 border-purple-200">
                                        {meal.mealCategoryName}
                                    </Badge>
                                </div>
                                <Separator className="bg-gray-200" />

                                {/* Description */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-blue-50 rounded-lg">
                                            <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg sm:text-xl">
                                            {t("meals.page.description")}
                                        </h3>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                                        <p className="text-gray-700 leading-relaxed">
                                            {meal.description || t("meals.page.noDescription")}
                                        </p>
                                    </div>
                                </div>

                                {/* Ingredients */}
                                <Separator className="bg-gray-200" />
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-red-50 rounded-lg">
                                                <Utensils className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                            </div>
                                            <h3 className="font-semibold text-lg sm:text-xl">
                                                {t("meals.page.ingredients")}
                                            </h3>
                                        </div>
                                        <Badge variant="outline" className="px-3 py-1">
                                            {t("meals.page.items", { count: meal.ingredients?.length || 0 })}
                                        </Badge>
                                    </div>

                                    {meal.ingredients?.length > 0 ? (
                                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                            <div className="px-4 py-3 border-b border-gray-200 hidden sm:grid sm:grid-cols-4">
                                                <div className="text-sm font-semibold uppercase tracking-wider">
                                                    {t("meals.page.ingredient")}
                                                </div>
                                                <div className="text-sm font-semibold uppercase tracking-wider">
                                                    {t("meals.page.image")}
                                                </div>
                                                <div className="text-sm font-semibold uppercase tracking-wider">
                                                    {t("meals.page.quantity")}
                                                </div>
                                                <div className="text-sm font-semibold uppercase tracking-wider">
                                                    Actions
                                                </div>
                                            </div>
                                            <div className="divide-y divide-gray-200">
                                                {meal.ingredients.map((ing: any) => (
                                                    <div key={ing.id} className="p-4 sm:p-0">
                                                        {/* Mobile */}
                                                        <div className="sm:hidden space-y-3">
                                                            <div className="flex justify-between items-start">
                                                                <div className="font-medium">{ing.name}</div>
                                                                <div className="flex items-center gap-2">
                                                                    <Badge className="bg-orange-100 text-orange-800">
                                                                        {ing.quantity}
                                                                    </Badge>
                                                                    <button
                                                                        onClick={() => handleViewIngredientDetails(ing.ingredientId)}
                                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                                        title="View Details"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            {ing.imagePath && (
                                                                <div className="flex items-center gap-3">
                                                                    <img
                                                                        src={`${import.meta.env.VITE_BASE_URL}/${ing.imagePath}`}
                                                                        alt={ing.name}
                                                                        className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                                    />
                                                                    <span className="text-sm text-gray-600">
                                                                        {t("meals.page.ingredientImage")}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {/* Desktop */}
                                                        <div className="hidden sm:grid sm:grid-cols-4 sm:px-4 sm:py-3">
                                                            <div className="text-sm font-medium flex items-center">
                                                                {ing.name}
                                                            </div>
                                                            <div>
                                                                {ing.imagePath ? (
                                                                    <img
                                                                        src={`${import.meta.env.VITE_BASE_URL}/${ing.imagePath}`}
                                                                        alt={ing.name}
                                                                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                                                                    />
                                                                ) : (
                                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 border flex items-center justify-center">
                                                                        <Utensils className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <Badge className="bg-orange-100 text-orange-800 px-3 py-1">
                                                                    {ing.quantity}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center">
                                                                <button
                                                                    onClick={() => handleViewIngredientDetails(ing.ingredientId)}
                                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                                                    title="View Details"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <Utensils className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium text-lg sm:text-xl">
                                                {t("meals.page.noIngredients")}
                                            </p>
                                            <p className="text-sm sm:text-base mt-2">
                                                {t("meals.page.noIngredientsDesc")}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Images & Videos Carousel */}
                                {(sortedImages.length > 0 || videos.length > 0) && (
                                    <Separator className="bg-gray-200 mt-8" />
                                )}

                                {sortedImages.length > 0 && (
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 bg-green-50 rounded-lg">
                                                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                            </div>
                                            <h3 className="font-semibold text-lg sm:text-xl">
                                                {t("meals.page.images")}
                                            </h3>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl shadow-lg group">
                                            <div
                                                className="flex transition-transform duration-300 ease-in-out h-full"
                                                dir="ltr"
                                                style={{
                                                    transform: `translateX(-${currentImageIndex * 100}%)`
                                                }}
                                            >
                                                {sortedImages.map((img, _) => (
                                                    <div key={img.id} className="w-full flex-shrink-0">
                                                        <img
                                                            src={`${import.meta.env.VITE_BASE_URL}/${img.image}`}
                                                            alt={meal.name}
                                                            className="w-full h-auto max-h-[400px] object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {sortedImages.length > 1 && (
                                                <>
                                                    {/* <button
                                                        onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : sortedImages.length - 1))}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                                                    >
                                                        ‹
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentImageIndex(prev => (prev < sortedImages.length - 1 ? prev + 1 : 0))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                                                    >
                                                        ›
                                                    </button> */}
                                                    <button
                                                        onClick={() =>
                                                            setCurrentImageIndex(prev => {
                                                                if (isRTL) {
                                                                    return prev < sortedImages.length - 1 ? prev + 1 : 0;
                                                                }
                                                                return prev > 0 ? prev - 1 : sortedImages.length - 1;
                                                            })
                                                        }
                                                        className={`absolute top-1/2 -translate-y-1/2
    ${isRTL ? 'right-3' : 'left-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10`}
                                                        aria-label="Previous image"
                                                    >
                                                        {isRTL ? '‹' : '›'}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setCurrentImageIndex(prev => {
                                                                if (isRTL) {
                                                                    return prev > 0 ? prev - 1 : sortedImages.length - 1;
                                                                }
                                                                return prev < sortedImages.length - 1 ? prev + 1 : 0;
                                                            })
                                                        }
                                                        className={`absolute top-1/2 -translate-y-1/2
    ${isRTL ? 'left-3' : 'right-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10`}
                                                        aria-label="Next image"
                                                    >
                                                        {isRTL ? '‹' : '›'}
                                                    </button>

                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {videos.length > 0 && (
                                    <div className="mt-6">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                <VideoIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                            </div>
                                            <h3 className="font-semibold text-lg sm:text-xl">
                                                {t("meals.page.videos")}
                                            </h3>
                                        </div>
                                        <div className="relative overflow-hidden rounded-xl shadow-lg group">
                                            <div
                                                className="flex transition-transform duration-300 ease-in-out h-full"
                                                dir="ltr"
                                                style={{
                                                    transform: `translateX(-${currentVideoIndex * 100}%)`
                                                }}
                                            >
                                                {videos.map((vid: any, idx: any) => (
                                                    <div key={idx} className="w-full flex-shrink-0">
                                                        <video
                                                            src={`${import.meta.env.VITE_BASE_URL}/${vid}`}
                                                            controls
                                                            className="w-full h-auto max-h-[400px] object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            {videos.length > 1 && (
                                                <>
                                                    {/* <button
                                                        onClick={() => setCurrentVideoIndex(prev => (prev > 0 ? prev - 1 : videos.length - 1))}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                                                    >
                                                        ‹
                                                    </button>
                                                    <button
                                                        onClick={() => setCurrentVideoIndex(prev => (prev < videos.length - 1 ? prev + 1 : 0))}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10"
                                                    >
                                                        ›
                                                    </button> */}
                                                    <button
                                                        onClick={() =>
                                                            setCurrentVideoIndex(prev => {
                                                                if (isRTL) {
                                                                    return prev < videos.length - 1 ? prev + 1 : 0;
                                                                }
                                                                return prev > 0 ? prev - 1 : videos.length - 1;
                                                            })
                                                        }
                                                        className={`absolute top-1/2 -translate-y-1/2
    ${isRTL ? 'right-3' : 'left-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10`}
                                                        aria-label="Previous video"
                                                    >
                                                        {isRTL ? '›' : '‹'}
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setCurrentVideoIndex(prev => {
                                                                if (isRTL) {
                                                                    return prev > 0 ? prev - 1 : videos.length - 1;
                                                                }
                                                                return prev < videos.length - 1 ? prev + 1 : 0;
                                                            })
                                                        }
                                                        className={`absolute top-1/2 -translate-y-1/2
    ${isRTL ? 'left-3' : 'right-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2 z-10`}
                                                        aria-label="Next video"
                                                    >
                                                        {isRTL ? '‹' : '›'}
                                                    </button>

                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
                                    <Button variant="outline" onClick={handleGoToMeals}>
                                        {t("meals.page.footer.viewAll")}
                                    </Button>
                                    <Button onClick={handleGoBack}>
                                        {t("meals.page.footer.done")}
                                    </Button>
                                </div>
                            </div>
                        ) : null}

                        {/* Ingredient Details Dialog */}
                        <DetailsIngredient
                            isOpen={isDetailsOpen}
                            onOpenChange={setIsDetailsOpen}
                            ingredientId={selectedIngredientId}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
