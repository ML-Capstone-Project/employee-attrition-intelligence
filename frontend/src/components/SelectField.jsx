import React from 'react';
import { ChevronDown } from 'lucide-react';

export const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
  icon: Icon,
  error,
  required = false,
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label htmlFor={name} className="text-xs sm:text-sm font-bold text-slate-800 flex items-center justify-between">
        <span>
          {label} {required && <span className="text-violet-600 font-bold">*</span>}
        </span>
      </label>

      <div className="relative rounded-2xl group">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className={`custom-input w-full appearance-none ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-10 py-3 rounded-2xl text-sm text-slate-900 font-medium cursor-pointer ${
            error
              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-slate-200'
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>

        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-hover:text-indigo-600 transition-colors">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && (
        <p className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1">
          <span>•</span> {error}
        </p>
      )}
    </div>
  );
};

export default SelectField;
