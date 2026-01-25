// import React, { useState, useEffect, useCallback } from 'react';
// import { X, Hash, FileText } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { useHomeSliderQuery } from '@/api/feature/homeSlider/getSlice';
// import { useTranslation } from 'react-i18next';

// interface CarouselItem {
//     title: string;
//     description: string | null;
//     image: string;
//     details: Array<{ key: string; value: string }>;
// }

// interface CarouselDialogProps {
//     onClose?: () => void;
//     isOpen?: boolean; // إضافة خاصية isOpen من الخارج
// }

// export const CarouselDialog: React.FC<CarouselDialogProps> = ({ onClose, isOpen: externalIsOpen = true }) => {
//     const { t } = useTranslation();
//     // استخدام externalIsOpen كقيمة أولية
//     const [isOpen, setIsOpen] = useState<boolean>(externalIsOpen);
//     const [currentIndex, setCurrentIndex] = useState(0);
//     const [isPlaying, setIsPlaying] = useState(true);
//     const { data, isLoading, error } = useHomeSliderQuery({});

//     const items: CarouselItem[] = data?.data || [];
//     const totalItems = items.length;
//     const interval = 2000;

//     // إعادة تعيين isOpen عندما يتغير externalIsOpen
//     useEffect(() => {
//         setIsOpen(externalIsOpen);
//         if (externalIsOpen) {
//             setIsPlaying(true); // إعادة تشغيل التشغيل التلقائي عند الفتح
//         }
//     }, [externalIsOpen]);

//     // تغيير الشريحة تلقائياً
//     useEffect(() => {
//         if (!isPlaying || totalItems <= 1 || !isOpen) return;

//         const timer = setInterval(() => {
//             setCurrentIndex((prev) => (prev + 1) % totalItems);
//         }, interval);

//         return () => clearInterval(timer);
//     }, [isPlaying, totalItems, interval, isOpen]);

//     const goToNext = useCallback(() => {
//         setCurrentIndex((prev) => (prev + 1) % totalItems);
//     }, [totalItems]);

//     const goToPrev = useCallback(() => {
//         setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
//     }, [totalItems]);

//     const goToSlide = useCallback((index: number) => {
//         setCurrentIndex(index);
//     }, []);

//     const togglePlayPause = useCallback(() => {
//         setIsPlaying(!isPlaying);
//     }, [isPlaying]);

//     const handleClose = useCallback(() => {
//         setIsPlaying(false);
//         setIsOpen(false);
//         // إذا تم تمرير onClose، نستدعيه
//         if (onClose) {
//             onClose();
//         }
//     }, [onClose]);

//     const handleKeyDown = useCallback((e: KeyboardEvent) => {
//         if (!isOpen) return;

//         switch (e.key) {
//             case 'ArrowLeft':
//             case 'ArrowRight':
//                 e.preventDefault();
//                 e.key === 'ArrowLeft' ? goToPrev() : goToNext();
//                 break;
//             case ' ':
//                 e.preventDefault();
//                 togglePlayPause();
//                 break;
//             case 'Escape':
//                 e.preventDefault();
//                 handleClose();
//                 break;
//         }
//     }, [isOpen, goToPrev, goToNext, togglePlayPause, handleClose]);

//     useEffect(() => {
//         window.addEventListener('keydown', handleKeyDown);
//         return () => window.removeEventListener('keydown', handleKeyDown);
//     }, [handleKeyDown]);

//     // بناء عنوان الصورة
//     const getImageUrl = useCallback((imagePath: string) => {
//         return `${import.meta.env.VITE_BASE_URL}/${imagePath}`;
//     }, []);

//     // إذا تم إغلاق النافذة، لا نعرض أي شيء
//     if (!isOpen) {
//         return null;
//     }

//     if (isLoading) {
//         return (
//             <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
//                 <div className="relative">
//                     <div className="animate-spin rounded-full h-24 w-24 border-[6px] border-transparent border-t-white border-r-white/30"></div>
//                     <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="text-white text-xl font-light"></div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (error || !items.length) {
//         return (
//             <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
//                 <div className="flex flex-col items-center justify-center text-white p-8 max-w-lg text-center">
//                     <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
//                         <X className="h-12 w-12 text-red-400" />
//                     </div>
//                     <p className="text-2xl font-light mb-4">{t('homeSlide.error.title')}</p>
//                     <p className="text-gray-400 mb-8">{t('homeSlide.error.message')}</p>
//                     <Button
//                         onClick={handleClose}
//                         className="px-10 py-3 text-lg bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
//                     >
//                         {t('homeSlide.error.close')}
//                     </Button>
//                 </div>
//             </div>
//         );
//     }

