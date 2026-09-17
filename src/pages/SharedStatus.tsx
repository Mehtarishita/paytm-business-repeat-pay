import React from "react";
import { useParams } from "react-router-dom";
import { db } from "../lib/db";
import { CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react";
import { formatCurrency, cn } from "../lib/utils";
import { format } from "date-fns";

export const SharedStatus = () => {
  const { token } = useParams();
  const payment = db.getPaymentByToken(token || "");

  if (!payment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F9FC] p-4 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Link unavailable</h1>
        <p className="text-gray-500">This payment-status link is no longer available.</p>
      </div>
    );
  }

  const recipient = db.getRecipient(payment.recipientId);
  if (!recipient) return null;

  const isSuccess = payment.status === "SUCCESS";
  const isPending = payment.status === "PENDING";
  
  let statusIcon = <CheckCircle2 className="w-10 h-10 text-green-500" />;
  let statusText = "Successful";
  let statusColor = "text-green-600";
  
  if (isPending) {
    statusIcon = <Clock className="w-10 h-10 text-orange-500" />;
    statusText = "Pending";
    statusColor = "text-orange-600";
  } else if (payment.status !== "SUCCESS") {
    statusIcon = <XCircle className="w-10 h-10 text-red-500" />;
    statusText = payment.status.charAt(0) + payment.status.slice(1).toLowerCase();
    statusColor = "text-red-600";
  }

  // Mask address for privacy
  const maskAddress = (address: string) => {
    const parts = address.split("@");
    if (parts.length !== 2) return address;
    const name = parts[0];
    const maskedName = name.length > 4 ? name.substring(0, name.length - 4) + "••••" : "••••";
    return `${maskedName}@${parts[1]}`;
  };

  return (
    <div className="min-h-screen bg-[#F5F9FC] flex justify-center pb-12">
      <div className="w-full max-w-md p-4">
        <div className="flex justify-between items-center mb-6 pt-4">
          <h1 className="text-xl font-extrabold text-[#002970] tracking-tight">PAYTM</h1>
          <div className="bg-[#002970] text-white text-[10px] font-bold py-1 px-2.5 rounded-full tracking-wider">
            DEMO
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-6">
          <div className="p-6 text-center border-b border-gray-50">
            <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Payment status</p>
            <div className="flex justify-center mb-2">{statusIcon}</div>
            <p className={cn("text-lg font-bold mb-3", statusColor)}>{statusText}</p>
            <p className="text-4xl font-extrabold text-gray-900">{formatCurrency(payment.amount)}</p>
          </div>
          
          <div className="p-6 space-y-5">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">From</p>
              <p className="font-semibold text-gray-900">Sharma General Store</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">To</p>
              <p className="font-semibold text-gray-900">{recipient.accountName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Payment address</p>
              <p className="font-medium text-gray-800">{maskAddress(recipient.demoAddress)}</p>
            </div>
            {payment.reference && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Reference</p>
                <p className="font-medium text-gray-800">{payment.reference}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Time</p>
              <p className="font-medium text-gray-800">{format(payment.createdAt, "d MMM yyyy, h:mm a")}</p>
            </div>
            {payment.demoTransactionId && (
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Demo transaction ID</p>
                <p className="font-mono text-sm font-semibold text-gray-800 bg-gray-50 p-2 rounded border border-gray-100 inline-block">
                  {payment.demoTransactionId}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            DEMO — No money moved
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="inline-flex items-center text-sm font-semibold text-[#00BAF2] bg-white border border-gray-200 px-6 py-2.5 rounded-full shadow-sm"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh status
          </button>
          <p className="text-[10px] text-gray-400 mt-3 font-medium">
            Last updated {format(payment.updatedAt, "h:mm a")}
          </p>
        </div>
      </div>
    </div>
  );
};
