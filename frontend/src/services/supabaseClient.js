import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  supabaseUrl.startsWith('https://')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    })
  : null;

/**
 * Upload an image file to Supabase Storage 'product-images' bucket.
 * Falls back to base64 data-URL if Supabase is not configured or on network error.
 */
export async function uploadProductImage(file) {
  if (!file) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileName = `product_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.warn('Supabase storage upload error, falling back to base64:', error.message);
      } else {
        const { data: publicData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicData?.publicUrl) {
          return publicData.publicUrl;
        }
      }
    } catch (err) {
      console.warn('Upload exception:', err);
    }
  }

  // Fallback: Read and compress image as base64 DataURL (optimized for web & storage)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      try {
        const img = new Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDim = 1200;
            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            resolve(compressed);
          } catch (_) {
            resolve(reader.result);
          }
        };
        img.onerror = () => resolve(reader.result);
        img.src = reader.result;
      } catch (_) {
        resolve(reader.result);
      }
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}
