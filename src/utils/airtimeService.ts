/**
 * Airtime Service Utility
 * 
 * This file contains utility functions for purchasing airtime through MTN MoMo API.
 */

import { generateUUID, getAccessToken, initiatePayment, checkPaymentStatus } from './momoApi';

// MTN MoMo API credentials - In production, these should be stored securely
// and potentially retrieved from a secure backend
const MTN_CREDENTIALS = {
  apiKey: 'YOUR_API_KEY', // Replace with your actual API key
  userId: 'YOUR_USER_ID', // Replace with your actual User ID
  subscriptionKey: 'YOUR_SUBSCRIPTION_KEY', // Replace with your actual Subscription Key
  accessToken: '' // This will be populated at runtime
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
    
    // Step 4: In a real implementation, you would check the payment status
    // and then call the telco's API to provision the airtime
    // For now, we'll simulate this process
    
    // Wait for payment to be processed (in production, this would be handled by webhooks)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check payment status
    const paymentStatus = await checkPaymentStatus(credentials, referenceId);
    
    if (paymentStatus.status === 'SUCCESSFUL') {
      // In production: Call MTN's airtime provisioning API here
      
      // Generate a transaction ID for the airtime purchase
      const transactionId = generateUUID();
      
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
    // Get access token
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
    
    // Check payment status
    const paymentStatus = await checkPaymentStatus(credentials, referenceId);
    
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
