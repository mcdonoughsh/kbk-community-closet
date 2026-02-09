"use client";

import { useActionState } from "react";
import { signIn, type AuthResult } from "../actions";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<AuthResult, FormData>(
    signIn,
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary)] focus:border-transparent"
          placeholder="admin@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--kbk-primary)] focus:border-transparent"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
        style={{ backgroundColor: "var(--kbk-primary)" }}
      >
        {isPending ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
