// hooks/useUserRole.ts
import { useState, useEffect } from "react";

export function useUserRole() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
        setIsLoading(false);
    }, []);

    return {
        userRole,
        isStaff: userRole === "Staff",
        isAdmin: userRole === "Admin",
        isLoading
    };
}