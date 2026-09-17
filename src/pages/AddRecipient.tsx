import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { db } from "../lib/db";
import { TopBar } from "../components/UI";

const CATEGORIES = ["Delivery", "Packaging", "Inventory", "Utilities", "Other"];

export const AddRecipient = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("Delivery");
  const [step, setStep] = useState<"INPUT" | "CHECKING" | "VERIFIED" | "ERROR">("INPUT");

  const handleCheck = () => {
    if (!nickname || !address) return;
    
    setStep("CHECKING");
    setTimeout(() => {
      if (address.includes("@demo")) {
        setStep("VERIFIED");
      } else {
        setStep("ERROR");
      }
    }, 1000);
  };

  const handleSave = () => {
    const newRec = db.addRecipient({
      nickname,
      demoAddress: address,
      accountName: nickname + " Services",
      category,
    });
    navigate(`/recipients/${newRec.id}`, { replace: true });
  };

  return (
    <div className="flex flex-col h-full bg-[#F5F9FC]">
      <TopBar title="Add business contact" />
      
      <div className="p-4 flex-1">
        {step === "INPUT" || step === "CHECKING" || step === "ERROR" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact nickname</label>
              <input
                type="text"
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#00BAF2]"
                placeholder="Example: Ravi Delivery"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Demo payment address</label>
              <input
                type="text"
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#00BAF2]"
                placeholder="example@demo"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="block w-full px-3 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-[#00BAF2]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {step === "ERROR" && (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                This recipient is not available in the demo. Ensure address ends with @demo.
              </div>
            )}

            <button 
              onClick={handleCheck}
              disabled={!nickname || !address || step === "CHECKING"}
              className="w-full mt-6 bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold shadow-sm disabled:opacity-50"
            >
              {step === "CHECKING" ? "Checking..." : "Check recipient"}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-green-100 shadow-sm">
              <div className="flex items-center text-green-700 mb-4 font-semibold">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Demo recipient found
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account holder</p>
                  <p className="font-semibold text-gray-900">{nickname} Services</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Payment address</p>
                  <p className="font-medium text-gray-900">{address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Nickname</p>
                  <p className="font-medium text-gray-900">{nickname}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Category</p>
                  <p className="font-medium text-gray-900">{category}</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full bg-[#00BAF2] text-white py-3.5 rounded-xl font-bold shadow-sm"
            >
              Save contact
            </button>
            <button 
              onClick={() => setStep("INPUT")}
              className="w-full bg-white text-gray-600 border border-gray-200 py-3.5 rounded-xl font-bold"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
