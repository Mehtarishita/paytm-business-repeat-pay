import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn, formatCurrency } from "../lib/utils";
import { PaymentStatus } from "../lib/types";

export const TopBar = ({ title, showBack = true, onBack }: { title: string, showBack?: boolean, onBack?: () => void }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-slate-800 px-4 py-4 flex items-center sticky top-0 z-30 shadow-sm border-b border-gray-100 dark:border-slate-700">
      {showBack && (
        <button 
          onClick={onBack ? onBack : () => navigate(-1)} 
          className="mr-3 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Go back"
        >
          <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-slate-300" />
        </button>
      )}
      <h1 className="text-lg font-semibold text-[#1F2937] dark:text-white">{title}</h1>
    </div>
  );
};

export const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const config = {
    SUCCESS: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-800 dark:text-green-400", label: "SUCCESS" },
    PENDING: { bg: "bg-orange-100 dark:bg-orange-900/30", text: "text-orange-800 dark:text-orange-400", label: "PENDING" },
    FAILED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", label: "FAILED" },
    REVERSED: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-800 dark:text-red-400", label: "REVERSED" },
    PROCESSING: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-800 dark:text-blue-400", label: "PROCESSING" },
    DRAFT: { bg: "bg-gray-100 dark:bg-slate-700", text: "text-gray-800 dark:text-slate-300", label: "DRAFT" },
  };
  const current = config[status] || config.DRAFT;

  return (
    <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold tracking-wider", current.bg, current.text)}>
      {current.label}
    </span>
  );
};

export const PaymentCard = ({ 
  recipientName, 
  amount, 
  reference, 
  date, 
  status, 
  onClick 
}: { 
  recipientName: string, 
  amount: number, 
  reference?: string, 
  date: string, 
  status: PaymentStatus,
  onClick?: () => void 
}) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm flex justify-between items-start",
        onClick && "cursor-pointer active:scale-[0.98] transition-transform"
      )}
    >
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900 dark:text-white">{recipientName}</span>
        {reference && <span className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{reference}</span>}
        <span className="text-xs text-gray-400 dark:text-slate-500 mt-1.5">{date}</span>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-bold text-gray-900 dark:text-white text-base">{formatCurrency(amount)}</span>
        <div className="mt-2">
          <StatusBadge status={status} />
        </div>
      </div>
    </div>
  );
};
