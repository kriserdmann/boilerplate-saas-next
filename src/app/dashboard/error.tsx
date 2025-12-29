'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
            <h2 className="text-2xl font-semibold">Algo deu errado!</h2>
            <p className="text-muted-foreground">{error.message || 'Erro ao carregar o dashboard.'}</p>
            <Button onClick={() => reset()} variant="default">
                Tentar Novamente
            </Button>
        </div>
    );
}
