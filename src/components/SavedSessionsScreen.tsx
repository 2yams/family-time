import React, { useState, useEffect } from 'react';
import { 
  BookmarkCheck, 
  Trash2, 
  Edit3, 
  Calendar, 
  Clock, 
  Users, 
  Download, 
  ArrowLeft, 
  Sparkles, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Heart,
  Lightbulb
} from 'lucide-react';
import { SessionRecord } from '../types';
import { getSavedSessions, updateSessionTitle, deleteSession, clearAllSessions } from '../services/storageService';

interface SavedSessionsScreenProps {
  onBack: () => void;
  onStartNew: () => void;
}

export const SavedSessionsScreen: React.FC<SavedSessionsScreenProps> = ({
  onBack,
  onStartNew,
}) => {
  const [sessions, setSessions] = useState<SessionRecord[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTitleText, setNewTitleText] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setSessions(getSavedSessions());
  }, []);

  const handleStartRename = (session: SessionRecord) => {
    setEditingId(session.id);
    setNewTitleText(session.title);
  };

  const handleSaveRename = (id: string) => {
    if (newTitleText.trim()) {
      updateSessionTitle(id, newTitleText.trim());
      setSessions(getSavedSessions());
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this saved family session? This cannot be undone.')) {
      deleteSession(id);
      setSessions(getSavedSessions());
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to clear all saved sessions from this device?')) {
      clearAllSessions();
      setSessions([]);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `generation_gap_family_sessions_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs sm:text-sm font-bold text-[#57534E] hover:bg-[#F5EFE6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-black text-[#292524]">
            Saved Discoveries
          </h1>
          <p className="text-xs text-[#78716C]">
            Family sessions preserved safely on this device
          </p>
        </div>

        <div className="flex items-center gap-2">
          {sessions.length > 0 && (
            <button
              onClick={handleExportJson}
              className="p-2 rounded-xl bg-white border border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6] transition-colors"
              title="Export sessions to JSON file"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {sessions.length === 0 ? (
        <div className="p-10 sm:p-14 rounded-3xl bg-white border-2 border-[#E7DFD5] text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center text-2xl">
            📖
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-black text-[#292524]">
              No Saved Sessions Yet
            </h3>
            <p className="text-xs sm:text-sm text-[#78716C] max-w-sm mx-auto">
              Once you complete your first family perspective session, its shared discoveries and takeaways will appear here.
            </p>
          </div>
          <button
            onClick={onStartNew}
            className="px-6 py-2.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-sm shadow-xs transition-colors"
          >
            Start First Session
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#78716C] px-1 font-semibold">
            <span>{sessions.length} Saved Family Session{sessions.length !== 1 ? 's' : ''}</span>
            <button
              onClick={handleClearAll}
              className="text-red-500 hover:underline"
            >
              Clear All Saved
            </button>
          </div>

          <div className="space-y-3.5">
            {sessions.map((session) => {
              const isExpanded = expandedId === session.id;
              const dateFormatted = new Date(session.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={session.id}
                  className="p-5 rounded-3xl bg-white border-2 border-[#E7DFD5] space-y-3 shadow-xs transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="space-y-1 flex-1">
                      {editingId === session.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={newTitleText}
                            onChange={(e) => setNewTitleText(e.target.value)}
                            className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] border border-[#9333EA] font-black text-sm text-[#292524]"
                          />
                          <button
                            onClick={() => handleSaveRename(session.id)}
                            className="p-1 text-green-600 rounded"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base sm:text-lg text-[#292524]">
                            {session.title}
                          </h3>
                          <button
                            onClick={() => handleStartRename(session)}
                            className="p-1 text-stone-400 hover:text-stone-700"
                            title="Rename"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-xs text-[#78716C] flex-wrap">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          {dateFormatted}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#9333EA]" />
                          {session.participants.map((p) => p.name).join(', ')}
                        </span>
                        <span>•</span>
                        <span>{session.questionsData.length} Question{session.questionsData.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : session.id)}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8F5] border border-[#E7DFD5] text-xs font-bold text-[#57534E] hover:bg-[#F5EFE6] flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'View Discoveries'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleDelete(session.id)}
                        className="p-1.5 rounded-xl border border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEE2E2]"
                        title="Delete session"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Discoveries View */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-[#F5F2EB] space-y-3 animate-in fade-in duration-150">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        {/* Common ground */}
                        <div className="p-3.5 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] space-y-1.5">
                          <div className="font-bold text-[#6D28D9] flex items-center gap-1.5">
                            <Heart className="w-3.5 h-3.5 text-[#9333EA]" />
                            <span>Common Ground</span>
                          </div>
                          <ul className="space-y-1 text-[#4C1D95]">
                            {session.discoveries?.commonGround?.map((c, i) => (
                              <li key={i}>• {c}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Perspectives */}
                        <div className="p-3.5 rounded-2xl bg-[#E0F2FE] border border-[#BAE6FD] space-y-1.5">
                          <div className="font-bold text-[#0369A1] flex items-center gap-1.5">
                            <Lightbulb className="w-3.5 h-3.5 text-[#0284C7]" />
                            <span>New Perspectives</span>
                          </div>
                          <ul className="space-y-1 text-[#075985]">
                            {session.discoveries?.newPerspectives?.map((p, i) => (
                              <li key={i}>• {p}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Participant Takeaways */}
                      {session.discoveries?.customTakeaways?.length > 0 && (
                        <div className="p-3 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-xs space-y-1">
                          <div className="font-bold text-[#92400E]">Takeaways:</div>
                          <ul className="space-y-0.5 text-[#78350F]">
                            {session.discoveries.customTakeaways.map((t, i) => (
                              <li key={i}>• "{t}"</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
