import React from 'react';
import { ShieldCheck, Activity, User, ChevronDown } from 'lucide-react';

export const Header = () => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Side: Brand Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-4 ring-indigo-50 hover:scale-105 transition-transform duration-300">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Employee Attrition Intelligence
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">
              Workforce Risk & Retention Insights
            </p>
          </div>
        </div>

        {/* Right Side: Status Badge & Profile */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 bg-emerald-50/90 border border-emerald-200/80 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Model ready</span>
          </div>

          {/* HR Operations User Profile */}
          <div className="flex items-center space-x-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 pl-2 pr-3 py-1.5 rounded-2xl cursor-pointer transition-all duration-200 group">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shadow-xs group-hover:scale-105 transition-transform">
              <User className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-slate-800 leading-tight">HR Operations</p>
              <p className="text-[11px] text-slate-500 font-medium">Internal Personnel Portal</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
