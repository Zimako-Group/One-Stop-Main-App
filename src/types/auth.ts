export interface User {
  id: string;
  fullName: string;
  email: string;
  accountNumber: string;
}

export interface AuthFormData {
  fullName?: string;
  email: string;
  accountNumber?: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}