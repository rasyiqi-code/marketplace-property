import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
    <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
    </div>
);
