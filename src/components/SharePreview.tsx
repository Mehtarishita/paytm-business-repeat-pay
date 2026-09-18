import React from "react";
import { Payment, Recipient } from "../lib/types";
import { formatCurrency } from "../lib/utils";
import { Copy, Share, X } from "lucide-react";
import { db } from "../lib/db";

export const SharePreview = ({ payment, recipient, onClose }: { payment: Payment, recipient: Recipient, onClose: () => void }) => {
  const handleCopy = async () => {
    if (!window.confirm("Are you sure you want to create and share this demo payment record?")) {
      return;
    }
    
    try {
      // Create backend record
      const shareData = {
        payerName: "Sharma General Store",
        recipientNickname: recipient.nickname,
        recipientAccountName: recipient.accountName,
        recipientAddress: recipient.demoAddress,
        amount: payment.amount,
        category: payment.category,
        reference: payment.reference,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
        status: payment.status,
        demoTransactionId: payment.demoTransactionId,
        paymentId: payment.id
      };

      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(shareData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate sharing link from backend');
      }

      const { token: apiToken } = await response.json();
      const url = `${window.location.origin}/r/${apiToken}`;
      
      await navigator.clipboard.writeText(url);
      alert("Demo link copied to clipboard: " + url);
      onClose();
    } catch (err) {
      console.error(err);
      // Fallback to local token if API fails (e.g. no env vars)
      let token = payment.shareToken || db.generateShareToken(payment.id);
      const url = `${window.location.origin}/r/${token}`;
      alert("Note: Backend API failed, using fallback local link. " + url);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl overflow-hidden pb-safe animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-bold text-gray-900 text-lg">Share payment status</h3>
          <button aria-label="Close sharing preview" onClick={onClose} className="p-1 rounded-full bg-gray-100 text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-5 bg-gray-50">
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Preview</div>
            
            <div className="text-center mt-3 mb-4 space-y-1">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">From</p>
              <p className="text-sm font-semibold text-gray-900 mb-3">Sharma General Store</p>
              
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">To</p>
              <p className="text-sm font-semibold text-gray-900">{recipient.nickname}</p>
              
              <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(payment.amount)}</p>
              <p className="text-xs font-bold text-green-600 flex justify-center items-center">
                ✓ SUCCESS
              </p>
            </div>
            
            {payment.reference && (
              <div className="flex justify-between items-center border-t border-gray-50 pt-3 text-xs">
                <span className="text-gray-500">Ref (Added by payer)</span>
                <span className="font-semibold text-gray-800">{payment.reference}</span>
              </div>
            )}
            {payment.demoTransactionId && (
              <div className="flex justify-between items-center mt-2 text-xs">
                <span className="text-gray-500">Demo ID</span>
                <span className="font-mono text-gray-800">{payment.demoTransactionId}</span>
              </div>
            )}
          </div>
          
          <p className="text-xs text-orange-600 text-center mt-4 bg-orange-50 p-2 rounded-lg border border-orange-100">
            Anyone with this link can view the limited payment-status information.
          </p>
        </div>

        <div className="p-4 flex space-x-3">
          <button 
            onClick={handleCopy}
            className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center shadow-sm"
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy link
          </button>
          <button 
            onClick={handleCopy}
            className="flex-1 bg-[#00BAF2] text-white py-3 rounded-xl font-bold flex items-center justify-center shadow-sm"
          >
            <Share className="w-4 h-4 mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};
