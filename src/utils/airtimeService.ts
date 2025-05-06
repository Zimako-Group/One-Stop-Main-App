/**
 * Airtime Service Utility
 * 
 * This file contains utility functions for purchasing airtime through MTN MoMo API.
 */

import { generateUUID, getAccessToken, initiatePayment, checkPaymentStatus } from './momoApi';
import { Momo } from './momoService';

// MTN MoMo API credentials - In production, these should be stored securely
// and potentially retrieved from a secure backend or environment variables
const MTN_CREDENTIALS = {
  apiKey: process.env.MTN_API_KEY || 'YOUR_API_KEY', // Will be replaced by user
  userId: process.env.MTN_USER_ID || 'YOUR_USER_ID', // Will be replaced by user
  subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY || 'YOUR_SUBSCRIPTION_KEY', // Will be replaced by user
  accessToken: '' // This will be populated at runtime
};

// Initialize the Momo service
const momoService = new Momo();

// Function to update credentials at runtime
export const updateMoMoCredentials = (credentials: {
  apiKey?: string;
  userId?: string;
  subscriptionKey?: string;
}) => {
  if (credentials.apiKey) MTN_CREDENTIALS.apiKey = credentials.apiKey;
  if (credentials.userId) MTN_CREDENTIALS.userId = credentials.userId;
  if (credentials.subscriptionKey) MTN_CREDENTIALS.subscriptionKey = credentials.subscriptionKey;
};

// Interface for airtime purchase request
interface AirtimePurchaseRequest {
  phoneNumber: string; // Phone number to purchase airtime for
  amount: number; // Amount in SZL
  payerPhoneNumber: string; // Phone number making the payment
}

// Interface for airtime purchase response
interface AirtimePurchaseResponse {
  success: boolean;
  referenceId?: string;
  message: string;
  transactionId?: string;
}

/**
 * Purchase airtime through MTN MoMo API
 * 
 * @param request AirtimePurchaseRequest object containing purchase details
 * @returns Promise<AirtimePurchaseResponse> with transaction details
 */
