export interface TransactionDTO {
    id: string;
    amount: number;
    status: string;
    propertyTitle: string | null;
    propertyId: string;
    buyerId: string;
    sellerId: string;
    createdAt: string;
    property: {
        title: string;
        images: string;
    };
    buyer: {
        name: string | null;
        email: string;
    };
    seller: {
        name: string | null;
        email: string;
        bankName: string | null;
        bankAccount: string | null;
        bankHolder: string | null;
    };
    paymentProofUrl?: string | null;
}
