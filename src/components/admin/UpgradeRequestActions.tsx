'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface UpgradeRequestActionsProps {
    requestId: string;
    status: string;
    adminNote?: string | null;
}

export function UpgradeRequestActions({ requestId, status, adminNote }: UpgradeRequestActionsProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handleApprove = async () => {
        if (!confirm('Approve request ini? User akan di-upgrade dan dapat verified badge.')) return;

        setIsProcessing(true);
        try {
            const res = await fetch(`/api/admin/upgrade-requests/${requestId}/approve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminNote: 'Request approved' }),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || 'Gagal approve request');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan network');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        const adminNote = prompt('Alasan reject (required):');
        if (!adminNote) return;

        setIsProcessing(true);
        try {
            const res = await fetch(`/api/admin/upgrade-requests/${requestId}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ adminNote }),
            });

            if (res.ok) {
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || 'Gagal reject request');
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan network');
        } finally {
            setIsProcessing(false);
        }
    };

    if (status === 'PENDING') {
        return (
            <div className="flex items-center justify-end gap-2">
                <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <CheckCircle size={14} />
                    Approve
                </button>
                <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <XCircle size={14} />
                    Reject
                </button>
            </div>
        );
    }

    // For approved/rejected status
    if (adminNote) {
        return (
            <span className="text-xs text-gray-400" title={adminNote}>
                Note: {adminNote.substring(0, 20)}...
            </span>
        );
    }

    return null;
}
