import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TransactionDTO } from './types';

export const generateInvoice = (tx: TransactionDTO) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.text('PROESTATE INVOICE', 14, 20);

    doc.setFontSize(10);
    doc.text(`Invoice ID: ${tx.id}`, 14, 30);
    doc.text(`Tanggal: ${new Date(tx.createdAt).toLocaleDateString('id-ID')}`, 14, 35);

    // Seller & Buyer Info
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Diterbitkan Oleh:', 14, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${tx.seller.name || tx.seller.email}`, 14, 55);

    doc.setFont('helvetica', 'bold');
    doc.text('Ditujukan Kepada:', 120, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`${tx.buyer.name || tx.buyer.email}`, 120, 55);

    // Transaction Table
    autoTable(doc, {
        startY: 70,
        head: [['Deskripsi Properti', 'Harga']],
        body: [[tx.propertyTitle || 'Property', new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(tx.amount)]],
        theme: 'striped',
        headStyles: { fillColor: [3, 78, 150] } // Primary ProEstate brand color
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text('Status Pembayaran: LUNAS', 14, finalY);
    doc.text('Terima kasih atas transaksi Anda di ProEstate Marketplace!', 14, finalY + 10);

    doc.save(`Invoice-${tx.id}.pdf`);
};
