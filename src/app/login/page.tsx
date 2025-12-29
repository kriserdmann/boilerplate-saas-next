import { LoginForm } from "@/modules/auth/ui/login-form";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 p-4">
            {/* Container com largura controlada para manter o aspecto minimalista */}
            <div className="w-full max-w-[400px]">
                <LoginForm />
            </div>
        </main>
    );
}
