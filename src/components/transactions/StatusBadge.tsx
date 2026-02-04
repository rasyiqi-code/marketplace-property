import { Check, X, Clock } from 'lucide-react';

export const StatusBadge = ({ status }: { status: string }) => {
    let color = 'bg-gray-100 text-gray-600';
    let icon = <Clock size={14} />;

    if (status === 'SUCCESS') {
        color = 'bg-green-100 text-green-700';
        icon = <Check size={14} />;
    } else if (status === 'WAITING_VERIFICATION') {
        color = 'bg-blue-100 text-blue-700';
        icon = <Clock size={14} />;
    } else if (status === 'CANCELLED' || status === 'FAILED') {
        color = 'bg-red-100 text-red-700';
        icon = <X size={14} />;
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${color}`}>
            {icon}
            {status}
        </span>
    );
};
