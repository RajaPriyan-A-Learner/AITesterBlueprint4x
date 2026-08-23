import { createWorker } from 'tesseract.js';

let workerInstance = null;
let isInitializing = false;

/**
 * Preprocesses an image via Canvas to maximize OCR character clarity
 * (sharpening, contrast boost, and 2.5x upscale for crisp slashes, colons, dots, and symbols)
 * @param {string|HTMLImageElement|Blob} imageSource
 * @returns {Promise<string>} processed base64 data URL
 */
async function preprocessImage(imageSource) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 2.5x High-DPI Upscale for small screenshots / URL bars
      const scale = Math.max(1.8, Math.min(3.0, 2000 / Math.max(img.width, img.height)));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Contrast enhancement & thresholding
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Calculate average brightness
      let totalLum = 0;
      for (let i = 0; i < data.length; i += 4) {
        const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        totalLum += lum;
      }
      const avgLum = totalLum / (data.length / 4);

      // Boost contrast to make slashes / dots / colons pop
      const contrast = 1.35;
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply contrast
        r = Math.min(255, Math.max(0, factor * (r - 128) + 128));
        g = Math.min(255, Math.max(0, factor * (g - 128) + 128));
        b = Math.min(255, Math.max(0, factor * (b - 128) + 128));

        // Grayscale conversion
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      // Fallback to original source if canvas load fails
      resolve(typeof imageSource === 'string' ? imageSource : URL.createObjectURL(imageSource));
    };

    if (typeof imageSource === 'string') {
      img.src = imageSource;
    } else if (imageSource instanceof Blob || imageSource instanceof File) {
      img.src = URL.createObjectURL(imageSource);
    }
  });
}

/**
 * Initializes or reuses a Tesseract OCR Worker with full punctuation support
 * @param {Function} onProgress
 * @returns {Promise<Worker>}
 */
async function getWorker(onProgress) {
  if (workerInstance) {
    return workerInstance;
  }

  if (isInitializing) {
    while (isInitializing) {
      await new Promise((r) => setTimeout(r, 100));
    }
    if (workerInstance) return workerInstance;
  }

  isInitializing = true;
  try {
    const worker = await createWorker('eng', 1, {
      logger: (m) => {
        if (onProgress && m.status === 'recognizing text') {
          onProgress(Math.round((m.progress || 0) * 100), m.status);
        }
      },
    });

    // Configure Tesseract to preserve ALL punctuation, slashes, colons, spaces, and special symbols
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:\'",./<>?~`\\/ \n\r\t',
      preserve_interword_spaces: '1',
      tessedit_pageseg_mode: '6', // Assume uniform block of text (prevents omitting technical symbols)
      user_defined_dpi: '300',
    });

    workerInstance = worker;
    return worker;
  } finally {
    isInitializing = false;
  }
}

/**
 * Extract text from an Image with enhanced symbol and special character preservation
 * @param {File|Blob|string} imageSource
 * @param {Function} [onProgress]
 * @returns {Promise<{ text: string, confidence: number }>}
 */
export async function extractTextFromImage(imageSource, onProgress) {
  try {
    const worker = await getWorker(onProgress);

    // 1. High-contrast preprocessed pass
    const preprocessedDataUrl = await preprocessImage(imageSource);
    const result = await worker.recognize(preprocessedDataUrl);
    
    let text = result?.data?.text || '';
    const confidence = result?.data?.confidence || 0;

    // If preprocessed text was too short or low confidence, try original image directly
    if (!text.trim() || text.trim().length < 5) {
      const fallbackResult = await worker.recognize(imageSource);
      if ((fallbackResult?.data?.text || '').length > text.length) {
        text = fallbackResult.data.text;
      }
    }

    return {
      text: text.trim(),
      confidence,
      lines: result?.data?.lines || [],
    };
  } catch (error) {
    console.error('OCR Extraction Error:', error);
    throw new Error(`Failed to extract text: ${error.message}`);
  }
}
