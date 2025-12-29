'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { loginSchema, type LoginInput } from '../application/login-schema';
import { loginAction } from '../application/auth-actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: LoginInput) {
        setIsLoading(true);
        try {
            const result = await loginAction(data);
            if (result?.success) {
                toast.success('Login realizado com sucesso!');
                router.push('/dashboard');
            }
        } catch (error: any) {
            if (error?.message) {
                toast.error(error.message);
            } else {
                toast.error('Ocorreu um erro ao fazer login.');
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50/50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                <Card className="w-[350px] overflow-hidden rounded-xl border-border/50 bg-background/95 shadow-[var(--shadow-elevation)] backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Boas-vindas</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            Insira suas credenciais para acessar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-mail</Label>
                                <Input
                                    id="email"
                                    placeholder="seu@email.com"
                                    className="rounded-lg"
                                    {...form.register('email')}
                                />
                                {form.formState.errors.email && (
                                    <p className="text-sm text-red-500 font-medium">{form.formState.errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    className="rounded-lg"
                                    {...form.register('password')}
                                />
                                {form.formState.errors.password && (
                                    <p className="text-sm text-red-500 font-medium">{form.formState.errors.password.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full rounded-lg font-semibold" disabled={isLoading}>
                                {isLoading ? 'Entrando...' : 'Entrar'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Não tem uma conta?{' '}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                Cadastre-se
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
