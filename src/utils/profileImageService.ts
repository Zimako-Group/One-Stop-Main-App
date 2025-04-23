import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';
import { Platform } from 'react-native';

// Constants
const BUCKET_NAME = 'profile-images';

// Initialize storage for profile images
export const initializeStorage = async () => {
  try {
    // First try to list buckets to see if our bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    // If we can't list buckets due to permissions, we'll try to use the bucket directly
    if (listError) {
      console.log('Unable to list buckets, will try to use bucket directly:', listError.message);
      return true; // Continue anyway, we'll handle upload errors separately
    }
    
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    // If bucket doesn't exist, try to create it
    if (!bucketExists) {
      try {
        const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
          public: true,
          fileSizeLimit: 1024 * 1024 * 2, // 2MB limit
        });
        
        if (error) {
          // If we can't create the bucket due to RLS policies, log it but continue
          // The bucket might already exist but we don't have permission to create/list it
          console.log('Note: Could not create profile-images bucket:', error.message);
          console.log('This is often due to RLS policies. Will attempt to use it anyway.');
        } else {
          console.log('Profile images bucket created successfully');
        }
      } catch (createError) {
        console.log('Error in bucket creation:', createError);
        // Continue anyway, the bucket might exist already
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error initializing storage:', error);
    return false;
  }
};

// Upload profile image
export const uploadProfileImage = async (
  userId: string,
  uri: string
): Promise<string | null> => {
  try {
    // Generate a unique file path - use a simpler path structure to avoid permission issues
    const fileExt = uri.split('.').pop();
    const fileName = `${userId}.${fileExt}`;
    
    // Use a flat structure instead of nested folders to avoid permission issues
    // This is more compatible with default Supabase RLS policies
    const filePath = fileName;
    
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    
    // Try to upload the file
    try {
      const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, decode(base64), {
          contentType: `image/${fileExt}`,
          upsert: true,
        });
      
      if (error) {
        console.log('Error uploading image:', error.message);
        // If we get an RLS policy error, we'll try a fallback approach
        if (error.message.includes('policy') || error.message.includes('permission')) {
          console.log('Permission issue detected, trying alternative approach...');
          return await handleFallbackImageStorage(userId, uri);
        }
        return null;
      }
    } catch (uploadError) {
      console.log('Exception during upload:', uploadError);
      return await handleFallbackImageStorage(userId, uri);
    }
    
    // Get the public URL
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error in uploadProfileImage:', error);
    return null;
  }
};

// Get profile image URL
export const getProfileImageUrl = (userId: string, fileName: string): string => {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(`${userId}/${fileName}`);
  
  return data.publicUrl;
};

// Generate initials avatar
// Fallback mechanism when Supabase storage fails
const handleFallbackImageStorage = async (userId: string, uri: string): Promise<string | null> => {
  try {
    // For fallback, we'll use a local approach or return the initials avatar
    // In a production app, you might use another storage service as fallback
    console.log('Using fallback image storage mechanism');
    
    // For now, we'll just store the image URI in local storage and return it
    // This is a temporary solution - in production, you'd want a more robust approach
    if (Platform.OS === 'web') {
      // For web, we can use localStorage
      try {
        localStorage.setItem(`profile_image_${userId}`, uri);
      } catch (e) {
        console.log('LocalStorage not available:', e);
      }
    }
    
    // Return the original URI as a fallback
    return uri;
  } catch (error) {
    console.error('Error in fallback image storage:', error);
    return null;
  }
};

export const getInitialsAvatar = (fullName: string, size = 200): string => {
  // Extract initials (up to 2 characters)
  const initials = fullName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // Generate a consistent color based on the name
  const hue = Math.abs(
    fullName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
  );
  
  const backgroundColor = `hsl(${hue}, 70%, 40%)`;
  const textColor = '#FFFFFF';
  
  // Create SVG for the avatar
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${backgroundColor}" />
      <text 
        x="50%" 
        y="50%" 
        dy=".1em" 
        fill="${textColor}" 
        font-family="Arial, sans-serif" 
        font-size="${size * 0.4}px" 
        font-weight="bold" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${initials}
      </text>
    </svg>
  `;
  
  // Convert SVG to data URL
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return dataUrl;
};
