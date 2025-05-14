/**
 * OTP Service Utility
 * 
 * This file contains utility functions for generating, sending, and verifying OTPs.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// Constants
const OTP_EXPIRY_MINUTES = 5; // OTP expires after 5 minutes
const OTP_LENGTH = 6; // 6-digit OTP

// Interface for OTP data
interface OtpData {
  otp: string;
  expiresAt: number; // Timestamp when OTP expires
  verified: boolean;
  attempts: number;
}

/**
 * Generate a random numeric OTP of specified length
 */
export const generateOtp = (length = OTP_LENGTH): string => {
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

/**
 * Store OTP in AsyncStorage with expiry time
 */
export const storeOtp = async (userId: string, otp: string): Promise<void> => {
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;
  const otpData: OtpData = {
    otp,
    expiresAt,
    verified: false,
    attempts: 0
  };
  
  await AsyncStorage.setItem(`otp_${userId}`, JSON.stringify(otpData));
};

/**
 * Get stored OTP data for a user
 */
export const getOtpData = async (userId: string): Promise<OtpData | null> => {
  const otpJson = await AsyncStorage.getItem(`otp_${userId}`);
  if (!otpJson) return null;
  
  return JSON.parse(otpJson) as OtpData;
};

/**
 * Check if OTP is expired
 */
export const isOtpExpired = (otpData: OtpData): boolean => {
  return Date.now() > otpData.expiresAt;
};

/**
 * Verify OTP for a user
 * Returns: { valid: boolean, message: string }
 */
export const verifyOtp = async (userId: string, inputOtp: string): Promise<{ valid: boolean; message: string }> => {
  try {
    const otpData = await getOtpData(userId);
    
    if (!otpData) {
      return { valid: false, message: 'No OTP found. Please request a new one.' };
    }
    
    // Check if OTP is expired
    if (isOtpExpired(otpData)) {
      return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }
    
    // Update attempts
    otpData.attempts += 1;
    
    // Check if max attempts reached (3 attempts)
    if (otpData.attempts > 3) {
      await AsyncStorage.removeItem(`otp_${userId}`);
      return { valid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
    }
    
    // Check if OTP matches
    if (otpData.otp === inputOtp) {
      // Mark as verified and save
      otpData.verified = true;
      await AsyncStorage.setItem(`otp_${userId}`, JSON.stringify(otpData));
      return { valid: true, message: 'OTP verified successfully.' };
    }
    
    // Save updated attempts
    await AsyncStorage.setItem(`otp_${userId}`, JSON.stringify(otpData));
    
    return { 
      valid: false, 
      message: `Incorrect OTP. ${3 - otpData.attempts} attempts remaining.` 
    };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { valid: false, message: 'An error occurred while verifying OTP.' };
  }
};

/**
 * Send OTP via SMS using Infobip API
 */
export const sendOtpViaSms = async (phoneNumber: string, otp: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Format phone number to E.164 format if needed
    const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    
    // In development mode, log the OTP instead of sending it
    if (__DEV__) {
      console.log(`[DEV MODE] OTP for ${formattedPhone}: ${otp}`);
      
      // Log to Supabase for development tracking
      try {
        await supabase
          .from('otp_logs')
          .insert([
            {
              phone_number: formattedPhone,
              otp,
              created_at: new Date().toISOString()
            }
          ]);
      } catch (logError) {
        console.log('Could not log OTP to database:', logError);
      }
      
      return { success: true, message: 'OTP logged (dev mode)' };
    }
    
    // Production mode - Send SMS via Infobip API
    const INFOBIP_API_KEY = process.env.EXPO_PUBLIC_INFOBIP_API_KEY || 'YOUR_INFOBIP_API_KEY';
    const INFOBIP_BASE_URL = process.env.EXPO_PUBLIC_INFOBIP_BASE_URL || 'https://api.infobip.com';
    const INFOBIP_SENDER = process.env.EXPO_PUBLIC_INFOBIP_SENDER || 'OneStop';
    
    const response = await fetch(`${INFOBIP_BASE_URL}/sms/2/text/advanced`, {
      method: 'POST',
      headers: {
        'Authorization': `App ${INFOBIP_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        messages: [
          {
            from: INFOBIP_SENDER,
            destinations: [
              { to: formattedPhone }
            ],
            text: `Your One-Stop verification code is: ${otp}. Valid for ${OTP_EXPIRY_MINUTES} minutes.`
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Infobip API error:', errorData);
      return { success: false, message: 'Failed to send SMS' };
    }
    
    const data = await response.json();
    const messageId = data?.messages?.[0]?.messageId;
    
    if (messageId) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      console.error('Infobip response missing messageId:', data);
      return { success: false, message: 'SMS gateway error' };
    }
  } catch (error) {
    console.error('Error sending OTP via SMS:', error);
    return { success: false, message: 'Failed to send OTP' };
  }
};

/**
 * Generate and send OTP for a user
 */
export const generateAndSendOtp = async (userId: string, phoneNumber: string): Promise<{ success: boolean; message: string }> => {
  try {
    // Generate OTP
    const otp = generateOtp();
    
    // Store OTP
    await storeOtp(userId, otp);
    
    // Send OTP via SMS
    return await sendOtpViaSms(phoneNumber, otp);
  } catch (error) {
    console.error('Error generating and sending OTP:', error);
    return { success: false, message: 'Failed to generate and send OTP' };
  }
};

/**
 * Clear OTP data for a user
 */
export const clearOtpData = async (userId: string): Promise<void> => {
  await AsyncStorage.removeItem(`otp_${userId}`);
};
