'use server';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const { email, password } = Object.fromEntries(formData);

    try {
        console.log('Attempting sign in with credentials...');
        await signIn('credentials', {
            email,
            password,
            redirectTo: '/dashboard', // Default to dashboard for now
        });
        console.log('Sign in successful');
    } catch (error) {
        console.log('Sign in error caught:', error);

        // Check if it's a redirect error (Next.js specific)
        if ((error as Error).message.includes('NEXT_REDIRECT')) {
            throw error;
        }

        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Email atau password salah.';
                case 'CallbackRouteError':
                    return 'Terjadi kesalahan pada login callback.';
                default:
                    return 'Terjadi kesalahan sistem: ' + error.type;
            }
        }

        // If it's a redirect that didn't match the message check (sometimes happens in dev)
        // We can try to re-throw if it has 'digest' property starting with 'NEXT_REDIRECT'
        if ((error as any).digest?.startsWith?.('NEXT_REDIRECT')) {
            throw error;
        }

        // For other errors, return generic message or re-throw
        console.error('Unexpected auth error:', error);
        return 'Gagal masuk: ' + (error as Error).message;
    }
}
