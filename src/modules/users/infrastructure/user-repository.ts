import { createClientServer } from '@/lib/supabase';
import { AppError } from '@/modules/shared/domain/app-error';

export async function getCurrentProfile() {
    const supabase = await createClientServer();

    // 1. Pega o ID do usuário da sessão
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new AppError('Não autenticado', 'UNAUTHORIZED', 401);

    // 2. Busca o perfil na tabela pública
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (error) throw new AppError('Perfil não encontrado', 'NOT_FOUND', 404);

    return profile;
}

export async function updateProfile(id: string, data: Partial<{ full_name: string; avatar_url: string }>) {
    const supabase = await createClientServer();

    const { data: profile, error } = await supabase
        .from('profiles')
        .update({
            full_name: data.full_name,
            avatar_url: data.avatar_url,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw new AppError(error.message, 'INTERNAL_ERROR', 500);

    return profile;
}

export async function uploadAvatar(file: File, userId: string) {
    const supabase = await createClientServer();

    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true
        });

    if (error) throw new AppError(error.message, 'INTERNAL_ERROR', 500);

    // Retorna a URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

    return publicUrl;
}
