export type OpsPlan = "unsubscribed" | "starter" | "lite" | "pro" | string;
export type OpsPaymentStatus = "paid" | "pending" | "failed" | "expired" | "none" | string;
export type OpsEngagement = "subscribed" | "pending" | "hot" | "active" | "interested" | "cold";

export type OpsUser = {
  id: string;
  email: string;
  name: string;
  verified: boolean;
  createdAt: string;
  lastActiveAt: string | null;
  active24h: boolean;
  plan: OpsPlan;
  paymentStatus: OpsPaymentStatus;
  amountPaidIdr: number | null;
  purchasedAt: string | null;
  expiresAt: string | null;
  weddingTitle: string | null;
  weddingDate: string | null;
  completion: number;
  engagement: OpsEngagement;
  usage: {
    tasks: number;
    tasksDone: number;
    budgetItems: number;
    vendors: number;
    guests: number;
    invitationPublished: boolean;
    rundown: number;
  };
};

export type OpsMetrics = {
  totalUsers: number;
  verifiedUsers: number;
  newThisWeek: number;
  active24h: number;
  subscribers: number;
  unsubscribed: number;
  conversionRate: number;
  revenueIdr: number;
  plans: { starter: number; lite: number; pro: number; other: number };
  payments: { paid: number; pending: number; failed: number };
  segments: { hot: number; active: number; interested: number; cold: number };
};

export type OpsPayload = {
  configured: boolean;
  users: OpsUser[];
  metrics: OpsMetrics;
  fetchedAt: string;
};