export const purchaseMtnAirtime = async (
  request: AirtimePurchaseRequest
): Promise<AirtimePurchaseResponse> => {
  try {
    // Option 1: Using the new direct Momo service
    // Prepare the request payload for the Momo service
    const momoRequest = {
      amount: request.amount.toString(),
      payer: request.payerPhoneNumber,
      externaltransactionid: `airtime-${Date.now()}`
    };
    
    // Call the momoCollect method to initiate the payment
    const result = await momoService.momoCollect(momoRequest);
    
    // Extract the reference ID from the result
    // The result format is "[response] Transaction initiated. [uuid]"
    const referenceIdMatch = result.match(/Transaction initiated\. ([\w-]+)$/);
    const referenceId = referenceIdMatch ? referenceIdMatch[1] : '';
    
    if (!referenceId) {
      return {
        success: false,
        message: 'Failed to get transaction reference ID'
      };
    }
    
    // Poll for payment status (retry a few times with delay)
    let statusResult = '';
    let paymentStatus = { status: 'PENDING' };
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      // Wait before checking (simulating async payment processing)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check payment status
      statusResult = await momoService.transactionStatus();
      
      try {
        const statusData = JSON.parse(statusResult);
        paymentStatus = { status: statusData.status };
        
        // If we have a final status, break out of the loop
        if (statusData.status === 'SUCCESSFUL' || 
            statusData.status === 'FAILED' || 
            statusData.status === 'REJECTED') {
          break;
        }
      } catch (e) {
        console.error('Error parsing status result:', e);
      }
      
      attempts++;
    }
    
    if (paymentStatus.status === 'SUCCESSFUL') {
      // Generate a transaction ID for the airtime purchase
      const transactionId = generateUUID();
      
      // In a full implementation, you would call the telco's API to provision the airtime here
      // This would typically be a separate API call to the mobile operator's provisioning system
      // For now, we'll assume the airtime is provisioned automatically by MTN's system
      
      return {
        success: true,
        referenceId,
        message: `Successfully purchased E${request.amount} airtime for ${request.phoneNumber}`,
        transactionId
      };
    } else {
      return {
        success: false,
        referenceId,
        message: `Payment failed: ${paymentStatus.status || 'Unknown error'}`
      };
    }
  } catch (error) {
    console.error('Error purchasing airtime:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Purchase airtime through MTN MoMo API using the legacy implementation
 * Kept for backward compatibility
 * 
 * @param request AirtimePurchaseRequest object containing purchase details
 * @returns Promise<AirtimePurchaseResponse> with transaction details
 */
export const purchaseMtnAirtimeLegacy = async (
  request: AirtimePurchaseRequest
): Promise<AirtimePurchaseResponse> => {
  try {
    // Step 1: Get access token
    const accessToken = await getAccessToken({
      apiKey: MTN_CREDENTIALS.apiKey,
      userId: MTN_CREDENTIALS.userId,
      subscriptionKey: MTN_CREDENTIALS.subscriptionKey
    });
    
    // Update credentials with new access token
    const credentials = {
      ...MTN_CREDENTIALS,
      accessToken
    };
    
    // Step 2: Generate a transaction reference
    const externalId = generateUUID();
    
    // Step 3: Initiate payment request
    const paymentRequest = {
      amount: request.amount.toString(),
      phoneNumber: request.payerPhoneNumber,
      externalId,
      payerMessage: `Airtime purchase for ${request.phoneNumber}`,
      payeeNote: `Airtime top-up of E${request.amount} for ${request.phoneNumber}`
    };
    
    const { referenceId } = await initiatePayment(credentials, paymentRequest);
    
    // Step 4: Check the payment status and provision airtime if successful
    // Note: In a production environment with high volume, you would use webhooks instead
    // of polling for status, but for simplicity we'll poll here
    
    // Poll for payment status (retry a few times with delay)
    let paymentStatus: { status: string; reason?: string } = { status: 'PENDING' };
    let attempts = 0;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts) {
      // Wait a bit before checking (simulating async payment processing)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check payment status
      paymentStatus = await checkPaymentStatus(credentials, referenceId);
      
      // If we have a final status, break out of the loop
      if (paymentStatus.status === 'SUCCESSFUL' || 
          paymentStatus.status === 'FAILED' || 
          paymentStatus.status === 'REJECTED') {
        break;
      }
      
      attempts++;
    }
    
    if (paymentStatus.status === 'SUCCESSFUL') {
      // Generate a transaction ID for the airtime purchase
      const transactionId = generateUUID();
      
      // In a full implementation, you would call the telco's API to provision the airtime here
      // This would typically be a separate API call to the mobile operator's provisioning system
      // For now, we'll assume the airtime is provisioned automatically by MTN's system
      
      return {
        success: true,
        referenceId,
        message: `Successfully purchased E${request.amount} airtime for ${request.phoneNumber}`,
        transactionId
      };
    } else {
      return {
        success: false,
        referenceId,
        message: `Payment failed: ${paymentStatus.reason || 'Unknown error'}`
      };
    }
  } catch (error) {
    console.error('Error purchasing airtime:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};

/**
 * Check the status of an airtime purchase
 * 
 * @param referenceId The reference ID of the transaction
 * @returns Promise<{status: string, message: string}>
 */
export const checkAirtimePurchaseStatus = async (
  referenceId: string
): Promise<{status: string, message: string}> => {
  try {
    // Get access token for the API call
    const accessToken = await getAccessToken({
      apiKey: MTN_CREDENTIALS.apiKey,
      userId: MTN_CREDENTIALS.userId,
      subscriptionKey: MTN_CREDENTIALS.subscriptionKey
    });
    
    const credentials = {
      ...MTN_CREDENTIALS,
      accessToken
    };
    
    // Check payment status with the MoMo API
    const paymentStatus = await checkPaymentStatus(credentials, referenceId);
    
    // Map the MoMo API status to our application status
    if (paymentStatus.status === 'SUCCESSFUL') {
      return {
        status: 'completed',
        message: 'Airtime purchase completed successfully'
      };
    } else if (paymentStatus.status === 'PENDING') {
      return {
        status: 'pending',
        message: 'Airtime purchase is being processed'
      };
    } else {
      return {
        status: 'failed',
        message: `Airtime purchase failed: ${paymentStatus.reason || 'Unknown error'}`
      };
    }
  } catch (error) {
    console.error('Error checking airtime purchase status:', error);
    return {
      status: 'failed',
      message: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
};
