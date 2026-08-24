import React from 'react';

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  icon: Icon,
  placeholder,
  error,
  helperText,
  required = false,
  min,
  max,
  step,
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

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`custom-input w-full ${
            Icon ? 'pl-10' : 'pl-4'
          } pr-4 py-3 rounded-2xl text-sm text-slate-900 font-medium placeholder-slate-400 ${
            error
              ? 'border-rose-400 bg-rose-50/20 focus:border-rose-500 focus:ring-rose-500/10'
              : 'border-slate-200'
          }`}
        />
      </div>

      {error ? (
        <p className="text-xs font-semibold text-rose-500 flex items-center gap-1 mt-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-[11px] font-medium text-slate-400 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
