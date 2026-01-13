import * as React from "react"
import { NavMain } from "@/shared/components/sidebar/NavMain.tsx"
import { NavUser } from "@/shared/components/sidebar/NavUser.tsx"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail, } from "@/components/ui/sidebar.tsx"
import { sidebarConfig } from "@/config/sidebar.config.ts"
import { SidebarBrand } from "@/shared/components/sidebar/SidebarBrand.tsx";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarBrand/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={sidebarConfig.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}