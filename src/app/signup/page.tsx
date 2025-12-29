import { SignUpForm } from "@/modules/auth/ui/signup-form";

export default function SignUpPage() {
    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-gray-50/50 p-4">
            <div className="w-full max-w-[400px]">
                <SignUpForm />
            </div>
        </main>
    );
}
