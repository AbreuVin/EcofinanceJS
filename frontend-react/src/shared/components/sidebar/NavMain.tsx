import { MoreHorizontal } from "lucide-react"
import { Link, useLocation } from "wouter"
import { useAuthStore } from "@/store/authStore"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
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

// Recursive function to check if any nested item matches current location
function isNestedActive(items: SubItem[] | undefined, location: string): boolean {
    if (!items) return false;
    return items.some(item => {
        if (item.url === location) return true;
        return isNestedActive(item.items, location);
    });
}

// Recursive component for rendering nested menu items
function RenderSubItems({ items }: { items: SubItem[] }) {
    return (
        <>
            {items.map((subItem) => {
                // If subItem has nested items, render as SubMenu
                if (subItem.items && subItem.items.length > 0) {
                    return (
                        <DropdownMenuSub key={subItem.title}>
                            <DropdownMenuSubTrigger>
                                {subItem.title}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent className="max-h-[300px] overflow-y-auto">
                                <RenderSubItems items={subItem.items} />
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    );
                }
                
                // Otherwise render as regular menu item
                return (
                    <DropdownMenuItem asChild key={subItem.title}>
                        <Link href={subItem.url || "#"} className="cursor-pointer">
                            {subItem.title}
                        </Link>
                    </DropdownMenuItem>
                );
            })}
        </>
    );
}

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
                    const isActive = location === item.url || isNestedActive(item.items, location)

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
                                            <RenderSubItems items={item.items} />
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