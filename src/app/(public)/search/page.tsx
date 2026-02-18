import { FilterSidebar } from '@/components/filters/FilterSidebar';
import { getProperties } from '@/lib/data/properties';
import { SearchResults } from '@/components/search/SearchResults';
import { Container, Grid, Typography, Box } from '@mui/material';
import { getUserWishlistIds } from '@/lib/actions/wishlist';

export default async function SearchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const params = await searchParams;

    const query = typeof params.query === 'string' ? params.query : undefined;
    const type = typeof params.type === 'string' ? params.type : undefined;
    const location = typeof params.location === 'string' ? params.location : undefined;
    const status = typeof params.status === 'string' ? params.status : undefined;
    const minPrice = typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined;
    const maxPrice = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined;
    const bedrooms = typeof params.bedrooms === 'string' ? Number(params.bedrooms) : undefined;

    const properties = await getProperties({
        query,
        type,
        location,
        status,
        minPrice,
        maxPrice,
        bedrooms,
    });

    const wishlistedPropertyIds = await getUserWishlistIds();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'neutral.50', fontFamily: 'sans' }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Box mb={4}>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" mb={1}>
                        Hasil Pencarian Properti
                    </Typography>
                    <Typography color="text.secondary">
                        Menampilkan {properties.length} properti yang sesuai dengan kriteria Anda.
                    </Typography>
                </Box>

                <Grid container spacing={4}>
                    {/* Sidebar Filters */}
                    <Grid size={{ xs: 12, lg: 3 }}>
                        <FilterSidebar />
                    </Grid>

                    {/* Results Content */}
                    <Grid size={{ xs: 12, lg: 9 }}>
                        <SearchResults properties={properties} wishlistedPropertyIds={wishlistedPropertyIds} />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
