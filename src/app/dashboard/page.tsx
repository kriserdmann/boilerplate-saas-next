import { getCurrentProfile } from "@/modules/users/infrastructure/user-repository";
import { DashboardShell } from "@/modules/dashboard/ui/dashboard-shell";
import { getUserOrganizations } from "@/modules/organizations/infrastructure/org-repository";
import { createClientServer } from "@/lib/supabase";
import { cookies } from "next/headers";

export default async function DashboardPage() {
    // Busca de dados segura no servidor
    const profile = await getCurrentProfile();

    // Busca organizações para o Switcher
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    const organizations = user ? await getUserOrganizations(user.id) : [];

    const cookieStore = await cookies();
    const currentOrgId = cookieStore.get('current_org_id')?.value;

    return (
        <DashboardShell user={profile} organizations={organizations} currentOrgId={currentOrgId}>
            <section className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Bem-vindo de volta, {profile.full_name?.split(' ')[0]}
                    </h1>
                    <p className="text-muted-foreground">
                        Aqui está o que está acontecendo no seu projeto hoje.
                    </p>
                </div>

                {/* Placeholder para os Cards de métricas */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-32 rounded-xl border border-border/50 bg-background shadow-[var(--shadow-elevation)]" />
                    <div className="h-32 rounded-xl border border-border/50 bg-background shadow-[var(--shadow-elevation)]" />
                    <div className="h-32 rounded-xl border border-border/50 bg-background shadow-[var(--shadow-elevation)]" />
                </div>
            </section>
        </DashboardShell>
    );
}
