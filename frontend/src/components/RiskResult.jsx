import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  UserCheck,
  Building2,
  Clock,
  Heart,
  Smile,
  Sparkles,
} from 'lucide-react';
import HRReview from './HRReview';

export const RiskResult = ({
  resultData,
  formData,
  onReset,
  hrDecision,
  onSaveHRDecision,
  onDeleteHRDecision,
}) => {
  if (!resultData) return null;

  // Extract raw backend fields safely
  const rawAttrition = String(resultData.attrition || 'No').trim();
  const isLikelyToLeave =
    rawAttrition.toLowerCase() === 'yes' ||
    rawAttrition.toLowerCase() === 'likely to leave';

  // Format probability (handles float 0.784 or number 78.4)
  let rawProb = Number(resultData.probability || 0);

  if (rawProb > 0 && rawProb <= 1) {
    rawProb = rawProb * 100;
  }

  const formattedProbability = rawProb.toFixed(1);

  // Risk category mapping
  const riskLevel = String(resultData.risk || 'Low').trim();
  const riskLower = riskLevel.toLowerCase();

  let riskTheme = {
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cardBg:
      'bg-gradient-to-br from-emerald-50/70 via-white to-emerald-50/30 border-emerald-200/80 shadow-emerald-500/5',
    circleStroke: '#10b981',
    textGradient: 'from-emerald-700 to-teal-800',
    icon: CheckCircle2,
    attritionText: 'Likely to Stay',
    subtext:
      'Employee signals demonstrate high stability and strong retention probability.',
  };

  if (riskLower === 'high') {
    riskTheme = {
      badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
      cardBg:
        'bg-gradient-to-br from-rose-50/70 via-white to-rose-50/30 border-rose-200/80 shadow-rose-500/5',
      circleStroke: '#f43f5e',
      textGradient: 'from-rose-700 to-red-800',
      icon: AlertTriangle,
      attritionText: 'Likely to Leave',
      subtext:
        'Significant early warning signals detected. Proactive retention dialogue recommended.',
    };
  } else if (riskLower === 'medium') {
    riskTheme = {
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      cardBg:
        'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 border-amber-200/80',
      circleStroke: '#f59e0b',
      textGradient: 'from-amber-700 to-yellow-800',
      icon: AlertCircle,
      attritionText: isLikelyToLeave
        ? 'Likely to Leave'
        : 'Likely to Stay',
      subtext:
        'Moderate workforce indicators suggest potential attrition vulnerability.',
    };
  }

  const RiskIcon = riskTheme.icon;

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Top Banner Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ATTRITION RISK ASSESSMENT</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Attrition Risk Assessment
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
            Machine learning assessment based on the submitted employee profile.
          </p>
        </div>

        <button
          onClick={onReset}
          className="inline-flex items-center space-x-2 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold border border-slate-200 transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Assessment</span>
        </button>
      </div>

      {/* Main Prediction Output Card */}
      <div
        className={`rounded-3xl p-6 sm:p-8 border ${riskTheme.cardBg} transition-all duration-300`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column */}
          <div className="lg:col-span-7 space-y-4">

            <div className="flex flex-wrap items-center gap-3">

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold border ${riskTheme.badgeBg} uppercase tracking-wider flex items-center gap-1.5`}
              >
                <RiskIcon className="w-4 h-4" />
                <span>{riskLevel} Risk</span>
              </span>

              <span
                className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
                  isLikelyToLeave
                    ? 'bg-rose-100 text-rose-900 border border-rose-200'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                }`}
              >
                Attrition:{' '}
                {isLikelyToLeave
                  ? 'Likely to Leave'
                  : 'Likely to Stay'}
              </span>

            </div>

            <h3
              className={`text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${riskTheme.textGradient}`}
            >
              {isLikelyToLeave
                ? 'Likely to Leave'
                : 'Likely to Stay'}{' '}
              — {riskLevel} Risk Level
            </h3>

            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              {riskTheme.subtext}
            </p>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/60">

              <div className="bg-white/90 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  ML Prediction
                </span>

                <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 block">
                  {rawAttrition}
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Calculated Prob
                </span>

                <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 block">
                  {formattedProbability}%
                </span>
              </div>

              <div className="bg-white/90 p-3 rounded-2xl border border-slate-100 text-center">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Model Category
                </span>

                <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 block">
                  {riskLevel}
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Probability Meter */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-white/90 rounded-2xl border border-slate-200/80 shadow-xs">

            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Attrition Probability Gauge
            </span>

            <div className="relative w-40 h-40 flex items-center justify-center my-2">

              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-slate-100"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                />

                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={riskTheme.circleStroke}
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    251.2 - (251.2 * rawProb) / 100
                  }
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute flex flex-col items-center justify-center text-center">

                <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {formattedProbability}%
                </span>

                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  Probability
                </span>

              </div>
            </div>

            <p className="text-[11px] text-slate-400 text-center font-medium mt-1">
              Backend ML response from <code>POST /predict</code>
            </p>

          </div>
        </div>
      </div>

      {/* Employee Profile Used for Assessment */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 space-y-4">

        <h4 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-indigo-600" />
          <span>Employee Profile Used for Assessment</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">

          {/* Job Role */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Job Role
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
              {formData.JobRole || 'N/A'}
            </span>
          </div>

          {/* Job Level */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Job Level
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Level {formData.JobLevel || '1'}
            </span>
          </div>

          {/* Monthly Income - ₹ */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">

            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Monthly Income
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1">

              {/* Indian Rupee Symbol */}
              <span className="text-sm font-bold text-emerald-600">
                ₹
              </span>

              {Number(formData.MonthlyIncome || 0).toLocaleString()}

            </span>
          </div>

          {/* Overtime */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">

            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Overtime
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-violet-500" />

              {formData.OverTime === 'Yes'
                ? 'Yes (Frequently)'
                : 'No (Standard)'}
            </span>
          </div>

          {/* Job Satisfaction */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">

            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Job Satisfaction
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-amber-500" />

              Score: {formData.JobSatisfaction} / 4
            </span>
          </div>

          {/* Environment Satisfaction */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">

            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Environment Sat.
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800">
              Score: {formData.EnvironmentSatisfaction} / 4
            </span>
          </div>

          {/* Work-Life Balance */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">

            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Work-Life Balance
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />

              Score: {formData.WorkLifeBalance} / 4
            </span>
          </div>

          {/* Years at Company */}
          <div className="bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">

            <span className="text-[11px] font-bold text-slate-400 block mb-1">
              Years at Company
            </span>

            <span className="text-xs sm:text-sm font-bold text-slate-800">
              {formData.YearsAtCompany} years
            </span>
          </div>

        </div>
      </div>

      {/* HR REVIEW & DECISION SECTION */}
      <HRReview
        hrDecision={hrDecision}
        onSaveDecision={onSaveHRDecision}
        onDeleteDecision={onDeleteHRDecision}
      />

    </div>
  );
};

export default RiskResult;