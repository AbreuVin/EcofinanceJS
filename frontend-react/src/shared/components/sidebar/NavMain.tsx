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
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import type { NavItem, SubItem } from "@/config/sidebar.config.ts"

export function NavMain({ items }: { items: NavItem[] }) {
    const { isMobile } = useSidebar()
    const [location] = useLocation()
    const { user } = useAuthStore() // 2. Get User

    // 3. Filter Logic
    const filteredItems = items.filter(item => {
        // If no roles defined, everyone can see
        if (!item.allowedRoles) return true;
        // If roles defined, check if user has one of them
        return user && item.allowedRoles.includes(user.role);
    });

    return (
        <SidebarGroup>
            <SidebarMenu>
                {filteredItems.map((item) => { // 4. Map the filtered list
                    const isActive = location === item.url || item.items?.some((sub: SubItem) => sub.url === location)

                    return (
                        <SidebarMenuItem key={item.title}>
                            {item.items?.length ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            tooltip={item.title}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <MoreHorizontal className="ml-auto" />
                                        </SidebarMenuButton>
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
                            ) : (
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.title}
                                >
                                    <Link href={item.url}>
                                        {item.icon && <item.icon />}
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