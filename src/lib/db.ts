import { DemoSession, Payment, PaymentStatus, Recipient } from "./types";

const INITIAL_DATA: DemoSession = {
  duplicateWarningWindowMs: 15 * 60 * 1000, // 15 minutes
  feeScenario: "UNKNOWN",
  recipients: [
    {
      id: "rec_1",
      nickname: "Ravi Delivery",
      accountName: "Ravi Delivery Services",
      demoAddress: "ravi.delivery@demo",
      category: "Delivery / Transport",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "rec_2",
      nickname: "Meera Packaging",
      accountName: "Meera Packaging Services",
      demoAddress: "meera.packaging@demo",
      category: "Packaging",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
    {
      id: "rec_3",
      nickname: "City Supplies",
      accountName: "City Supplies Enterprise",
      demoAddress: "city.supplies@demo",
      category: "Inventory",
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
    },
  ],
  payments: [],
};

const getInitialPayments = (): Payment[] => [
  {
    id: "pay_1",
    recipientId: "rec_1",
    amount: 850,
    reference: "Delivery 124",
    category: "Delivery",
    status: "SUCCESS",
    demoTransactionId: "DEMO-PAY-001",
    createdAt: Date.now() - 2 * 60 * 60 * 1000, // Today
    updatedAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "pay_2",
    recipientId: "rec_1",
    amount: 900,
    reference: "Delivery 119",
    category: "Delivery",
    status: "SUCCESS",
    demoTransactionId: "DEMO-PAY-002",
    createdAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // Sep 12 (approx)
    updatedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "pay_3",
    recipientId: "rec_2",
    amount: 2400,
    reference: "Packing material Sep 17",
    category: "Packaging",
    status: "SUCCESS", // changed to SUCCESS based on seed data
    demoTransactionId: "DEMO-PAY-003",
    createdAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "pay_4",
    recipientId: "rec_3",
    amount: 5200,
    reference: "Inventory",
    category: "Inventory",
    status: "PENDING",
    demoTransactionId: "DEMO-PAY-004",
    createdAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "pay_5",
    recipientId: "rec_1",
    amount: 1200,
    reference: "Delivery 117",
    category: "Delivery",
    status: "FAILED",
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
  },
  {
    id: "pay_6",
    recipientId: "rec_2",
    amount: 1800,
    reference: "Packaging",
    category: "Packaging",
    status: "REVERSED",
    demoTransactionId: "DEMO-PAY-006",
    createdAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
    updatedAt: Date.now() - 9 * 24 * 60 * 60 * 1000,
  },
];

const STORAGE_KEY = "paytm_demo_session";

export const db = {
  getSession(): DemoSession {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      const session = { ...INITIAL_DATA, payments: getInitialPayments() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return session;
    }
    return JSON.parse(data);
  },

  saveSession(session: DemoSession) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  },

  reset() {
    localStorage.removeItem(STORAGE_KEY);
    this.getSession();
  },

  getRecipients() {
    return this.getSession().recipients;
  },

  getRecipient(id: string) {
    return this.getSession().recipients.find((r) => r.id === id);
  },

  addRecipient(recipient: Omit<Recipient, "id" | "createdAt">) {
    const session = this.getSession();
    const newRecipient = {
      ...recipient,
      id: `rec_${Date.now()}`,
      createdAt: Date.now(),
    };
    session.recipients.push(newRecipient);
    this.saveSession(session);
    return newRecipient;
  },

  getPayments() {
    return this.getSession().payments.sort((a, b) => b.createdAt - a.createdAt);
  },

  getPayment(id: string) {
    return this.getSession().payments.find((p) => p.id === id);
  },
  
  getPaymentByToken(token: string) {
    return this.getSession().payments.find((p) => p.shareToken === token);
  },

  addPayment(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">) {
    const session = this.getSession();
    const newPayment: Payment = {
      ...payment,
      id: `pay_${Date.now()}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    session.payments.push(newPayment);
    this.saveSession(session);
    return newPayment;
  },

  updatePaymentStatus(id: string, status: PaymentStatus, demoTransactionId?: string) {
    const session = this.getSession();
    const payment = session.payments.find((p) => p.id === id);
    if (payment) {
      payment.status = status;
      payment.updatedAt = Date.now();
      if (demoTransactionId) payment.demoTransactionId = demoTransactionId;
      this.saveSession(session);
    }
    return payment;
  },

  generateShareToken(id: string) {
    const session = this.getSession();
    const payment = session.payments.find((p) => p.id === id);
    if (payment) {
      payment.shareToken = `token_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      this.saveSession(session);
      return payment.shareToken;
    }
    return null;
  },

  checkDuplicate(recipientId: string, amount: number) {
    const session = this.getSession();
    const recentTime = Date.now() - session.duplicateWarningWindowMs;
    const recentPayment = session.payments.find(
      (p) =>
        p.recipientId === recipientId &&
        p.amount === amount &&
        p.createdAt > recentTime &&
        p.status !== "FAILED"
    );
    return recentPayment;
  },
};
