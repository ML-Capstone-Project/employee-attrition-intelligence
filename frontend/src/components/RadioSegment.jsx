import React from 'react';

export const RadioSegment = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ],
  error,
  helperText,
  required = false,
}) => {
  return (
    <div className="flex flex-col space-y-1.5">
      <label className="block text-sm font-medium text-hr-dark">
        {label}
        {required && <span className="text-red-600 ml-1" aria-hidden="true">*</span>}
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex items-center justify-center text-center min-h-12 py-2 px-2 text-xs font-medium rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-hr-primary-light text-hr-primary shadow-hr-sm border-hr-primary font-semibold'
                  : 'bg-slate-50/70 text-hr-muted border-hr-border hover:text-hr-dark hover:bg-indigo-50/60 hover:border-indigo-200 hover:-translate-y-0.5 hover:shadow-hr-sm'
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={onChange}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>

      {helperText && !error && (
        <p className="text-xs text-hr-light">
          {helperText}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-600"></span>
          {error}
        </p>
      )}
    </div>
  );
};

export default RadioSegment;
