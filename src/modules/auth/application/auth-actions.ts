'use server';

import { createClientServer } from '@/lib/supabase';
import { loginSchema, type LoginInput } from './login-schema';
import { signUpSchema, type SignUpInput } from './signup-schema';
import { AppError } from '@/modules/shared/domain/app-error';

export async function loginAction(data: LoginInput) {
    // 1. Validação estrita com Zod v4
    const result = loginSchema.safeParse(data);

    if (!result.success) {
        throw new AppError('Dados inválidos', 'VALIDATION_ERROR', 400);
    }

    const supabase = await createClientServer();

    // 2. Chamada ao Supabase
    const { error } = await supabase.auth.signInWithPassword(result.data);

    if (error) {
        throw new AppError(error.message, 'UNAUTHORIZED', 401);
    }

    // 3. Revalidação ou Redirecionamento (Opcional aqui, pode ser no cliente)
    return { success: true };
}

export async function signUpAction(data: SignUpInput) {
    const result = signUpSchema.safeParse(data);

    if (!result.success) {
        throw new AppError('Dados inválidos', 'VALIDATION_ERROR', 400);
    }

    const supabase = await createClientServer();

    // Passando full_name nos metadados para que o Trigger SQL crie o Profile
    const { error } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
            data: {
                full_name: result.data.fullName,
            },
        },
    });

    if (error) {
        throw new AppError(error.message, 'INTERNAL_ERROR', 500);
    }

    return { success: true };
}

export async function signOutAction() {
    const supabase = await createClientServer();
    await supabase.auth.signOut();
    return { success: true };
}
