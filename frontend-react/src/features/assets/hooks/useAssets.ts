import { useQuery } from "@tanstack/react-query";
import { AssetService } from "../api/asset.service";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/enums";


export const assetKeys = {
    all: ["assets"] as const,
};

export const useAssets = () => {
    const user = useAuthStore((state) => state.user);
    
    return useQuery({
        queryKey: assetKeys.all,
        queryFn: AssetService.getAll,
        select: (data) => {
            if (user?.role === UserRole.MASTER) return data;
            
            if (user?.companyId) {
                // Filter by asset's companyId (works for both unit-specific and global assets)
                return data.filter(a => a.companyId === user.companyId);
            }
            return [];
        }
    });
};