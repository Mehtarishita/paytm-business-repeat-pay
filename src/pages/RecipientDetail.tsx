import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../lib/db";
import { TopBar, PaymentCard } from "../components/UI";
import { format } from "date-fns";

export const RecipientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipient = db.getRecipient(id || "");
  const payments = db.getPayments().filter(p => p.recipientId === id);

  if (!recipient) {
    return <div>Recipient not found</div>;
  }

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title={recipient.nickname} />
      
      <div className="p-4 flex-1 overflow-y-auto pb-24">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
          <div className="flex items-center space-x-3 mb-4">
             <div className="w-12 h-12 rounded-full bg-blue-50 text-[#002970] flex items-center justify-center font-bold text-lg">
                {recipient.nickname.substring(0, 2).toUpperCase()}
             </div>
             <div>
               <h2 className="text-lg font-bold text-gray-900">{recipient.nickname}</h2>
               <p className="text-sm text-gray-500">{recipient.category}</p>
             </div>
          </div>
          
          <div className="space-y-3 pt-3 border-t border-gray-50">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Account holder</p>
              <p className="text-sm font-medium text-gray-800">{recipient.accountName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Demo payment address</p>
              <p className="text-sm font-medium text-gray-800">{recipient.demoAddress}</p>
            </div>
          </div>
        </div>

        <h3 className="font-semibold text-gray-800 text-sm tracking-wide uppercase mb-3">Payment history</h3>
        
        <div className="space-y-3">
          {payments.length === 0 ? (
            <div className="text-center py-6 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-500 text-sm">No payments yet</p>
            </div>
          ) : (
            payments.map((payment) => (
              <PaymentCard 
                key={payment.id}
                recipientName={payment.reference || recipient.nickname} // Show reference prominently in history
                amount={payment.amount}
                date={format(payment.createdAt, "MMM d, yyyy")}
                status={payment.status}
                onClick={() => navigate(`/payments/${payment.id}`)}
              />
            ))
          )}
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0 z-40 pb-safe">
        <button 
          onClick={() => navigate(`/pay/${recipient.id}`)}
          className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold shadow-sm text-lg active:scale-[0.98] transition-transform"
        >
          Pay Again
        </button>
      </div>
    </div>
  );
};
