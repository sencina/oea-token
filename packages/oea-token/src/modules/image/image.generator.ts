import canvas, { createCanvas, loadImage } from 'canvas';
import { IMAGE_HEIGHT, IMAGE_WIDTH, LAYER_DIR } from './utils/constants';
import path from 'path';
import { toDataURL } from 'qrcode';

const generateQRCode = async (url: string) => {
  const qrCode = await toDataURL(url, {
    color: {
      dark: '#9747FF', // Purple color matching HAPS theme
      light: '#FFFFFF',
    },
    width: 400,
    margin: 1,
    errorCorrectionLevel: 'H',
  });
  return qrCode;
};

const drawRoundedRect = (
  ctx: canvas.CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
};

const drawNFTBadge = (ctx: canvas.CanvasRenderingContext2D, x: number, y: number, text: string) => {
  const padding = 12;
  const fontSize = 16;
  ctx.font = `${fontSize}px "Open Sans"`;
  const textWidth = ctx.measureText(text).width;
  const width = textWidth + padding * 2;
  const height = fontSize + padding * 1.5;
  const radius = height / 2;

  // Draw badge background
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, '#9747FF');
  gradient.addColorStop(1, '#FFC700');

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + width / 2, y + height / 2);

  return { width, height };
};

export const generateImage = async (eventName: string, nftId: string, url: string) => {
  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  // Add background with gradient
  const gradient = ctx.createLinearGradient(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  gradient.addColorStop(0, '#9747FF'); // Purple
  gradient.addColorStop(1, '#FFC700'); // Yellow
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);

  // Add a white rounded rectangle for the content with shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = '#FFFFFF';
  const padding = 40;
  drawRoundedRect(ctx, padding, padding, IMAGE_WIDTH - padding * 2, IMAGE_HEIGHT - padding * 2, 20);
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Generate and add QR code with subtle shadow
  const qrCode = await generateQRCode(url);
  const qr = await loadImage(qrCode);
  const qrSize = IMAGE_HEIGHT - 250; // Even bigger QR code
  const qrX = (IMAGE_WIDTH - qrSize) / 2;
  const qrY = padding + 40; // Moved up since we removed the logo

  // Add subtle shadow to QR code
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 3;
  ctx.drawImage(qr, qrX, qrY, qrSize, qrSize);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Add event name with elegant styling
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 36px "Open Sans"';
  ctx.textAlign = 'center';
  const title = eventName.toUpperCase();

  // Add subtle text shadow for depth
  ctx.fillStyle = 'rgba(151, 71, 255, 0.1)';
  ctx.fillText(title, IMAGE_WIDTH / 2 + 2, qrY + qrSize + 50 + 2);

  // Main text
  ctx.fillStyle = '#333333';
  ctx.fillText(title, IMAGE_WIDTH / 2, qrY + qrSize + 50);

  // Add NFT ID badge
  const badgeText = `NFT #${nftId}`;

  // Calculate text width to center the badge
  ctx.font = '16px "Open Sans"';
  const textWidth = ctx.measureText(badgeText).width;
  const badgeWidth = textWidth + 12 * 2; // padding * 2
  const badgeX = (IMAGE_WIDTH - badgeWidth) / 2;
  const badgeY = qrY + qrSize + 65; // Reduced spacing between title and badge
  drawNFTBadge(ctx, badgeX, badgeY, badgeText);

  const buffer = canvas.toBuffer('image/png');
  return buffer;
};
