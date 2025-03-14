import AXIOS from "./Axios";

export interface RegisterData {
  fullName: string;
  email: string;
  image?: string;
  phoneNumber: string;
  location: string;
  businessName: string;
  businessType: string;
  password: string;
  accountStatus?: string;
  accountType?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    location: string;
    businessName: string;
    businessType: string;
    accountStatus: string;
    accountType: string;
    isVerified: boolean;
    verificationToken: string;
    isLoggedIn: boolean;
    createdAt: string;
    updatedAt: string;
  };
  token: string;
}

export const registerUser = async (data: RegisterData) => {
  const response = await AXIOS.post("/register", data);
  return response;
};

export const loginUser = async (data: LoginData) => {
  const response = await AXIOS.post("/login", data);
  return response.data as LoginResponse;
};

export interface RegisterData {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export type PaymentMethodType =
  | "MOBILE_BANKING"
  | "VISA"
  | "MASTERCARD"
  | "CREDIT_CARD"
  | "USDT";

export interface PaymentMethodData {
  name: PaymentMethodType;
  image: string;
  status: "active" | "inactive";
}

// API Functions

export const forgotPassword = async (data: ForgotPasswordData) => {
  const response = await AXIOS.post("/forgot-password", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await AXIOS.post("/reset-password", data);
  return response.data;
};

export const createPaymentMethod = async (
  data: PaymentMethodData & {
    id?: number;
  }
) => {
  const response = await AXIOS.post(
    data?.id ? `/payment/methods/${data?.id}` : `/payment/methods`,
    data
  );
  return response.data;
};

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await AXIOS.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.url;
};

export interface PaymentMethod {
  id: number;
  name: PaymentMethodType;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export const getPaymentMethods = async () => {
  const response = await AXIOS.get("/payment/methods");
  return response.data as PaymentMethod[];
};
