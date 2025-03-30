import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define transaction types
export type TransactionType = 'topup' | 'purchase' | 'transfer' | 'refund';

// Define transaction interface
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'completed' | 'failed';
  reference?: string;
}

// Define wallet context interface
interface WalletContextType {
  balance: number;
  transactions: Transaction[];
  topUpWallet: (amount: number, reference: string) => Promise<void>;
  deductFromWallet: (amount: number, description: string, type: TransactionType) => Promise<boolean>;
  getTransactionById: (id: string) => Transaction | undefined;
  refreshWallet: () => Promise<void>;
}

// Create context with default values
const WalletContext = createContext<WalletContextType>({
  balance: 0,
  transactions: [],
  topUpWallet: async () => {},
  deductFromWallet: async () => false,
  getTransactionById: () => undefined,
  refreshWallet: async () => {},
});

// Custom hook to use the wallet context
export const useWallet = () => useContext(WalletContext);

// Provider component
export const WalletProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Load wallet data from storage on mount
  useEffect(() => {
    loadWalletData();
  }, []);
  
  // Load wallet data from AsyncStorage
  const loadWalletData = async () => {
    try {
      const storedBalance = await AsyncStorage.getItem('wallet_balance');
      const storedTransactions = await AsyncStorage.getItem('wallet_transactions');
      
      if (storedBalance) {
        setBalance(parseFloat(storedBalance));
      }
      
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
    } catch (error) {
      console.error('Error loading wallet data:', error);
    }
  };
  
  // Save wallet data to AsyncStorage
  const saveWalletData = async () => {
    try {
      await AsyncStorage.setItem('wallet_balance', balance.toString());
      await AsyncStorage.setItem('wallet_transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Error saving wallet data:', error);
    }
  };
  
  // Effect to save wallet data whenever balance or transactions change
  useEffect(() => {
    saveWalletData();
  }, [balance, transactions]);
  
  // Generate a unique transaction ID
  const generateTransactionId = (): string => {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  };
  
  // Top up wallet balance
  const topUpWallet = async (amount: number, reference: string): Promise<void> => {
    // Create a new transaction
    const newTransaction: Transaction = {
      id: generateTransactionId(),
      type: 'topup',
      amount: amount,
      description: 'Wallet top up',
      date: new Date().toISOString(),
      status: 'completed',
      reference: reference
    };
    
    // Update balance and transactions
    setBalance(prevBalance => prevBalance + amount);
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
  };
  
  // Deduct from wallet balance
  const deductFromWallet = async (
    amount: number, 
    description: string,
    type: TransactionType
  ): Promise<boolean> => {
    // Check if there's enough balance
    if (balance < amount) {
      return false;
    }
    
    // Create a new transaction
    const newTransaction: Transaction = {
      id: generateTransactionId(),
      type: type,
      amount: amount,
      description: description,
      date: new Date().toISOString(),
      status: 'completed'
    };
    
    // Update balance and transactions
    setBalance(prevBalance => prevBalance - amount);
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
    
    return true;
  };
  
  // Get a transaction by ID
  const getTransactionById = (id: string): Transaction | undefined => {
    return transactions.find(transaction => transaction.id === id);
  };
  
  // Refresh wallet data
  const refreshWallet = async (): Promise<void> => {
    await loadWalletData();
  };
  
  // Context value
  const value: WalletContextType = {
    balance,
    transactions,
    topUpWallet,
    deductFromWallet,
    getTransactionById,
    refreshWallet
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};
