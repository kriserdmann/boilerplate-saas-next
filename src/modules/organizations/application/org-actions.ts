'use server';

import { createOrganization } from '../infrastructure/org-repository';
import { createClientServer } from '@/lib/supabase';
import { z } from 'zod';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const createOrgSchema = z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
});

export async function createOrganizationAction(formData: FormData) {
    const name = formData.get('name') as string;
    const result = createOrgSchema.safeParse({ name });

    if (!result.success) {
        return { error: 'Nome inválido (mínimo 3 caracteres)' };
    }

    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Não autorizado' };

    try {
        const org = await createOrganization(result.data.name, user.id);

        // Set cookie automatically
        const cookieStore = await cookies();
        cookieStore.set('current_org_id', org.id, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return { success: true, orgId: org.id };
    } catch (err: any) {
        return { error: err.message || 'Erro ao criar organização' };
    }
}

export async function switchOrganizationAction(orgId: string) {
    const cookieStore = await cookies();
    cookieStore.set('current_org_id', orgId, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    revalidatePath('/', 'layout'); // Refresh everything
    return { success: true };
}
