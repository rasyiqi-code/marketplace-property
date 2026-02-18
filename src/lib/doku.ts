import crypto from 'crypto';

/**
 * Utility untuk DOKU Payment Gateway
 * Dokumentasi: https://dashboard.doku.com/docs/docs/jokul-checkout/integration-guide/
 */

const DOKU_MALL_ID = process.env.DOKU_MALL_ID || '';
const DOKU_SHARED_KEY = process.env.DOKU_SHARED_KEY || '';
const DOKU_IS_PROD = process.env.DOKU_IS_PRODUCTION === 'true';

const API_BASE_URL = DOKU_IS_PROD
    ? 'https://api.doku.com'
    : 'https://api-sandbox.doku.com';

/**
 * Menghasilkan Signature untuk request DOKU
 * Digest = Base64(SHA256(RequestBody))
 * Signature = Base64(HMAC-SHA256(SharedKey, MallId + RequestId + Timestamp + RequestTarget + Digest))
 */
export function generateDokuSignature(payload: Record<string, unknown>, requestId: string, timestamp: string, targetPath: string) {
    const bodyString = JSON.stringify(payload);
    const digest = crypto.createHash('sha256').update(bodyString).digest('base64');

    const signaturePayload = `Client-Id:${DOKU_MALL_ID}\n` +
        `Request-Id:${requestId}\n` +
        `Request-Timestamp:${timestamp}\n` +
        `Request-Target:${targetPath}\n` +
        `Digest:${digest}`;

    const signature = crypto.createHmac('sha256', DOKU_SHARED_KEY)
        .update(signaturePayload)
        .digest('base64');

    return {
        digest,
        signature: `HMACSHA256=${signature}`
    };
}

/**
 * Membuat request ke DOKU Checkout
 */
export async function createDokuCheckoutSession(orderData: {
    id: string;
    amount: number;
    customerName: string;
    customerEmail: string;
    items: { id: string, name: string, price: number, quantity: number }[];
}) {
    const timestamp = new Date().toISOString().split('.')[0] + 'Z';
    const requestId = `REQ-${orderData.id}-${Date.now()}`;
    const targetPath = '/checkout/v1/payment';

    const payload = {
        order: {
            amount: orderData.amount,
            invoice_number: orderData.id,
            currency: 'IDR',
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/upgrade/success`,
            line_items: orderData.items.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        },
        customer: {
            name: orderData.customerName,
            email: orderData.customerEmail
        },
        payment: {
            payment_due_date: 60 // 60 minutes
        }
    };

    const { signature } = generateDokuSignature(payload, requestId, timestamp, targetPath);

    const response = await fetch(`${API_BASE_URL}${targetPath}`, {
        method: 'POST',
        headers: {
            'Client-Id': DOKU_MALL_ID,
            'Request-Id': requestId,
            'Request-Timestamp': timestamp,
            'Signature': signature,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.error?.message || 'Gagal membuat sesi pembayaran DOKU');
    }

    return result;
}
