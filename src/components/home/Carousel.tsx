import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { FileText, Utensils, Clock, Cog, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ItemDetailsDialog } from "./ItemDetailsDialog"
import { useTranslation } from 'react-i18next'

interface CarouselItemData {
    id: string;
    title?: string;
    name?: string;
    imagePath?: string;
    images?: string[] | Array<{ index: number; image: string }>;
    articleCategoryName?: string;
    mealCategoryName?: string;
    mealsCount?: number;
    createdAt?: string
}

interface CustomCarouselProps {
    title: string;
    data: CarouselItemData[];
    isLoading?: boolean;
    type: 'articles' | 'meals' | 'machines';
}

export function CustomCarousel({ title, data, isLoading = false, type }: CustomCarouselProps) {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
    const [dialogOpen, setDialogOpen] = useState(false)
    const navigate = useNavigate()
    // const { t } = useTranslation()
    const { t, i18n } = useTranslation()
    const isRTL = i18n.dir() === "rtl"

    const handleCardClick = (itemId: string) => {
        setSelectedItemId(itemId)
        setDialogOpen(true)
    }

    const handleMoreClick = (e: React.MouseEvent, _itemId: string) => {
        e.stopPropagation()

        switch (type) {
            case 'articles':
                navigate(`/article`)
                break
            case 'meals':
                navigate(`/meals`)
                break
            case 'machines':
                navigate(`/machines`)
                break
            default:
                navigate(`/`)
        }
    }

    const handleDialogOpenChange = (open: boolean) => {
        setDialogOpen(open)
        if (!open) {
            setSelectedItemId(null)
        }
    }

    if (isLoading) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-8 text-gray-900">{title}</h2>
                <div className="flex justify-start space-x-6 overflow-hidden">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="w-80 flex-shrink-0 border-0 shadow-lg rounded-2xl">
                            <CardContent className="p-0">
                                <div className="animate-pulse">
                                    <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 rounded-t-2xl"></div>
                                    <div className="p-6">
                                        <div className="bg-gray-200 h-5 rounded-lg mb-3"></div>
                                        <div className="bg-gray-200 h-4 rounded-lg w-3/4"></div>
                                        <div className="flex items-center mt-4">
                                            <div className="bg-gray-200 h-6 w-16 rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    if (!data || data.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold mb-8">{title}</h2>
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Cog className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">{t('customCarousel.noData')}</p>
                </div>
            </div>
        )
    }

    const getImageUrl = (imagePath: any) => {
        if (!imagePath) return null;
        if (Array.isArray(imagePath)) {
            if (imagePath.length === 0) return null;
            if (typeof imagePath[0] === 'string') {
                return `${import.meta.env.VITE_BASE_URL}/${imagePath[0]}`;
            }
            if (typeof imagePath[0] === 'object' && imagePath[0].image) {
                return `${import.meta.env.VITE_BASE_URL}/${imagePath[0].image}`;
            }
            return null;
        }
        return `${import.meta.env.VITE_BASE_URL}/${imagePath}`;
    };

    const getItemTitle = (item: CarouselItemData) => {
        return item.title || item.name || t('customCarousel.noTitle');
    };

    const getItemSubtitle = (item: CarouselItemData) => {
        switch (type) {
            case 'articles':
                return item.articleCategoryName || t('customCarousel.noCategory');
            case 'meals':
                return item.mealCategoryName || t('customCarousel.noCategory');
            case 'machines':
                return t('customCarousel.categoryLabels.machines');
            default:
                return "";
        }
    };

    const getItemCreatedAt = (item: CarouselItemData) => {
        const createdAt = item.createdAt;
        if (!createdAt) {
            return t('customCarousel.noDate');
        }
        try {
            const date = new Date(createdAt);
            const day = date.getDate().toString().padStart(2, '0');
            const month = date.toLocaleString('en-US', { month: 'short' });
            const year = date.getFullYear();

            return `${day} ${month} ${year}`;
        } catch (error) {
            return t('customCarousel.invalidDate');
        }
    };

    const getTypeIcon = () => {
        switch (type) {
            case 'articles':
                return <FileText className="h-6 w-6" />;
            case 'meals':
                return <Utensils className="h-6 w-6" />;
            case 'machines':
                return <Cog className="h-6 w-6" />;
            default:
                return <FileText className="h-6 w-6" />;
        }
    };

    const getTypeColor = () => {
        switch (type) {
            case 'articles':
                return {
                    bg: "bg-blue-500/10",
                    text: "text-blue-600",
                    border: "border-blue-200",
                    gradient: "from-blue-50 to-blue-100",
                    accent: "bg-blue-500",
                    hover: "hover:text-blue-700"
                };
            case 'meals':
                return {
                    bg: "bg-green-500/10",
                    text: "text-green-600",
                    border: "border-green-200",
                    gradient: "from-green-50 to-green-100",
                    accent: "bg-green-500",
                    hover: "hover:text-green-700"
                };
            case 'machines':
                return {
                    bg: "bg-purple-500/10",
                    text: "text-purple-600",
                    border: "border-purple-200",
                    gradient: "from-purple-50 to-purple-100",
                    accent: "bg-purple-500",
                    hover: "hover:text-purple-700"
                };
            default:
                return {
                    bg: "bg-gray-500/10",
                    text: "text-gray-600",
                    border: "border-gray-200",
                    gradient: "from-gray-50 to-gray-100",
                    accent: "bg-gray-500",
                    hover: "hover:text-gray-700"
                };
        }
    };

    const getTypeBadge = () => {
        switch (type) {
            case 'articles':
                return {
                    text: t('customCarousel.typeLabels.articles'),
                    icon: <FileText className="h-3 w-3" />
                };
            case 'meals':
                return {
                    text: t('customCarousel.typeLabels.meals'),
                    icon: <Utensils className="h-3 w-3" />
                };
            case 'machines':
                return {
                    text: t('customCarousel.typeLabels.machines'),
                    icon: <Cog className="h-3 w-3" />
                };
            default:
                return {
                    text: t('customCarousel.typeLabels.item'),
                    icon: <FileText className="h-3 w-3" />
                };
        }
    };

    const colors = getTypeColor();
    const badge = getTypeBadge();

    return (
        <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold ">{title}</h2>
                </div>

                <div className="relative">
                    <Carousel
                        opts={{
                            align: "start",
                            loop: true,
                            direction: isRTL ? "rtl" : "ltr",
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="ml-0 -mr-4">
                            {data.map((item) => {
                                const imageUrl = getImageUrl(item.images || item.imagePath);
                                const hasImage = imageUrl;
                                return (
                                    <CarouselItem
                                        key={item.id}
                                        className="pl-0 pr-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                                    >
                                        <div className="h-full">
                                            <Card
                                                className={`
                                                    overflow-hidden h-full border-0 shadow-sm hover:shadow-xl 
                                                    transition-all duration-500 rounded-2xl
                                                    hover:scale-105 cursor-pointer
                                                    ${colors.border}
                                                `}
                                                onClick={() => handleCardClick(item.id)}
                                            >
                                                <CardContent className="p-0 flex flex-col h-full">
                                                    {/* Image Section */}
                                                    {hasImage ? (
                                                        <div className="relative h-48 overflow-hidden">
                                                            <img
                                                                src={imageUrl}
                                                                alt={getItemTitle(item)}
                                                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                                                        </div>
                                                    ) : (
                                                        <div className="relative h-48 overflow-hidden">
                                                            <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}`}></div>
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-y-16 translate-x-16"></div>
                                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full translate-y-12 -translate-x-12"></div>
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <div className={`p-4 rounded-2xl ${colors.bg} ${colors.text} transform hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                                                    {getTypeIcon()}
                                                                </div>
                                                            </div>
                                                            <div className="absolute top-4 left-4">
                                                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm bg-white/80 ${colors.text} border ${colors.border}`}>
                                                                    {badge.icon}
                                                                    {badge.text}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Content */}
                                                    <div className="p-6 flex-grow flex flex-col">
                                                        <h3 className="font-bold text-lg mb-2  line-clamp-2 leading-tight">
                                                            {getItemTitle(item)}
                                                        </h3>

                                                        <p className="text-sm mb-4 line-clamp-2 leading-relaxed">
                                                            {getItemSubtitle(item)}
                                                        </p>

                                                        <div className="mt-auto flex items-center justify-between">
                                                            <div className="flex items-center gap-1.5 text-sm text-gray-500">
                                                                <Clock className="h-4 w-4" />
                                                                <span>{getItemCreatedAt(item)}</span>
                                                            </div>

                                                            <button
                                                                onClick={(e) => handleMoreClick(e, item.id)}
                                                                className={`
                                                                    flex items-center gap-1 text-sm font-medium 
                                                                    ${colors.text} ${colors.hover}
                                                                    transition-all duration-300
                                                                    group cursor-pointer
                                                                `}
                                                            >
                                                                {t('customCarousel.more')}
                                                                <ArrowRight className="h-3 w-3 transition-transform duration-300" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>

                        {/* Navigation Buttons */}
                        {/* {data.length > 4 && (
                            <>
                                <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-300 shadow-lg hover:shadow-xl hover:bg-white hover:scale-110 transition-all duration-300" />
                                <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm border-gray-300 shadow-lg hover:shadow-xl hover:bg-white hover:scale-110 transition-all duration-300" />
                            </>
                        )} */}
                        {data.length > 4 && (
                            <>
                                <CarouselPrevious
                                    className={`
                absolute top-1/2 -translate-y-1/2 hidden sm:flex
                h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm
                border-gray-300 shadow-lg hover:shadow-xl hover:bg-white hover:scale-110 transition-all duration-300
                ${isRTL ? "right-[95%]" : "left-2"}
            `}
                                />
                                <CarouselNext
                                    className={`
                absolute top-1/2 -translate-y-1/2 hidden sm:flex
                h-10 w-10 rounded-full bg-white/80 backdrop-blur-sm
                border-gray-300 shadow-lg hover:shadow-xl hover:bg-white hover:scale-110 transition-all duration-300
                ${isRTL ? "left-[6%]" : "right-0"}
            `}
                                />
                            </>
                        )}

                    </Carousel>
                </div>

                {/* Mobile indicators */}
                {data.length > 1 && (
                    <div className="flex justify-center gap-2 mt-6 sm:hidden">
                        {data.map((_, index) => (
                            <div
                                key={index}
                                className="w-2 h-2 rounded-full bg-gray-300"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Dialog */}
            {selectedItemId && (
                <ItemDetailsDialog
                    open={dialogOpen}
                    onOpenChange={handleDialogOpenChange}
                    itemId={selectedItemId}
                    type={type}
                />
            )}
        </>
    )
}