import React, { useState } from 'react';
import Header from './components/Header';
import EmployeeInformation from './pages/EmployeeInformation';
import WorkExperience from './pages/WorkExperience';
import RiskResult from './components/RiskResult';
import { Lock } from 'lucide-react';

const INITIAL_FORM_DATA = {
  Age: 29,
  JobLevel: 1,
  JobSatisfaction: 3,
  EnvironmentSatisfaction: 3,
  JobInvolvement: 3,
  MonthlyIncome: 3500,
  OverTime: 'No',
  WorkLifeBalance: 3,
  YearsAtCompany: 2,
  YearsInCurrentRole: 1,
  YearsWithCurrManager: 1,
  JobRole: 'Sales Executive',
};

export function App() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [resultData, setResultData] = useState(null);
  const [hrDecision, setHrDecision] = useState(null);

  const updateFormData = (fields) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const handleNextStep = () => {
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevStep = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePredictionResult = (data) => {
    setResultData(data);
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveHRDecision = (decision) => {
    setHrDecision(decision);
  };

  const handleDeleteHRDecision = () => {
    setHrDecision(null);
  };

  const handleResetAssessment = () => {
    setFormData(INITIAL_FORM_DATA);
    setResultData(null);
    setHrDecision(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-ambient-pattern dot-pattern flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Enterprise Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        
        {step === 1 && (
          <EmployeeInformation
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNextStep}
          />
        )}

        {step === 2 && (
          <WorkExperience
            formData={formData}
            updateFormData={updateFormData}
            onBack={handlePrevStep}
            onResult={handlePredictionResult}
          />
        )}

        {step === 3 && resultData && (
          <RiskResult
            resultData={resultData}
            formData={formData}
            onReset={handleResetAssessment}
            hrDecision={hrDecision}
            onSaveHRDecision={handleSaveHRDecision}
            onDeleteHRDecision={handleDeleteHRDecision}
          />
        )}

      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200/60 bg-white/70 backdrop-blur-md py-4 px-4 text-center text-xs text-slate-500 font-medium mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Lock className="w-3.5 h-3.5 text-indigo-500" />
            <span>Your data is secure and used only for workforce analytics.</span>
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>© 2026 Employee Attrition Intelligence</span>
            <span>•</span>
            <span className="hover:text-slate-600 transition-colors">Privacy & Security</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
