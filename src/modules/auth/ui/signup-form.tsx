'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { signUpSchema, type SignUpInput } from '../application/signup-schema';
import { signUpAction } from '../application/auth-actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function SignUpForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<SignUpInput>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: SignUpInput) {
        setIsLoading(true);
        try {
            const result = await signUpAction(data);
            if (result?.success) {
                toast.success('Cadastro realizado! Verifique seu e-mail.');
                router.push('/login');
            }
        } catch (error: any) {
            if (error?.message) {
                toast.error(error.message);
            } else {
                toast.error('Erro ao criar conta.');
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
                        <CardTitle className="text-2xl font-bold tracking-tight text-center">Criar Conta</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            Preencha os dados para começar
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                                {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <p className="text-sm text-muted-foreground">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Entrar
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
}
