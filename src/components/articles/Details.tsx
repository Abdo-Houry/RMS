// // src/pages/ArticleDetailsPage.tsx
// import { Button } from "@/components/ui/button";
// import { useGetArticleByIdQuery, useGetArticleByIdStaffQuery } from "@/api/feature/articles/getSlices";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Skeleton } from "@/components/ui/skeleton";
// import { FileText, Image as ImageIcon } from "lucide-react";
// import { useUserRole } from "@/hooks/useUserRole";
// import { useParams, useNavigate } from "react-router-dom";
// import { useTranslation } from 'react-i18next'

// interface ArticleDetailsPageProps {
//     articleId?: string;
// }

// export default function ArticleDetailsPage({ articleId: propArticleId }: ArticleDetailsPageProps) {
//     const navigate = useNavigate();
//     const { id: paramId } = useParams<{ id: string }>();
//     const { t } = useTranslation();

//     // استخدام الـ ID من props أو من params
//     const articleId = propArticleId || paramId;

//     if (!articleId) {
//         navigate("/articles");
//         return null;
//     }

//     // استخدام الـ hook بدلاً من useState و useEffect
//     const { isStaff, isLoading: roleLoading } = useUserRole();

//     // استخدام الاستعلام المناسب بناءً على دور المستخدم
//     const { data, isLoading, isError } = isStaff
//         ? useGetArticleByIdStaffQuery(articleId, {
//             skip: !isStaff || roleLoading,
//         })
//         : useGetArticleByIdQuery(articleId, {
//             skip: isStaff || roleLoading,
//         });

//     const article = data?.data;

//     const handleGoBack = () => {
//         navigate(-1);
//     };

//     const handleGoToArticles = () => {
//         navigate("/article");
//     };

//     return (
//         <div className="min-h-screen">
//             {/* Main Content */}
//             <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
//                 <div className="max-w-full mx-auto">
//                     <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//                         {/* Loading state skeleton */}
//                         {isLoading ? (
//                             <div className="p-6 space-y-6">
//                                 <div className="space-y-3">
//                                     <Skeleton className="h-8 w-3/4" />
//                                     <Skeleton className="h-4 w-full" />
//                                     <Skeleton className="h-4 w-2/3" />
//                                 </div>
//                                 <div className="space-y-3">
//                                     <Skeleton className="h-6 w-32" />
//                                     <Skeleton className="h-32 w-full" />
//                                 </div>
//                                 <div className="space-y-3">
//                                     <Skeleton className="h-6 w-28" />
//                                     <Skeleton className="h-8 w-40" />
//                                 </div>
//                                 <div className="space-y-3">
//                                     <Skeleton className="h-6 w-36" />
//                                     <Skeleton className="h-48 w-full rounded-lg" />
//                                 </div>
//                             </div>
//                         ) : isError ? (
//                             <div className="p-8 text-center">
//                                 <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <FileText className="h-8 w-8 text-red-500" />
//                                 </div>
//                                 <h2 className="text-lg font-semibold text-red-600 mb-2">
//                                     {t('articles.details.failedTitle')}
//                                 </h2>
//                                 <p className=" mb-6">
//                                     {t('articles.details.failedMessage')}
//                                 </p>
//                                 <div className="flex flex-col sm:flex-row gap-3 justify-center">
//                                     <Button onClick={handleGoToArticles}>
//                                         {t('articles.details.backToArticles')}
//                                     </Button>
//                                     <Button variant="outline" onClick={handleGoBack}>
//                                         {t('articles.details.goBack')}
//                                     </Button>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="p-4 sm:p-6 lg:p-8">
//                                 {/* Title Section */}
//                                 <div className="mb-8">
//                                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
//                                         <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
//                                             {article?.title}
//                                         </h2>
//                                         <Badge
//                                             variant="secondary"
//                                             className="px-4 py-2 text-sm sm:text-base bg-purple-100 text-purple-800 border-purple-200 self-start sm:self-center"
//                                         >
//                                             {article?.articleCategoryName}
//                                         </Badge>
//                                     </div>
//                                     <Separator className="bg-gray-200" />
//                                 </div>

//                                 {/* Content Section */}
//                                 <div className="mb-8">
//                                     <div className="flex items-center gap-2 mb-4">
//                                         <div className="p-2 bg-green-50 rounded-lg">
//                                             <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
//                                         </div>
//                                         <h3 className="font-semibold text-lg sm:text-xl">
//                                             {t('articles.details.content')}
//                                         </h3>
//                                     </div>

//                                     <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
//                                         <div
//                                             className="prose prose-sm sm:prose max-w-none text-gray-700"
//                                             dangerouslySetInnerHTML={{ __html: article?.body || "" }}
//                                         />
//                                     </div>
//                                 </div>

