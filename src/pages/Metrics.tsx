import React from "react";
import { TopBar } from "../components/UI";
import { Target, TrendingUp, ShieldCheck } from "lucide-react";

export const Metrics = () => {
  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title="Pilot success metrics" showBack={true} />
      
      <div className="p-4 flex-1 overflow-y-auto pb-24 space-y-6">
        
        <div>
          <div className="flex items-center mb-3">
            <Target className="w-5 h-5 text-[#00BAF2] mr-2" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Primary</h2>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm border-l-4 border-l-[#00BAF2]">
            <p className="font-semibold text-gray-900 text-sm">Incremental successful outgoing business UPI value per eligible merchant</p>
            <p className="text-xs text-gray-400 mt-2 font-mono">Target metric • Measured in pilot</p>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <TrendingUp className="w-5 h-5 text-gray-500 mr-2" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Secondary & Supporting</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {[
              "Paytm share of participating merchants' outgoing business UPI value",
              "Repeat business payers",
              "Payment completion rate",
              "Payment retrieval time",
              "Recipient follow-up frequency",
              "30-day retention"
            ].map((metric, i) => (
              <div key={i} className="p-4 border-b border-gray-50 last:border-0">
                <p className="font-semibold text-gray-800 text-sm">{metric}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center mb-3">
            <ShieldCheck className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Guardrails</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Duplicate payments",
              "Wrong recipient incidents",
              "Pending duration",
              "Privacy incidents",
              "Recipient refusal",
              "Support burden"
            ].map((g, i) => (
              <span key={i} className="bg-orange-50 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-orange-100">
                {g}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
