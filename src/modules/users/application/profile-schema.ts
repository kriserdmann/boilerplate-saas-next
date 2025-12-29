import { z } from 'zod';

export const profileSchema = z.object({
    fullName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    avatarUrl: z.string().url().optional().or(z.literal('')),
});

export type ProfileInput = z.infer<typeof profileSchema>;
