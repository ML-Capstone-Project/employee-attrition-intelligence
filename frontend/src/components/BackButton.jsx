import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BackButton({ to, children = 'Back' }) {
  const navigate = useNavigate();
  return <button type="button" onClick={() => (to ? navigate(to) : navigate(-1))} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-indigo-600"><ArrowLeft size={16} />{children}</button>;
}