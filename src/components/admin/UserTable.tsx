'use client';

import { useState } from 'react';
import { UserDTO } from '@/lib/data/users';
import { Trash2, UserCog, Check, X } from 'lucide-react';

interface UserTableProps {
    users: UserDTO[];
    currentUserId?: string;
}

export function UserTable({ users: initialUsers, currentUserId }: UserTableProps) {
    const [users, setUsers] = useState(initialUsers);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [isSavingRole, setIsSavingRole] = useState(false);

    const handleDelete = async (id: string) => {
        if (!confirm('Hapus pengguna ini? Semua data properti mereka juga akan terhapus.')) return;

        setIsDeleting(id);
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Gagal menghapus pengguna');

            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (error) {
            console.error('Failed to delete user:', error);
            alert('Gagal menghapus pengguna.');
        } finally {
            setIsDeleting(null);
        }
    };

    const startEditRole = (user: UserDTO) => {
        setEditingRole(user.id);
        setSelectedRole(user.role);
    };

    const cancelEditRole = () => {
        setEditingRole(null);
        setSelectedRole('');
    };

    const saveRole = async (id: string) => {
        setIsSavingRole(true);
        try {
            const res = await fetch(`/api/admin/users/${id}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: selectedRole }),
            });
            if (!res.ok) throw new Error('Gagal mengubah role');

            setUsers(users.map(u => u.id === id ? { ...u, role: selectedRole } : u));
            setEditingRole(null);
        } catch (error) {
            console.error('Failed to update role:', error);
            alert('Gagal mengubah role.');
        } finally {
            setIsSavingRole(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Nama</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Properti</th>
                            <th className="px-6 py-4">Bergabung</th>
                            <th className="px-6 py-4">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                            {user.id === currentUserId && (
                                                <span className="bg-primary/10 text-primary text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">Anda</span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    {editingRole === user.id ? (
                                        <div className="flex items-center gap-2">
                                            <select
                                                value={selectedRole}
                                                onChange={(e) => setSelectedRole(e.target.value)}
                                                className="text-xs border rounded px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20"
                                                disabled={isSavingRole}
                                            >
                                                <option value="USER">USER</option>
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="AGENT">AGENT</option>
                                            </select>
                                            <button
                                                onClick={() => saveRole(user.id)}
                                                disabled={isSavingRole}
                                                className="text-green-600 hover:text-green-700 p-1"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={cancelEditRole}
                                                disabled={isSavingRole}
                                                className="text-red-500 hover:text-red-600 p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startEditRole(user)}
                                            disabled={user.id === currentUserId}
                                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium hover:bg-opacity-80 transition-opacity disabled:cursor-not-allowed ${user.role === 'ADMIN'
                                                ? 'bg-purple-50 text-purple-700'
                                                : 'bg-blue-50 text-blue-700'
                                                }`}
                                            title={user.id === currentUserId ? 'Anda tidak bisa mengubah role sendiri' : 'Klik untuk ubah role'}
                                        >
                                            {user.role === 'ADMIN' && <UserCog className="w-3 h-3" />}
                                            {user.role}
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-gray-600">{user._count.properties} Listing</span>
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        disabled={isDeleting === user.id || user.role === 'ADMIN' || user.id === currentUserId}
                                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                        title={user.id === currentUserId ? 'Anda tidak bisa menghapus akun sendiri' : user.role === 'ADMIN' ? 'Tidak bisa menghapus Admin' : 'Hapus User'}
                                    >
                                        {isDeleting === user.id ? (
                                            <span className="animate-spin w-4 h-4 block border-2 border-red-600 border-t-transparent rounded-full"></span>
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
