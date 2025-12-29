'use server';

import { revalidatePath } from 'next/cache';
import { profileSchema, type ProfileInput } from './profile-schema';
import { updateProfile, uploadAvatar } from '../infrastructure/user-repository';
import { createClientServer } from '@/lib/supabase';

// ... updateProfileAction ...

export async function uploadAvatarAction(formData: FormData) {
    const file = formData.get('file') as File;
    if (!file) throw new Error('Nenhum arquivo enviado');

    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autorizado');

    const publicUrl = await uploadAvatar(file, user.id);

    await updateProfile(user.id, { avatar_url: publicUrl });

    revalidatePath('/dashboard', 'layout');
    return { success: true, publicUrl };
}

export async function updateProfileAction(data: ProfileInput) {
    const result = profileSchema.safeParse(data);
    if (!result.success) throw new Error('Dados inválidos');

    const supabase = await createClientServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autorizado');

    await updateProfile(user.id, {
        full_name: result.data.fullName,
        avatar_url: result.data.avatarUrl
    });

    // Limpa o cache para refletir a mudança no App Shell/Dashboard
    revalidatePath('/dashboard', 'layout');

    return { success: true };
}
