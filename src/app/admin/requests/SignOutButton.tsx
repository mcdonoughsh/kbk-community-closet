"use client";

import { signOut } from "../actions";

export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="px-4 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Sign Out
      </button>
    </form>
  );
}
