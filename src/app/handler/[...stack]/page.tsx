import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "@/lib/stack";

/**
 * Stack Auth Handler
 * 
 * Menangani semua route autentikasi:
 * - /handler/sign-in
 * - /handler/sign-up
 * - /handler/sign-out
 * - /handler/forgot-password
 * - /handler/account-settings
 * - dll.
 */
export default function Handler(props: object) {
    return <StackHandler fullPage app={stackServerApp} {...props} />;
}
