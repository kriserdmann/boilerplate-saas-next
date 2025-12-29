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
import { switchOrganizationAction } from "@/modules/organizations/application/org-actions";
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
        await switchOrganizationAction(orgId);
        setIsLoading(false);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between h-10 border-dashed border-gray-300 hover:bg-gray-50 bg-transparent text-slate-700 px-3">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Avatar className="h-5 w-5 rounded-md border border-gray-200">
                            <AvatarImage src={currentOrg?.avatar_url || ''} />
                            <AvatarFallback className="rounded-md text-[10px] bg-blue-600 text-white">
                                {currentOrg?.name?.substring(0, 2).toUpperCase() || 'MO'}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate text-sm font-medium">{currentOrg?.name || 'Selecione'}</span>
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px] p-1 shadow-lg border-gray-200">
                <DropdownMenuLabel className="text-xs text-muted-foreground px-2 py-1.5">
                    Workspaces
                </DropdownMenuLabel>
                <DropdownMenuGroup>
                    {organizations.map((org) => (
                        <DropdownMenuItem
                            key={org.id}
                            onSelect={() => handleSwitch(org.id)}
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar className="h-5 w-5 rounded-md border border-gray-100">
                                    <AvatarFallback className="rounded-md text-[10px] bg-slate-100 text-slate-600">
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
                    className="cursor-pointer text-blue-600 focus:text-blue-700"
                    onSelect={() => router.push('/onboarding')}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Workspace
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
