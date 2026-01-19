import { useQuery } from "@tanstack/react-query";
import { UnitService } from "../api/unit.service";

export const unitKeys = {
    all: ["units"] as const,
};

export const useUnits = () => {
    return useQuery({
        queryKey: unitKeys.all,
        queryFn: UnitService.getAll,
    });
};

