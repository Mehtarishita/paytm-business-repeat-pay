export type PaymentStatus = "DRAFT" | "PROCESSING" | "PENDING" | "SUCCESS" | "FAILED" | "REVERSED";

export interface Recipient {
  id: string;
  nickname: string;
  accountName: string;
  demoAddress: string;
  category: string;
  createdAt: number;
}

export interface Payment {
  id: string;
  recipientId: string;
  amount: number;
  reference: string;
  category: string;
  status: PaymentStatus;
  demoTransactionId?: string;
  createdAt: number;
  updatedAt: number;
  shareToken?: string;
}

export interface DemoSession {
  recipients: Recipient[];
  payments: Payment[];
  duplicateWarningWindowMs: number;
  feeScenario: "UNKNOWN" | "SIMULATED_ZERO" | "SIMULATED_FEE";
}
