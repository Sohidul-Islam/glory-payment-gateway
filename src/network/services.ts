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
  userId: number;
  name: PaymentMethodType;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTypeWithMethod {
  id: number;
  userId: number;
  paymentMethodId: number;
  name: string;
  image: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  PaymentMethod: PaymentMethod;
}

export interface PaymentMethodDetail {
  id: number;
  paymentTypeId: number;
  value: string;
  description: string;
  maxLimit: string;
  currentUsage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  PaymentType: PaymentTypeWithMethod;
}

export interface AccountInfo {
  id: number;
  userId: number;
  paymentDetailId: number;
  accountNumber: string;
  maxLimit: string;
  currentUsage: string;
  isActive: boolean;
  status: "active" | "inactive";
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaymentDetailResponse {
  paymentMethod: PaymentMethodDetail;
  accountInfo: AccountInfo[];
}

export const getPaymentMethods = async () => {
  const response = await AXIOS.get("/payment/methods");

  return response.data as PaymentMethod[];
};

export const getPaymentMethodById = async (id: number) => {
  const response = await AXIOS.get(`/payment/methods/${id}`);
  return response.data as PaymentMethod;
};

export interface PaymentTypeDetail {
  id: number;
  paymentTypeId: number;
  value: string;
  description: string;
  maxLimit: string;
  currentUsage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentType {
  id: number;
  userId: number;
  paymentMethodId: number;
  name: string;
  image: string;
  status: "active" | "inactive";
  PaymentDetails: PaymentTypeDetail[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentTypeData {
  id?:number;
  paymentMethodId: number;
  name: string;
  image: string;
  details: {
    value: string;
    description: string;
    maxLimit: string;
  }[];
}

export const getPaymentTypes = async () => {
  const response = await AXIOS.get("/payment/types");
  return response.data;
};

export const createPaymentType = async (data: CreatePaymentTypeData) => {
  const response = await AXIOS.post("/payment/types", data);
  return response;
};

export const updatePaymentType = async (data: CreatePaymentTypeData) => {
  if(!data.id){
    throw Error("Payment type is methods.")
  }
  const response = await AXIOS.post(`/payment/types/${data.id}`, data);
  return response;
};

export const deletePaymentType = async (typeId: number) => {
  const response = await AXIOS.post(`/payment/types/delete/${typeId}`);
  return response;
};

export const getPaymentDetailInfo = async (paymentDetailId: number) => {
  const response = await AXIOS.get(`/payment/details/${paymentDetailId}`);
  return response.data as PaymentDetailResponse;
};

export interface CreateAccountData {
  paymentDetailId: number;
  accountNumber: string;
  maxLimit: string;
  status: "active" | "inactive";
}

export const createPaymentAccount = async (data: CreateAccountData) => {
  const response = await AXIOS.post("/payment/account/create", data);
  return response.data;
};

export const updatePaymentAccount = async (id: number, data: CreateAccountData) => {
  const response = await AXIOS.post(`/payment/account/update/${id}`, data);
  return response.data;
};
