import { Box, CircularProgress } from '@mui/material';

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex justify-center items-center h-[500px]">
                    <CircularProgress />
                </div>
            </div>
        </div>
    );
}
