export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  accountNumber: string;
}

export interface AuthFormData {
  fullName?: string;
  phoneNumber: string;
  email?: string;
  accountNumber?: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (fullName: string, phoneNumber: string, email: string | undefined, password: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
}