import { supabase } from "./supabase";

export async function uploadImage(file) {
    if (!file) return null;
    
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}.${fileExt}`;
        
        const { error } = await supabase.storage
        .from("products")
        .upload(fileName, file);
        
        if (error) {
            console.error("Upload error:", error.message);
            return null;
        }
        
        const { data } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);
        
        return data.publicUrl;
    }