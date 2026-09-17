import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/db";
import { formatCurrency } from "../lib/utils";
import { ShieldCheck } from "lucide-react";

export const AuthorisePayment = () => {
  const navigate = useNavigate();
  const draftStr = sessionStorage.getItem("current_draft");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!draftStr) {
      navigate("/business");
    }
  }, [draftStr, navigate]);

  if (!draftStr) return null;
  const draft = JSON.parse(draftStr);
  const recipient = db.getRecipient(draft.recipientId);

  if (!recipient) return null;

  const handleAuthorise = () => {
    setIsProcessing(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Logic for status based on demo controls can be added, but default is SUCCESS
      // Let's create the payment record
      const payment = db.addPayment({
        recipientId: draft.recipientId,
        amount: draft.amount,
        reference: draft.reference,
        category: draft.category,
        status: "SUCCESS",
        demoTransactionId: `DEMO-PAY-${Math.floor(Math.random() * 100000)}`
      });
      
      sessionStorage.removeItem("current_draft");
      navigate(`/payments/${payment.id}`, { replace: true });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-white justify-between">
      <div className="p-6 flex flex-col items-center justify-center flex-1">
        <ShieldCheck className="w-16 h-16 text-[#00BAF2] mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">Confirm demo payment</h1>
        
        <div className="text-center my-6">
          <p className="text-sm text-gray-500 mb-1 uppercase tracking-wide font-semibold">Payment</p>
          <p className="text-4xl font-extrabold text-gray-900">{formatCurrency(draft.amount)}</p>
        </div>
        
        <div className="bg-gray-50 w-full p-4 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">To</span>
            <span className="font-semibold text-gray-900">{recipient.nickname}</span>
          </div>
          {draft.reference && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Reference</span>
              <span className="font-semibold text-gray-900 max-w-[60%] text-right truncate">{draft.reference}</span>
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-xl w-full text-center">
          <p className="text-sm font-semibold text-[#002970]">
            This is a simulated payment for demonstration only.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-gray-100 pb-safe">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="w-8 h-8 border-4 border-[#00BAF2] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-[#002970] font-semibold text-sm">Processing demo payment...</p>
          </div>
        ) : (
          <button 
            onClick={handleAuthorise}
            className="w-full bg-[#00BAF2] text-white py-4 rounded-xl font-bold text-lg shadow-sm active:scale-[0.98] transition-transform"
          >
            Confirm demo payment
          </button>
        )}
      </div>
    </div>
  );
};
