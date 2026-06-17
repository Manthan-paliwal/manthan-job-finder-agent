import { supabase } from "./supabase";

export async function uploadResume(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("resumes")
    .upload(fileName, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("resumes")
    .getPublicUrl(fileName);

  return data.publicUrl;
}