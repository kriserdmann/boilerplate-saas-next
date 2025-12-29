import { z } from 'zod';

export const signUpSchema = z.object({
    fullName: z.string().min(2, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
