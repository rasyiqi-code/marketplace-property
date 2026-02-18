'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Box,
    TextField,
    Button,
    Card,
    CardContent,
    FormControlLabel,
    Switch,
    Typography,
    Rating,
    Alert,
    CircularProgress
} from '@mui/material';
import { createTestimonial, updateTestimonial, TestimonialState } from '@/lib/actions/testimonial';
import { Save } from 'lucide-react';

interface TestimonialFormProps {
    mode: 'create' | 'edit';
    initialData?: {
        id: string;
        name: string;
        role: string;
        quote: string;
        rating: number;
        show: boolean;
        avatar?: string | null;
    };
}

const initialState: TestimonialState = {};

export default function TestimonialForm({ mode, initialData }: TestimonialFormProps) {
    const router = useRouter();

    // Bind the correct action based on mode
    const action = mode === 'create'
        ? createTestimonial
        : updateTestimonial.bind(null, initialData?.id as string);

    const [state, formAction, isPending] = useActionState(action, initialState);

    if (state.success) {
        // Redirect back to list on success
        router.push('/admin/testimonials');
        router.refresh();
    }

    return (
        <form action={formAction}>
            <Card variant="outlined" sx={{ borderRadius: 3, boxShadow: 'sm' }}>
                <CardContent sx={{ p: 4 }}>
                    {state.error && <Alert severity="error" sx={{ mb: 3 }}>{state.error}</Alert>}

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                        <TextField
                            label="Nama User"
                            name="name"
                            defaultValue={initialData?.name}
                            required
                            fullWidth
                            error={!!state.errors?.name}
                            helperText={state.errors?.name?.[0]}
                        />
                        <TextField
                            label="Role / Jabatan"
                            name="role"
                            defaultValue={initialData?.role}
                            placeholder="Contoh: CEO, Property Agent"
                            required
                            fullWidth
                            error={!!state.errors?.role}
                            helperText={state.errors?.role?.[0]}
                        />
                    </Box>

                    <TextField
                        label="Kutipan Testimoni"
                        name="quote"
                        defaultValue={initialData?.quote}
                        required
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 3 }}
                        error={!!state.errors?.quote}
                        helperText={state.errors?.quote?.[0]}
                    />

                    <Box sx={{ mt: 3, display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        <Box>
                            <Typography component="legend" gutterBottom>Rating</Typography>
                            <Rating
                                name="rating"
                                defaultValue={initialData?.rating || 5}
                            />
                        </Box>

                        <TextField
                            label="Avatar URL (Optional)"
                            name="avatar"
                            defaultValue={initialData?.avatar || ''}
                            placeholder="https://example.com/photo.jpg"
                            sx={{ flexGrow: 1 }}
                        />

                        <FormControlLabel
                            control={<Switch name="show" defaultChecked={initialData?.show ?? true} />}
                            label="Tampilkan di Homepage"
                            sx={{ mt: 2 }}
                        />
                    </Box>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={() => router.back()}
                            disabled={isPending}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={isPending ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />}
                            disabled={isPending}
                        >
                            {isPending ? 'Menyimpan...' : 'Simpan Testimoni'}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
}
