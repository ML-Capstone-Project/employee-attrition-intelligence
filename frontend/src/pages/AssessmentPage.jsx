import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import EmployeeInformation from './EmployeeInformation';
import WorkExperience from './WorkExperience';
import SelectField from '../components/SelectField';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { HR_ACCOUNTS } from '../data/mockData';
import { submitAssessment } from '../services/api';

const INITIAL = { Age: 29, JobLevel: 1, JobSatisfaction: 3, EnvironmentSatisfaction: 3, JobInvolvement: 3, MonthlyIncome: 3500, OverTime: 'No', WorkLifeBalance: 3, YearsAtCompany: 2, YearsInCurrentRole: 1, YearsWithCurrManager: 1, JobRole: 'Sales Executive' };
const ML_KEYS = Object.keys(INITIAL);

export default function AssessmentPage() {
  const { user } = useAuth();
  const { addEmployee } = useApp();
  const [formData, setFormData] = useState({ ...INITIAL, name: user.name, employeeId: user.employeeId, email: user.email, whatsapp: user.whatsapp || '' });
  const [step, setStep] = useState(1);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [hrId, setHrId] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const update = (fields) => setFormData((current) => ({ ...current, ...fields }));

  const submit = async () => {
    const hr = HR_ACCOUNTS.find((item) => item.id === hrId);
    setError('');
    try {
      const features = Object.fromEntries(ML_KEYS.map((key) => [key, key === 'OverTime' || key === 'JobRole' ? formData[key] : Number(formData[key])]));
      await submitAssessment({ selected_hr_id: hr.id, features });
      addEmployee({ ...formData, id: formData.employeeId, selectedHrId: hr.id, hrName: hr.name, submissionStatus: 'Submitted', reviewStatus: 'Pending', decision: null, note: '' });
      setSent(true);
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to submit assessment.');
    }
  };

  if (sent) return <main className="min-h-screen bg-slate-50 px-5 py-16"><div className="mx-auto max-w-xl border border-emerald-200 bg-white p-8 shadow-card"><p className="text-sm font-bold uppercase tracking-widest text-emerald-600">Assessment submitted successfully.</p><h1 className="mt-3 text-2xl font-black text-slate-950">Your assessment has been sent to {HR_ACCOUNTS.find((item) => item.id === hrId)?.name}.</h1><Link to="/employee/dashboard" className="mt-7 inline-block rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white">Go to dashboard</Link></div></main>;
  return <main className="min-h-screen bg-slate-50 px-4 py-8"><div className="mx-auto max-w-7xl">{!assessmentComplete ? (step === 1 ? <EmployeeInformation formData={formData} updateFormData={update} onNext={() => setStep(2)} /> : <WorkExperience formData={formData} updateFormData={update} onBack={() => setStep(1)} onAssessmentComplete={() => setAssessmentComplete(true)} />) : <div className="mx-auto max-w-lg border border-slate-200 bg-white p-7 shadow-card"><p className="text-sm font-bold uppercase tracking-widest text-indigo-600">Assessment ready to submit</p><h1 className="mt-2 text-2xl font-black text-slate-950">Select an HR to review your assessment</h1><p className="mt-2 text-sm text-slate-500">Your assessment will be securely analyzed by the backend after you choose an HR.</p><div className="mt-6"><SelectField label="Selected HR" name="hrId" value={hrId} onChange={(event) => setHrId(event.target.value)} options={HR_ACCOUNTS.map((item) => ({ value: item.id, label: `${item.name} — HR` }))} required /></div>{error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">{error}</p>}<button disabled={!hrId} onClick={submit} className="mt-6 w-full rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white disabled:opacity-50">Send Assessment</button></div>}</div></main>;
}
