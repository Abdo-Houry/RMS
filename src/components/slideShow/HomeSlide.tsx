"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Info, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHomeSliderQuery } from "@/api/feature/homeSlider/getSlice";
import { useTranslation } from "react-i18next";

interface CarouselItem {
    title: string;
    description: string | null;
    images: string[];
    videos: string[] | null;
    details: Array<{ key: string; value: string }>;
}

interface CarouselDialogProps {
    onClose?: () => void;
    isOpen?: boolean;
}

export const CarouselDialog: React.FC<CarouselDialogProps> = ({
    onClose,
    isOpen: externalIsOpen = true,
}) => {
    const { t } = useTranslation();

    const [isOpen, setIsOpen] = useState(externalIsOpen);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [mediaIndex, setMediaIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    // @ts-ignore
    const [isFullDescription, setIsFullDescription] = useState(false);

    const { data, isLoading, error } = useHomeSliderQuery({});
    const items: CarouselItem[] = data?.data || [];
    const totalItems = items.length;
    // const interval = 3000;
    // بعد useState الأخرى
    const [speed, setSpeed] = useState(2000); // القيمة الافتراضية
    const speedOptions = [1000, 2000, 3000, 5000, 8000]; // خيارات السرعة

    useEffect(() => {
        setIsOpen(externalIsOpen);
        if (externalIsOpen) setIsPlaying(true);
    }, [externalIsOpen]);

    const getMediaUrl = useCallback((path: string) => {
        return `${import.meta.env.VITE_BASE_URL}/${path}`;
    }, []);

    const currentItem = items[currentIndex];
    const mediaList = currentItem
        ? [
            ...(currentItem.videos ?? []).map((src) => ({
                type: "video" as const,
                src,
            })),
            ...currentItem.images.map((src) => ({
                type: "image" as const,
                src,
            })),
        ]
        : [];

    const currentMedia = mediaList[mediaIndex];

    const goToNext = useCallback(() => {
        if (!mediaList.length) return;

        if (mediaIndex < mediaList.length - 1) {
            setMediaIndex((p) => p + 1);
        } else {
            setMediaIndex(0);
            setCurrentIndex((p) => (p + 1) % totalItems);
        }
    }, [mediaIndex, mediaList.length, totalItems]);

    const goToPrev = useCallback(() => {
        if (!mediaList.length) return;

        if (mediaIndex > 0) {
            setMediaIndex((p) => p - 1);
        } else {
            setCurrentIndex((p) => (p - 1 + totalItems) % totalItems);
            setMediaIndex(0);
        }
    }, [mediaIndex, mediaList.length, totalItems]);

    useEffect(() => {
        setMediaIndex(0);
    }, [currentIndex]);

    // useEffect(() => {
    //     if (
    //         !isPlaying ||
    //         !isOpen ||
    //         currentMedia?.type === "video" ||
    //         totalItems <= 1
    //     )
    //         return;

    //     const timer = setInterval(goToNext, interval);
    //     return () => clearInterval(timer);
    // }, [isPlaying, isOpen, currentMedia, goToNext, totalItems]);
    useEffect(() => {
        if (
            !isPlaying ||
            !isOpen ||
            currentMedia?.type === "video" ||
            totalItems <= 1
        )
            return;

        const timer = setInterval(goToNext, speed); // استبدل interval بـ speed
        return () => clearInterval(timer);
    }, [isPlaying, isOpen, currentMedia, goToNext, totalItems, speed]); // أضف speed هنا

    const handleSpeedChange = useCallback(() => {
        const currentIndex = speedOptions.indexOf(speed);
        const nextIndex = (currentIndex + 1) % speedOptions.length;
        setSpeed(speedOptions[nextIndex]);
    }, [speed]);

    const handleClose = useCallback(() => {
        setIsPlaying(false);
        setIsOpen(false);
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === "ArrowRight") goToNext();
            if (e.key === "ArrowLeft") goToPrev();
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen, goToNext, goToPrev, handleClose]);

    const getContentType = () => {
        if (currentItem.images[0]?.includes('meals')) return {
            type: t('homeSlide.contentTypes.meal'),
            icon: '🍽️',
            color: 'from-emerald-500 to-teal-500',
            bgColor: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10'
        };
        if (currentItem.images[0]?.includes('articles')) return {
            type: t('homeSlide.contentTypes.article'),
            icon: '📰',
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10'
        };
        if (currentItem.images[0]?.includes('machines')) return {
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

    // const contentType = getContentType();
    const contentType = currentItem ? getContentType() : null;
    currentItem ? getContentType() : null;
    /* ⬇️ returns فقط بالآخر */
    if (!isOpen) return null;

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black">
                <div className="animate-spin h-16 w-16 rounded-full border-4 border-t-blue-500 border-transparent" />
            </div>
        );
    }

    if (error || !items.length || !currentMedia) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black text-white">
                <Button onClick={handleClose}>Close</Button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[9999] bg-black">
            {/* Close */}
            <div className="absolute top-6 right-6 z-50">
                <button
                    onClick={handleClose}
                    className="p-3 rounded-full bg-red-500/30 hover:bg-red-500/50 transition"
                >
                    <X className="text-white" />
                </button>
            </div>

            {/* Progress */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    style={{
                        width: `${((currentIndex + 1) / totalItems) * 100}%`,
                    }}
                />
            </div>

            <div className="w-full h-full grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 p-6">
                {/* Media */}
                <div className="relative rounded-3xl overflow-hidden">
                    {currentMedia.type === "image" ? (
                        <img
                            src={getMediaUrl(currentMedia.src)}
                            className="w-full h-full object-cover"
                            alt={currentItem.title}
                        />
                    ) : (
                        <video
                            src={getMediaUrl(currentMedia.src)}
                            autoPlay
                            muted
                            playsInline
                            onEnded={goToNext}
                            className="w-full h-full object-cover"
                        />
                    )}

                    <button
                        onClick={goToPrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full"
                    >
                        <ChevronLeft className="text-white" />
                    </button>

                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 rounded-full"
                    >
                        <ChevronRight className="text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="relative rounded-3xl overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-black/95 backdrop-blur-xl"></div>
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-500/30 to-transparent"></div>

                    {/* Content Container */}
                    <div className="relative z-10 h-full p-6 md:p-8 flex flex-col">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`px-4 py-2 ${contentType?.bgColor} backdrop-blur-sm rounded-xl border border-white/10`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{contentType?.icon}</span>
                                        <span className="text-sm font-semibold text-gray-200">{contentType?.type}</span>
                                    </div>
                                </div>

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
                                    <div className={`${contentType?.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-white/10 ${isFullDescription ? 'h-full overflow-y-auto' : 'max-h-48 overflow-hidden'}`}>
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
                                <h3 className="text-lg font-semibold text-gray-300 mb-4">{t('homeSlide.details')}</h3>
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
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-gradient-to-r from-blue-500 to-purple-500' : 'w-2 bg-gray-600 hover:bg-gray-500'}`}
                                        />
                                    ))}
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* Speed Control Button */}
                                    <button
                                        onClick={handleSpeedChange}
                                        className="group flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all"
                                        title={`Speed: ${speed / 1000}s`}
                                    >
                                        <Gauge className="h-4 w-4 text-blue-400" />
                                        <span className="text-sm text-gray-300">
                                            {speed / 1000}s
                                        </span>
                                        <div className="h-4 w-px bg-gray-600"></div>
                                        <div className="text-xs text-gray-400 group-hover:text-gray-300">
                                            {speed === 1000 ? 'Fast' :
                                                speed === 3000 ? 'Normal' :
                                                    speed === 5000 ? 'Slow' :
                                                        speed === 8000 ? 'Very Slow' : 'Default'}
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};