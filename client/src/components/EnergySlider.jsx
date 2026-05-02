import { Battery, Zap } from 'lucide-react';

export const EnergySlider = ({ value, onChange }) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 sm:min-w-[320px] transition-colors dark:border-stone-700 dark:bg-stone-800">
      <div className="flex items-center justify-between">
        <label htmlFor="energy-slider" className="font-display text-sm font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 transition-colors">
          Mental Energy
        </label>
        <span className="flex h-7 w-12 items-center justify-center rounded-md bg-stone-100 border border-stone-200 text-sm font-bold text-emerald-800 dark:bg-stone-900 dark:border-stone-700 dark:text-emerald-400 transition-colors">
          {value}<span className="text-stone-400 dark:text-stone-500 text-xs ml-0.5">/10</span>
        </span>
      </div>
      <div className="group relative py-2">
        <div className="absolute left-0 top-1/2 h-2 w-full -translate-y-1/2 rounded-full bg-stone-200 shadow-inner dark:bg-stone-700 transition-colors" />
        
        <div 
          className="absolute left-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-emerald-600 dark:bg-emerald-500 transition-all"
          style={{ width: `${(value / 10) * 100}%` }}
        />

        <input
          id="energy-slider"
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative z-10 w-full cursor-pointer appearance-none bg-transparent outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(0,0,0,0.3)] [&::-webkit-slider-thumb]:ring-2 [&::-webkit-slider-thumb]:ring-emerald-600 [&::-webkit-slider-thumb]:transition-transform hover:[&::-webkit-slider-thumb]:scale-110 active:[&::-webkit-slider-thumb]:scale-95"
        />
      </div>
      <div className="flex justify-between text-xs font-medium text-stone-500 dark:text-stone-400 transition-colors">
        <span className="flex items-center gap-1.5"><Battery className="h-3.5 w-3.5" /> Depleted</span>
        <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Peak</span>
      </div>
    </div>
  );
};
