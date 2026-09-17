import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../lib/db";
import { TopBar } from "../components/UI";
import { formatCurrency } from "../lib/utils";
import { AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const PaymentForm = () => {
  const { recipientId } = useParams();
  const navigate = useNavigate();
  const recipient = db.getRecipient(recipientId || "");
  
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [category, setCategory] = useState(recipient?.category || "Other");
  const [duplicateWarning, setDuplicateWarning] = useState<any>(null);

  // Find previous successful payment for suggestions
  const prevPayment = db.getPayments().find(p => p.recipientId === recipientId && p.status === "SUCCESS");

  useEffect(() => {
    if (amount && recipientId) {
      const numAmount = parseInt(amount, 10);
      if (!isNaN(numAmount) && numAmount > 0) {
        const dup = db.checkDuplicate(recipientId, numAmount);
        setDuplicateWarning(dup);
      } else {
        setDuplicateWarning(null);
      }
    }
  }, [amount, recipientId]);

  if (!recipient) return <div>Recipient not found</div>;

  const handleReview = () => {
    const numAmount = parseInt(amount, 10);
    if (isNaN(numAmount) || numAmount <= 0) return;

    // Create a temporary draft object in session storage or pass via state
    const draft = {
      recipientId: recipient.id,
      amount: numAmount,
      reference,
      category
    };
    
    sessionStorage.setItem("current_draft", JSON.stringify(draft));
    navigate(`/review/draft`);
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC] dark:bg-slate-900 transition-colors">
      <TopBar title={`Pay ${recipient.nickname}`} />
      
      <div className="p-4 flex-1 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6 flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-slate-700 text-[#002970] dark:text-blue-400 flex items-center justify-center font-bold text-sm mr-3">
             {recipient.nickname.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{recipient.nickname}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{recipient.demoAddress}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 dark:text-gray-500">₹</span>
              <input
                type="number"
                className="block w-full pl-10 pr-4 py-4 text-2xl font-bold border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:border-[#00BAF2] focus:bg-white dark:focus:bg-slate-800 transition-colors"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            {prevPayment && !amount && (
              <button 
                onClick={() => setAmount(prevPayment.amount.toString())}
                className="mt-2 text-xs font-semibold text-[#00BAF2] dark:text-blue-400 bg-blue-50 dark:bg-slate-700 px-3 py-1.5 rounded-full hover:bg-blue-100 dark:hover:bg-slate-600"
              >
                Use previous amount {formatCurrency(prevPayment.amount)}
              </button>
            )}
          </div>

          {duplicateWarning && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/30 p-4 rounded-xl">
              <div className="flex items-start text-orange-800 dark:text-orange-400">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Looks similar to a recent payment</p>
                  <p className="text-xs mt-1 text-orange-700 dark:text-orange-300">
                    {formatCurrency(duplicateWarning.amount)} · {duplicateWarning.reference || 'No ref'}
                    <br/>
                    {formatDistanceToNow(duplicateWarning.createdAt, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <button 
                  onClick={() => navigate(`/payments/${duplicateWarning.id}`)}
                  className="flex-1 bg-white dark:bg-slate-800 border border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 py-2 rounded-lg text-xs font-bold"
                >
                  View previous
                </button>
                <button 
                  onClick={() => setDuplicateWarning(null)}
                  className="flex-1 bg-orange-100 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 py-2 rounded-lg text-xs font-bold"
                >
                  It's another payment
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
            <select
              className="block w-full px-3 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:border-[#00BAF2]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {["Delivery", "Packaging", "Inventory", "Utilities", "Other"].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment reference (optional)</label>
            <input
              type="text"
              className="block w-full px-4 py-3 border border-gray-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-700 dark:text-white focus:outline-none focus:border-[#00BAF2] focus:bg-white dark:focus:bg-slate-800"
              placeholder="Example: Delivery 124"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Added by you to help find this payment later.</p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500">DEMO — No money moved</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700 p-4 sticky bottom-0 z-40 transition-colors">
        <button 
          onClick={handleReview}
          disabled={!amount || parseInt(amount) <= 0}
          className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold shadow-sm text-lg disabled:opacity-50"
        >
          Review payment
        </button>
      </div>
    </div>
  );
};
