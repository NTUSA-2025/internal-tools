import { Button } from '@internal-tools/ui';
import { Download, ImageIcon, LogIn, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { AuthState } from '../../app/app';
import { ToolShell } from '../../app/app';
import ntusaLogo from '../../assets/ntusa-logo.png';

const defaultQrValue = 'https://ntusa.ntu.edu.tw';
const qrSize = 320;

export function QrcodeTool({ auth }: { auth: AuthState }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [value, setValue] = useState(defaultQrValue);
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [includeLogo, setIncludeLogo] = useState(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const canUseLogo = auth.status === 'authenticated';
  const loginUrl = useLoginUrl();

  useEffect(() => {
    if (!canUseLogo && includeLogo) {
      setIncludeLogo(false);
    }
  }, [canUseLogo, includeLogo]);

  useEffect(() => {
    let cancelled = false;

    async function renderQrCode() {
      const canvas = canvasRef.current;

      if (!canvas) {
        return;
      }

      try {
        setRenderError(null);
        await QRCode.toCanvas(canvas, value.trim() || ' ', {
          color: {
            dark: '#000000',
            light: transparentBackground ? '#00000000' : '#ffffff',
          },
          errorCorrectionLevel: includeLogo ? 'H' : 'M',
          margin: 2,
          width: qrSize,
        });

        if (!cancelled && includeLogo) {
          await drawCenterLogo(canvas, transparentBackground);
        }
      } catch (error) {
        if (!cancelled) {
          setRenderError(
            error instanceof Error
              ? error.message
              : 'Unable to render QR code.',
          );
        }
      }
    }

    void renderQrCode();

    return () => {
      cancelled = true;
    };
  }, [includeLogo, transparentBackground, value]);

  return (
    <ToolShell
      title="QR code"
      eyebrow="Public tool"
      actions={
        <Button variant="secondary" onClick={downloadPng}>
          <Download size={16} aria-hidden="true" />
          Download PNG
        </Button>
      }
    >
      <div className="qr-tool">
        <section className="qr-controls" aria-label="QR code settings">
          <label className="field">
            <span>Content</span>
            <textarea
              value={value}
              onChange={(event) => setValue(event.target.value)}
              rows={6}
              placeholder="Paste a URL or text"
            />
          </label>

          <div className="qr-option">
            <label className="check-row">
              <input
                type="checkbox"
                checked={transparentBackground}
                onChange={(event) =>
                  setTransparentBackground(event.target.checked)
                }
              />
              <span>
                <span className="check-title">Transparent background</span>
                <span className="check-copy">
                  Export the PNG with transparent pixels behind the black QR
                  modules.
                </span>
              </span>
            </label>
          </div>

          <div className="qr-option">
            <label className="check-row">
              <input
                type="checkbox"
                checked={includeLogo}
                disabled={!canUseLogo}
                onChange={(event) => setIncludeLogo(event.target.checked)}
              />
              <span>
                <span className="check-title">
                  <ImageIcon size={16} aria-hidden="true" />
                  Add NTUSA logo to center
                </span>
                <span className="check-copy">
                  This option requires sign-in. Plain QR codes stay public.
                </span>
              </span>
            </label>

            {!canUseLogo ? (
              <Button asChild variant="secondary">
                <a href={loginUrl}>
                  <LogIn size={16} aria-hidden="true" />
                  Sign in to enable logo
                </a>
              </Button>
            ) : null}
          </div>
        </section>

        <section className="qr-preview" aria-label="QR code preview">
          <div className="qr-canvas-frame">
            <canvas ref={canvasRef} width={qrSize} height={qrSize} />
          </div>
          {renderError ? (
            <p className="text-sm text-[var(--accent)]">{renderError}</p>
          ) : (
            <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <QrCode size={16} aria-hidden="true" />
              Preview updates automatically.
            </p>
          )}
        </section>
      </div>
    </ToolShell>
  );

  function downloadPng() {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'qrcode.png';
    link.click();
  }
}

function useLoginUrl() {
  const location = useLocation();

  return useMemo(() => {
    const returnTo = `${location.pathname}${location.search}`;
    return `/api/auth/google/start?returnTo=${encodeURIComponent(returnTo)}`;
  }, [location.pathname, location.search]);
}

async function drawCenterLogo(
  canvas: HTMLCanvasElement,
  transparentBackground: boolean,
) {
  const context = canvas.getContext('2d');

  if (!context) {
    return;
  }

  const logo = await loadImage(ntusaLogo);
  const logoSize = Math.round(canvas.width * 0.2);
  const padding = Math.round(logoSize * 0.18);
  const frameSize = logoSize + padding * 2;
  const x = Math.round((canvas.width - frameSize) / 2);
  const y = Math.round((canvas.height - frameSize) / 2);

  if (!transparentBackground) {
    context.fillStyle = '#ffffff';
    roundRect(
      context,
      x,
      y,
      frameSize,
      frameSize,
      Math.round(frameSize * 0.18),
    );
    context.fill();
  }

  context.drawImage(logo, x + padding, y + padding, logoSize, logoSize);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to load logo image.'));
    image.src = src;
  });
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}
