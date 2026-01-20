import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { DAYS_OF_WEEK } from "../../constants/esg-options";

export function HomeOfficeFields() {
    const form = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
                <FormLabel className="text-base mb-3 block">Dias da semana em Home Office</FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border p-4 rounded-md">
                    {DAYS_OF_WEEK.map((day) => (
                        <FormField
                            key={day.id}
                            control={form.control}
                            name="assetFields.homeOfficeDays"
                            render={({ field }) => {
                                const value = field.value || []; // Ensure array
                                return (
                                    <FormItem key={day.id} className="flex flex-row items-start space-x-3 space-y-0">
                                        <FormControl>
                                            <Checkbox
                                                checked={value.includes(day.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...value, day.id])
                                                        : field.onChange(value.filter((val: string) => val !== day.id));
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="font-normal cursor-pointer">
                                            {day.label}
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}