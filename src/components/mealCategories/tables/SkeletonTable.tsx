import { Skeleton } from "@/components/ui/skeleton";


function SkeletonTable() {
    return (
        <div className="container mx-auto py-10 space-y-4">
            {/* Search bar skeleton */}
            <Skeleton className="h-10 w-1/2" />

            {/* Rows skeleton */}
            <div className="space-y-2">
                {[...Array(10)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center space-x-2 mt-4">
                <Skeleton className="h-8 w-20 rounded" /> {/* Previous */}
                <Skeleton className="h-8 w-20 rounded" /> {/* Current Page */}
                <Skeleton className="h-8 w-20 rounded" /> {/* Next */}
            </div>
        </div>
    );
}

export default SkeletonTable;
