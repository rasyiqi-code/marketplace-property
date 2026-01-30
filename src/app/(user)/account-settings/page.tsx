'use client';

import { AccountSettings } from "@stackframe/stack";

export default function AccountSettingsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold font-heading text-gray-900">Pengaturan Akun</h1>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AccountSettings fullPage={false} />
            </div>
        </div>
    );
}