//                                 <Separator className="bg-gray-200 mb-8" />

//                                 {/* Image Section */}
//                                 <div>
//                                     <div className="flex items-center gap-2 mb-4">
//                                         <div className="p-2 bg-orange-50 rounded-lg">
//                                             <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
//                                         </div>
//                                         <h3 className="font-semibold text-lg sm:text-xl">
//                                             {t('articles.details.featuredImage')}
//                                         </h3>
//                                     </div>

//                                     {article?.imagePath ? (
//                                         <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
//                                             <img
//                                                 src={
//                                                     article.imagePath.startsWith("http")
//                                                         ? article.imagePath
//                                                         : `${import.meta.env.VITE_BASE_URL}/${article.imagePath}`
//                                                 }
//                                                 alt={article?.title || "Article Image"}
//                                                 className="w-full h-auto max-h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
//                                             />
//                                             <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//                                         </div>
//                                     ) : (
//                                         <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
//                                             <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
//                                             <p className="text-gray-600 font-medium text-lg sm:text-xl">
//                                                 {t('articles.details.noImage')}
//                                             </p>
//                                             <p className=" text-sm sm:text-base mt-2">
//                                                 {t('articles.details.noImageDesc')}
//                                             </p>
//                                         </div>
//                                     )}
//                                 </div>

//                                 {/* Footer Actions */}
//                                 <div className="mt-8 pt-6 border-t border-gray-200">
//                                     <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
//                                         <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//                                             <Button
//                                                 variant="outline"
//                                                 onClick={handleGoToArticles}
//                                                 className="w-full sm:w-auto"
//                                             >
//                                                 {t('articles.details.viewAll')}
//                                             </Button>
//                                             <Button
//                                                 onClick={handleGoBack}
//                                                 className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
//                                             >
//                                                 {t('articles.details.done')}
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
// src/pages/ArticleDetailsPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useGetArticleByIdQuery, useGetArticleByIdStaffQuery } from "@/api/feature/articles/getSlices";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Image as ImageIcon, ChevronLeft, ChevronRight, Video } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'
import i18n from "@/i18n";

interface ArticleDetailsPageProps {
    articleId?: string;
}

