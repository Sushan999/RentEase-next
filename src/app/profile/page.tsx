"use client";
import { useAppContext } from "@/context/AppContext";

import { User as UserIcon, Mail } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user, handleSignOut } = useAppContext();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-4">
            Please log in to view your profile
          </h2>
          <Link href="/auth/signin" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <div className="flex items-center text-gray-500">
            <Mail className="h-4 w-4 mr-1" /> {user.email}
          </div>
          <div className="mt-2 text-sm text-gray-400 capitalize">
            Role: {String(user.role).toLowerCase()}
          </div>
          <button
            className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            type="button"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
