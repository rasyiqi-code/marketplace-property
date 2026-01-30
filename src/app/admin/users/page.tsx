import { getUsers } from '@/lib/data/users';
import { UserTable } from '@/components/admin/UserTable';

export default async function AdminUsersPage() {
    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-heading font-bold text-white">Kelola Pengguna</h1>
                    <p className="text-gray-400">Daftar pengguna terdaftar di sistem</p>
                </div>
            </div>

            <UserTable users={users} />
        </div>
    );
}
