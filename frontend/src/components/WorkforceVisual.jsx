import React from 'react';
import { Diamond, Users, TrendingUp, Sparkles, CheckCircle2 } from 'lucide-react';

export const WorkforceVisual = ({ currentStep = 1 }) => {
  return (
    <div className="left-visual-panel rounded-3xl p-6 lg:p-8 flex flex-col justify-between relative overflow-hidden shadow-soft-xl border border-indigo-100/80">
      
      {/* Background Decorative Faint Curves & Geometric Dots */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-indigo-200/30 via-violet-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 w-64 h-64 bg-gradient-to-tr from-blue-200/30 via-indigo-100/20 to-transparent rounded-full blur-3xl pointer-events-none" />
      
      <div className="absolute top-12 right-8 opacity-20 pointer-events-none">
        <div className="grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
          ))}
        </div>
      </div>

      <div>
        {/* Top Tag */}
        <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
          <Diamond className="w-3.5 h-3.5 text-indigo-600 fill-indigo-200" />
          <span>Workforce Intelligence</span>
        </div>

        {/* Headline */}
        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 leading-[1.2] tracking-tight mb-4">
          Understand{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800">
            workforce risk
          </span>{' '}
          before it becomes turnover.
        </h2>

        {/* Sub-description */}
        <p className="text-slate-600 text-sm lg:text-base leading-relaxed font-normal mb-8 max-w-md">
          Turn employee signals into thoughtful, human-led retention conversations.
        </p>

        {/* Centerpiece SVG Illustration & Floating Analytics Badge */}
        <div className="relative my-4 flex justify-center items-center">
          
          {/* Vector Illustration Container */}
          <div className="w-full max-w-sm h-64 relative bg-gradient-to-b from-indigo-50/50 to-white/70 rounded-2xl border border-indigo-50/80 p-4 flex items-center justify-center shadow-inner overflow-hidden">
            
            {/* Soft Background Grid Chart */}
            <svg className="absolute inset-0 w-full h-full text-indigo-100/60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Workforce Data Illustration */}
            <img
              src="https://static.vecteezy.com/system/resources/previews/060/391/941/non_2x/office-worker-analyzing-data-with-charts-and-graphs-in-flat-illustration-vector.jpg"
              alt="Office worker analyzing workforce data"
              className="w-full h-full object-contain z-10 drop-shadow-sm"
            />

            {/* Floating Analytics Card Inspired by Reference Image */}
            <div className="absolute top-3 right-3 bg-slate-900/90 text-white p-3 rounded-2xl shadow-xl backdrop-blur-md border border-slate-700/50 w-44 transform hover:scale-105 transition-transform duration-300 pointer-events-none">
              <div className="flex items-center justify-between text-[10px] font-semibold text-slate-300 mb-1">
                <span>Retention Signals</span>
                <span className="bg-indigo-500/30 text-indigo-300 px-1.5 py-0.5 rounded text-[9px]">Live</span>
              </div>
              
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-extrabold text-white tracking-tight">82%</span>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />
                  +12%
                </span>
              </div>
              <p className="text-[9px] text-slate-400 mb-2">Engagement vs last quarter</p>

              {/* Decorative mini Sparkline Graph */}
              <div className="h-6 w-full flex items-end space-x-1">
                <div className="flex-1 bg-indigo-500/30 h-[30%] rounded-t-sm" />
                <div className="flex-1 bg-indigo-500/40 h-[45%] rounded-t-sm" />
                <div className="flex-1 bg-indigo-500/50 h-[40%] rounded-t-sm" />
                <div className="flex-1 bg-indigo-500/70 h-[70%] rounded-t-sm" />
                <div className="flex-1 bg-violet-400 h-[90%] rounded-t-sm relative">
                  <span className="absolute -top-1 right-0 w-2 h-2 bg-violet-300 rounded-full animate-ping" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Cards Grid (Bottom of Visual Panel) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
          <div className="bg-white/80 border border-indigo-100 p-3.5 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
              <Users className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">People-first signals</h4>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Focus on early indicators that matter.</p>
          </div>

          <div className="bg-white/80 border border-indigo-100 p-3.5 rounded-2xl shadow-xs hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-7 h-7 rounded-lg bg-violet-100 text-violet-600 flex items-center justify-center mb-2">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900">Earlier intervention</h4>
            <p className="text-[11px] text-slate-500 leading-tight mt-0.5">Take action early and improve retention.</p>
          </div>
        </div>
      </div>

      {/* Panel Footer Navigation Dots */}
      <div className="mt-6 pt-4 border-t border-indigo-100/60 flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>Currently viewing step {currentStep} of 2</span>
        <div className="flex items-center space-x-1.5">
          <div className={`h-2 rounded-full transition-all duration-300 ${currentStep === 1 ? 'w-5 bg-indigo-600' : 'w-2 bg-indigo-200'}`} />
          <div className={`h-2 rounded-full transition-all duration-300 ${currentStep === 2 ? 'w-5 bg-indigo-600' : 'w-2 bg-indigo-200'}`} />
        </div>
      </div>

    </div>
  );
};

export default WorkforceVisual;
