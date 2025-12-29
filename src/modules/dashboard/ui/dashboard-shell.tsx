'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/modules/auth/application/auth-actions";
import { useRouter, usePathname } from "next/navigation";
import Link from 'next/link';
import { cn } from "@/lib/utils";
import { LayoutDashboard, User, Settings, LogOut, PanelLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OrgSwitcher } from "@/modules/organizations/ui/org-switcher";
import { Organization } from "@/modules/organizations/infrastructure/org-repository";

const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Perfil", href: "/dashboard/profile", icon: User },
    { name: "Configurações", href: "/dashboard/settings", icon: Settings },
];

export function DashboardShell({
    children,
    user,
    organizations = [],
    currentOrgId,
}: {
    children: React.ReactNode;
    user: any;
    organizations?: Organization[];
    currentOrgId?: string;
}) {
    const router = useRouter();
    const pathname = usePathname();

    async function handleSignOut() {
        await signOutAction();
        router.replace('/login');
    }

    const initials = user?.full_name
        ? user.full_name
            .split(' ')
            .map((n: string) => n[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'U';

    return (
        <div className="flex min-h-screen w-full bg-[var(--color-background)]">
            {/* Sidebar */}
            <aside className="fixed inset-y-0 left-0 z-10 w-64 border-r border-[#e5e7eb] bg-white hidden md:flex flex-col">
                <div className="flex h-14 items-center border-b border-[#e5e7eb] px-4">
                    {/* <span className="font-bold text-lg tracking-tight text-slate-900">Refine Boilerplate</span> */}
                    <OrgSwitcher organizations={organizations} currentOrgId={currentOrgId || ''} />
                </div>
                <nav className="flex-1 px-4 py-6 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600 rounded-r-none" // Style Refine Active
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4", isActive ? "stroke-[2px]" : "stroke-[1.5px]")} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
                <div className="border-t border-[#e5e7eb] p-4">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 border border-slate-200">
                            <AvatarImage src={user?.avatar_url} />
                            <AvatarFallback className="bg-slate-100 text-slate-700">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-900 line-clamp-1">{user?.full_name}</span>
                            <span className="text-xs text-slate-500">Free Plan</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex flex-col flex-1 md:ml-64 transition-all duration-300 ease-in-out">
                <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-[#e5e7eb] bg-white/80 px-6 backdrop-blur">
                    <Button variant="ghost" size="icon" className="md:hidden">
                        <PanelLeft className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                        <Breadcrumbs />
                    </div>
                    <div className="flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
                                    <Settings className="h-4 w-4 text-slate-500" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sair
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
