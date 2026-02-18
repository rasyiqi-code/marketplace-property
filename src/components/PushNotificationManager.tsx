'use client';

import { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import { NotificationsActive, NotificationsOff } from '@mui/icons-material';
import { toast } from 'sonner';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const paddedBase64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(paddedBase64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export default function PushNotificationManager() {
    const [isSupported, setIsSupported] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState<PushSubscription | null>(null);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        setIsSupported(typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window);

        if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window) {
            // Register SW
            navigator.serviceWorker.register('/sw.js')
                .then(reg => {
                    setRegistration(reg);
                    reg.pushManager.getSubscription()
                        .then(sub => {
                            if (sub) {
                                setSubscription(sub);
                                setIsSubscribed(true);
                            } else {
                                // Auto-prompt if not subscribed and permission is default
                                if (Notification.permission === 'default') {
                                    setTimeout(() => {
                                        toast('Dapatkan Info Properti Terbaru', {
                                            description: 'Aktifkan notifikasi untuk tidak ketinggalan update menarik.',
                                            action: {
                                                label: 'Aktifkan',
                                                onClick: () => subscribeToPush()
                                            },
                                            duration: 8000,
                                        });
                                    }, 3000); // Delay 3s agar tidak kaget
                                }
                            }
                        });
                })
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    }, []);

    const subscribeToPush = async () => {
        if (!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
            toast.error('Gagal: Public Key VAPID tidak ditemukan di environment variable.');
            console.error('Missing NEXT_PUBLIC_VAPID_PUBLIC_KEY');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.ready;

            if (!registration) {
                toast.error('Service Worker belum siap. Coba refresh halaman.');
                return;
            }

            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY)
            });

            setSubscription(sub);
            setIsSubscribed(true);

            // Send subscription to server
            await fetch('/api/web-push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sub)
            });

            toast.success('Berhasil berlangganan notifikasi!');
        } catch (error) {
            console.error('Failed to subscribe:', error);
            toast.error('Gagal mengaktifkan notifikasi: ' + error);
        }
    };

    const unsubscribeFromPush = async () => {
        if (!subscription) return;

        try {
            await subscription.unsubscribe();
            setSubscription(null);
            setIsSubscribed(false);
            toast.success('Berhenti berlangganan notifikasi.');
            // Optional: Notify server to remove subscription
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            toast.error('Gagal menonaktifkan notifikasi.');
        }
    };

    if (!isSupported) {
        return null; // Not supported
    }

    return (
        <Button
            variant="outlined"
            color={isSubscribed ? "secondary" : "primary"}
            size="small"
            startIcon={isSubscribed ? <NotificationsActive /> : <NotificationsOff />}
            onClick={isSubscribed ? unsubscribeFromPush : subscribeToPush}
            sx={{ textTransform: 'none' }}
        >
            {isSubscribed ? 'Notifikasi Aktif' : 'Aktifkan Notifikasi'}
        </Button>
    );
}
