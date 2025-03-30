/**
 * MTN Mobile Money API Integration Utility
 * 
 * This file contains utility functions for interacting with the MTN Mobile Money API.
 * Documentation: https://momodeveloper.mtn.com/
 */

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://sandbox.momodeveloper.mtn.com', // Change to production URL in production
  COLLECTION_ENDPOINT: '/collection/v1_0/requesttopay',
  COLLECTION_STATUS_ENDPOINT: '/collection/v1_0/requesttopay/',
  DISBURSEMENT_ENDPOINT: '/disbursement/v1_0/transfer',
  DISBURSEMENT_STATUS_ENDPOINT: '/disbursement/v1_0/transfer/',
  ENVIRONMENT: 'sandbox', // Change to 'production' in production
  CURRENCY: 'SZL', // Eswatini Lilangeni
};

// Interface for MoMo API credentials
interface MoMoCredentials {
  apiKey: string;
  userId: string;
  subscriptionKey: string;
  accessToken: string;
}

// Interface for payment request
interface PaymentRequest {
  amount: string;
  phoneNumber: string;
  externalId: string;
  payerMessage: string;
  payeeNote: string;
}

// Interface for disbursement request
interface DisbursementRequest {
  amount: string;
  phoneNumber: string;
  externalId: string;
  payerMessage: string;
  payeeNote: string;
}

/**
 * Generate a UUID for transaction reference
 * @returns {string} UUID
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Get access token from MTN MoMo API
 * @param {MoMoCredentials} credentials - API credentials
 * @returns {Promise<string>} Access token
 */
