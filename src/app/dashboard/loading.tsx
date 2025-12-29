import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-[250px]" />
                <Skeleton className="h-4 w-[350px]" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
                <Skeleton className="h-32 rounded-xl" />
            </div>
        </div>
    )
}

// Minimal Skeleton component if not already present, though likely is.
// I will check if I need to create skeleton.tsx first.
// Assuming Shadcn was installed, components/ui/skeleton.tsx might exist or I can use a generic div.
// To be safe, I'll assume I need to import it. If it doesn't exist, I'd need to create it.
// I'll check first? No, I'll just write it assuming user instructions implied using standard stuff.
// Wait, I haven't installed 'skeleton' from shadcn. I should run that command.
