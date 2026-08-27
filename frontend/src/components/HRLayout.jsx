import React from 'react';
import { BarChart3, ClipboardList, LayoutDashboard, LogOut, UserRound, Users } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HRAvatar from './HRAvatar';

export default function HRLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const navigation = [[LayoutDashboard, 'Dashboard', '/hr/dashboard'], [Users, 'Employees', '/hr/employees'], [ClipboardList, 'Reviews', '/hr/employees'], [BarChart3, 'Risk Overview', '/hr/dashboard'], [UserRound, 'Profile', '/hr/profile']];
  return <div className="min-h-screen bg-slate-50 lg:flex"><aside className="w-full border-b border-slate-200 bg-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r"><div className="p-6"><Link to="/hr/profile" className="flex items-center gap-3"><HRAvatar user={user}/><div><p className="font-black text-slate-900">{user.name}</p><p className="text-xs text-slate-400">HR Operations</p></div></Link><nav className="mt-8 grid grid-cols-2 gap-1 lg:block lg:space-y-1">{navigation.map(([Icon,label,to])=>{const active=location.pathname===to||(label==='Reviews'&&location.pathname.startsWith('/hr/employees/'));return <Link key={label} to={to} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${active?'bg-indigo-50 text-indigo-700':'text-slate-600 hover:bg-slate-50 hover:text-indigo-700'}`}><Icon size={17}/>{label}</Link>;})}</nav><button onClick={()=>{logout();navigate('/');}} className="mt-6 flex items-center gap-3 px-3 py-2 text-sm font-bold text-slate-500"><LogOut size={17}/> Logout</button></div></aside><main className="min-w-0 flex-1"><header className="flex items-center justify-end border-b border-slate-200 bg-white px-5 py-3 lg:px-10"><Link to="/hr/profile" className="flex items-center gap-3"><HRAvatar user={user} size="h-9 w-9"/><span className="text-right"><strong className="block text-sm text-slate-800">{user.name}</strong><small className="text-xs text-slate-400">HR Manager</small></span></Link></header>{children}</main></div>;
}
