import React from 'react';

export const RatingSelector = ({
  label,
  name,
  value,
  onChange,
  options = [],
  description,
  required = false,
}) => {
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
        <label className="text-xs sm:text-sm font-bold text-slate-800">
          {label} {required && <span className="text-violet-600 font-bold">*</span>}
        </label>
        {description && (
          <span className="text-xs text-slate-400 font-normal">{description}</span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {options.map((opt) => {
          const optValue = opt.value !== undefined ? opt.value : opt;
          const optLabel = opt.label || opt;
          const isSelected = String(value) === String(optValue);

          return (
            <button
              key={String(optValue)}
              type="button"
              onClick={() => onChange({ target: { name, value: optValue } })}
              className={`py-3 px-3 rounded-2xl text-xs sm:text-sm font-semibold flex flex-col items-center justify-center space-y-0.5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'rating-pill-active scale-[1.02]'
                  : 'rating-pill text-slate-700 hover:text-indigo-900'
              }`}
            >
              <span className="font-extrabold">{optValue}</span>
              <span className={`text-[11px] ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                {optLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSelector;
