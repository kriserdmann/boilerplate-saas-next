'use client';

import { createOrganizationAction } from "@/modules/organizations/application/org-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await createOrganizationAction(formData);

        if (result?.error) {
            toast.error(result.error);
            setIsLoading(false);
            return;
        }

        if (result?.success) {
            toast.success("Workspace criado!");
            router.push("/dashboard");
            // Proxy vai detectar o cookie novo e permitir acesso
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Card className="w-[400px] shadow-lg border-gray-200">
                <CardHeader>
                    <CardTitle className="text-xl text-center">Vamos começar</CardTitle>
                    <CardDescription className="text-center">
                        Crie seu primeiro Workspace para organizar seus projetos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Workspace</Label>
                            <Input id="name" name="name" placeholder="Ex: Acme Corp" required minLength={3} />
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                            {isLoading ? 'Criando...' : 'Criar e Continuar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
