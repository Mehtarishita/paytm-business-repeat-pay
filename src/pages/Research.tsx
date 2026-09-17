import React from "react";
import { TopBar } from "../components/UI";
import { FileText } from "lucide-react";

export const Research = () => {
  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title="Why we built this" showBack={true} />
      
      <div className="p-4 flex-1 overflow-y-auto pb-24 space-y-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl">
          <p className="text-xs font-bold text-[#002970] uppercase tracking-wide">Research inputs will be replaced with actual VOC findings.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col justify-center">
            <span className="text-2xl font-extrabold text-[#00BAF2]">50</span>
            <span className="text-xs font-semibold text-gray-600 mt-1">merchant VOCs — coming from field research</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center flex flex-col justify-center">
            <span className="text-2xl font-extrabold text-[#00BAF2]">10+</span>
            <span className="text-xs font-semibold text-gray-600 mt-1">in-depth conversations</span>
          </div>
        </div>

        <div className="space-y-4">
          {[
            "Recurring payments are frequent enough to build a habit.",
            "Merchants struggle to retrieve or explain older payments.",
            "A better business-payment workflow could create a reason to choose Paytm."
          ].map((hyp, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-[10px] uppercase font-bold text-orange-500 tracking-wider mb-2">
                Hypothesis — Validation Required
              </div>
              <p className="font-semibold text-gray-900 text-sm">{hyp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
