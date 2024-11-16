// Maximum file size for MongoDB (16MB), we'll aim for max 5MB per base64 string
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DIMENSION = 1200; // Max width or height

export interface CompressionResult {
  base64: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
  quality: number;
}

export async function compressImage(file: File): Promise<CompressionResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Invalid file type. Please upload an image file.')
  }

  if (file.size > MAX_FILE_SIZE * 2) {
    throw new Error(`File is too large. Maximum size is ${MAX_FILE_SIZE * 2 / (1024 * 1024)}MB`)
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = async (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > height && width > MAX_DIMENSION) {
          height = (height * MAX_DIMENSION) / width;
          width = MAX_DIMENSION;
        } else if (height > MAX_DIMENSION) {
          width = (width * MAX_DIMENSION) / height;
          height = MAX_DIMENSION;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Apply some smoothing for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Start with high quality
        let quality = 0.9;
        let base64 = canvas.toDataURL('image/jpeg', quality);
        
        // Reduce quality until file size is under MAX_FILE_SIZE
        while (base64.length > MAX_FILE_SIZE && quality > 0.1) {
          quality -= 0.1;
          base64 = canvas.toDataURL('image/jpeg', quality);
        }
        
        if (base64.length > MAX_FILE_SIZE) {
          reject(new Error('Image is too large even after compression'));
          return;
        }

        resolve({
          base64,
          originalSize: file.size,
          compressedSize: base64.length,
          width,
          height,
          quality
        });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
  });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
