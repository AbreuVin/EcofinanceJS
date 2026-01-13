import { AppSidebar } from "@/shared/components/sidebar/AppSidebar.tsx"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import type { ReactNode } from "react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b px-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        {/* Add Breadcrumbs here if needed */}
                    </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-4">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}