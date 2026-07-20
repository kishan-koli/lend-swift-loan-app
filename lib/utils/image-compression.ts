/**
 * LendSwift Image Compression Utility
 * Client-side Canvas-based image compression with recursive quality reduction
 * Optimized for document uploads (KYC, address proofs) and profile pictures
 */

export interface CompressionOptions {
  targetSizeKB?: number; // Target file size in kilobytes (default: 100KB)
  maxWidth?: number; // Maximum width in pixels (default: 1920)
  maxHeight?: number; // Maximum height in pixels (default: 1080)
  initialQuality?: number; // Initial JPEG quality (0-1, default: 0.8)
  format?: 'image/jpeg' | 'image/webp' | 'image/png'; // Output format
}

export interface CompressionResult {
  blob: Blob;
  originalSizeKB: number;
  compressedSizeKB: number;
  compressionRatio: number;
  width: number;
  height: number;
  quality: number;
  format: string;
}

/**
 * Compress image using Canvas with recursive quality reduction
 * Automatically reduces quality and dimensions until target size is met
 * @param file - Image file to compress
 * @param options - Compression configuration
 * @returns Promise with compression result
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const {
    targetSizeKB = 100,
    maxWidth = 1920,
    maxHeight = 1080,
    initialQuality = 0.8,
    format = 'image/jpeg',
  } = options;

  // Validate file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const originalSizeKB = file.size / 1024;

  // If already below target, return as-is
  if (originalSizeKB <= targetSizeKB && file.type === format) {
    const result = await getImageDimensions(file);
    return {
      blob: file,
      originalSizeKB,
      compressedSizeKB: originalSizeKB,
      compressionRatio: 1,
      width: result.width,
      height: result.height,
      quality: 1,
      format: file.type,
    };
  }

  // Create image element to get dimensions
  const img = await createImageElement(file);
  let width = img.width;
  let height = img.height;

  // Scale down if exceeds max dimensions
  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  // Recursively compress until target size is met
  let quality = initialQuality;
  let compressedBlob: Blob | null = null;
  let attempts = 0;
  const maxAttempts = 12; // Prevent infinite loops

  while (attempts < maxAttempts) {
    compressedBlob = await compressCanvasToBlob(
      img,
      width,
      height,
      quality,
      format
    );

    const compressedSizeKB = compressedBlob.size / 1024;

    // Target achieved or quality too low
    if (compressedSizeKB <= targetSizeKB || quality <= 0.1) {
      return {
        blob: compressedBlob,
        originalSizeKB,
        compressedSizeKB,
        compressionRatio: originalSizeKB / compressedSizeKB,
        width,
        height,
        quality,
        format,
      };
    }

    // Reduce quality aggressively
    quality = Math.max(quality - 0.15, 0.1);
    attempts++;
  }

  // Fallback: reduce dimensions
  if (compressedBlob && (compressedBlob.size / 1024) > targetSizeKB) {
    const scaleFactor = Math.sqrt(targetSizeKB / (compressedBlob.size / 1024));
    width = Math.round(width * scaleFactor);
    height = Math.round(height * scaleFactor);

    compressedBlob = await compressCanvasToBlob(
      img,
      width,
      height,
      0.6,
      format
    );
  }

  const compressedSizeKB = (compressedBlob?.size || 0) / 1024;

  return {
    blob: compressedBlob || file,
    originalSizeKB,
    compressedSizeKB,
    compressionRatio: originalSizeKB / compressedSizeKB,
    width,
    height,
    quality,
    format,
  };
}

/**
 * Compress canvas to blob with specified quality
 * @param img - HTMLImageElement
 * @param width - Target width
 * @param height - Target height
 * @param quality - Quality level (0-1)
 * @param format - Output format
 * @returns Promise with compressed blob
 */
async function compressCanvasToBlob(
  img: HTMLImageElement,
  width: number,
  height: number,
  quality: number,
  format: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    // Draw image with anti-aliasing
    ctx.drawImage(img, 0, 0, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      format,
      quality
    );
  });
}

/**
 * Create HTMLImageElement from file
 * @param file - Image file
 * @returns Promise with HTMLImageElement
 */
function createImageElement(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));

      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions from file
 * @param file - Image file
 * @returns Promise with dimensions
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const img = await createImageElement(file);
  return { width: img.width, height: img.height };
}

/**
 * Batch compress multiple images
 * @param files - Array of image files
 * @param options - Compression options
 * @returns Promise with array of compression results
 */
export async function compressImageBatch(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  return Promise.all(files.map((file) => compressImage(file, options)));
}

/**
 * Convert compression result to File
 * @param result - Compression result
 * @param fileName - Output file name
 * @returns File object
 */
export function compressionResultToFile(
  result: CompressionResult,
  fileName: string
): File {
  const extension = getFormatExtension(result.format);
  const newFileName = `${fileName.replace(/\.[^/.]+$/, '')}_compressed.${extension}`;

  return new File([result.blob], newFileName, {
    type: result.format,
    lastModified: Date.now(),
  });
}

/**
 * Get file extension from MIME type
 * @param mimeType - MIME type
 * @returns File extension
 */
function getFormatExtension(mimeType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/png': 'png',
  };
  return extensions[mimeType] || 'jpg';
}

/**
 * Check if browser supports specific image format
 * @param format - MIME type
 * @returns Boolean indicating support
 */
export function isFormatSupported(format: string): boolean {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL(format) !== `data:${format};base64,`;
}