//     const currentItem = items[currentIndex];
//     const imageUrl = getImageUrl(currentItem.image);

//     // تحديد نوع المحتوى
//     const getContentType = () => {
//         if (currentItem.image.includes('meals')) return { type: t('homeSlide.contentTypes.meal'), icon: '🍽️', color: 'from-emerald-500 to-teal-500' };
//         if (currentItem.image.includes('articles')) return { type: t('homeSlide.contentTypes.article'), icon: '📰', color: 'from-blue-500 to-cyan-500' };
//         if (currentItem.image.includes('machines')) return { type: t('homeSlide.contentTypes.machine'), icon: '⚙️', color: 'from-purple-500 to-violet-500' };
//         return { type: t('homeSlide.contentTypes.content'), icon: '📄', color: 'from-gray-500 to-gray-600' };
//     };

//     const contentType = getContentType();

//     return (
//         <div className="fixed inset-0 z-[9999] overflow-hidden">
//             {/* Overlay مع تأثير تدرجي */}
//             <div className="fixed inset-0 bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-sm" />

//             {/* Dialog Content - Full Screen بدون سكرول */}
//             <div className="relative z-10 w-full h-full">
//                 {/* زر الإغلاق المحسن */}
//                 <button
//                     onClick={handleClose}
//                     className="absolute top-8 right-8 z-50 bg-black/50 hover:bg-red-600/80 backdrop-blur-md text-white rounded-full w-14 h-14 shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 border border-white/20 flex items-center justify-center group"
//                 >
//                     <X className="h-7 w-7 group-hover:rotate-90 transition-transform duration-300" />
//                 </button>

//                 {/* ... باقي الكود كما هو ... */}
//                 {/* شريط التقدم العلوي */}
//                 <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-800/30 z-40">
//                     <div
//                         className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
//                         style={{
//                             width: `${((currentIndex + 1) / totalItems) * 100}%`,
//                             boxShadow: '0 0 15px rgba(99, 102, 241, 0.7)'
//                         }}
//                     />
//                 </div>

//                 {/* المحتوى الرئيسي */}
//                 <div className="w-full h-full flex flex-col lg:flex-row">
//                     {/* الصورة - جانب مبدع */}
//                     <div className="relative lg:w-3/5 h-1/2 lg:h-full overflow-hidden">
//                         {/* تأثيرات إضافية */}
//                         <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent z-10" />
//                         <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-10" />
//                         <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent z-10" />

//                         {/* التأثير البصري */}
//                         <div className="absolute inset-0 z-0">
//                             <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl" />
//                             <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
//                         </div>

//                         {/* الصورة مع تأثيرات */}
//                         <img
//                             src={imageUrl}
//                             alt={currentItem.title}
//                             className="w-full h-full object-cover object-center transition-transform duration-700 ease-out"
//                             onError={(e) => {
//                                 (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1920x1080?text=Image+Not+Found';
//                             }}
//                         />

//                         {/* معلومات الشريحة في الزاوية */}
//                         <div className="absolute bottom-6 left-6 z-20">
//                             <div className="flex items-center gap-4">
//                                 {/* رقم الشريحة */}
//                                 <div className="bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-2xl">
//                                     <div className="flex items-center gap-2">
//                                         <Hash className="h-4 w-4 text-gray-300" />
//                                         <span className="text-lg font-semibold text-white">
//                                             {currentIndex + 1} <span className="text-gray-400">/ {totalItems}</span>
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* محتوى الوصف - تصميم أكثر مرونة */}
//                     <div className="lg:w-2/5 h-1/2 lg:h-full relative overflow-hidden">
//                         {/* خلفية متدرجة مع تأثيرات */}
//                         <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 backdrop-blur-sm" />
//                         <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
//                         <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 rounded-full blur-3xl" />

//                         {/* المحتوى الرئيسي */}
//                         <div className="relative z-10 h-full flex flex-col p-6 lg:p-8">
//                             {/* العنوان مع تأثير */}
//                             <div className="mb-6">
//                                 <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
//                                     {currentItem.title}
//                                 </h1>
//                                 <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
//                             </div>

//                             {/* نوع المحتوى */}
//                             <div className="mb-6">
//                                 <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${contentType.color}/20 backdrop-blur-sm rounded-lg border ${contentType.color.replace('from-', 'border-').replace(' to-', '/30')}`}>
//                                     <span className="text-lg">{contentType.icon}</span>
//                                     <span className="text-base font-medium text-gray-200">{contentType.type}</span>
//                                 </div>
//                             </div>

