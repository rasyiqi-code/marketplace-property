import { AccountSettings } from "@stackframe/stack";
import { BankSettings } from "@/components/dashboard/BankSettings";
import { SellerSettings } from "@/components/dashboard/SellerSettings";
import { SellerProfileSettings } from "@/components/dashboard/SellerProfileSettings";

export default function AccountSettingsPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold font-heading text-gray-900">Pengaturan Akun</h1>
                <p className="text-gray-500">Kelola profil pribadi dan informasi pembayaran Anda.</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <AccountSettings fullPage={false} />
            </div>

            <SellerProfileSettings />
            <BankSettings />
            <SellerSettings />
        </div>
    );
}
