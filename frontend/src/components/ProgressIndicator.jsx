import React from 'react';
import { Check } from 'lucide-react';

export const ProgressIndicator = ({ currentStep }) => {
  return (
    <div className="w-full mb-6 pb-6 border-b border-slate-100">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold tracking-wider text-indigo-600 uppercase">
          ASSESSMENT PATHWAY
        </span>
        <span className="text-xs font-bold text-slate-400 tracking-widest font-mono">
          0{currentStep} / 02
        </span>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Step 1 Pill */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentStep === 1
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-500/20'
                : 'bg-emerald-500 text-white'
            }`}
          >
            {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '01'}
          </div>
          <span
            className={`text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              currentStep === 1 ? 'text-indigo-950 font-bold' : 'text-slate-500'
            }`}
          >
            Employee profile
          </span>
        </div>

        {/* Connector Line */}
        <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500 ease-out"
            style={{ width: currentStep === 1 ? '50%' : '100%' }}
          />
        </div>

        {/* Step 2 Pill */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentStep === 2
                ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md shadow-indigo-500/20'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            02
          </div>
          <span
            className={`text-xs sm:text-sm font-semibold transition-colors duration-200 ${
              currentStep === 2 ? 'text-indigo-950 font-bold' : 'text-slate-400'
            }`}
          >
            Work experience
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
