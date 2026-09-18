import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, ArrowRight, Wallet, Clock, AlertCircle } from "lucide-react";
import { db } from "../lib/db";
import { Payment, Recipient } from "../lib/types";
import { formatCurrency } from "../lib/utils";
import { PaymentCard, StatusBadge } from "../components/UI";
import { format, isToday, isYesterday } from "date-fns";

const formatDate = (ts: number) => {
  if (isToday(ts)) return `Today, ${format(ts, "h:mm a")}`;
  if (isYesterday(ts)) return `Yesterday, ${format(ts, "h:mm a")}`;
  return format(ts, "MMM d");
};

export const BusinessHome = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    setPayments(db.getPayments());
    setRecipients(db.getRecipients());
  }, []);

  const totalSuccessful = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments.filter((p) => p.status === "PENDING");

  const recentPayments = payments.slice(0, 5);

  const getRecipientName = (id: string) =>
    recipients.find((r) => r.id === id)?.nickname || "Unknown";
    
  const getRecipientCategory = (id: string) =>
    recipients.find((r) => r.id === id)?.category || "Unknown";

  const getRecipientInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col space-y-6 px-4 py-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#002970] dark:text-blue-400">Good evening, Sharma General Store</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your business payments</p>
      </div>

      {/* Main Top Card */}
      <div className="bg-[#00BAF2] text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10">
          <Wallet className="w-32 h-32 transform translate-x-4 translate-y-4" />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-medium opacity-90">Business Payments</p>
          <h2 className="text-3xl font-bold mt-1 tracking-tight">{formatCurrency(totalSuccessful)}</h2>
          <p className="text-xs mt-2 opacity-80 flex items-center">
             Successful payments recorded here
          </p>
        </div>
      </div>

      <div className="flex space-x-3">
        <button 
          onClick={() => navigate("/recipients")}
          className="flex-1 bg-white dark:bg-slate-800 border border-[#00BAF2] dark:border-blue-400 text-[#00BAF2] dark:text-blue-400 py-3 rounded-xl font-semibold shadow-sm flex justify-center items-center active:scale-[0.98] transition-transform hover:bg-blue-50 dark:hover:bg-slate-700"
        >
          Pay a business contact
        </button>
      </div>

      {pendingPayments.length > 0 && (
        <div 
          onClick={() => {
            if (pendingPayments.length === 1) {
              navigate(`/payments/${pendingPayments[0].id}`);
            } else {
              navigate("/history?status=PENDING");
            }
          }}
          className="bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 p-3 rounded-xl flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center space-x-3">
            <AlertCircle className="text-orange-500 w-5 h-5" />
            <span className="text-sm font-medium text-orange-800 dark:text-orange-400">
              {pendingPayments.length} pending payment{pendingPayments.length !== 1 ? 's' : ''} — View status
            </span>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400" />
        </div>
      )}

      {/* Frequent Recipients */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm tracking-wide uppercase">Frequent Recipients</h3>
          <Link to="/recipients" className="text-xs text-[#00BAF2] dark:text-blue-400 font-semibold flex items-center">
            View all <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        
        <div className="flex overflow-x-auto space-x-3 pb-4 -mx-4 px-4 snap-x hide-scroll">
          {recipients.map((rec) => {
            const recPayments = payments.filter(p => p.recipientId === rec.id && p.status === "SUCCESS");
            
            return (
              <div 
                key={rec.id}
                onClick={() => navigate(`/recipients/${rec.id}`)}
                className="snap-start min-w-[240px] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-4 rounded-2xl shadow-sm cursor-pointer active:scale-[0.98] transition-transform flex-shrink-0"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700 text-[#002970] dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    {getRecipientInitials(rec.nickname)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate w-[140px]">{rec.nickname}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{rec.category}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-50 dark:border-slate-700">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {recPayments.length} successful
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/pay/${rec.id}`);
                    }}
                    className="text-xs font-semibold text-[#00BAF2] dark:text-blue-400 bg-blue-50 dark:bg-slate-700 px-3 py-1.5 rounded-full"
                  >
                    Pay Again
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Payments */}
      <div>
        <div className="flex justify-between items-end mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-sm tracking-wide uppercase">Recent Payments</h3>
          <Link to="/history" className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center">
            View all <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>
        
        <div className="space-y-3">
          {recentPayments.map((payment) => (
            <PaymentCard 
              key={payment.id}
              recipientName={getRecipientName(payment.recipientId)}
              amount={payment.amount}
              reference={payment.reference}
              date={formatDate(payment.createdAt)}
              status={payment.status}
              onClick={() => navigate(`/payments/${payment.id}`)}
            />
          ))}
          {recentPayments.length === 0 && (
            <div className="text-center py-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No payments found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
