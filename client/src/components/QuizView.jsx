import React, { useState } from 'react';

export default function QuizView({ initialQuestions }) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongMode, setWrongMode] = useState(false);

  const handleSelect = (qIdx, option) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmit = () => {
    let finalCalculatedScore = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correct) finalCalculatedScore++;
    });
    setScore(finalCalculatedScore);
    setSubmitted(true);
  };

  const handleRetryWrong = () => {
    const missedConceptStack = questions.filter((q, idx) => selectedAnswers[idx] !== q.correct);
    setQuestions(missedConceptStack);
    setSelectedAnswers({});
    setSubmitted(false);
    setWrongMode(true);
  };

  const handleResetFull = () => {
    setQuestions(initialQuestions);
    setSelectedAnswers({});
    setSubmitted(false);
    setWrongMode(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6 bg-slate-900/40 border border-slate-850/80 rounded-2xl p-6 backdrop-blur-md shadow-xl">
      {wrongMode && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-2.5 text-xs text-amber-400 font-mono tracking-wide">
          Isolation Mode: Reviewing {questions.length} incorrect concepts.
        </div>
      )}

      <div className="flex flex-col gap-6">
        {questions.map((q, qIdx) => (
          <div key={qIdx} className="border border-slate-850/60 bg-slate-950/40 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex gap-2 items-start">
              <span className="text-xs font-mono text-slate-500 mt-0.5">[{String(qIdx + 1).padStart(2, '0')}]</span>
              <h4 className="text-sm font-medium text-slate-200 leading-relaxed">{q.question}</h4>
            </div>
            
            <div className="grid grid-cols-1 gap-2 mt-1">
              {q.options.map((option, oIdx) => {
                const isSelected = selectedAnswers[qIdx] === option;
                const isCorrect = q.correct === option;
                let layoutVariant = "bg-slate-950/60 border-slate-900/80 hover:border-slate-800 text-slate-400 hover:text-slate-300";

                if (isSelected && !submitted) {
                  layoutVariant = "bg-amber-950/30 border-amber-600 text-amber-400 font-medium";
                }
                
                if (submitted) {
                  if (isCorrect) {
                    layoutVariant = "bg-emerald-950/20 border-emerald-600 text-emerald-400 font-medium";
                  } else if (isSelected && !isCorrect) {
                    layoutVariant = "bg-rose-950/20 border-rose-600 text-rose-400 opacity-90";
                  } else {
                    layoutVariant = "bg-slate-950/20 border-slate-950 text-slate-600 opacity-30 pointer-events-none";
                  }
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelect(qIdx, option)}
                    disabled={submitted}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-xs flex items-center justify-between ${layoutVariant}`}
                  >
                    <span>{option}</span>
                    {isSelected && !submitted && <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />}
                    {submitted && isCorrect && <span className="text-[10px] font-mono text-emerald-400">PASSED</span>}
                    {submitted && isSelected && !isCorrect && <span className="text-[10px] font-mono text-rose-400">FAILED</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Control Interface Actions */}
      <div className="border-t border-slate-850/80 pt-4">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(selectedAnswers).length < questions.length}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-900 disabled:border-slate-800 disabled:text-slate-600 border border-transparent text-slate-950 font-semibold text-xs py-3 rounded-lg transition-all shadow-md disabled:opacity-100 disabled:cursor-not-allowed"
          >
            Submit Evaluation Matrix
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/60 border border-slate-900 p-4 rounded-xl">
            <p className="text-xs font-mono text-slate-400">
              Accuracy Metrics: <span className="text-amber-400 font-bold text-sm ml-1">{score} / {questions.length}</span>
            </p>
            <div className="flex gap-2 w-full sm:w-auto">
              {score < questions.length && (
                <button
                  onClick={handleRetryWrong}
                  className="px-4 py-2 bg-amber-600/95 hover:bg-amber-600 text-slate-950 font-semibold rounded-lg text-xs transition-all shadow-sm whitespace-nowrap"
                >
                  Retry Errors
                </button>
              )}
              <button
                onClick={handleResetFull}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium border border-slate-800 rounded-lg text-xs transition-all whitespace-nowrap"
              >
                Reset Evaluation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}