export default function ArticleDetailsPage({ articleId: propArticleId }: ArticleDetailsPageProps) {
    const navigate = useNavigate();
    const { id: paramId } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [articleImages, setArticleImages] = useState<string[]>([]);
    const [articleVideos, setArticleVideos] = useState<string[]>([]);
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

    // استخدام الـ ID من props أو من params
    const articleId = propArticleId || paramId;

    if (!articleId) {
        navigate("/articles");
        return null;
    }

    // استخدام الـ hook بدلاً من useState و useEffect
    const { isStaff, isLoading: roleLoading } = useUserRole();

    // استخدام الاستعلام المناسب بناءً على دور المستخدم
    const { data, isLoading, isError } = isStaff
        ? useGetArticleByIdStaffQuery(articleId, {
            skip: !isStaff || roleLoading,
        })
        : useGetArticleByIdQuery(articleId, {
            skip: isStaff || roleLoading,
        });

    const article = data?.data;

    // تحديث الصور عند تغيير البيانات
    useEffect(() => {
        if (article) {
            // إذا كان هناك مصفوفة images، استخدمها
            if (article.images && Array.isArray(article.images) && article.images.length > 0) {
                const imageUrls = article.images.map((imgPath: string) =>
                    imgPath.startsWith("http") ? imgPath : `${import.meta.env.VITE_BASE_URL}/${imgPath}`
                );
                setArticleImages(imageUrls);
                setCurrentImageIndex(0);
            }
            // إذا لم يكن هناك images ولكن هناك imagePath كاحتياطي للنظام القديم
            else if (article.imagePath) {
                const imageUrl = article.imagePath.startsWith("http")
                    ? article.imagePath
                    : `${import.meta.env.VITE_BASE_URL}/${article.imagePath}`;
                setArticleImages([imageUrl]);
                setCurrentImageIndex(0);
            } else {
                setArticleImages([]);
            }
            if (article.videos && Array.isArray(article.videos) && article.videos.length > 0) {
                const videoUrls = article.videos.map((vidPath: string) =>
                    vidPath.startsWith("http") ? vidPath : `${import.meta.env.VITE_BASE_URL}/${vidPath}`
                );
                setArticleVideos(videoUrls);
                setCurrentVideoIndex(0);
            } else {
                setArticleVideos([]);
            }
        }
    }, [article]);
    const isRTL = i18n.language === "ar";

    const handlePreviousImage = () => {
        setCurrentImageIndex(prev => {
            if (isRTL) {
                return prev < articleImages.length - 1 ? prev + 1 : 0;
            }
            return prev > 0 ? prev - 1 : articleImages.length - 1;
        });
    };

    const handleNextImage = () => {
        setCurrentImageIndex(prev => {
            if (isRTL) {
                return prev > 0 ? prev - 1 : articleImages.length - 1;
            }
            return prev < articleImages.length - 1 ? prev + 1 : 0;
        });
    };
    const handlePreviousVideo = () => {
        setCurrentVideoIndex(prev => {
            if (isRTL) {
                return prev > 0 ? prev - 1 : articleVideos.length - 1;
            }
            return prev > 0 ? prev - 1 : articleVideos.length - 1;
        });
    };

    const handleNextVideo = () => {
        setCurrentVideoIndex(prev => {
            if (isRTL) {
                return prev < articleVideos.length - 1 ? prev + 1 : 0;
            }
            return prev < articleVideos.length - 1 ? prev + 1 : 0;
        });
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleGoToArticles = () => {
        navigate("/article");
    };

    return (
        <div className="min-h-screen">
            {/* Main Content */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="max-w-full mx-auto">
                    <div className="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Loading state skeleton */}
                        {isLoading ? (
                            <div className="p-6 space-y-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-8 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-32" />
                                    <Skeleton className="h-32 w-full" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-28" />
                                    <Skeleton className="h-8 w-40" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-6 w-36" />
                                    <Skeleton className="h-48 w-full rounded-lg" />
                                </div>
                            </div>
                        ) : isError ? (
                            <div className="p-8 text-center">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="h-8 w-8 text-red-500" />
                                </div>
                                <h2 className="text-lg font-semibold text-red-600 mb-2">
                                    {t('articles.details.failedTitle')}
                                </h2>
                                <p className=" mb-6">
                                    {t('articles.details.failedMessage')}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button onClick={handleGoToArticles}>
                                        {t('articles.details.backToArticles')}
                                    </Button>
                                    <Button variant="outline" onClick={handleGoBack}>
                                        {t('articles.details.goBack')}
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 sm:p-6 lg:p-8">
                                {/* Title Section */}
                                <div className="mb-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                                            {article?.title}
                                        </h2>
                                        <Badge
                                            variant="secondary"
                                            className="px-4 py-2 text-sm sm:text-base bg-purple-100 text-purple-800 border-purple-200 self-start sm:self-center"
                                        >
                                            {article?.articleCategoryName}
                                        </Badge>
                                    </div>
                                    <Separator className="bg-gray-200" />
                                </div>

                                {/* Content Section */}
                                <div className="mb-8">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-2 bg-green-50 rounded-lg">
                                            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-lg sm:text-xl">
                                            {t('articles.details.content')}
                                        </h3>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                                        <div
                                            className="prose prose-sm sm:prose max-w-none text-gray-700"
                                            dangerouslySetInnerHTML={{ __html: article?.body || "" }}
                                        />
                                    </div>
                                </div>

                                <Separator className="bg-gray-200 mb-8" />

                                {/* Image Section with Carousel */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-orange-50 rounded-lg">
                                                <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
                                            </div>
                                            <h3 className="font-semibold text-lg sm:text-xl">
                                                {articleImages.length > 1
                                                    ? t('articles.details.featuredImage')
                                                    : t('articles.details.featuredImage')
                                                }
                                            </h3>
                                        </div>
                                        {articleImages.length > 1 && (
                                            <span className="text-sm text-gray-500">
                                                {currentImageIndex + 1} / {articleImages.length}
                                            </span>
                                        )}
                                    </div>

                                    {articleImages.length > 0 ? (
                                        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            {/* Carousel Container */}
                                            <div className="relative h-64 sm:h-80 overflow-hidden">
                                                <div
                                                    className="flex transition-transform duration-300 ease-in-out h-full"
                                                    dir="ltr"
                                                    style={{
                                                        transform: `translateX(-${currentImageIndex * 100}%)`
                                                    }}
                                                >
                                                    {articleImages.map((imageUrl, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-full flex-shrink-0 h-full"
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt={`${article?.title} - Image ${index + 1}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Navigation Arrows */}
                                                {articleImages.length > 1 && (
                                                    <>
                                                        {/* <button
                                                            type="button"
                                                            onClick={handlePreviousImage}
                                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                            aria-label="Previous image"
                                                        >
                                                            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                                        </button> */}
                                                        <button
                                                            type="button"
                                                            onClick={handlePreviousImage}
                                                            className={`absolute top-1/2 -translate-y-1/2 
    ${isRTL ? 'right-3' : 'left-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2 
    transition-all duration-200 z-10`}
                                                            aria-label="Previous image"
                                                        >
                                                            {isRTL ? (
                                                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            ) : (
                                                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            )}
                                                        </button>

                                                        {/* <button
                                                            type="button"
                                                            onClick={handleNextImage}
                                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                                            aria-label="Next image"
                                                        >
                                                            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                                        </button> */}
                                                        <button
                                                            type="button"
                                                            onClick={handleNextImage}
                                                            className={`absolute top-1/2 -translate-y-1/2 
    ${isRTL ? 'left-3' : 'right-3'}
    bg-black/50 hover:bg-black/70 text-white rounded-full p-2 
    transition-all duration-200 z-10`}
                                                            aria-label="Next image"
                                                        >
                                                            {isRTL ? (
                                                                <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            ) : (
                                                                <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                                            )}
                                                        </button>

                                                    </>
                                                )}
                                            </div>

                                            {/* Dots Navigation */}
                                            {articleImages.length > 1 && (
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
                                                    {articleImages.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setCurrentImageIndex(index)}
                                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${currentImageIndex === index
                                                                ? 'bg-white scale-125'
                                                                : 'bg-white/50 hover:bg-white/70'
                                                                }`}
                                                            aria-label={`Go to image ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium text-lg sm:text-xl">
                                                {t('articles.details.noImage')}
                                            </p>
                                            <p className="text-sm sm:text-base mt-2">
                                                {t('articles.details.noImageDesc')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                {/* Video Section with Carousel */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 bg-purple-50 rounded-lg">
                                                <Video className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                                            </div>
                                            <h3 className="font-semibold text-lg sm:text-xl">
                                                {articleVideos.length > 1
                                                    ? t('articles.details.videos')
                                                    : t('articles.details.videos')}
                                            </h3>
                                        </div>
                                        {articleVideos.length > 1 && (
                                            <span className="text-sm text-gray-500">
                                                {currentVideoIndex + 1} / {articleVideos.length}
                                            </span>
                                        )}
                                    </div>

                                    {articleVideos.length > 0 ? (
                                        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                            {/* Carousel Container */}
                                            <div className="relative h-64 sm:h-80 overflow-hidden">
                                                <div
                                                    className="flex transition-transform duration-300 ease-in-out h-full"
                                                    dir="ltr"
                                                    style={{
                                                        transform: `translateX(-${currentVideoIndex * 100}%)`
                                                    }}
                                                >
                                                    {articleVideos.map((videoUrl, index) => (
                                                        <div
                                                            key={index}
                                                            className="w-full flex-shrink-0 h-full"
                                                        >
                                                            <video
                                                                src={videoUrl}
                                                                controls
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Navigation Arrows */}
                                                {articleVideos.length > 1 && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={handlePreviousVideo}
                                                            className={`absolute top-1/2 -translate-y-1/2 
                                ${isRTL ? 'right-3' : 'left-3'}
                                bg-black/50 hover:bg-black/70 text-white rounded-full p-2 
                                transition-all duration-200 z-10`}
                                                            aria-label="Previous video"
                                                        >
                                                            {isRTL ? <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" /> : <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={handleNextVideo}
                                                            className={`absolute top-1/2 -translate-y-1/2 
                                ${isRTL ? 'left-3' : 'right-3'}
                                bg-black/50 hover:bg-black/70 text-white rounded-full p-2 
                                transition-all duration-200 z-10`}
                                                            aria-label="Next video"
                                                        >
                                                            {isRTL ? <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" /> : <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />}
                                                        </button>
                                                    </>
                                                )}
                                            </div>

                                            {/* Dots Navigation */}
                                            {articleVideos.length > 1 && (
                                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
                                                    {articleVideos.map((_, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => setCurrentVideoIndex(index)}
                                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${currentVideoIndex === index
                                                                ? 'bg-white scale-125'
                                                                : 'bg-white/50 hover:bg-white/70'
                                                                }`}
                                                            aria-label={`Go to video ${index + 1}`}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                            <Video className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 font-medium text-lg sm:text-xl">
                                                {t('articles.details.noVideo')}
                                            </p>
                                            <p className="text-sm sm:text-base mt-2">
                                                {t('articles.details.noVideoDesc')}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Footer Actions */}
                                <div className="mt-8 pt-6 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                            <Button
                                                variant="outline"
                                                onClick={handleGoToArticles}
                                                className="w-full sm:w-auto"
                                            >
                                                {t('articles.details.viewAll')}
                                            </Button>
                                            <Button
                                                onClick={handleGoBack}
                                                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                                            >
                                                {t('articles.details.done')}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}