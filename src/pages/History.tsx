import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { db } from "../lib/db";
import { Payment, Recipient, PaymentStatus } from "../lib/types";
import { TopBar, PaymentCard } from "../components/UI";
import { format } from "date-fns";

export const History = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [search, setSearch] = useState("");
  
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get("status") as PaymentStatus | "ALL" || "ALL";
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">(initialStatus);

  useEffect(() => {
    setPayments(db.getPayments());
    setRecipients(db.getRecipients());
  }, []);

  const getRecipient = (id: string) => recipients.find((r) => r.id === id);

  const filtered = payments.filter((p) => {
    const rec = getRecipient(p.recipientId);
    const searchLower = search.toLowerCase();
    
    const formattedDate = format(p.createdAt, "d MMM · h:mm a").toLowerCase();
    const amountStr = p.amount.toString();
    
    const matchesSearch = 
      (rec?.nickname.toLowerCase().includes(searchLower)) ||
      (rec?.accountName.toLowerCase().includes(searchLower)) ||
      (p.reference?.toLowerCase().includes(searchLower)) ||
      (p.demoTransactionId?.toLowerCase().includes(searchLower)) ||
      (amountStr.includes(searchLower)) ||
      (formattedDate.includes(searchLower));
      
    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title="Payment history" />
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00BAF2] focus:border-[#00BAF2] sm:text-sm shadow-sm"
            placeholder="Search payments, names, reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex overflow-x-auto space-x-2 pb-2 mb-4 hide-scroll">
          {["ALL", "SUCCESS", "PENDING", "FAILED", "REVERSED"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                statusFilter === s 
                  ? "bg-[#002970] text-white" 
                  : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="space-y-3 pb-6">
          {filtered.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 font-medium">No payments found</p>
              <p className="text-sm text-gray-400 mt-1">Try another name, reference or filter.</p>
            </div>
          ) : (
            filtered.map((payment) => {
              const rec = getRecipient(payment.recipientId);
              return (
                <PaymentCard 
                  key={payment.id}
                  recipientName={rec?.nickname || "Unknown"}
                  amount={payment.amount}
                  reference={payment.reference}
                  date={format(payment.createdAt, "d MMM · h:mm a")}
                  status={payment.status}
                  onClick={() => navigate(`/payments/${payment.id}`)}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};
