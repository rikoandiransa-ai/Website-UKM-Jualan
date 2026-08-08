import React from 'react';
import { Smartphone, Monitor, Palette, Sparkles, HelpCircle } from 'lucide-react';

interface PhoneFrameControlsProps {
  isFrameActive: boolean;
  setIsFrameActive: (val: boolean) => void;
  phoneModel: string;
  setPhoneModel: (model: string) => void;
  caseColor: string;
  setCaseColor: (color: string) => void;
}

export const PhoneFrameControls: React.FC<PhoneFrameControlsProps> = ({
  isFrameActive,
  setIsFrameActive,
  phoneModel,
  setPhoneModel,
  caseColor,
  setCaseColor,
}) => {
  return (
    <div className="bg-slate-900/90 backdrop-blur-md text-white py-2 px-4 shadow-md border-b border-slate-800 text-xs z-50 sticky top-0">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Title / App Mode Indicator */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            {isFrameActive ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
          </div>
          <div>
            <span className="font-bold text-slate-100 flex items-center gap-1.5">
              {isFrameActive ? 'Modus Simulasi Layar HP' : 'Modus Layar Laptop / Desktop'} <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              {isFrameActive ? 'Tampilan terisolasi dalam frame smartphone' : 'Tampilan penuh responsif untuk laptop & komputer'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Toggle Frame View */}
          <button
            onClick={() => setIsFrameActive(!isFrameActive)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full font-semibold text-xs transition ${
              isFrameActive
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm'
            }`}
          >
            {isFrameActive ? (
              <>
                <Monitor className="w-3.5 h-3.5" /> Switch to Layar Laptop
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" /> Switch to Simulasi HP
              </>
            )}
          </button>

          {/* Phone Model Selection */}
          {isFrameActive && (
            <div className="hidden md:flex items-center gap-1 bg-slate-800/90 p-0.5 rounded-full border border-slate-700 text-[11px]">
              <button
                onClick={() => setPhoneModel('iPhone 15 Pro')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition ${
                  phoneModel === 'iPhone 15 Pro' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                iPhone 15 Pro
              </button>
              <button
                onClick={() => setPhoneModel('Galaxy S24')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition ${
                  phoneModel === 'Galaxy S24' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Galaxy S24
              </button>
              <button
                onClick={() => setPhoneModel('Pixel 8 Pro')}
                className={`px-2.5 py-0.5 rounded-full font-medium transition ${
                  phoneModel === 'Pixel 8 Pro' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Pixel 8
              </button>
            </div>
          )}

          {/* Case Color Selector */}
          {isFrameActive && (
            <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-slate-700">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              {[
                { id: 'titanium', name: 'Titanium', bg: 'bg-slate-400' },
                { id: 'black', name: 'Space Black', bg: 'bg-slate-900 border border-slate-600' },
                { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600' },
                { id: 'gold', name: 'Gold', bg: 'bg-amber-400' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCaseColor(c.id)}
                  title={c.name}
                  className={`w-4 h-4 rounded-full ${c.bg} transition ${
                    caseColor === c.id ? 'ring-2 ring-emerald-400 scale-125' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
