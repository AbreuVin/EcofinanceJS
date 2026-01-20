import { useQuery } from "@tanstack/react-query";
import { AssetService } from "../api/asset.service";


export const assetKeys = {
    all: ["assets"] as const,
};

export const useAssets = () => {
    return useQuery({
        queryKey: assetKeys.all,
        queryFn: AssetService.getAll,
    });
};