import AsyncStorage from '@react-native-async-storage/async-storage';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

interface MomoRequestPayload {
  amount: string;
  payer: string;
  externaltransactionid: string;
}

interface RequestToPayPayload {
  amount: string;
  currency: string;
  externalId: string;
  payer: {
    partyIdType: string;
    partyId: string;
  };
  payerMessage: string;
  payeeNote: string;
}

export class Momo {
  private baseUrl: string;
  private callbackUrl: string;
  private subscription_key: string;
  private api_key: string;
  private api_secret: string;

  constructor() {
    // Initialize values
    this.baseUrl = "https://proxy.momoapi.mtn.com/";
    this.subscription_key = '6d912021c2724e44a9e900dbcd98929b';
    this.callbackUrl = "http://eswalink.com/ussd/";
    this.api_key = "5c115501c0484e89b4cc02240e8b59ec";
    this.api_secret = "080b52df-6c41-44b0-91cc-159530f9bc84";
  }

  // This is not needed as we'll use the uuid package instead
  // private v4(): string {
  //   // Implementation removed as we'll use the uuid package
  // }

  async getMomoToken(uri: string): Promise<string> {
    try {
      // Create Basic Auth header
      const credentials = `${this.api_secret}:${this.api_key}`;
      const base64Credentials = Buffer.from(credentials).toString('base64');

      // Request headers
      const headers = {
        'Ocp-Apim-Subscription-Key': this.subscription_key,
        'Authorization': `Basic ${base64Credentials}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(this.baseUrl + uri, {
        method: 'POST',
        headers: headers,
        body: ''
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error) {
      console.error('Error getting Momo token:', error);
      return '';
    }
  }

  async momoCollect(request: MomoRequestPayload): Promise<string> {
    try {
      const { amount, payer, externaltransactionid } = request;
      const currency = "SZL"; // The currency code
      const v4uuid = uuidv4();
      
      // Store the transaction reference in AsyncStorage
      await AsyncStorage.setItem('currentTransactionId', v4uuid);

      const uri = "collection/token/";
      let token = await this.getMomoToken(uri);

      // Retry getting token if empty
      while (!token) {
        token = await this.getMomoToken(uri);
      }

      // Request payload
      const data: RequestToPayPayload = {
        amount,
        currency,
        externalId: externaltransactionid,
        payer: {
          partyIdType: "MSISDN",
          partyId: payer,
        },
        payerMessage: "string",
        payeeNote: "string"
      };

      // Request headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'X-Reference-Id': v4uuid,
        'X-Target-Environment': 'mtnswaziland',
        'Ocp-Apim-Subscription-Key': this.subscription_key,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${this.baseUrl}collection/v1_0/requesttopay`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseText = await response.text();
      return `${responseText} Transaction initiated. ${v4uuid}`;
    } catch (error) {
      console.error('Error in momoCollect:', error);
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  async transactionStatus(): Promise<string> {
    try {
      // Get the reference ID from AsyncStorage
      const referenceId = await AsyncStorage.getItem('currentTransactionId');
      
      if (!referenceId) {
        return "Error: No transaction reference found";
      }
      
      const uri = `collection/v1_0/requesttopay/${referenceId}`;
      const tokenUri = "collection/token/";
      
      // Get the access token
      const token = await this.getMomoToken(tokenUri);
      
      if (!token) {
        return "Error: Failed to get access token.";
      }
      
      // Request headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Ocp-Apim-Subscription-Key': this.subscription_key,
      };
      
      const response = await fetch(`${this.baseUrl}${uri}`, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('Error in transactionStatus:', error);
      return `Error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}
