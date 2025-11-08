import { supabase } from "../conf/conf"; 

/**
 * Uploads an image file to the 'course_images' bucket.
 * @param {File} file The image file from the form.
 * @returns {string} The public URL of the uploaded image.
 */

export async function uploadCourseImage(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course_images') 
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase
      .storage
      .from('course_images')
      .getPublicUrl(filePath);

    return publicUrl;

  } catch (error) {
    console.error('Error uploading course image:', error.message);
    throw error;
  }
}