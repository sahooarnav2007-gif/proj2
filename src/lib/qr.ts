import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Generates a scannable QR code entirely client-side so the live demo works
// even without internet access (no external qr-code image CDN dependency).
export function useQrDataUrl(text: string, size = 320): { dataUrl: string | null; error: boolean } {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;
    if (!text) return;
    QRCode.toDataURL(text, {
      width: size,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [text, size]);

  return { dataUrl, error };
}