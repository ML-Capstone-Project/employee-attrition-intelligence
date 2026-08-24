import React, { useState } from 'react';
import { X, ClipboardList, FileText, CheckCircle } from 'lucide-react';

const REASON_OPTIONS = [
  'Performance concerns',
  'Attendance concerns',
  'Role redundancy',
  'Policy violation',
  'Business restructuring',
  'Employee resignation',
  'Other',
];

export const HRDecisionModal = ({ isOpen, onClose, onSave, selectedAction }) => {
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSave({
      reason,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Record HR Decision</h3>
              <p className="text-xs text-indigo-200 font-medium">
                Action: <strong className="text-white">{selectedAction || 'Keep Under Review'}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-2">
              Why is this employee being considered for review?
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {REASON_OPTIONS.map((opt) => {
                const isSelected = reason === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setReason(opt)}
                    className={`p-3 rounded-2xl text-xs font-semibold text-left border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-500/20 font-bold'
                        : 'border-slate-200 hover:border-indigo-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 ml-1" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Additional Notes</span>
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Confidential notes, retention discussion outline, or key context..."
              className="w-full custom-input p-3.5 rounded-2xl text-xs sm:text-sm text-slate-900 border border-slate-200 resize-none"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 to-violet-600 shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Save Decision
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default HRDecisionModal;
