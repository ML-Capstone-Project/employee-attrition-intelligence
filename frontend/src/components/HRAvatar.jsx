import React from 'react';

const colors = ['bg-indigo-100 text-indigo-700', 'bg-emerald-100 text-emerald-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700', 'bg-sky-100 text-sky-700'];
export default function HRAvatar({ user, size = 'h-10 w-10' }) {
  const initials = user?.name?.split(' ').map((part) => part[0]).join('').slice(0, 2) || 'HR';
  const color = colors[(Number(user?.id?.replace('HR', '')) || 1) - 1] || colors[0];
  return <div className={`${size} ${color} flex shrink-0 items-center justify-center rounded-xl text-sm font-black`} aria-label={`${user?.name || 'HR'} profile picture`}>{initials}</div>;
}