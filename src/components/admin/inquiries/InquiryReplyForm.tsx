'use client';

import { useActionState } from 'react';
import { TextField, Button, Alert, Box } from '@mui/material';
import { replyInquiry } from '@/lib/actions/inquiry';
import { Send, CheckCircle } from 'lucide-react';

interface ReplyState {
    error?: string;
    success?: boolean;
}

export default function InquiryReplyForm({ inquiryId, isReplied }: { inquiryId: string, isReplied: boolean }) {
    const bindReplyAction = replyInquiry.bind(null, inquiryId);
    const [state, formAction, isPending] = useActionState(bindReplyAction, {} as ReplyState);

    if (state.success || isReplied) {
        return (
            <Alert
                icon={<CheckCircle fontSize="inherit" />}
                severity="success"
                variant="filled"
                sx={{ width: '100%', borderRadius: 2 }}
            >
                Pesan ini sudah dibalas.
            </Alert>
        );
    }

    return (
        <form action={formAction}>
            {state.error && <Alert severity="error" sx={{ mb: 2 }}>{state.error}</Alert>}

            <TextField
                label="Tulis balasan Anda..."
                name="replyMessage"
                multiline
                rows={4}
                fullWidth
                required
                placeholder="Halo, terima kasih atas ketertarikan Anda..."
                sx={{ mb: 2 }}
                disabled={isPending}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<Send size={16} />}
                    disabled={isPending}
                >
                    {isPending ? 'Mengirim...' : 'Kirim Balasan'}
                </Button>
            </Box>
        </form>
    );
}
