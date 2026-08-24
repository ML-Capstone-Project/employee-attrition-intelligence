import React, { useState } from 'react';
import {
  ShieldAlert,
  ClipboardList,
  CheckCircle,
  Trash2,
  AlertTriangle,
  FileText,
  UserCheck,
  Clock,
} from 'lucide-react';
import HRDecisionModal from './HRDecisionModal';

export const HRReview = ({ hrDecision, onSaveDecision, onDeleteDecision }) => {
  const [selectedAction, setSelectedAction] = useState('Keep Under Review');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const actionDescriptions = {
    'Keep Under Review': 'Monitor retention signals during regular HR check-ins.',
    'Mark for HR Follow-up': 'Schedule a one-to-one retention discussion.',
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-xs font-bold text-indigo-700">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-600" />
            <span>DECISION SUPPORT</span>
          </div>
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">HR Review</h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            "Machine learning supports the assessment, but the final workforce decision requires human review."
          </p>
        </div>
      </div>

      {/* Selectable HR Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option 1: Keep Under Review */}
        <div
          onClick={() => setSelectedAction('Keep Under Review')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
            selectedAction === 'Keep Under Review'
              ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-sm font-extrabold text-slate-900">1. Keep Under Review</h4>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedAction === 'Keep Under Review'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300'
              }`}
            >
              {selectedAction === 'Keep Under Review' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {actionDescriptions['Keep Under Review']}
          </p>
        </div>

        {/* Option 2: Mark for HR Follow-up */}
        <div
          onClick={() => setSelectedAction('Mark for HR Follow-up')}
          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
            selectedAction === 'Mark for HR Follow-up'
              ? 'border-indigo-600 bg-indigo-50/50 shadow-sm ring-2 ring-indigo-500/20'
              : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/60'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-sm font-extrabold text-slate-900">2. Mark for HR Follow-up</h4>
            <div
              className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                selectedAction === 'Mark for HR Follow-up'
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300'
              }`}
            >
              {selectedAction === 'Mark for HR Follow-up' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {actionDescriptions['Mark for HR Follow-up']}
          </p>
        </div>
      </div>

      {/* Record Decision Button (only if no decision is saved yet) */}
      {!hrDecision && (
        <div className="pt-2 flex justify-start">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center space-x-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <ClipboardList className="w-4 h-4" />
            <span>Record HR Decision</span>
          </button>
        </div>
      )}

      {/* SAVED HR DECISION REPORT CARD */}
      {hrDecision && (
        <div className="mt-6 p-5 sm:p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl shadow-xl border border-slate-800 space-y-4 relative animate-fade-in">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <CheckCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider block">
                  HR Decision Recorded
                </span>
                <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {hrDecision.timestamp ? new Date(hrDecision.timestamp).toLocaleString() : 'Just now'}
                </span>
              </div>
            </div>

            {/* DELETE BUTTON */}
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete HR Record</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Selected Action</span>
              <span className="font-extrabold text-indigo-300 text-sm">{hrDecision.action}</span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1">Reason</span>
              <span className="font-bold text-white text-xs sm:text-sm">{hrDecision.reason}</span>
            </div>
          </div>

          {hrDecision.notes && (
            <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
              <span className="text-[11px] font-bold text-slate-400 uppercase block mb-1 flex items-center gap-1">
                <FileText className="w-3 h-3 text-slate-400" />
                <span>Additional Notes</span>
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-normal italic">
                "{hrDecision.notes}"
              </p>
            </div>
          )}

        </div>
      )}

      {/* Record HR Decision Modal */}
      <HRDecisionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedAction={selectedAction}
        onSave={(modalData) => {
          onSaveDecision({
            action: selectedAction,
            reason: modalData.reason,
            notes: modalData.notes,
            timestamp: new Date().toISOString(),
          });
        }}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900">Delete this HR decision?</h4>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This action will remove the recorded HR decision from this assessment.
            </p>

            <div className="pt-2 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  onDeleteDecision();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default HRReview;
