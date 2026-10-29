import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronRight, X, HeartHandshake, SkipForward } from 'lucide-react';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNotes?: (notes: { prompt: string; reflectionText?: string; completed: boolean }[]) => void;
}

const DEFAULT_PROMPTS = [
  'What surprised you about another person’s answer?',
  'What is something you understand better about their world now?',
  'Which perspective had you not considered before hearing them speak?',
  'What is one warm question you would like to ask them respectfully?',
];

export const ReflectionModal: React.FC<ReflectionModalProps> = ({
  isOpen,
  onClose,
  onSaveNotes,
}) => {
  const [completedPrompts, setCompletedPrompts] = useState<Record<number, boolean>>({});
  const [promptNotes, setPromptNotes] = useState<Record<number, string>>({});

  if (!isOpen) return null;

  const toggleComplete = (index: number) => {
    setCompletedPrompts((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleFinish = () => {
    if (onSaveNotes) {
      const records = DEFAULT_PROMPTS.map((prompt, i) => ({
        prompt,
        reflectionText: promptNotes[i] || undefined,
        completed: !!completedPrompts[i],
      }));
      onSaveNotes(records);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border-2 border-[#E7DFD5] max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-[#E7DFD5] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#292524]">
                Gentle Reflection Prompts
              </h3>
              <p className="text-xs text-[#78716C]">
                Take a moment to talk through one or more of these together
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-[#F5F2EB]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {DEFAULT_PROMPTS.map((prompt, index) => {
            const isCompleted = !!completedPrompts[index];
            return (
              <div
                key={index}
                className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                  isCompleted
                    ? 'bg-[#DCFCE7] border-[#86EFAC]'
                    : 'bg-[#FAF8F5] border-[#E7DFD5]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white border border-[#E7DFD5] text-xs font-black flex items-center justify-center text-[#57534E] shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-[#292524]">
                      {prompt}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleComplete(index)}
                    className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors ${
                      isCompleted
                        ? 'bg-[#15803D] text-white'
                        : 'bg-white border border-[#E7DFD5] text-[#57534E] hover:bg-[#F5EFE6]'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isCompleted ? 'Discussed' : 'Mark Done'}</span>
                  </button>
                </div>

                <input
                  type="text"
                  placeholder="Optional notes or takeaway from this reflection..."
                  value={promptNotes[index] || ''}
                  onChange={(e) =>
                    setPromptNotes({ ...promptNotes, [index]: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-xl bg-white border border-[#E7DFD5] text-xs text-[#292524] placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-[#9333EA]"
                />
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#E7DFD5]">
          <span className="text-xs text-[#78716C] italic">
            You can skip any reflection freely.
          </span>
          <button
            onClick={handleFinish}
            className="px-5 py-2.5 rounded-2xl bg-[#9333EA] text-white hover:bg-[#7E22CE] font-bold text-sm shadow-xs transition-colors"
          >
            Done with Reflection
          </button>
        </div>
      </div>
    </div>
  );
};
