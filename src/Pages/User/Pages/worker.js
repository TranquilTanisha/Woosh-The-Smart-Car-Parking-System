import QrScanner from 'qr-scanner';

self.addEventListener('message', async (event) => {
  const { imageData } = event.data;
  const code = await QrScanner.scanImage(imageData);
  self.postMessage(code);
});