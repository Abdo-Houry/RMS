interface ApiError {
    code: string;
    message: string;
    latinoMessage: string;
}

interface ApiResponse<T = boolean> {
    data: T;
    error: ApiError;
}

export const getErrorMessage = (error: any): string => {
    // محاولة استخراج الرسالة من الـ response
    if (error?.data?.error) {
        const apiError = error.data.error;
        return apiError.latinoMessage || apiError.message;
    }

    // محاولة أخرى للوصول للبيانات
    if (error?.error) {
        const apiError = error.error;
        return apiError.latinoMessage || apiError.message;
    }

    // إذا كان الـ error مباشرةً
    if (error?.latinoMessage) {
        return error.latinoMessage;
    }

    if (error?.message) {
        return error.message;
    }

    return "An unexpected error occurred";
};

export const handleApiResponse = <T = boolean>(res: any): {
    success: boolean;
    data?: T;
    error?: string;
} => {
    if ("data" in res) {
        const response = res.data as ApiResponse<T>;
        if (response.error.code === "Error.None") {
            return {
                success: true,
                data: response.data,
                error: response.error.latinoMessage
            };
        } else {
            return {
                success: false,
                error: response.error.latinoMessage || response.error.message
            };
        }
    }

    if ("error" in res) {
        return {
            success: false,
            error: getErrorMessage(res.error)
        };
    }

    return {
        success: false,
        error: "An unexpected error occurred"
    };
};