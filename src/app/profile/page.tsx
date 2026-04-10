"use client";
import Image from "next/image";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_BASE_API || "https://api-express-schedule.vercel.app";

export default function Profile() {
    const { data: session, status, update } = useSession();

    const [editName, setEditName] = useState("");
    const [editPhone, setEditPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingProfile, setEditingProfile] = useState(false);

    const hasPassword = session?.user?.hasPassword;
    const userRole = session?.user?.role;
    const kehilot = session?.user?.kehilaSlugs || [];

    const roleLabel = userRole === "admin" ? "אדמין" : userRole === "gabay" ? "גבאי" : "משתמש";
    const roleColor = userRole === "admin"
        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
        : userRole === "gabay"
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (password !== confirmPassword) {
            setError("הסיסמאות לא תואמות");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/set-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: session?.user?.email,
                    password,
                    phone: editPhone || undefined,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "שגיאה");
            } else {
                setMessage("הסיסמה נשמרה בהצלחה!");
                setPassword("");
                setConfirmPassword("");
                await update();
            }
        } catch {
            setError("שגיאת שרת");
        }

        setLoading(false);
    };

    if (status === "loading") {
        return (
            <DefaultLayout>
                <div className="flex min-h-[60vh] items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
                </div>
            </DefaultLayout>
        );
    }

    if (status === "unauthenticated") {
        return (
            <DefaultLayout>
                <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4" dir="rtl">
                    <p className="text-gray-500">יש להתחבר כדי לראות את הפרופיל</p>
                    <Link href="/signin" className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                        התחברות
                    </Link>
                </div>
            </DefaultLayout>
        );
    }

    return (
        <DefaultLayout>
            <div className="mx-auto max-w-2xl px-4 py-8" dir="rtl">

                {/* Profile Header Card */}
                <div className="rounded-2xl bg-gradient-to-l from-blue-600 to-indigo-700 p-6 text-white shadow-lg mb-6">
                    <div className="flex items-center gap-5">
                        <div className="relative">
                            {session?.user?.image ? (
                                <Image
                                    width={80}
                                    height={80}
                                    src={session.user.image}
                                    alt={session.user.name || ""}
                                    className="rounded-full border-4 border-white/30 shadow-lg"
                                />
                            ) : (
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/30 bg-white/20 text-3xl font-bold shadow-lg">
                                    {session?.user?.name?.[0]?.toUpperCase() || "?"}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl font-bold truncate">{session?.user?.name}</h1>
                            <p className="text-blue-200 text-sm truncate">{session?.user?.email}</p>
                            {session?.user?.phone && (
                                <p className="text-blue-200 text-sm mt-0.5" dir="ltr">{session.user.phone}</p>
                            )}
                            <div className="mt-2 flex flex-wrap gap-2">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${roleColor}`}>
                                    {roleLabel}
                                </span>
                                {hasPassword ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                        סיסמה מוגדרת
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" /></svg>
                                        ללא סיסמה
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Kehilot */}
                    {kehilot.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/20">
                            <p className="text-xs text-blue-200 mb-2">קהילות מנוהלות</p>
                            <div className="flex flex-wrap gap-2">
                                {kehilot.map((slug) => (
                                    <Link
                                        key={slug}
                                        href={`/admin/${slug}`}
                                        className="rounded-lg bg-white/15 px-3 py-1.5 text-sm font-medium hover:bg-white/25 transition"
                                    >
                                        {slug}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Set Password Section */}
                {!hasPassword && (
                    <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-amber-600"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">הגדר סיסמה</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">כדי להתחבר גם עם אימייל וסיסמה</p>
                            </div>
                        </div>

                        <form onSubmit={handleSetPassword} className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="edit-phone">
                                    מספר טלפון
                                </label>
                                <input
                                    id="edit-phone"
                                    type="tel"
                                    value={editPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    placeholder="050-1234567"
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="new-password">
                                    סיסמה חדשה
                                </label>
                                <div className="relative">
                                    <input
                                        id="new-password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="לפחות 6 תווים"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pl-12 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="confirm-password">
                                    אימות סיסמה
                                </label>
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="הכנס סיסמה שוב"
                                    required
                                    minLength={6}
                                    autoComplete="new-password"
                                    className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:ring-2 dark:bg-gray-700 dark:text-white ${
                                        confirmPassword && password !== confirmPassword
                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                                            : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 dark:border-gray-600"
                                    }`}
                                />
                                {confirmPassword && password !== confirmPassword && (
                                    <p className="mt-1 text-xs text-red-500">הסיסמאות לא תואמות</p>
                                )}
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 dark:bg-red-900/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-red-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" /></svg>
                                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                                </div>
                            )}
                            {message && (
                                <div className="flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 dark:bg-green-900/20">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-green-500 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" /></svg>
                                    <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (!!confirmPassword && password !== confirmPassword)}
                                className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        שומר...
                                    </span>
                                ) : "שמור סיסמה"}
                            </button>
                        </form>
                    </div>
                )}

                {/* Sign Out */}
                <div className="rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                    <button
                        onClick={() => signOut({ callbackUrl: "/signin" })}
                        className="w-full flex items-center justify-center gap-2 rounded-xl border-2 border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 hover:border-red-300 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                        התנתק
                    </button>
                </div>
            </div>
        </DefaultLayout>
    );
}
