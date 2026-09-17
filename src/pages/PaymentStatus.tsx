import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle2, Clock, XCircle, Share2, ArrowLeft, RefreshCw } from "lucide-react";
import { db } from "../lib/db";
import { formatCurrency, cn } from "../lib/utils";
import { format } from "date-fns";
import { SharePreview } from "../components/SharePreview";

export const PaymentStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const payment = db.getPayment(id || "");
  const [showShare, setShowShare] = useState(false);

  if (!payment) return <div>Payment not found</div>;

  const recipient = db.getRecipient(payment.recipientId);
  if (!recipient) return <div>Recipient not found</div>;

  const isSuccess = payment.status === "SUCCESS";
  const isPending = payment.status === "PENDING";
  const isFailed = payment.status === "FAILED";
  const isReversed = payment.status === "REVERSED";

  let statusConfig = {
    icon: <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />,
    title: "Demo payment completed",
    color: "text-green-600",
    bg: "bg-green-50",
    desc: ""
  };

  if (isPending) {
    statusConfig = {
      icon: <Clock className="w-16 h-16 text-orange-500 mb-4" />,
      title: "Payment pending",
      color: "text-orange-600",
      bg: "bg-orange-50",
      desc: "This payment does not have a final outcome yet."
    };
  } else if (isFailed) {
    statusConfig = {
      icon: <XCircle className="w-16 h-16 text-red-500 mb-4" />,
      title: "Payment failed",
      color: "text-red-600",
      bg: "bg-red-50",
      desc: "This demo payment attempt failed."
    };
  } else if (isReversed) {
    statusConfig = {
      icon: <XCircle className="w-16 h-16 text-red-500 mb-4" />,
      title: "Payment reversed",
      color: "text-red-600",
      bg: "bg-red-50",
      desc: "This demo payment was later reversed."
    };
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <div className="p-4 flex items-center">
        <button onClick={() => navigate("/business")} className="p-2">
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <div className="px-4 flex-1 overflow-y-auto pb-24">
        <div className={cn("p-6 rounded-3xl flex flex-col items-center text-center mb-6 shadow-sm border border-white", statusConfig.bg)}>
          {statusConfig.icon}
          <h1 className={cn("text-xl font-bold mb-1", statusConfig.color)}>{statusConfig.title}</h1>
          <p className="text-3xl font-extrabold text-gray-900 mt-2 mb-1">{formatCurrency(payment.amount)}</p>
          <p className="text-sm font-semibold text-gray-700">{recipient.nickname}</p>
          {payment.reference && (
            <p className="text-xs text-gray-500 mt-1">Ref: {payment.reference}</p>
          )}
          
          {payment.demoTransactionId && (
            <div className="mt-4 py-1.5 px-3 bg-white/60 rounded-lg">
               <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Demo transaction ID</p>
               <p className="text-xs font-mono font-semibold text-gray-800">{payment.demoTransactionId}</p>
            </div>
          )}
        </div>

        <div className="text-center mb-8">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-1">Status</p>
          <p className={cn("text-lg font-bold tracking-wider", statusConfig.color)}>{payment.status}</p>
          {statusConfig.desc && (
            <p className="text-sm text-gray-600 mt-2 max-w-[80%] mx-auto">{statusConfig.desc}</p>
          )}
          <p className="text-xs text-gray-400 mt-3 flex items-center justify-center">
            Last updated: {format(payment.updatedAt, "MMM d, h:mm a")}
          </p>
        </div>

        {isPending && (
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-center mb-6">
            <p className="text-sm text-orange-800 font-medium">Do not pay again until the status is clear.</p>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-40 pb-safe space-y-3">
        {isSuccess && (
          <button 
            onClick={() => setShowShare(true)}
            className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold flex items-center justify-center shadow-sm"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share payment status
          </button>
        )}
        
        {isPending && (
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold flex items-center justify-center shadow-sm"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh status
          </button>
        )}

        {(isFailed || isReversed) && (
          <button 
            onClick={() => navigate(`/pay/${payment.recipientId}`)}
            className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold shadow-sm"
          >
            Try again
          </button>
        )}

        <button 
          onClick={() => navigate("/business")}
          className="w-full bg-white text-gray-600 border border-gray-200 py-3.5 rounded-xl font-bold"
        >
          Back to business payments
        </button>
      </div>

      {showShare && (
        <SharePreview payment={payment} recipient={recipient} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
};
