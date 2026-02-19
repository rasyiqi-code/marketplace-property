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
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID,
    publishableClientKey: process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY,
    secretServerKey: process.env.STACK_SECRET_SERVER_KEY,
});

/**
 * Custom Permission ID untuk admin
 * 
 * PENTING: Permission ini harus dibuat terlebih dahulu di Stack Auth Dashboard:
 * 1. Go to Settings → Permissions
 * 2. Create new permission dengan ID: 'admin'
 * 3. Scope: Project (global)
 * 4. Grant permission ke user via Dashboard atau API:
 *    POST /project-permissions/{user_id}/admin
 */
const ADMIN_PERMISSION_ID = 'admin';

// Type untuk permission dari Stack Auth
interface Permission {
    id: string;
    [key: string]: unknown;
}

/**
 * Helper: Check if current user is admin
 * 
 * Menggunakan Stack Auth custom project permission untuk validasi admin.
 * Permission 'admin' harus sudah dibuat di Stack Auth Dashboard.
 * 
 * Fallback: Jika user ID ada di environment variable ADMIN_IDS, akan dianggap admin.
 * Ini berguna untuk bootstrap admin pertama tanpa perlu database/API setup.
 * 
 * @returns Promise<boolean> - true jika user memiliki project permission 'admin' atau ada di ADMIN_IDS
 */
export async function isUserAdmin(): Promise<boolean> {
    try {
        const user = await stackServerApp.getUser();

        if (!user) return false;

        // Check 1: Environment variable ADMIN_IDS (bootstrap/fallback)
        const adminIds = process.env.ADMIN_IDS?.split(',').map(id => id.trim()) || [];
        if (adminIds.includes(user.id)) {
            return true;
        }

        // Check 2: Stack Auth project permission 'admin'
        const permissions = await user.listPermissions();
        const hasAdminPermission = permissions.some((permission: Permission) => permission.id === 'admin');

        return hasAdminPermission;
    } catch (error) {
        console.error('Error checking admin permission:', error);
        return false;
    }
}

/**
 * Helper: Require admin or throw error
 * 
 * Throws error jika user bukan admin. Digunakan di API routes.
 * 
 * @throws Error 'UNAUTHORIZED' jika user tidak login
 * @throws Error 'FORBIDDEN' jika user tidak punya admin permission
 * @returns User object jika valid admin
 */
export async function requireAdmin() {
    const user = await stackServerApp.getUser();

    if (!user) {
        throw new Error('UNAUTHORIZED');
    }

    // Check 1: Environment variable ADMIN_IDS
    const adminIds = process.env.ADMIN_IDS?.split(',').map(id => id.trim()) || [];
    if (adminIds.includes(user.id)) {
        return user;
    }

    // Check 2: Stack Auth permission
    const permissions = await user.listPermissions();
    const isAdmin = permissions.some((permission: Permission) => permission.id === ADMIN_PERMISSION_ID);

    if (!isAdmin) {
        throw new Error('FORBIDDEN');
    }

    return user;
}
