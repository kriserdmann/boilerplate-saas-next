'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { profileSchema, type ProfileInput } from '../application/profile-schema';
import { updateProfileAction, uploadAvatarAction } from '../application/user-actions';
import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ProfileForm({ user }: { user: any }) {
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Limpeza de memória para ObjectURLs
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const form = useForm<ProfileInput>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            fullName: user?.full_name || '',
            avatarUrl: user?.avatar_url || '',
        },
    });

    async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Preview imediato
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload automático
        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Enviando imagem...');

        try {
            const result = await uploadAvatarAction(formData);
            if (result?.success) {
                toast.success('Avatar atualizado!', { id: toastId });
                form.setValue('avatarUrl', result.publicUrl); // Atualiza o form
            }
        } catch (error) {
            toast.error('Erro no upload', { id: toastId });
            setPreviewUrl(null); // Reverte preview
        }
    }

    async function onSubmit(data: ProfileInput) {
        setIsLoading(true);
        try {
            const result = await updateProfileAction(data);
            if (result?.success) {
                toast.success('Perfil atualizado com sucesso!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Erro ao atualizar perfil');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto border-border/50 bg-background/95 shadow-[var(--shadow-elevation)] backdrop-blur">
            <CardHeader>
                <CardTitle>Seu Perfil</CardTitle>
                <CardDescription>
                    Gerencie suas informações pessoais e aparência.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                    <div className="flex items-center gap-6">
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Avatar className="h-20 w-20 border-2 border-border/50 transition-opacity group-hover:opacity-80">
                                <AvatarImage src={previewUrl || form.watch('avatarUrl') || user.avatar_url} />
                                <AvatarFallback>
                                    {user.full_name?.split(' ').map((n: any) => n[0]).join('').substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-white font-medium">Trocar</span>
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div className="space-y-2 flex-1">
                            <Label htmlFor="avatarUrl">URL do Avatar</Label>
                            <Input
                                id="avatarUrl"
                                placeholder="https://..."
                                className="rounded-lg"
                                {...form.register('avatarUrl')}
                            />
                            <p className="text-xs text-muted-foreground">Cole um link de imagem direta.</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Nome Completo</Label>
                        <Input
                            id="fullName"
                            placeholder="Seu nome"
                            className="rounded-lg"
                            {...form.register('fullName')}
                        />
                        {form.formState.errors.fullName && (
                            <p className="text-sm text-red-500 font-medium">{form.formState.errors.fullName.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>E-mail</Label>
                        <Input
                            value={user.email} // Supabase User Email (Read Only for now)
                            disabled
                            className="bg-muted text-muted-foreground rounded-lg"
                        />
                        <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado aqui.</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" className="rounded-lg font-semibold" disabled={isLoading}>
                            {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
