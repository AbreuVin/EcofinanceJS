import { MoreHorizontal } from "lucide-react"
import { Link, useLocation } from "wouter"
import { useAuthStore } from "@/store/authStore"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import type { NavItem, SubItem } from "@/config/sidebar.config.ts"

export function NavMain({ items }: { items: NavItem[] }) {
    const { isMobile } = useSidebar()
    const [location] = useLocation()
    const { user } = useAuthStore()

    const filteredItems = items.filter(item => {
        if (!item.allowedRoles) return true;
        return user && item.allowedRoles.includes(user.role);
    });

    return (
        <SidebarGroup>
            <SidebarMenu>
                {filteredItems.map((item) => {
                    const isActive = location === item.url || item.items?.some((sub: SubItem) => sub.url === location)

                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.items?.length ? (
                                <>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={item.title}
                                    >
                                        <Link href={item.url}>
                                            {item.icon && <item.icon/>}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <SidebarMenuAction showOnHover>
                                                <MoreHorizontal/>
                                                <span className="sr-only">More</span>
                                            </SidebarMenuAction>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                            side={isMobile ? "bottom" : "right"}
                                            align={isMobile ? "end" : "start"}
                                            className="min-w-56 rounded-lg"
                                        >
                                            {item.items.map((subItem: SubItem) => (
                                                <DropdownMenuItem asChild key={subItem.title}>
                                                    <Link href={subItem.url} className="cursor-pointer">
                                                        {subItem.title}
                                                    </Link>
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.title}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon/>}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            )}
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}