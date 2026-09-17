import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Home, Users, ScrollText, Settings } from "lucide-react";
import { cn } from "../lib/utils";

const DemoBanner = () => (
  <div className="bg-[#002970] text-white text-xs font-semibold py-1.5 px-4 text-center tracking-wide sticky top-0 z-50">
    DEMO MODE • No money moved
  </div>
);

const BottomNav = () => {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "Home", to: "/business", icon: Home },
    { name: "Recipients", to: "/recipients", icon: Users },
    { name: "History", to: "/history", icon: ScrollText },
    { name: "Demo", to: "/demo", icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-safe z-40 max-w-md mx-auto transition-colors">
      <div className="flex justify-around items-center h-16">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = path.startsWith(link.to);
          return (
            <Link
              key={link.name}
              to={link.to}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
                isActive ? "text-[#00BAF2]" : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              )}
            >
              <Icon className="w-6 h-6 mb-1" strokeWidth={isActive ? 2.5 : 2} />
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export const Layout = ({ hideNav = false }: { hideNav?: boolean }) => {
  const location = useLocation();
  const path = location.pathname;

  const links = [
    { name: "Home", to: "/business", icon: Home },
    { name: "Recipients", to: "/recipients", icon: Users },
    { name: "History", to: "/history", icon: ScrollText },
    { name: "Demo", to: "/demo", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F5F9FC] font-sans flex flex-col md:flex-row justify-center md:px-4 md:py-6 lg:px-8 xl:gap-8">
      {/* Desktop Left Nav */}
      <div className="hidden md:flex flex-col w-64 flex-shrink-0 sticky top-6 h-[calc(100vh-3rem)]">
        <div className="mb-8 px-4">
          <h1 className="text-2xl font-extrabold text-[#002970] dark:text-blue-400 tracking-tight">PAYTM</h1>
          <div className="bg-[#002970] dark:bg-blue-400 dark:text-gray-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-full tracking-wider inline-block mt-1">
            BUSINESS DEMO
          </div>
        </div>
        
        <nav className="space-y-2 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = path.startsWith(link.to);
            return (
              <Link
                key={link.name}
                to={link.to}
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl font-medium transition-colors text-sm",
                  isActive 
                    ? "bg-blue-50 text-[#00BAF2] dark:bg-[#00BAF2]/20 dark:text-[#00BAF2]" 
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-[#00BAF2]" : "text-gray-400")} />
                {link.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="bg-blue-50 dark:bg-slate-800 border border-blue-100 dark:border-slate-700 p-4 rounded-xl mt-auto">
          <p className="text-xs font-bold text-[#002970] dark:text-blue-400 uppercase tracking-wide">Prototype Mode</p>
          <p className="text-xs text-[#002970]/80 dark:text-blue-200 mt-1">No real money moves.</p>
        </div>
      </div>

      {/* Main Mobile/Desktop Content Area */}
      <div className="w-full md:max-w-md lg:max-w-lg xl:max-w-xl bg-white dark:bg-slate-900 md:rounded-[2rem] md:shadow-xl md:border md:border-gray-100 dark:md:border-slate-800 min-h-screen md:min-h-0 md:h-[calc(100vh-3rem)] relative flex flex-col overflow-hidden transition-colors">
        <DemoBanner />
        <div className={cn("flex-1 overflow-y-auto pb-20 md:pb-6", hideNav && "pb-0 md:pb-0")}>
          <Outlet />
        </div>
        {!hideNav && (
          <div className="md:hidden">
            <BottomNav />
          </div>
        )}
      </div>
      
      {/* Desktop Right Context Area (Optional empty space for balance on XL screens) */}
      <div className="hidden xl:block w-72 flex-shrink-0 sticky top-6 h-[calc(100vh-3rem)]">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-slate-700 mb-4">
           <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wide mb-3">About this prototype</h3>
           <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">This is a case study prototype for the Paytm Innovation Challenge.</p>
           <p className="text-sm text-gray-600 dark:text-gray-400">It demonstrates a workflow for organising, tracking, and repeating outgoing business UPI payments.</p>
        </div>
      </div>
    </div>
  );
};
