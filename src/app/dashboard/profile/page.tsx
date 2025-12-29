import { getCurrentProfile } from "@/modules/users/infrastructure/user-repository";
import { DashboardShell } from "@/modules/dashboard/ui/dashboard-shell";
import { ProfileForm } from "@/modules/users/ui/profile-form";
import { createClientServer } from "@/lib/supabase";
import { getUserOrganizations } from "@/modules/organizations/infrastructure/org-repository";
import { cookies } from "next/headers";

export default async function ProfilePage() {
    const profile = await getCurrentProfile();

    // Pegar email do auth.user pois não está no profile publico
    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();

    const userWithEmail = {
        ...profile,
        email: user?.email
    };

    // Org Switcher Data
    const organizations = user ? await getUserOrganizations(user.id) : [];
    const cookieStore = await cookies();
    const currentOrgId = cookieStore.get('current_org_id')?.value;

    return (
        <DashboardShell user={profile} organizations={organizations} currentOrgId={currentOrgId}>
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
                    <p className="text-muted-foreground">
                        Gerencie sua conta e preferências.
                    </p>
                </div>

                <ProfileForm user={userWithEmail} />
            </div>
        </DashboardShell>
    );
}
