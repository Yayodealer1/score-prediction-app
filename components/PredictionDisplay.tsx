import React, { useMemo } from 'react';
import { PredictionResult, GroundingChunk } from '../types';

interface PredictionDisplayProps {
  result: PredictionResult;
}

export const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result }) => {
  
  // Parse the raw text into match cards based on the delimiter requested in the prompt
  const matches = useMemo(() => {
    if (!result.rawText) return [];
    // Split by the delimiter we asked Gemini to use
    return result.rawText
      .split('---MATCH_ANALYSIS---')
      .map(s => s.trim())
      .filter(s => s.length > 20); // Filter out empty or too short segments
  }, [result.rawText]);

  const renderMatchContent = (text: string) => {
    // Basic formatting for the AI markdown-like response
    return text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('**Match:**')) {
        return (
          <h3 key={index} className="text-xl font-display font-bold text-pitch-accent mb-4 border-b border-slate-700 pb-2">
            {trimmed.replace('**Match:**', '')}
          </h3>
        );
      }
      
      if (trimmed.startsWith('**Prediction:**')) {
        return (
          <div key={index} className="my-4 bg-slate-900/50 p-4 rounded-lg border border-pitch-accent/30 flex items-center justify-between">
            <span className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Projected Score</span>
            <span className="text-2xl font-bold font-display text-white">{trimmed.replace('**Prediction:**', '')}</span>
          </div>
        );
      }

      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
         // Headers like **Form Guide:**
         return <h4 key={index} className="text-sm font-bold text-slate-300 mt-3 mb-1">{trimmed.replace(/\*/g, '')}</h4>;
      }
      
      if (trimmed.startsWith('**')) {
         const parts = trimmed.split('**');
         if (parts.length >= 3) {
            return (
              <p key={index} className="text-slate-400 text-sm mb-1 leading-relaxed">
                <strong className="text-slate-200">{parts[1]}</strong> {parts[2]}
              </p>
            );
         }
      }

      // Bullet points
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={index} className="text-slate-400 text-sm ml-4 list-disc mb-1">
            {trimmed.substring(2)}
          </li>
        );
      }

      return <p key={index} className="text-slate-400 text-sm mb-1 leading-relaxed">{trimmed}</p>;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {matches.map((matchText, i) => (
          <div key={i} className="bg-pitch-light rounded-xl p-6 border border-slate-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            {renderMatchContent(matchText)}
          </div>
        ))}
        {matches.length === 0 && (
          <div className="col-span-3 text-center p-12 bg-pitch-light rounded-xl border border-slate-700">
            <p className="text-slate-400">Analysis provided in a single block:</p>
            <div className="mt-4 text-left whitespace-pre-wrap text-slate-300 text-sm leading-relaxed max-w-4xl mx-auto">
                {result.rawText}
            </div>
          </div>
        )}
      </div>

      {/* Sources Section */}
      {result.groundingChunks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-800">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Live Data Sources</h4>
          <div className="flex flex-wrap gap-3">
            {result.groundingChunks.map((chunk, idx) => (
              chunk.web?.uri ? (
                <a 
                  key={idx}
                  href={chunk.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pitch-accent hover:text-white bg-pitch-accent/10 hover:bg-pitch-accent/20 px-3 py-1.5 rounded-full transition-colors truncate max-w-[200px]"
                >
                  {chunk.web.title || chunk.web.uri}
                </a>
              ) : null
            ))}
          </div>
        </div>
      )}
    </div>
  );
};