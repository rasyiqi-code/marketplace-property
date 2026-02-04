import { stackServerApp } from '@/lib/stack';
import { NextResponse } from 'next/server';

/**
 * Development Endpoint: Grant Admin Permission
 * 
 * Endpoint ini untuk development/testing purposes.
 * Grant project permission 'admin' ke current logged-in user.
 * 
 * PENTING: 
 * 1. Permission 'admin' harus sudah dibuat di Stack Auth Dashboard
 * 2. Endpoint ini sebaiknya dihapus/disabled di production
 * 3. Atau tambahkan security check (e.g. whitelist email)
 */
export async function POST() {
    try {
        const user = await stackServerApp.getUser({ or: 'redirect' });

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Grant admin permission to current user
        await user.grantPermission('admin');

        return NextResponse.json({
            success: true,
            message: `Admin permission granted to user: ${user.primaryEmail}`,
            userId: user.id,
        });
    } catch (error: any) {
        console.error('Error granting admin permission:', error);

        return NextResponse.json({
            error: error.message || 'Failed to grant admin permission',
            details: 'Make sure permission "admin" is created in Stack Auth Dashboard (Settings → Permissions)',
        }, { status: 500 });
    }
}

/**
 * GET: Check if current user has admin permission
 */
export async function GET() {
    try {
        const user = await stackServerApp.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        const permissions = await user.listPermissions();
        const hasAdmin = permissions.some((p: any) => p.id === 'admin');

        return NextResponse.json({
            userId: user.id,
            email: user.primaryEmail,
            hasAdmin,
            allPermissions: permissions.map((p: any) => p.id),
        });
    } catch (error: any) {
        console.error('Error checking permissions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * DELETE: Revoke admin permission from current user
 */
export async function DELETE() {
    try {
        const user = await stackServerApp.getUser({ or: 'redirect' });

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // Revoke admin permission
        await user.revokePermission('admin');

        return NextResponse.json({
            success: true,
            message: `Admin permission revoked from user: ${user.primaryEmail}`,
        });
    } catch (error: any) {
        console.error('Error revoking admin permission:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
