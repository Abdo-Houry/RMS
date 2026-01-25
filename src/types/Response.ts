interface ErrorResponse {
    code: string;
    message: string;
    latinoMessage: string;
}
//@ts-ignore
interface ApiResponse {
    data: boolean;
    error: ErrorResponse;
}
