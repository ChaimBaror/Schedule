'use client'
import React from 'react';
import { useSession } from 'next-auth/react';

interface RestrictedContentProps {
    children: React.ReactNode;
    fallback?: React.ReactElement;
}

export default function RestrictedContent({ children, fallback }: RestrictedContentProps) {
    const { status } = useSession();
    const isLoggedIn: boolean = status === 'authenticated';
    const isLoadingAuth: boolean = status === 'loading';

    if (isLoadingAuth) {
        return null;
    }

    if (!isLoggedIn) {
        return fallback || null;
    }

    return <>{children}</>;
}