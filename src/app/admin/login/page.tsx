import type { Metadata } from "next";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "KBK CC | Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--kbk-background)]">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-medium text-center text-gray-900 mb-8">
          Admin Login
        </h1>
        <LoginForm />
      </div>
    </div>
  );
}
