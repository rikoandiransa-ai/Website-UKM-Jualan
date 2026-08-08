import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Camera } from 'lucide-react';

interface MobileStatusBarProps {
  deviceModel?: string;
  isDarkTheme?: boolean;
}

export const MobileStatusBar: React.FC<MobileStatusBarProps> = ({
  deviceModel = 'iPhone 15 Pro',
  isDarkTheme = false,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`w-full px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none z-50 ${
        isDarkTheme ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'
      }`}
    >
      {/* Time Display */}
      <div className="w-14 font-medium text-center text-[13px] tracking-tight">
        {timeStr || '09:41'}
      </div>

      {/* Notch / Dynamic Island / Hole Punch */}
      <div className="flex-1 flex justify-center items-center">
        {deviceModel.includes('iPhone') ? (
          <div className="w-24 h-5 bg-black rounded-full flex items-center justify-between px-2 shadow-inner">
            <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800/80 flex items-center justify-center">
              <div className="w-1 h-1 bg-emerald-500/80 rounded-full"></div>
            </div>
            <div className="w-2.5 h-2.5 bg-slate-950 rounded-full border border-slate-800"></div>
          </div>
        ) : (
          <div className="w-3.5 h-3.5 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center">
            <Camera className="w-2 h-2 text-slate-700" />
          </div>
        )}
      </div>

      {/* Status Icons */}
      <div className="w-16 flex items-center justify-end gap-1.5 text-slate-700 dark:text-slate-200">
        <Signal className="w-3.5 h-3.5" />
        <Wifi className="w-3.5 h-3.5" />
        <div className="flex items-center gap-0.5">
          <Battery className="w-4 h-4 text-emerald-600" />
        </div>
      </div>
    </div>
  );
};
