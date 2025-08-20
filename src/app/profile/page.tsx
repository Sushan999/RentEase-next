"use client";
import { useEffect, useState } from "react";
import { getSession, signOut } from "next-auth/react";
import { User, Mail, Phone } from "lucide-react";
import Link from "next/link";

interface SessionUser {
  name: string;
  email: string;
  role: string;
  phone?: string;
}
interface SessionType {
  user: SessionUser;
}

export default function ProfilePage() {
  const [session, setSession] = useState<SessionType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((sess) => {
      setSession(sess as SessionType | null);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm text-center">
          <h2 className="text-xl font-bold mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!session) {
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

  const user = session.user;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm relative">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <div className="flex items-center text-gray-500">
            <Mail className="h-4 w-4 mr-1" /> {user.email}
          </div>
          {user.phone && (
            <div className="flex items-center text-gray-500">
              <Phone className="h-4 w-4 mr-1" /> {user.phone}
            </div>
          )}
          <div className="mt-2 text-sm text-gray-400 capitalize">
            Role: {String(user.role).toLowerCase()}
          </div>
          <button
            className="mt-6 w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            type="button"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
