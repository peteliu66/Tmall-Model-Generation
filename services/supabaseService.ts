import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { ModelConfig, GalleryImage } from '../types';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase URL or Anon Key not provided. Supabase features will be disabled.");
}

// Helper to convert data URL to Blob
const dataURLtoBlob = (dataurl: string): Blob | null => {
    const arr = dataurl.split(',');
    if (arr.length < 2) { return null; }
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) { return null; }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
}

export const uploadGeneratedImage = async (
    imageUrl: string,
    config: ModelConfig
): Promise<string | null> => {
    if (!supabase) return null;

    const blob = dataURLtoBlob(imageUrl);
    if (!blob) {
        console.error("Failed to convert data URL to blob");
        return null;
    }

    const fileName = `generated/${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('generated-images')
        .upload(fileName, blob, {
            cacheControl: '3600',
            upsert: false,
        });

    if (uploadError) {
        console.error('Error uploading image to Supabase:', uploadError);
        return null;
    }

    const { data: publicUrlData } = supabase.storage
        .from('generated-images')
        .getPublicUrl(uploadData.path);
        
    const publicUrl = publicUrlData.publicUrl;

    const { error: dbError } = await supabase
        .from('generations')
        .insert([{ 
            image_url: publicUrl,
            config: config,
            prompt: `A ${config.age} ${config.ethnicity} ${config.gender} model in a ${config.setting} setting. Details: ${config.details}`
        }]);

    if (dbError) {
        console.error('Error saving generation to database:', dbError);
    }
    
    return publicUrl;
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('generations')
        .select('id, created_at, image_url, prompt')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching gallery images:', error);
        return [];
    }

    return data as GalleryImage[];
};
