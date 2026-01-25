import { useMemo } from 'react'

interface UsePermissionsReturn {
    hasPermission: (permissionId: number) => boolean
    hasAnyPermission: (permissionIds: number[]) => boolean
    hasAllPermissions: (permissionIds: number[]) => boolean
    getPermissions: () => number[]
    clearPermissions: () => void
}

export const usePermissions = (): UsePermissionsReturn => {
    // استخدام useMemo لتجنب إعادة الحساب في كل render
    const permissions = useMemo(() => {
        try {
            const stored = localStorage.getItem('userPermissions')
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    }, [])

    const hasPermission = (permissionId: number): boolean => {
        return permissions.includes(permissionId)
    }

    const hasAnyPermission = (permissionIds: number[]): boolean => {
        return permissionIds.some(id => permissions.includes(id))
    }

    const hasAllPermissions = (permissionIds: number[]): boolean => {
        return permissionIds.every(id => permissions.includes(id))
    }

    const getPermissions = (): number[] => {
        return permissions
    }

    const clearPermissions = () => {
        localStorage.removeItem('userPermissions')
    }

    return {
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        getPermissions,
        clearPermissions
    }
}