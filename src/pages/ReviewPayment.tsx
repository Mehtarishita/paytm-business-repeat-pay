import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../lib/db";
import { TopBar } from "../components/UI";
import { formatCurrency } from "../lib/utils";
import { Info } from "lucide-react";

export const ReviewPayment = () => {
  const navigate = useNavigate();
  const draftStr = sessionStorage.getItem("current_draft");
  
  if (!draftStr) {
    return <div>No active draft.</div>;
  }
  
  const draft = JSON.parse(draftStr);
  const recipient = db.getRecipient(draft.recipientId);
  const session = db.getSession();
  
  const [isProcessing, setIsProcessing] = useState(false);

  if (!recipient) return <div>Recipient not found</div>;

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate(`/authorise/draft`, { replace: true });
    }, 500);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title="Review payment" />
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="bg-gray-50 p-4 border-b border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Paying</p>
            <p className="font-semibold text-gray-900 mt-1">Sharma General Store</p>
          </div>
          
          <div className="p-5 flex flex-col items-center border-b border-gray-100">
             <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">To</p>
             <div className="w-12 h-12 rounded-full bg-blue-50 text-[#002970] flex items-center justify-center font-bold text-lg mb-2">
                {recipient.nickname.substring(0, 2).toUpperCase()}
             </div>
             <h2 className="text-xl font-bold text-gray-900">{recipient.nickname}</h2>
             <p className="text-sm font-medium text-gray-600 mt-1">{recipient.accountName}</p>
             <p className="text-xs text-gray-400 mt-0.5">{recipient.demoAddress}</p>
          </div>

          <div className="p-5 border-b border-gray-100">
             <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Amount</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(draft.amount)}</p>
             </div>
             
             {draft.reference && (
               <div className="flex justify-between items-start mb-4">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-0.5">Purpose</p>
                  <p className="text-sm font-medium text-gray-800 text-right max-w-[60%]">{draft.reference}</p>
               </div>
             )}
             
             <div className="flex justify-between items-center mb-4">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Category</p>
                <p className="text-sm font-medium text-gray-800">{draft.category}</p>
             </div>
             
             <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Source</p>
                <p className="text-sm font-medium text-gray-800">Demo bank account</p>
             </div>
          </div>

          <div className="p-5 bg-gray-50">
             <div className="flex items-center text-gray-700 mb-2">
               <Info className="w-4 h-4 mr-1.5" />
               <p className="text-sm font-bold">Fee information</p>
             </div>
             {session.feeScenario === "UNKNOWN" && (
               <p className="text-xs text-gray-500">Recipient charges depend on their applicable payment arrangement.</p>
             )}
             {session.feeScenario === "SIMULATED_ZERO" && (
               <p className="text-xs text-green-600 font-medium">ILLUSTRATIVE DEMO ONLY: Simulated ₹0 fee</p>
             )}
             {session.feeScenario === "SIMULATED_FEE" && (
               <div className="flex justify-between items-center">
                 <p className="text-xs text-gray-500">ILLUSTRATIVE DEMO ONLY: Base fee</p>
                 <p className="text-xs font-semibold text-gray-800">₹40</p>
               </div>
             )}
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4 space-y-3">
        <button 
          onClick={handleConfirm}
          disabled={isProcessing}
          className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold shadow-sm text-lg flex justify-center items-center"
        >
          {isProcessing ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Continue to authorisation"
          )}
        </button>
        <button 
          onClick={() => navigate(-1)}
          disabled={isProcessing}
          className="w-full bg-white text-gray-600 py-3.5 rounded-xl font-bold"
        >
          Edit payment
        </button>
        <p className="text-[10px] text-center font-bold text-gray-400 mt-2 uppercase tracking-widest">
          DEMO — No money moved
        </p>
      </div>
    </div>
  );
};
