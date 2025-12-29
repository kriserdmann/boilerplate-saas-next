import { createClientServer } from '@/lib/supabase';
import { AppError } from '@/modules/shared/domain/app-error';

export interface Organization {
    id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
    owner_id: string;
}

export async function getUserOrganizations(userId: string) {
    const supabase = await createClientServer();

    const { data: orgs, error } = await supabase
        .from('organizations')
        .select('*, memberships!inner(user_id)')
        .eq('memberships.user_id', userId);

    if (error) {
        console.error('Error fetching orgs:', error);
        return [];
    }

    return orgs as Organization[];
}

export async function createOrganization(name: string, userId: string) {
    console.log('[createOrganization] Starting for user:', userId, 'Org:', name);
    const supabase = await createClientServer();
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.random().toString(36).substring(2, 7);

    // 1. Criar Organização
    const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
            name,
            slug,
            owner_id: userId,
        })
        .select()
        .single();

    if (orgError) {
        console.error('[createOrganization] Error creating org:', orgError);
        throw new AppError(orgError.message, 'INTERNAL_ERROR', 500);
    }

    // 2. Criar Membership (Owner)
    const { error: memberError } = await supabase
        .from('memberships')
        .insert({
            org_id: org.id,
            user_id: userId,
            role: 'owner'
        });

    if (memberError) {
        // Rollback seria ideal aqui, mas com RLS e transaction isso é complexo no client.
        // Assumimos sucesso por enquanto ou fazemos limpeza manual se falhar.
        throw new AppError(memberError.message, 'INTERNAL_ERROR', 500);
    }

    return org;
}

export async function getOrganizationById(orgId: string) {
    const supabase = await createClientServer();
    const { data: org, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', orgId)
        .single();

    if (error) return null;
    return org;
}
