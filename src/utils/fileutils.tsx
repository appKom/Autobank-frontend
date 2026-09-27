import heic2any from 'heic2any';

const MAX_IMAGE_LONGEST_SIDE = 2400;
const JPEG_QUALITY = 0.85; 

const fitWithinLongestSide = (width: number, height: number) => {
  const scale = Math.min(1, MAX_IMAGE_LONGEST_SIDE / Math.max(width, height));
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
};

const resizeImageFile = (file: File, quality = JPEG_QUALITY): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      // Only resize if the image exceeds max dimensions
      if (Math.max(img.width, img.height) <= MAX_IMAGE_LONGEST_SIDE) {
        resolve(file);
        return;
      }

      const { width: newWidth, height: newHeight } = fitWithinLongestSide(img.width, img.height);

      const canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newFile = new File([blob], file.name, {
              type: 'image/jpeg',
            });
            resolve(newFile);
          } else {
            reject(new Error('Failed to resize image'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = url;
  });
};

const convertPngToJpeg = (file: File, quality = JPEG_QUALITY): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const { width: targetWidth, height: targetHeight } = fitWithinLongestSide(img.width, img.height); 
     
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Fill with white background (PNG transparency becomes white)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.png$/i, '.jpg'), {
              type: 'image/jpeg',
            });
            resolve(newFile);
          } else {
            reject(new Error('Failed to convert PNG to JPEG'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image for conversion'));
    };

    img.src = url;
  });
};

export const fileToBase64 = async (file: File): Promise<string> => {
  let fileToConvert = file;

  // Convert HEIC/HEIF to JPEG (browsers can't display HEIC)
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    file.name.toLowerCase().endsWith('.heic') ||
    file.name.toLowerCase().endsWith('.heif');

  // Convert PNG to JPEG (smaller file size for photos)
  const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');

  if (isHeic) {
    try {
      console.log('Converting HEIC to JPEG...');
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.95,
      });

      // heic2any can return a Blob or Blob[] - handle both cases
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;

      fileToConvert = new File(
        [blob],
        file.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'),
        { type: 'image/jpeg' }
      );
      console.log('HEIC converted to JPEG successfully');
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw new Error('Kunne ikke konvertere HEIC-fil. Prøv å konvertere til JPEG først.');
    }
  } else if (isPng) {
    try {
      console.log('Converting PNG to JPEG...');
      fileToConvert = await convertPngToJpeg(file);
      console.log('PNG converted to JPEG successfully');
    } catch (error) {
      console.error('PNG conversion failed:', error);
      throw new Error('Kunne ikke konvertere PNG-fil. Prøv å konvertere til JPEG først.');
    }
  }

  // Resize large images (JPEG files that weren't already handled by PNG conversion)
  const isImage =
    fileToConvert.type === 'image/jpeg' ||
    fileToConvert.type === 'image/jpg' ||
    fileToConvert.type === 'image/png';

  if (isImage && !isPng) {
    try {
      console.log('Resizing image if needed...');
      fileToConvert = await resizeImageFile(fileToConvert);
      console.log('Image resize check complete');
    } catch (error) {
      console.error('Image resize failed:', error);
      throw new Error('Kunne ikke endre størrelse på bildet. Prøv en mindre fil.');
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(fileToConvert);
  });
};