export const getAccessToken = async (credentials: Omit<MoMoCredentials, 'accessToken'>): Promise<string> => {
  try {
    // In a real implementation, this would make an actual API call
    // For now, we'll simulate a successful response
    
    /**
     * Example API call:
     * 
     * const response = await fetch(`${API_CONFIG.BASE_URL}/collection/token/`, {
     *   method: 'POST',
     *   headers: {
     *     'Authorization': `Basic ${Buffer.from(`${credentials.userId}:${credentials.apiKey}`).toString('base64')}`,
     *     'Ocp-Apim-Subscription-Key': credentials.subscriptionKey
     *   }
     * });
     * 
     * if (!response.ok) {
     *   throw new Error(`Failed to get access token: ${response.status}`);
     * }
     * 
     * const data = await response.json();
     * return data.access_token;
     */
    
    // Simulated response
    return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik1UTiBNb01vIEFQSSIsImlhdCI6MTUxNjIzOTAyMn0';
  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
};

/**
 * Initiate a payment request to MTN MoMo
 * @param {MoMoCredentials} credentials - API credentials
 * @param {PaymentRequest} paymentDetails - Payment details
 * @returns {Promise<{referenceId: string}>} Reference ID for the transaction
 */
export const initiatePayment = async (
  credentials: MoMoCredentials, 
  paymentDetails: PaymentRequest
): Promise<{referenceId: string}> => {
  try {
    const referenceId = generateUUID();
    
    /**
     * Example API call:
     * 
     * const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.COLLECTION_ENDPOINT}`, {
     *   method: 'POST',
     *   headers: {
     *     'Authorization': `Bearer ${credentials.accessToken}`,
     *     'X-Reference-Id': referenceId,
     *     'X-Target-Environment': API_CONFIG.ENVIRONMENT,
     *     'Content-Type': 'application/json',
     *     'Ocp-Apim-Subscription-Key': credentials.subscriptionKey
     *   },
     *   body: JSON.stringify({
     *     amount: paymentDetails.amount,
     *     currency: API_CONFIG.CURRENCY,
     *     externalId: paymentDetails.externalId,
     *     payer: {
     *       partyIdType: 'MSISDN',
     *       partyId: paymentDetails.phoneNumber
     *     },
     *     payerMessage: paymentDetails.payerMessage,
     *     payeeNote: paymentDetails.payeeNote
     *   })
     * });
     * 
     * if (!response.ok) {
     *   throw new Error(`Failed to initiate payment: ${response.status}`);
     * }
     * 
     * // The API doesn't return a response body for successful requests
     * return { referenceId };
     */
    
    // Simulated response
    return { referenceId };
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw error;
  }
};

/**
 * Check the status of a payment
 * @param {MoMoCredentials} credentials - API credentials
 * @param {string} referenceId - Reference ID of the transaction
 * @returns {Promise<{status: string, reason?: string}>} Status of the transaction
 */
export const checkPaymentStatus = async (
  credentials: MoMoCredentials, 
  referenceId: string
): Promise<{status: string, reason?: string}> => {
  try {
    /**
     * Example API call:
     * 
     * const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.COLLECTION_STATUS_ENDPOINT}${referenceId}`, {
     *   method: 'GET',
     *   headers: {
     *     'Authorization': `Bearer ${credentials.accessToken}`,
     *     'X-Target-Environment': API_CONFIG.ENVIRONMENT,
     *     'Ocp-Apim-Subscription-Key': credentials.subscriptionKey
     *   }
     * });
     * 
     * if (!response.ok) {
     *   throw new Error(`Failed to check payment status: ${response.status}`);
     * }
     * 
     * const data = await response.json();
     * return {
     *   status: data.status,
     *   reason: data.reason
     * };
     */
    
    // Simulated response
    return { status: 'SUCCESSFUL' };
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

/**
 * Initiate a disbursement (transfer money to a user)
 * @param {MoMoCredentials} credentials - API credentials
 * @param {DisbursementRequest} disbursementDetails - Disbursement details
 * @returns {Promise<{referenceId: string}>} Reference ID for the transaction
 */
export const initiateDisbursement = async (
  credentials: MoMoCredentials, 
  disbursementDetails: DisbursementRequest
): Promise<{referenceId: string}> => {
  try {
    const referenceId = generateUUID();
    
    /**
     * Example API call:
     * 
     * const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DISBURSEMENT_ENDPOINT}`, {
     *   method: 'POST',
     *   headers: {
     *     'Authorization': `Bearer ${credentials.accessToken}`,
     *     'X-Reference-Id': referenceId,
     *     'X-Target-Environment': API_CONFIG.ENVIRONMENT,
     *     'Content-Type': 'application/json',
     *     'Ocp-Apim-Subscription-Key': credentials.subscriptionKey
     *   },
     *   body: JSON.stringify({
     *     amount: disbursementDetails.amount,
     *     currency: API_CONFIG.CURRENCY,
     *     externalId: disbursementDetails.externalId,
     *     payee: {
     *       partyIdType: 'MSISDN',
     *       partyId: disbursementDetails.phoneNumber
     *     },
     *     payerMessage: disbursementDetails.payerMessage,
     *     payeeNote: disbursementDetails.payeeNote
     *   })
     * });
     * 
     * if (!response.ok) {
     *   throw new Error(`Failed to initiate disbursement: ${response.status}`);
     * }
     * 
     * // The API doesn't return a response body for successful requests
     * return { referenceId };
     */
    
    // Simulated response
    return { referenceId };
  } catch (error) {
    console.error('Error initiating disbursement:', error);
    throw error;
  }
};

/**
 * Check the status of a disbursement
 * @param {MoMoCredentials} credentials - API credentials
 * @param {string} referenceId - Reference ID of the transaction
 * @returns {Promise<{status: string, reason?: string}>} Status of the transaction
 */
export const checkDisbursementStatus = async (
  credentials: MoMoCredentials, 
  referenceId: string
): Promise<{status: string, reason?: string}> => {
  try {
    /**
     * Example API call:
     * 
     * const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.DISBURSEMENT_STATUS_ENDPOINT}${referenceId}`, {
     *   method: 'GET',
     *   headers: {
     *     'Authorization': `Bearer ${credentials.accessToken}`,
     *     'X-Target-Environment': API_CONFIG.ENVIRONMENT,
     *     'Ocp-Apim-Subscription-Key': credentials.subscriptionKey
     *   }
     * });
     * 
     * if (!response.ok) {
     *   throw new Error(`Failed to check disbursement status: ${response.status}`);
     * }
     * 
     * const data = await response.json();
     * return {
     *   status: data.status,
     *   reason: data.reason
     * };
     */
    
    // Simulated response
    return { status: 'SUCCESSFUL' };
  } catch (error) {
    console.error('Error checking disbursement status:', error);
    throw error;
  }
};
