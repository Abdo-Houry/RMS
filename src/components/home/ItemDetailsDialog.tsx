import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Utensils, Cog, Tag, ChevronLeft, ChevronRight, ImageIcon, Video } from "lucide-react"
import { useGetArticleByIdQuery, useGetArticleByIdStaffQuery } from "@/api/feature/articles/getSlices"
import { useGetMealsByIdQuery, useGetMealsByIdStaffQuery } from "@/api/feature/meals/getSlice"
import { useGetMachinesByIdQuery, useGetMachinesByIdStaffQuery } from "@/api/feature/machines/getSlice"
import { useUserRole } from "@/hooks/useUserRole"
import { useTranslation } from "react-i18next"
import i18n from "@/i18n"

interface ItemDetailsDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    itemId: string
    type: 'articles' | 'meals' | 'machines'
}

interface MediaItem {
    type: 'image' | 'video'
    url: string
    alt?: string
}

export function ItemDetailsDialog({ open, onOpenChange, itemId, type }: ItemDetailsDialogProps) {
    const { t } = useTranslation()
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0)
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
    const { isStaff, isLoading: roleLoading } = useUserRole()

    const articleQuery = isStaff
        ? useGetArticleByIdStaffQuery(itemId, { skip: !open && !isStaff || roleLoading || type !== 'articles' })
        : useGetArticleByIdQuery(itemId, { skip: !open && isStaff || roleLoading || type !== 'articles' })

    const mealQuery = isStaff
        ? useGetMealsByIdStaffQuery(itemId, { skip: !open && !isStaff || roleLoading || type !== 'meals' })
        : useGetMealsByIdQuery(itemId, { skip: !open && isStaff || roleLoading || type !== 'meals' })

    const machineQuery = isStaff
        ? useGetMachinesByIdStaffQuery(itemId, { skip: !open && !isStaff || roleLoading || type !== 'machines' })
        : useGetMachinesByIdQuery(itemId, { skip: !open && isStaff || roleLoading || type !== 'machines' })

    const getQueryData = () => {
        switch (type) {
            case 'articles':
                return articleQuery
            case 'meals':
                return mealQuery
            case 'machines':
                return machineQuery
            default:
                return { data: null, isLoading: false }
        }
    }

    const { data, isLoading } = getQueryData()
    const itemData = data?.data

    // معالجة الصور والفيديوهات
    useEffect(() => {
        if (itemData) {
            const items: MediaItem[] = []

            // معالجة الصور بناءً على نوع البيانات
            if (type === 'articles') {
                // مقالات: images هي مصفوفة strings
                if (itemData.images && Array.isArray(itemData.images)) {
                    itemData.images.forEach((img: string, index: number) => {
                        items.push({
                            type: 'image',
                            url: `${import.meta.env.VITE_BASE_URL}/${img}`,
                            alt: `${itemData.title} - ${t('itemDetails.fields.image', { number: index + 1 })}`
                        })
                    })
                }
            } else if (type === 'meals') {
                // وجبات: images هي مصفوفة objects
                if (itemData.images && Array.isArray(itemData.images)) {
                    itemData.images.forEach((img: any, index: number) => {
                        const imageUrl = img.image || img
                        items.push({
                            type: 'image',
                            url: `${import.meta.env.VITE_BASE_URL}/${imageUrl}`,
                            alt: `${itemData.name} - ${t('itemDetails.fields.image', { number: index + 1 })}`
                        })
                    })
                }

                // إضافة الفيديوهات
                if (itemData.videos && Array.isArray(itemData.videos)) {
                    itemData.videos.forEach((video: string, index: number) => {
                        items.push({
                            type: 'video',
                            url: `${import.meta.env.VITE_BASE_URL}/${video}`,
                            alt: `${itemData.name} - ${t('itemDetails.fields.video', { number: index + 1 })}`
                        })
                    })
                }
            } else if (type === 'machines') {
                // آلات: images هي مصفوفة strings
                if (itemData.images && Array.isArray(itemData.images)) {
                    itemData.images.forEach((img: string, index: number) => {
                        items.push({
                            type: 'image',
                            url: `${import.meta.env.VITE_BASE_URL}/${img}`,
                            alt: `${itemData.name} - ${t('itemDetails.fields.image', { number: index + 1 })}`
                        })
                    })
                }
            }

            // الصورة الرئيسية كاحتياطي
            if (items.length === 0 && itemData.imagePath) {
                items.push({
                    type: 'image',
                    url: `${import.meta.env.VITE_BASE_URL}/${itemData.imagePath}`,
                    alt: itemData.title || itemData.name || t('itemDetails.fields.noTitle')
                })
            }

            setMediaItems(items)
            setCurrentMediaIndex(0)
        }
    }, [itemData, type, t])

    // const handlePreviousMedia = () => {
    //     setCurrentMediaIndex(prev =>
    //         prev > 0 ? prev - 1 : mediaItems.length - 1
    //     )
    // }

    // const handleNextMedia = () => {
    //     setCurrentMediaIndex(prev =>
    //         prev < mediaItems.length - 1 ? prev + 1 : 0
    //     )
    // }
    const isRTL = i18n.language === "ar";

    const handlePreviousMedia = () => {
        setCurrentMediaIndex(prev => {
            if (isRTL) {
                return prev < mediaItems.length - 1 ? prev + 1 : 0;
            }
            return prev > 0 ? prev - 1 : mediaItems.length - 1;
        });
    };

    const handleNextMedia = () => {
        setCurrentMediaIndex(prev => {
            if (isRTL) {
                return prev > 0 ? prev - 1 : mediaItems.length - 1;
            }
            return prev < mediaItems.length - 1 ? prev + 1 : 0;
        });
    };
    const getTypeIcon = () => {
        switch (type) {
            case 'articles':
                return <FileText className="h-6 w-6" />
            case 'meals':
                return <Utensils className="h-6 w-6" />
            case 'machines':
                return <Cog className="h-6 w-6" />
            default:
                return <FileText className="h-6 w-6" />
        }
    }

    const getTypeTitle = () => {
        switch (type) {
            case 'articles':
                return t('itemDetails.title.articles')
            case 'meals':
                return t('itemDetails.title.meals')
            case 'machines':
                return t('itemDetails.title.machines')
            default:
                return t('itemDetails.title.default')
        }
    }

    // دالة للحصول على اسم النوع للرسالة
    const getTypeNameForMessage = () => {
        switch (type) {
            case 'articles':
                return t('itemDetails.types.article')
            case 'meals':
                return t('itemDetails.types.meal')
            case 'machines':
                return t('itemDetails.types.machine')
            default:
                return 'item'
        }
    }

    if (isLoading) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {getTypeIcon()}
                            {t('itemDetails.loading')}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="animate-pulse space-y-4">
                        <div className="bg-gray-200 h-48 rounded-lg"></div>
                        <div className="space-y-2">
                            <div className="bg-gray-200 h-6 rounded w-3/4"></div>
                            <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                            <div className="bg-gray-200 h-4 rounded w-2/3"></div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getTypeIcon()}
                        {getTypeTitle()}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Media Carousel */}
                    {mediaItems.length > 0 ? (
                        <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                            {/* Carousel Container */}
                            <div className="relative h-64 sm:h-80 overflow-hidden">
                                <div
                                    className="flex transition-transform duration-300 ease-in-out h-full"
                                    dir="ltr"
                                    style={{
                                        transform: `translateX(-${currentMediaIndex * 100}%)`
                                    }}
                                >
                                    {mediaItems.map((item, index) => (
                                        <div
                                            key={index}
                                            className="w-full flex-shrink-0 h-full"
                                        >
                                            {item.type === 'image' ? (
                                                <img
                                                    src={item.url}
                                                    alt={item.alt}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                                    <video
                                                        controls
                                                        className="max-w-full max-h-full"
                                                    >
                                                        <source src={item.url} type="video/mp4" />
                                                        {t('itemDetails.videoNotSupported')}
                                                    </video>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* Navigation Arrows */}
                                {mediaItems.length > 1 && (
                                    <>
                                        {/* <button
                                            type="button"
                                            onClick={handlePreviousMedia}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                            aria-label={t('itemDetails.previous')}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextMedia}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-all duration-200 z-10"
                                            aria-label={t('itemDetails.next')}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </button> */}
                                        <button
                                            type="button"
                                            onClick={handlePreviousMedia}
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
                                        <button
                                            type="button"
                                            onClick={handleNextMedia}
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

                            {/* Media Type Indicator */}
                            <div className="absolute top-3 right-3 flex gap-2">
                                {mediaItems[currentMediaIndex].type === 'video' && (
                                    <div className="bg-purple-600 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                        <Video className="h-3 w-3" />
                                        {t('itemDetails.video')}
                                    </div>
                                )}
                            </div>

                            {/* Dots Navigation */}
                            {mediaItems.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex justify-center gap-1.5 z-10">
                                    {mediaItems.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => setCurrentMediaIndex(index)}
                                            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${currentMediaIndex === index
                                                ? 'bg-white scale-125'
                                                : 'bg-white/50 hover:bg-white/70'
                                                }`}
                                            aria-label={t('itemDetails.goToMedia', { index: index + 1 })}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Media Counter */}
                            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                {currentMediaIndex + 1} / {mediaItems.length}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 font-medium text-lg">
                                {t('itemDetails.noMedia')}
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                                {t('itemDetails.noMediaDesc', { type: getTypeNameForMessage() })}
                            </p>
                        </div>
                    )}

                    {/* Title */}
                    <div>
                        <h2 className="text-2xl font-bold">
                            {itemData?.title || itemData?.name || t('itemDetails.fields.noTitle')}
                        </h2>
                    </div>

                    {/* Details based on type */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Articles Details */}
                        {type === 'articles' && (
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{t('itemDetails.fields.category')}</span>
                                <span className="text-sm font-medium">
                                    {itemData?.articleCategoryName || t('itemDetails.fields.noCategory')}
                                </span>
                            </div>
                        )}

                        {/* Meals Details */}
                        {type === 'meals' && (
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{t('itemDetails.fields.category')}</span>
                                <span className="text-sm font-medium">
                                    {itemData?.mealCategoryName || t('itemDetails.fields.noCategory')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Description for articles */}
                    {type === 'articles' && itemData?.body && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{t('itemDetails.fields.description')}</h3>
                            <p className="leading-relaxed whitespace-pre-line">{itemData.body}</p>
                        </div>
                    )}

                    {/* Description for meals */}
                    {type === 'meals' && itemData?.description && (
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{t('itemDetails.fields.description')}</h3>
                            <p className="leading-relaxed whitespace-pre-line">{itemData.description}</p>
                        </div>
                    )}

                    {/* Price for meals */}
                    {type === 'meals' && itemData?.price && (
                        <div className="bg-green-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-green-800">{t('itemDetails.fields.price')}</h3>
                            <p className="text-2xl font-bold text-green-600">${itemData.price}</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}