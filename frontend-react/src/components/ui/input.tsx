import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, onKeyDown, ...props }: React.ComponentProps<"input">) {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Bloqueia a digitação de 'e' ou 'E' em campos numéricos (pedido do QA/Cliente)
        if (type === "number" && (e.key === 'e' || e.key === 'E')) {
            e.preventDefault()
        }

        // Se algum componente pai passou um onKeyDown customizado, nós o executamos também
        if (onKeyDown) {
            onKeyDown(e)
        }
    }

    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                className
            )}
            onKeyDown={handleKeyDown}
            {...props}
        />
    )
}

export { Input }
