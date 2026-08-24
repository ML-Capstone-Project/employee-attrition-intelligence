import React, { useState } from 'react';
import { ArrowLeft, Sparkles, AlertCircle, RefreshCw, Layers } from 'lucide-react';
import WorkforceVisual from '../components/WorkforceVisual';
import ProgressIndicator from '../components/ProgressIndicator';
import RatingSelector from '../components/RatingSelector';
import { predictAttrition } from '../services/api';

const RATING_1_TO_4 = [
  { value: 1, label: 'Low' },
  { value: 2, label: 'Medium' },
  { value: 3, label: 'High' },
  { value: 4, label: 'Very High' },
];

const WORK_LIFE_OPTIONS = [
  { value: 1, label: 'Bad' },
  { value: 2, label: 'Good' },
  { value: 3, label: 'Better' },
  { value: 4, label: 'Best' },
];

const OVERTIME_OPTIONS = [
  { value: 'No', label: 'Standard Hours' },
  { value: 'Yes', label: 'Frequently / Required' },
];

export const WorkExperience = ({ formData, updateFormData, onBack, onResult }) => {
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      const response = await predictAttrition(formData);
      onResult(response);
    } catch (err) {
      console.error('Error fetching prediction from Flask API:', err);
      const errMsg = err.response?.data?.error || 'Unable to connect to the prediction server. Please make sure the Flask backend is running.';
      setApiError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      
      {/* Left Column: Visual Panel (Step 2 active) */}
      <div className="lg:col-span-5 flex flex-col">
        <WorkforceVisual currentStep={2} />
      </div>

      {/* Right Column: Work Experience Form Card */}
      <div className="lg:col-span-7">
        <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-card border border-slate-200/80 hover:shadow-soft-xl transition-shadow duration-300">
          
          {/* Progress Indicator */}
          <ProgressIndicator currentStep={2} />

          {/* Section Header & Back Button */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>WORKPLACE & SATISFACTION</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Work Experience & Satisfaction
              </h3>
            </div>

            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50/50 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>

          {/* API Error Notification (if backend is offline or returns an error) */}
          {apiError && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm font-medium">
                <p className="font-bold text-rose-900">Backend Connection Notice</p>
                <p className="mt-0.5 text-rose-700">{apiError}</p>
                <p className="mt-1 text-[11px] text-rose-600 font-semibold">
                  Make sure your Flask server is running at <code>http://localhost:5000</code> with route <code>POST /predict</code>.
                </p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <RatingSelector
              label="Job Satisfaction"
              name="JobSatisfaction"
              value={formData.JobSatisfaction}
              onChange={handleChange}
              options={RATING_1_TO_4}
              description="Rate overall contentment with current job role"
              required
            />

            <RatingSelector
              label="Environment Satisfaction"
              name="EnvironmentSatisfaction"
              value={formData.EnvironmentSatisfaction}
              onChange={handleChange}
              options={RATING_1_TO_4}
              description="Rate physical and cultural workplace environment"
              required
            />

            <RatingSelector
              label="Job Involvement"
              name="JobInvolvement"
              value={formData.JobInvolvement}
              onChange={handleChange}
              options={RATING_1_TO_4}
              description="Degree of active engagement & participation"
              required
            />

            <RatingSelector
              label="Work-Life Balance"
              name="WorkLifeBalance"
              value={formData.WorkLifeBalance}
              onChange={handleChange}
              options={WORK_LIFE_OPTIONS}
              description="Personal life vs work commitment equilibrium"
              required
            />

            <RatingSelector
              label="Overtime Frequency"
              name="OverTime"
              value={formData.OverTime}
              onChange={handleChange}
              options={OVERTIME_OPTIONS}
              description="Does the employee regularly work overtime?"
              required
            />

            {/* Bottom Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={onBack}
                className="text-xs sm:text-sm font-extrabold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                ← Back to Employee Profile
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex items-center space-x-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 hover:from-indigo-700 hover:to-violet-800 text-white text-sm sm:text-base font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer ${
                  loading ? 'opacity-80 cursor-wait' : ''
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Assessing employee profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-indigo-200" />
                    <span>Assess Attrition Risk</span>
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
};

export default WorkExperience;