//                             {/* الوصف */}
//                             <div className="flex-1 mb-4 overflow-hidden">
//                                 <div className="flex items-center gap-2 mb-3">
//                                     <FileText className="h-4 w-4 text-gray-400" />
//                                     <h3 className="text-lg font-semibold text-gray-300">{t('homeSlide.description')}</h3>
//                                 </div>
//                                 <div className="bg-gray-900/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 h-full overflow-y-auto custom-scrollbar">
//                                     <p className="text-gray-300 text-base leading-relaxed">
//                                         {currentItem.description || t('homeSlide.noDescription')}
//                                     </p>
//                                 </div>
//                             </div>

//                             {/* التفاصيل (إذا وجدت) */}
//                             {currentItem.details.length > 0 && (
//                                 <div className="mb-4">
//                                     <div className="grid grid-cols-1 gap-2">
//                                         {currentItem.details.map((detail, idx) => (
//                                             <div
//                                                 key={idx}
//                                                 className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300"
//                                             >
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="text-gray-300 font-medium text-sm">
//                                                         {detail.key}
//                                                     </span>
//                                                     <span className="text-white font-bold text-lg bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">
//                                                         {detail.value}
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useHomeSliderQuery } from '@/api/feature/homeSlider/getSlice';
import { useTranslation } from 'react-i18next';

interface CarouselItem {
    title: string;
    description: string | null;
    image: string;
    details: Array<{ key: string; value: string }>;
}

interface CarouselDialogProps {
    onClose?: () => void;
    isOpen?: boolean;
}

