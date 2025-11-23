import React from 'react';
import { LeagueId } from '../types';

interface LeagueCardProps {
  name: string;
  country: string;
  flag: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
}

export const LeagueCard: React.FC<LeagueCardProps> = ({ name, country, flag, icon, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6 transition-all duration-300 w-full text-left group
        ${isSelected 
          ? 'bg-pitch-accent/10 border-2 border-pitch-accent shadow-[0_0_20px_rgba(16,185,129,0.3)]' 
          : 'bg-pitch-light border border-slate-700 hover:border-slate-500 hover:bg-slate-800'}
      `}
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-6xl select-none">
        {icon}
      </div>
      <div className="flex flex-col gap-2 relative z-10">
        <span className="text-4xl filter drop-shadow-md">{flag}</span>
        <div>
          <h3 className={`text-lg font-display font-bold ${isSelected ? 'text-pitch-accent' : 'text-slate-100'}`}>
            {name}
          </h3>
          <p className="text-sm text-slate-400 font-medium tracking-wide uppercase">{country}</p>
        </div>
      </div>
    </button>
  );
};