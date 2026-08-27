import React, { useState } from 'react';
import { Calendar, BarChart3, Briefcase, Building, UserCheck, Users, ArrowRight, Mail, Phone, Badge } from 'lucide-react';
import WorkforceVisual from '../components/WorkforceVisual';
import ProgressIndicator from '../components/ProgressIndicator';
import FormInput from '../components/FormInput';
import SelectField from '../components/SelectField';

const JOB_LEVEL_OPTIONS = [
  { value: 1, label: 'Level 1 — Entry Level' },
  { value: 2, label: 'Level 2 — Intermediate' },
  { value: 3, label: 'Level 3 — Senior' },
  { value: 4, label: 'Level 4 — Lead / Staff' },
  { value: 5, label: 'Level 5 — Executive' },
];

const JOB_ROLE_OPTIONS = [
  'Sales Executive',
  'Research Scientist',
  'Laboratory Technician',
  'Manufacturing Director',
  'Healthcare Representative',
  'Manager',
  'Sales Representative',
  'Research Director',
  'Human Resources',
];

export const EmployeeInformation = ({ formData, updateFormData, onNext }) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    const ageVal = Number(formData.Age);
    if (!formData.Age || isNaN(ageVal) || ageVal < 18 || ageVal > 80) {
      newErrors.Age = 'Please enter a valid age between 18 and 80.';
    }

    const incomeVal = Number(formData.MonthlyIncome);
    if (!formData.MonthlyIncome || isNaN(incomeVal) || incomeVal <= 0) {
      newErrors.MonthlyIncome = 'Monthly income must be greater than 0.';
    }

    const yrsCompany = Number(formData.YearsAtCompany);
    if (formData.YearsAtCompany === '' || isNaN(yrsCompany) || yrsCompany < 0) {
      newErrors.YearsAtCompany = 'Years at company cannot be negative.';
    }

    const yrsRole = Number(formData.YearsInCurrentRole);
    if (formData.YearsInCurrentRole === '' || isNaN(yrsRole) || yrsRole < 0) {
      newErrors.YearsInCurrentRole = 'Years in current role cannot be negative.';
    }

    const yrsMgr = Number(formData.YearsWithCurrManager);
    if (formData.YearsWithCurrManager === '' || isNaN(yrsMgr) || yrsMgr < 0) {
      newErrors.YearsWithCurrManager = 'Years with current manager cannot be negative.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      onNext();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Left Column: Visual Panel */}
      <div className="lg:col-span-5 flex flex-col">
        <WorkforceVisual currentStep={1} />
      </div>

      {/* Right Column: Employee Information Form Card */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card border border-slate-200/80 hover:shadow-soft-xl transition-shadow duration-300">
          
          {/* Progress Pathway Header */}
          <ProgressIndicator currentStep={1} />

          {/* Section Header */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>GENERAL INFORMATION</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Employee Information
            </h3>
            <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
              Enter the employee's basic and career details to begin the assessment.
            </p>
          </div>

          {/* Form Fields Grid */}
          <form onSubmit={handleContinue} className="space-y-5">
            <div className="border-b border-slate-100 pb-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-indigo-600">Personal & Contact Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput label="Employee Name" name="name" value={formData.name || ''} onChange={handleChange} icon={UserCheck} placeholder="Full name" required />
                <FormInput label="Employee ID" name="employeeId" value={formData.employeeId || ''} onChange={handleChange} icon={Badge} placeholder="EMP1005" required />
                <FormInput label="Email" name="email" type="email" value={formData.email || ''} onChange={handleChange} icon={Mail} placeholder="employee@example.com" required />
                <FormInput label="WhatsApp Number" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} icon={Phone} placeholder="+91 90000 00000" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Age"
                name="Age"
                type="number"
                value={formData.Age}
                onChange={handleChange}
                icon={Calendar}
                placeholder="29"
                error={errors.Age}
                required
                min={18}
                max={80}
              />

              <FormInput
                label="Monthly Income (₹)"
                name="MonthlyIncome"
                type="number"
                value={formData.MonthlyIncome}
                onChange={handleChange}
                 icon={() => <span className="text-sm font-medium">₹</span>} 
                placeholder="3500"
                helperText="Enter monthly salary"
                error={errors.MonthlyIncome}
                required
                min={1}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Job Level"
                name="JobLevel"
                value={formData.JobLevel}
                onChange={handleChange}
                options={JOB_LEVEL_OPTIONS}
                icon={BarChart3}
                required
              />

              <SelectField
                label="Job Role"
                name="JobRole"
                value={formData.JobRole}
                onChange={handleChange}
                options={JOB_ROLE_OPTIONS}
                icon={Briefcase}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormInput
                label="Years at Company"
                name="YearsAtCompany"
                type="number"
                value={formData.YearsAtCompany}
                onChange={handleChange}
                icon={Building}
                placeholder="2"
                error={errors.YearsAtCompany}
                required
                min={0}
              />

              <FormInput
                label="Years in Current Role"
                name="YearsInCurrentRole"
                type="number"
                value={formData.YearsInCurrentRole}
                onChange={handleChange}
                icon={UserCheck}
                placeholder="1"
                error={errors.YearsInCurrentRole}
                required
                min={0}
              />
            </div>

            <FormInput
              label="Years with Current Manager"
              name="YearsWithCurrManager"
              type="number"
              value={formData.YearsWithCurrManager}
              onChange={handleChange}
              icon={Users}
              placeholder="1"
              error={errors.YearsWithCurrManager}
              required
              min={0}
            />

            {/* Bottom Navigation Button */}
            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                className="group relative inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-700 hover:via-indigo-700 hover:to-violet-700 text-white text-sm sm:text-base font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default EmployeeInformation;
