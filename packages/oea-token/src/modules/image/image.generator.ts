import canvas, { createCanvas, loadImage } from 'canvas';
import { IMAGE_HEIGHT, IMAGE_WIDTH, LAYER_DIR } from './utils/constants';
import path from 'path';
import { toDataURL } from 'qrcode';

const generateQRCode = async (url: string) => {
  const qrCode = await toDataURL(url);
  return qrCode;
};

const addLayer = async (traitType: string, val: string, ctx: canvas.CanvasRenderingContext2D) => {
  const p = path.resolve(__dirname, `${LAYER_DIR}/${traitType}/${val}.png`);
  const img = await canvas.loadImage(p);
  return ctx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
};

export const generateImage = async (eventName: string, type: string, nftId: string, url: string) => {
  const canvas = createCanvas(IMAGE_WIDTH, IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');

  const bkgs = ['Background1', 'Background2', 'Background3'];
  const bkg = bkgs[Math.floor(Math.random() * bkgs.length)];
  await addLayer('Backgrounds', bkg, ctx);

  const qrCode = await generateQRCode(url);
  const qr = await loadImage(qrCode);
  ctx.drawImage(qr, 75, 50, IMAGE_WIDTH - 150, IMAGE_HEIGHT - 150);

  ctx.fillStyle = '#ffffff';
  ctx.font = '20px Nunito, sans-serif';
  ctx.fillText(`${eventName.toUpperCase()}-${type.toUpperCase()}-${nftId}`, 120, 460);

  const buffer = canvas.toBuffer('image/png');
  return buffer;
};
