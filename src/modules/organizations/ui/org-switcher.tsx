'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, Plus, Check } from "lucide-react";
import { Organization } from "@/modules/organizations/infrastructure/org-repository";
import { switchOrgAction } from "@/modules/organizations/application/org-actions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface OrgSwitcherProps {
    organizations: Organization[];
    currentOrgId: string;
}

export function OrgSwitcher({ organizations, currentOrgId }: OrgSwitcherProps) {
    const router = useRouter();
    const currentOrg = organizations.find(o => o.id === currentOrgId) || organizations[0];
    const [isLoading, setIsLoading] = useState(false);

    async function handleSwitch(orgId: string) {
        if (orgId === currentOrgId) return;
        setIsLoading(true);
        await switchOrgAction(orgId);
        // Não precisamos de setIsLoading(false) porque switchOrgAction faz redirect
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 border-slate-200 hover:bg-slate-50 bg-white text-slate-900 px-3 shadow-none rounded-lg">
                    <div className="flex items-center gap-3 overflow-hidden text-left">
                        <Avatar className="h-6 w-6 rounded-md border border-slate-200">
                            <AvatarImage src={currentOrg?.avatar_url || ''} />
                            <AvatarFallback className="rounded-md text-[10px] bg-blue-600 text-white font-bold">
                                {currentOrg?.name?.substring(0, 2).toUpperCase() || 'MO'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="truncate text-sm font-medium leading-none">{currentOrg?.name || 'Selecione'}</span>
                            <span className="truncate text-[10px] text-muted-foreground mt-0.5">Free Plan</span>
                        </div>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[240px] p-1 shadow-lg border-slate-200" align="start">
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5 font-normal">
                    Seus Workspaces
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    {organizations.map((org) => (
                        <DropdownMenuItem
                            key={org.id}
                            onSelect={() => handleSwitch(org.id)}
                            className="flex items-center justify-between cursor-pointer py-2 focus:bg-slate-50"
                        >
                            <div className="flex items-center gap-3">
                                <Avatar className="h-5 w-5 rounded-md border border-slate-100">
                                    <AvatarFallback className="rounded-md text-[9px] bg-slate-100 text-slate-600">
                                        {org.name.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <span className={cn("truncate text-sm", org.id === currentOrgId && "font-medium")}>
                                    {org.name}
                                </span>
                            </div>
                            {org.id === currentOrgId && <Check className="h-3 w-3 text-blue-600" />}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-blue-600 focus:text-blue-700 py-2 focus:bg-blue-50"
                    onSelect={() => router.push('/onboarding')}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
