/* eslint-disable @typescript-eslint/no-explicit-any */
import AXIOS from "./Axios";

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

export const API_URL = "http://localhost:5000/api";

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  location: string;
  businessName?: string;
  businessType?: string;
  accountType: string;
  image?: string;
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
  const response = await AXIOS.post<ApiResponse<User>>(`/register`, data);
  return response.data;
};

export const loginUser = async (data: LoginData) => {
  const response = await AXIOS.post("/login", data);
  return response;
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
  newPassword: string;
}

export interface VerifyEmailData {
  token: string;
  email: string;
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

export const forgotPassword = async (
  data: ForgotPasswordData
): Promise<ApiResponse> => {
  const response = await AXIOS.post("/request-reset", data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordData) => {
  const response = await AXIOS.post("/reset-password", data);
  return response;
};

export const verifyEmail = async (data: VerifyEmailData) => {
  const response = await AXIOS.post("/verify-email", data);
  return response;
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
  PaymentMethod?: PaymentMethod;
  PaymentDetails: PaymentTypeDetail[];
  createdAt: string;
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
  transactionType,
}: {
  agentId: string;
  paymentTypeId?: number;
  detailsId?: number;
  transactionType?: string;
}) => {
  const response = await AXIOS.get(`payment/agent-payment-details`, {
    params: {
      agentId,
      paymentTypeId,
      paymentDetailId: detailsId,
      transactionType,
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
  console.log({ methodId });
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
  paymentSourceId: string;
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
  commission: string;
  commissionType: string;
  paymentSource: string;
  paymentSourceId: number;
  givenTransactionId: string;
  attachment: string;
  createdAt: string;
  updatedAt: string;
  remarks: string;
  withdrawAccountNumber?: string;
  withdrawDescription?: string;
  userId: number;
  agentCommission: string;
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
  status?: string;
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

export type TransactionStatus = "PENDING" | "APPROVED" | "REJECTED" | "SETTLED";

export interface UpdateTransactionStatusData {
  status: TransactionStatus;
  remarks?: string;
  attachment?: string;
  transactionId?: string;
  settledCommission?: number;
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

// User Types
export interface UserSubscription {
  id: number;
  userId: number;
  subscriptionId: number;
  status: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  image: string | null;
  phoneNumber: string;
  location: string;
  businessName: string | null;
  businessType: string | null;
  password: string;
  accountStatus: string;
  accountType: string;
  isVerified: boolean;
  verificationToken: string;
  agentId: string;
  reference: string | null;
  resetTokenExpiry: string | null;
  resetToken: string | null;
  commission: string;
  commissionType: string;
  agentCommission: string;
  agentCommissionType: string;
  isLoggedIn: boolean;
  createdAt: string;
  updatedAt: string;
  UserSubscriptions: UserSubscription[];
}

export interface UserResponse {
  status: boolean;
  message: string;
  data: {
    users: User[];
    pagination: {
      page: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
}

// User API Functions
export interface UserFilters {
  page?: number;
  pageSize?: number;
  searchKey?: string;
  accountStatus?: string;
  accountType?: string;
}

export const getUsers = async (filters: UserFilters = {}) => {
  const {
    page = 1,
    pageSize = 10,
    searchKey,
    accountStatus,
    accountType,
  } = filters;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (searchKey) queryParams.append("searchKey", searchKey);
  if (accountStatus) queryParams.append("accountStatus", accountStatus);
  if (accountType) queryParams.append("accountType", accountType);

  const response = await AXIOS.get(`/users?${queryParams.toString()}`);
  return response.data;
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await AXIOS.post("/users", userData);
  return response.data;
};

export const updateUser = async (id: number, userData: Partial<User>) => {
  const response = await AXIOS.post(`/profile?userId=${id}`, userData);
  return response;
};

export const deleteUser = async (id: number): Promise<void> => {
  await AXIOS.delete(`/users/${id}`);
};

export interface Notification {
  id: number;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  relatedEntityType: string;
  relatedEntityId: number;
}

export interface NotificationsResponse {
  status: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      totalPages: number;
      currentPage: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    unreadCount: number;
  };
}

export const getNotifications = async (page = 1, limit = 10) => {
  const response = await AXIOS.get(`/notifications`, {
    params: { page, limit },
  });
  return response.data;
};

export const markNotificationAsRead = async (notificationIds: number[]) => {
  const response = await AXIOS.post<ApiResponse>(`/notifications/mark-read`, {
    notificationIds,
  });
  return response.data;
};

export const markAllNotificationsAsRead = async () => {
  const response = await AXIOS.post<ApiResponse>(`/notifications/read-all`);
  return response.data;
};

export const deleteNotifications = async (notificationIds: number[]) => {
  const response = await AXIOS.post<ApiResponse>(
    `/notifications/delete-notification`,
    {
      notificationIds,
    }
  );
  return response.data;
};

export interface UnreadCountResponse {
  status: boolean;
  message: string;
  data: {
    unreadCount: number;
  };
}

export const getUnreadNotificationCount = async () => {
  const response = await AXIOS.get(`/notifications/unread-count`);
  return response.data;
};

export interface DashboardData {
  stats: {
    title: string;
    value: string | number;
    change: string;
  }[];
  transactionData: {
    name: string;
    value: number;
  }[];
  methodsData: {
    name: string;
    value: number;
  }[];
}

export interface DashboardResponse {
  status: boolean;
  message: string;
  data: DashboardData;
}

export const getDashboardData = async () => {
  const response = await AXIOS.get<DashboardResponse>("/dashboard");
  return response.data;
};

export interface DashboardOverview {
  paymentMethods: number;
  paymentTypes: number;
  transactions: {
    count: number;
    totalAmount: number;
    totalCommission: number;
    agentCommission: number;
    settledAmount: number;
  };
}

export interface DashboardOverviewResponse {
  status: boolean;
  message: string;
  data: DashboardOverview;
}

export const getDashboardOverview = async (
  startDate?: string,
  endDate?: string
) => {
  const params = new URLSearchParams();
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);

  const response = await AXIOS.get(`/dashboard/overview?${params.toString()}`);
  return response.data;
};
