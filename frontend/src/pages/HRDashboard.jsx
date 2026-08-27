import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import HRLayout from '../components/HRLayout';
import { getHRDashboard } from '../services/api';

export default function HRDashboard() {
  const { user } = useAuth();
  const { employees } = useApp();
  const [remote, setRemote] = useState(null);
  useEffect(() => { let active = true; const refresh = () => getHRDashboard().then((data) => active && setRemote(data)).catch(() => {}); refresh(); const timer = setInterval(refresh, 3000); return () => { active = false; clearInterval(timer); }; }, []);
  const mine = employees.filter((employee) => employee.selectedHrId === user.id);
  const pending = remote?.pending_reviews ?? mine.filter((employee) => employee.reviewStatus === 'Pending').length;
  const reviewed = remote?.reviewed ?? mine.filter((employee) => employee.reviewStatus === 'Reviewed').length;
  const risk = ['Low', 'Medium', 'High'].map((level) => [level, remote?.risk_distribution?.[level] ?? mine.filter((employee) => employee.risk === level).length]);
  const metrics = [['Total Employees', remote?.total_employees ?? employees.length], ['Submitted to Me', remote?.submitted_to_me ?? mine.length], ['Pending Reviews', pending], ['Reviewed', reviewed]];
  return <HRLayout><div className="mx-auto max-w-7xl px-5 py-8 lg:px-10"><p className="text-sm font-bold text-indigo-600">Overview</p><h1 className="mt-1 text-3xl font-black text-slate-950">HR Intelligence Dashboard</h1><p className="mt-2 text-sm text-slate-500">Monitor employee insights and manage attrition reviews.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(([label, value]) => <div className="border border-slate-200 bg-white p-5 shadow-sm" key={label}><p className="text-xs font-bold uppercase tracking-widest text-slate-400">{label}</p><p className="mt-3 text-3xl font-black text-slate-900">{value}</p></div>)}</div><div className="mt-8 grid gap-6 lg:grid-cols-2"><div className="border border-slate-200 bg-white p-6"><h2 className="font-extrabold text-slate-900">Risk distribution</h2><div className="mt-6 space-y-5">{risk.map(([label, count]) => <div key={label}><div className="mb-2 flex justify-between text-sm font-bold"><span>{label}</span><span className="text-slate-500">{count}</span></div><div className="h-2 rounded-full bg-slate-100"><div className={`h-2 rounded-full ${label === 'High' ? 'bg-rose-500' : label === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${count ? Math.max(count / Math.max(remote?.submitted_to_me ?? mine.length, 1) * 100, 8) : 0}%` }} /></div></div>)}</div></div><div className="border border-slate-200 bg-white p-6"><h2 className="font-extrabold text-slate-900">Review status</h2><div className="mt-6 grid grid-cols-3 gap-3">{['Pending', 'Under Review', 'Reviewed'].map((label) => <div className="bg-slate-50 p-4 text-center" key={label}><p className="text-2xl font-black text-slate-900">{remote?.review_status?.[label] ?? mine.filter((employee) => employee.reviewStatus === label).length}</p><p className="mt-1 text-xs font-bold text-slate-500">{label}</p></div>)}</div><Link to="/hr/employees" className="mt-7 inline-block text-sm font-bold text-indigo-600">Open review queue →</Link></div></div></div></HRLayout>;
}
