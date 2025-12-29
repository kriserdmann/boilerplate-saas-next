import { createClientServer } from '@/lib/supabase';
import { AppError } from '@/modules/shared/domain/app-error';

// Atualizado para incluir metadados da membership
export interface Organization {
    id: string;
    name: string;
    slug: string;
    avatar_url: string | null;
    memberships: { role: string }[];
}

export async function getUserOrganizations(userId?: string) {
    const supabase = await createClientServer();

    // O RLS garante que só retornem as orgs certas. 
    // userId opcional pois RLS usa auth.uid(), mas mantemos compatibilidade se quiser passar.

    const { data, error } = await supabase
        .from('organizations')
        .select(`
      id,
      name,
      slug,
      avatar_url,
      memberships!inner (
        role
      )
    `);

    if (error) {
        console.error('Error fetching orgs:', error);
        return [];
    }

    // Cast manual pois o tipo retornado pelo Supabase tem estrutura complexa
    return data as unknown as Organization[];
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
