import "server-only";
import { StackServerApp } from "@stackframe/stack";

/**
 * Stack Auth Server Configuration
 * 
 * Digunakan di Server Components dan Server Actions
 * untuk autentikasi dan manajemen user
 */
export const stackServerApp = new StackServerApp({
    tokenStore: "nextjs-cookie",
});
