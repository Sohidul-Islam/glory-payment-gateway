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
    agentId: string;
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
  | "BANK"
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
  bankName: string;
  branchName: string;
  routingNumber: string;
  maxLimit: string;
  currentUsage: string;
  isActive: boolean;
  status: "active" | "inactive";
  createdAt: string | null;
  updatedAt: string | null;
}

export interface PaymentDetailResponse {
  status: boolean;
  message: string;
  data: {
    agent: {
      id: number;
      fullName: string;
      phone: string;
      email: string;
      status: string;
      agentId: string;
      image: string;
    };
    paymentMethod: {
      id: number;
      name: string;
      image: string;
    };
    paymentType: {
      id: number;
      name: string;
      image: string;
    };
    paymentDetail: {
      id: number;
      value: string;
      description: string;
      charge: string;
      maxLimit: string;
      currentUsage: string;
      availableLimit: number;
    };
    account: {
      id: number;
      accountNumber: string;
      accountName: string;
      branchName: string;
      maxLimit: string;
      currentUsage: string;
      availableLimit: number;
      routingNumber?: string;
    };
  };
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
  charge: string;
  maxLimit: string;
  currentUsage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentType {
  id: number;
  name: string;
  image: string;
  status: string;
  paymentMethodId: number;
  description?: string;
  PaymentMethod?:PaymentMethod;
  PaymentDetails: PaymentTypeDetail[];
  createdAt:string;
}

export interface CreatePaymentTypeData {
  id?: number;
  paymentMethodId: number;
  name: string;
  image: string;
  status: string;
  details: {
    value: string;
    description: string;
    charge: string;
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
  if (!data.id) {
    throw Error("Payment type is methods.");
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

export const getPaymentDetailInfoByTypeId = async (paymentTypeId: number) => {
  const response = await AXIOS.get(`/payment/type/details/${paymentTypeId}`);
  return response.data;
};

export const getAgentPaymentDetails = async ({
  agentId,
  paymentTypeId,
  detailsId,
}: {
  agentId: string;
  paymentTypeId?: number;
  detailsId?: number;
}) => {
  const response = await AXIOS.get(`payment/agent-payment-details`, {
    params: {
      agentId,
      paymentTypeId,
      paymentDetailId: detailsId,
    },
  });
  return response.data;
};

export interface CreateAccountData {
  paymentDetailId: number;
  paymentTypeId: number;
  accountNumber: string;
  routingNumber: string;
  branchName: string;
  maxLimit: string;
  status: "active" | "inactive";
}

export const createPaymentAccount = async (data: CreateAccountData) => {
  const response = await AXIOS.post("/payment/account/create", data);
  return response.data;
};

export const updatePaymentAccount = async (
  id: number,
  data: CreateAccountData
) => {
  const response = await AXIOS.post(`/payment/account/update/${id}`, data);
  return response.data;
};

// Agent-specific API functions
export const getAgentPaymentMethods = async (agentId: string) => {
  const response = await AXIOS.get(`/payment/methods/agent/${agentId}`);
  return response.data as PaymentMethod[];
};

export const getAgentSinglePaymentMethod = async (
  methodId: number,
  agentId: string
) => {
  const response = await AXIOS.get(`/payment/methods/${methodId}/${agentId}`);
  return response.data as PaymentMethod;
};

export const getAgentPaymentTypes = async (
  methodId: number,
  agentId: string
) => {
  console.log({methodId})
  const response = await AXIOS.get(`/payment/types-agent/${agentId}`);
  return response.data as PaymentType[];
};

export const getAgentSinglePaymentType = async (
  typeId: number,
  agentId: string
) => {
  const response = await AXIOS.get(`/payment/types/${typeId}/${agentId}`);
  return response.data as PaymentType;
};

export const checkAgentIdAvailability = async (agentId: string) => {
  const response = await AXIOS.get(`/check-agent-id/${agentId}`);
  return response.data;
};

export const generateAgentId = async () => {
  const response = await AXIOS.get("/generate-agent-id");
  return response.data;
};

export interface Banner {
  id: number;
  userId: number;
  title: string;
  image: string;
  description: string;
  status: "active" | "inactive";
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentInfo {
  id: number;
  fullName: string;
  email: string;
  image: string | null;
  phoneNumber: string;
  location: string;
  businessName: string | null;
  businessType: string | null;
  accountStatus: string;
  accountType: string;
  isVerified: boolean;
  verificationToken: string;
  agentId: string;
  resetTokenExpiry: string | null;
  resetToken: string | null;
  isLoggedIn: boolean;
  createdAt: string;
  updatedAt: string;
  Banners: Banner[];
}

export interface AgentInfoResponse {
  status: boolean;
  message: string;
  data: AgentInfo;
}

export const getAgentInfo = async (agentId: string) => {
  const response = await AXIOS.get(`/role/agent/${agentId}`);
  return response.data;
};

export const updatePaymentTypeDescription = async (
  typeId: number,
  description: string
) => {
  const response = await AXIOS.patch(`/payment-types/${typeId}`, {
    description,
  });
  return response.data;
};

export interface PaymentSubmissionData {
  agentId: string;
  paymentMethodId?: number;
  paymentTypeId?: number;
  paymentDetailId?: number;
  paymentAccountId?: number;
  transactionId: string;
  attachment: string;
  paymentSource: string;
  paymentSourceId: number;
  type: string;
  amount: number;
  status: string;
}

export interface PaymentSubmissionResponse {
  status: boolean;
  message: string;
  data?: {
    id: number;
    status: string;
    // Add other response fields as needed
  };
}

export const submitPayment = async (data: PaymentSubmissionData) => {
  const response = await AXIOS.post(
    `payment/transactions/${data.agentId}`,
    data
  );
  return response;
};

export interface Transaction {
  id: number;
  transactionId: string;
  type: string;
  amount: string;
  status: string;
  paymentSource: string;
  paymentSourceId: number;
  givenTransactionId: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
  remarks:string;
  PaymentMethod: {
    id: number;
    name: string;
    image: string;
  };
  PaymentType: {
    id: number;
    name: string;
    image: string;
  };
  PaymentDetail: {
    id: number;
    value: string;
    description: string;
    charge: string;
  };
  PaymentAccount: {
    id: number;
    accountNumber: string;
    accountName: string;
    branchName: string;
    routingNumber: string;
  };
}

export interface PaginationInfo {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TransactionResponse {
  status: boolean;
  message: string;
  data: {
    transactions: Transaction[];
    pagination: PaginationInfo;
  };
}

export interface TransactionFilters {
  paymentDetailId?: number;
  paymentAccountId?: number;
  type?: string;
  transactionId?: string;
  source?: string;
  sourceId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export const getTransactions = async (filters: TransactionFilters = {}) => {
  const response = await AXIOS.get("/payment/transactions", {
    params: filters,
  });
  return response.data;
};

export const approveTransaction = async (transactionId: number) => {
  const response = await AXIOS.post(
    `/payment/transactions/${transactionId}/approve`
  );
  return response.data;
};

export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface UpdateTransactionStatusData {
  status: TransactionStatus;
  remarks?: string;
}

export const updateTransactionStatus = async (
  transactionId: number,
  data: UpdateTransactionStatusData
) => {
  const response = await AXIOS.post(
    `/payment/transactions/status/${transactionId}`,
    data
  );
  return response.data;
};
