import React, { useState } from "react";
import { TopBar } from "../components/UI";
import { db } from "../lib/db";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

import { useTheme } from "../components/ThemeProvider";

export const DemoControlPanel = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState(db.getSession());
  const { theme, setTheme } = useTheme();

  const handleReset = () => {
    if (confirm("Reset all demo data to seed state?")) {
      db.reset();
      setSession(db.getSession());
      alert("Demo data reset.");
    }
  };

  const handleFeeScenario = (scenario: any) => {
    const s = db.getSession();
    s.feeScenario = scenario;
    db.saveSession(s);
    setSession(s);
  };

  const resolvePending = (status: "SUCCESS" | "FAILED") => {
    const payments = db.getPayments();
    const pending = payments.find(p => p.status === "PENDING");
    if (pending) {
      db.updatePaymentStatus(pending.id, status, status === "SUCCESS" ? `DEMO-PAY-${Math.floor(Math.random() * 100000)}` : undefined);
      alert(`First pending payment marked as ${status}.`);
      setSession(db.getSession());
    } else {
      alert("No pending payments found.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC] dark:bg-slate-900 transition-colors">
      <TopBar title="Demo controls" />
      
      <div className="p-4 flex-1 overflow-y-auto pb-24">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-4 rounded-xl mb-6">
          <div className="flex items-start text-red-800 dark:text-red-400">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Demo controls — not part of product</p>
              <p className="text-xs mt-1 text-red-700 dark:text-red-300">
                Use these buttons to simulate backend outcomes during presentation.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Appearance</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => setTheme("light")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold ${theme === 'light' ? 'bg-[#00BAF2] text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}
              >
                Light
              </button>
              <button 
                onClick={() => setTheme("dark")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold ${theme === 'dark' ? 'bg-[#00BAF2] text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}
              >
                Dark
              </button>
              <button 
                onClick={() => setTheme("system")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold ${theme === 'system' ? 'bg-[#00BAF2] text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'}`}
              >
                System
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">Data & State</h3>
            <button 
              onClick={handleReset}
              className="w-full bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset demo to seed data
            </button>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Resolve Pending</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => resolvePending("SUCCESS")}
                className="flex-1 bg-green-50 border border-green-200 text-green-700 py-2.5 rounded-lg text-sm font-bold"
              >
                Pending → Success
              </button>
              <button 
                onClick={() => resolvePending("FAILED")}
                className="flex-1 bg-red-50 border border-red-200 text-red-700 py-2.5 rounded-lg text-sm font-bold"
              >
                Pending → Failed
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Fee Scenario</h3>
            <p className="text-xs text-gray-500 mb-2">Controls what fee info is shown on Review screen.</p>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg cursor-pointer">
                <input 
                  type="radio" 
                  name="fee" 
                  checked={session.feeScenario === "UNKNOWN"}
                  onChange={() => handleFeeScenario("UNKNOWN")}
                  className="w-4 h-4 text-[#00BAF2]"
                />
                <span className="text-sm font-medium">Unknown fee policy</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg cursor-pointer">
                <input 
                  type="radio" 
                  name="fee" 
                  checked={session.feeScenario === "SIMULATED_ZERO"}
                  onChange={() => handleFeeScenario("SIMULATED_ZERO")}
                  className="w-4 h-4 text-[#00BAF2]"
                />
                <span className="text-sm font-medium">Simulated ₹0 fee</span>
              </label>
              <label className="flex items-center space-x-3 p-3 border border-gray-100 rounded-lg cursor-pointer">
                <input 
                  type="radio" 
                  name="fee" 
                  checked={session.feeScenario === "SIMULATED_FEE"}
                  onChange={() => handleFeeScenario("SIMULATED_FEE")}
                  className="w-4 h-4 text-[#00BAF2]"
                />
                <span className="text-sm font-medium">Fee-bearing scenario</span>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
            <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Case Study</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate("/research")}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-bold"
              >
                Research
              </button>
              <button 
                onClick={() => navigate("/metrics")}
                className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 py-2.5 rounded-lg text-sm font-bold"
              >
                Metrics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
