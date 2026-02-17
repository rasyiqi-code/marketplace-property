'use client';

import * as React from 'react';
import { Box, Container, Typography, Avatar, Rating, Paper, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight, FormatQuote } from '@mui/icons-material';
import { Testimonial } from '@prisma/client';

interface TestimonialSectionProps {
    testimonials: Testimonial[];
}

export function TestimonialSection({ testimonials }: TestimonialSectionProps) {
    const [activeStep, setActiveStep] = React.useState(0);

    const handleNext = () => {
        if (!testimonials.length) return;
        setActiveStep((prev) => (prev + 1) % testimonials.length);
    };

    const handleBack = () => {
        if (!testimonials.length) return;
        setActiveStep((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    const testimonial = testimonials[activeStep];

    return (
        <Box sx={{ py: 10, backgroundColor: '#fdfdfd', position: 'relative', overflow: 'hidden' }}>
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 8 }}>
                    <Typography variant="overline" sx={{ color: 'secondary.main', fontWeight: 700, letterSpacing: 2 }}>
                        Testimonials
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: 'grey.900' }}>
                        Apa Kata Mereka Tentang ProEstate?
                    </Typography>
                </Box>

                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 4, md: 8 },
                        borderRadius: 6,
                        backgroundColor: 'white',
                        border: '1px solid',
                        borderColor: 'grey.100',
                        position: 'relative',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.03)',
                    }}
                >
                    <FormatQuote
                        sx={{
                            position: 'absolute',
                            top: 40,
                            left: 40,
                            fontSize: 80,
                            color: 'grey.100',
                            zIndex: 0,
                        }}
                    />

                    <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                        <Rating value={testimonial.rating} readOnly precision={0.5} sx={{ mb: 3 }} />
                        <Typography
                            variant="h5"
                            sx={{
                                fontStyle: 'italic',
                                fontWeight: 500,
                                mb: 4,
                                lineHeight: 1.6,
                                color: 'grey.800',
                            }}
                        >
                            &ldquo;{testimonial.quote}&rdquo;
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src={testimonial.avatar || undefined}
                                sx={{ width: 80, height: 80, mb: 2, border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                            >
                                {testimonial.name[0]}
                            </Avatar>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'grey.900' }}>
                                {testimonial.name}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 600 }}>
                                {testimonial.role}
                            </Typography>
                        </Box>
                    </Box>

                    {/* Navigation Buttons */}
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            mt: 6,
                        }}
                    >
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': { backgroundColor: 'primary.main', color: 'white', borderColor: 'primary.main' },
                            }}
                        >
                            <ChevronLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                border: '1px solid',
                                borderColor: 'grey.200',
                                '&:hover': { backgroundColor: 'primary.main', color: 'white', borderColor: 'primary.main' },
                            }}
                        >
                            <ChevronRight />
                        </IconButton>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
