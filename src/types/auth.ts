export enum AuthStatus {
  LOGGED_OUT = 'LOGGED_OUT',
  AUTHENTICATED = 'AUTHENTICATED',  // User is authenticated but not verified with OTP
  VERIFIED = 'VERIFIED',           // User is fully verified with OTP
  PENDING_OTP = 'PENDING_OTP'      // User is authenticated and waiting for OTP verification
}

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

export interface OtpVerificationResult {
  success: boolean;
  error?: string;
  user?: User | null;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  authStatus: AuthStatus;
  login: (email: string, password: string) => Promise<{success: boolean, requiresOtp: boolean, error?: string}>;
  signup: (fullName: string, phoneNumber: string, email: string | undefined, password: string) => Promise<{success: boolean, error?: string}>;
  resetPassword: (email: string) => Promise<{success: boolean, error?: string}>;
  logout: () => void;
  verifyOtp: (otp: string) => Promise<OtpVerificationResult>;
  resendOtp: () => Promise<{success: boolean, message: string}>;
}