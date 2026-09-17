import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";
import { db } from "../lib/db";
import { Recipient } from "../lib/types";
import { TopBar } from "../components/UI";
import { isToday, format } from "date-fns";

export const Recipients = () => {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setRecipients(db.getRecipients());
  }, []);

  const filtered = recipients.filter((r) => 
    r.nickname.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title="Business contacts" />
      
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="text-sm text-gray-500 mb-4">Your regular payment recipients</p>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#00BAF2] focus:border-[#00BAF2] sm:text-sm"
            placeholder="Search contacts"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button 
          onClick={() => navigate("/recipients/new")}
          className="w-full mb-6 bg-blue-50 border border-blue-100 text-[#002970] py-3 rounded-xl font-semibold shadow-sm flex justify-center items-center active:scale-[0.98] transition-transform"
        >
          <Plus className="w-5 h-5 mr-1 text-[#00BAF2]" />
          Add business contact
        </button>

        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 font-medium">No business contacts yet</p>
              <p className="text-sm text-gray-400 mt-1">Save regular recipients to pay them faster.</p>
            </div>
          ) : (
            filtered.map((rec) => {
              const recPayments = db.getPayments().filter(p => p.recipientId === rec.id && p.status === "SUCCESS");
              const lastPayment = recPayments[0];
              
              let lastPaidText = "No payments yet";
              if (lastPayment) {
                lastPaidText = `Last paid ₹${lastPayment.amount} · ${
                  isToday(lastPayment.createdAt) ? "Today" : format(lastPayment.createdAt, "MMM d")
                }`;
              }

              return (
                <div 
                  key={rec.id}
                  onClick={() => navigate(`/recipients/${rec.id}`)}
                  className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
                >
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-bold text-gray-900">{rec.nickname}</h3>
                      <p className="text-xs text-gray-500">{rec.category}</p>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/pay/${rec.id}`);
                      }}
                      className="text-xs font-semibold text-[#00BAF2] bg-blue-50 px-3 py-1.5 rounded-full"
                    >
                      Pay Again
                    </button>
                  </div>
                  <div className="mt-3 text-sm text-gray-600 font-medium">
                    {rec.demoAddress}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {lastPaidText}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  );
};
