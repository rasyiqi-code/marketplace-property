import Link from 'next/link';

export function Footer() {
    return (
        <footer className="bg-background border-t border-border py-16 mt-auto">
            <div className="container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="max-w-[300px]">
                        <Link href="/" className="font-heading text-2xl font-bold text-primary mb-4 block">
                            ProEstate
                        </Link>
                        <p className="text-muted-foreground leading-relaxed">
                            Platform properti terpercaya untuk menemukan rumah impian Anda.
                            Jual, beli, dan sewa properti dengan mudah dan aman.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6 text-foreground">Perusahaan</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">Tentang Kami</Link>
                            <Link href="/careers" className="text-muted-foreground hover:text-primary transition-colors">Karir</Link>
                            <Link href="/press" className="text-muted-foreground hover:text-primary transition-colors">Pers</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6 text-foreground">Dukungan</h3>
                        <div className="flex flex-col gap-4">
                            <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Pusat Bantuan</Link>
                            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</Link>
                            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</Link>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-6 text-foreground">Hubungi Kami</h3>
                        <div className="flex flex-col gap-4">
                            <span className="text-muted-foreground">support@proestate.id</span>
                            <span className="text-muted-foreground">+62 21 5555 6666</span>
                            <span className="text-muted-foreground">Jakarta, Indonesia</span>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-border text-center text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} ProEstate. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
