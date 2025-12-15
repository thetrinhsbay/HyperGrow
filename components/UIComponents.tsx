import React from 'react';
import { Zap, Play } from 'lucide-react';

// Neon Button
interface NeonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'cyan' | 'magenta' | 'lime' | 'yellow' | 'purple' | 'orange' | 'blue' | 'red' | 'slate';
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const colorMap = {
  cyan: 'border-cyan-500 text-cyan-400 hover:bg-cyan-900/20 shadow-cyan-500/50',
  magenta: 'border-neon-magenta text-neon-magenta hover:bg-neon-magenta/20 shadow-neon-magenta/50',
  lime: 'border-neon-lime text-neon-lime hover:bg-neon-lime/20 shadow-neon-lime/50',
  yellow: 'border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20 shadow-neon-yellow/50',
  purple: 'border-neon-purple text-neon-purple hover:bg-neon-purple/20 shadow-neon-purple/50',
  orange: 'border-neon-orange text-neon-orange hover:bg-neon-orange/20 shadow-neon-orange/50',
  blue: 'border-neon-blue text-neon-blue hover:bg-neon-blue/20 shadow-neon-blue/50',
  red: 'border-red-500 text-red-500 hover:bg-red-900/20 shadow-red-500/50',
  slate: 'border-slate-500 text-slate-400 hover:bg-slate-800 shadow-slate-500/50',
};

const sizeMap = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-lg',
};

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, variant = 'cyan', glow = true, size = 'md', loading = false, className = '', ...props 
}) => {
  const baseStyle = "rounded-lg border font-bold transition-all duration-300 backdrop-blur-sm active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden";
  const colorStyle = colorMap[variant];
  const sizeStyle = sizeMap[size];
  const glowStyle = glow ? 'hover:shadow-[0_0_15px_currentColor]' : '';
  const disabledStyle = (props.disabled || loading) ? 'opacity-50 cursor-not-allowed grayscale' : '';
  
  return (
    <button 
      className={`${baseStyle} ${sizeStyle} ${colorStyle} ${glowStyle} ${disabledStyle} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 bg-black/20 flex items-center justify-center">
           <Zap className="animate-spin" size={16} />
        </span>
      )}
      <span className={loading ? 'opacity-0' : 'flex items-center gap-2'}>
        {children}
      </span>
    </button>
  );
};

// Neon Card
export const NeonCard: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => {
  return (
    <div className={`bg-dark-card/80 border border-slate-700/50 rounded-xl p-6 backdrop-blur-md shadow-lg hover:border-slate-600 transition-colors ${className}`}>
      {title && <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2 flex items-center gap-2"><span className="w-1 h-6 bg-cyan-500 rounded-full"></span>{title}</h3>}
      {children}
    </div>
  );
};

// Input Field
export const NeonInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`bg-slate-900/50 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all w-full ${props.className}`}
  />
);

// AI Action Grid (4 Buttons)
export interface AIAction {
  id: string;
  label: string;
  desc: string;
  icon?: React.ElementType;
}

export const AIActionGrid: React.FC<{ actions: AIAction[]; onRun: (id: string) => void; loadingId: string | null }> = ({ actions, onRun, loadingId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => onRun(action.id)}
          disabled={loadingId !== null}
          className={`relative group p-4 rounded-xl border border-slate-700 bg-slate-900/40 hover:bg-slate-800/60 transition-all duration-300 text-left hover:-translate-y-1 hover:shadow-lg overflow-hidden
            ${loadingId === action.id ? 'border-cyan-500 ring-1 ring-cyan-500' : 'hover:border-cyan-500/50'}
          `}
        >
          <div className="flex justify-between items-start mb-2">
            <div className={`p-2 rounded-lg bg-slate-800 text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-colors`}>
               {loadingId === action.id ? <Zap size={18} className="animate-spin"/> : (action.icon ? <action.icon size={18} /> : <Play size={18} />)}
            </div>
          </div>
          <h4 className="font-bold text-sm text-slate-200 group-hover:text-white mb-1">{action.label}</h4>
          <p className="text-[10px] text-slate-500 group-hover:text-slate-400 leading-tight">{action.desc}</p>
          
          {/* Progress Bar Animation when Loading */}
          {loadingId === action.id && (
             <div className="absolute bottom-0 left-0 h-1 bg-cyan-500 animate-[width_1.5s_ease-in-out_infinite]" style={{width: '100%'}}></div>
          )}
        </button>
      ))}
    </div>
  );
};
