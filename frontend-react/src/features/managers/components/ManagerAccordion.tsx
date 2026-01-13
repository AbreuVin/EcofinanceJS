import { Collapsible, CollapsibleContent, } from "@/components/ui/collapsible"
import { ManagerForm } from "./ManagerForm"
import type { FieldConfig } from "../hooks/useManagerConfig"

interface ManagerAccordionProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
    fields: FieldConfig[]
    initialData?: any
    onSubmit: (data: any) => Promise<void>
    isLoading: boolean
}

export function ManagerAccordion({
                                     isOpen,
                                     setIsOpen,
                                     fields,
                                     initialData,
                                     onSubmit,
                                     isLoading,
                                 }: ManagerAccordionProps) {
    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <CollapsibleContent className=" pb-4">
                <div className="bg-white p-4 rounded-md border shadow-sm">
                    <ManagerForm
                        fields={fields}
                        initialData={initialData}
                        onSubmit={onSubmit}
                        isLoading={isLoading}
                        onCancel={() => setIsOpen(false)}
                    />
                </div>
            </CollapsibleContent>
        </Collapsible>
    )
}