export const CarouselDialog: React.FC<CarouselDialogProps> = ({ onClose, isOpen: externalIsOpen = true }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState<boolean>(externalIsOpen);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    // @ts-ignore

    const [isFullDescription, setIsFullDescription] = useState(false);
    const { data, isLoading, error } = useHomeSliderQuery({});

    const items: CarouselItem[] = data?.data || [];
    const totalItems = items.length;
    const interval = 3000;

    useEffect(() => {
        setIsOpen(externalIsOpen);
        if (externalIsOpen) {
            setIsPlaying(true);
        }
    }, [externalIsOpen]);

    useEffect(() => {
        if (!isPlaying || totalItems <= 1 || !isOpen) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % totalItems);
        }, interval);

        return () => clearInterval(timer);
    }, [isPlaying, totalItems, interval, isOpen]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, [totalItems]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
    }, [totalItems]);

    const goToSlide = useCallback((index: number) => {
        setCurrentIndex(index);
    }, []);

    const togglePlayPause = useCallback(() => {
        setIsPlaying(!isPlaying);
    }, [isPlaying]);

    const handleClose = useCallback(() => {
        setIsPlaying(false);
        setIsOpen(false);
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                goToPrev();
                break;
            case 'ArrowRight':
                e.preventDefault();
                goToNext();
                break;
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'Escape':
                e.preventDefault();
                handleClose();
                break;
        }
    }, [isOpen, goToPrev, goToNext, togglePlayPause, handleClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    const getImageUrl = useCallback((imagePath: string) => {
        return `${import.meta.env.VITE_BASE_URL}/${imagePath}`;
    }, []);

    if (!isOpen) {
        return null;
    }

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-32 w-32 border-4 border-transparent border-t-emerald-500 border-r-blue-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-white text-xl font-light animate-pulse">Loading...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !items.length) {
        return (
            <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-white p-8 max-w-lg text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-r from-red-500/20 to-pink-500/20 flex items-center justify-center mb-8 animate-pulse">
                        <X className="h-16 w-16 text-red-400" />
                    </div>
                    <p className="text-3xl font-light mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
                        {t('homeSlide.error.title')}
                    </p>
                    <p className="text-gray-300 mb-8 text-lg">{t('homeSlide.error.message')}</p>
                    <Button
                        onClick={handleClose}
                        className="px-12 py-4 text-lg bg-gradient-to-r from-red-500 via-pink-500 to-red-600 hover:from-red-600 hover:via-pink-600 hover:to-red-700 text-white rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        {t('homeSlide.error.close')}
                    </Button>
                </div>
            </div>
        );
    }

    const currentItem = items[currentIndex];
    const imageUrl = getImageUrl(currentItem.image);

    const getContentType = () => {
        if (currentItem.image.includes('meals')) return {
            type: t('homeSlide.contentTypes.meal'),
            icon: '🍽️',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
        };
        if (currentItem.image.includes('articles')) return {
            type: t('homeSlide.contentTypes.article'),
            icon: '📰',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10'
        };
        if (currentItem.image.includes('machines')) return {
            type: t('homeSlide.contentTypes.machine'),
            icon: '⚙️',
            color: 'from-purple-500 to-violet-500',
            bgColor: 'bg-gradient-to-r from-purple-500/10 to-violet-500/10'
        };
        return {
            type: t('homeSlide.contentTypes.content'),
            icon: '📄',
            color: 'from-gray-500 to-gray-600',
            bgColor: 'bg-gradient-to-r from-gray-500/10 to-gray-600/10'
        };
    };

    const contentType = getContentType();

    return (
        <div className="fixed inset-0 z-[9999] overflow-hidden">
            {/* الخلفية مع تأثيرات متقدمة */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800/20 via-transparent to-transparent"></div>
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500/50 to-transparent"></div>
            </div>

            {/* Dialog Content */}
            <div className="relative z-10 w-full h-full p-4 md:p-8">
                {/* Header Controls */}
                <div className="absolute top-6 right-6 z-50 flex items-center gap-3">


                    <button
                        onClick={handleClose}
                        className="group relative p-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 hover:scale-110"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <X className="h-5 w-5 text-white" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 z-40">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-1000 ease-out"
                        style={{ width: `${((currentIndex + 1) / totalItems) * 100}%` }}>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    {/* Image Section */}
                    <div className="relative rounded-3xl overflow-hidden group">
                        {/* Background Effects */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>

                        {/* Image Container */}
                        <div className="relative w-full h-full">
                            <img
                                src={imageUrl}
                                alt={currentItem.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=1920&h=1080&fit=crop';
                                }}
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
                        </div>

                        {/* Slide Number */}
                        {/* <div className="absolute bottom-6 left-6 z-20">
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2.5 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl">
                                    <div className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-gray-300" />
                                        <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                            {currentIndex + 1}
                                        </span>
                                        <span className="text-gray-400">/ {totalItems}</span>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* Navigation Arrows */}
                        <button
                            onClick={goToPrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/20 hover:border-white/40 hover:bg-black/70 transition-all duration-300 hover:scale-110 group/arrow"
                        >
                            <ChevronLeft className="h-6 w-6 text-white group-hover/arrow:-translate-x-1 transition-transform duration-300" />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 backdrop-blur-xl rounded-full border border-white/20 hover:border-white/40 hover:bg-black/70 transition-all duration-300 hover:scale-110 group/arrow"
                        >
                            <ChevronRight className="h-6 w-6 text-white group-hover/arrow:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>

                    {/* Content Section */}
                    <div className="relative rounded-3xl overflow-hidden">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 backdrop-blur-xl"></div>
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>

                        {/* Content Container */}
                        <div className="relative z-10 h-full p-6 md:p-8 flex flex-col">
                            {/* Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`px-4 py-2 ${contentType.bgColor} backdrop-blur-sm rounded-xl border border-white/10`}>
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{contentType.icon}</span>
                                            <span className="text-sm font-semibold text-gray-200">{contentType.type}</span>
                                        </div>
                                    </div>
                                    {/* 
                                    <button
                                        onClick={() => setIsFullDescription(!isFullDescription)}
                                        className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all duration-300"
                                    >
                                        <Maximize2 className="h-4 w-4 text-gray-300" />
                                    </button> */}
                                </div>

                                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
                                    {currentItem.title}
                                </h1>

                                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                            </div>

                            {/* Description */}
                            {currentItem.description &&
                                (
                                    <div className={`mb-8 ${isFullDescription ? 'flex-1' : ''}`}>
                                        <div className="flex items-center gap-2 mb-4">
                                            <Info className="h-5 w-5 text-blue-400" />
                                            <h3 className="text-lg font-semibold text-gray-300">{t('homeSlide.description')}</h3>
                                        </div>
                                        <div className={`${contentType.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${isFullDescription ? 'h-full overflow-y-auto' : 'max-h-48 overflow-hidden'}`}>
                                            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                                                {currentItem.description}
                                            </p>
                                        </div>
                                    </div>
                                )
                            }

                            {/* Details Section */}
                            {currentItem.details.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold text-gray-300 mb-4">Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {currentItem.details.map((detail, idx) => (
                                            <div
                                                key={idx}
                                                className="group bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all duration-300 hover:scale-[1.02]"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div>
                                                        <span className="text-sm text-gray-400">{detail.key}</span>
                                                        <div className="h-px w-8 bg-gradient-to-r from-blue-500/50 to-purple-500/50 mt-1"></div>
                                                    </div>
                                                    <span className="text-xl font-bold bg-gradient-to-r from-amber-300 to-yellow-300 bg-clip-text text-transparent">
                                                        {detail.value}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Slide Indicators */}
                            <div className="mt-auto pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        {items.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => goToSlide(idx)}
                                                className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' : 'w-2 bg-gray-600 hover:bg-gray-500'}`}
                                            />
                                        ))}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Press <kbd className="px-2 py-1 bg-gray-800 rounded">Space</kbd> to {isPlaying ? 'pause' : 'play'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};