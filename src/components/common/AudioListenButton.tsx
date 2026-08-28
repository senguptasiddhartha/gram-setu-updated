import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AudioListenButtonProps {
  textToRead: string;
  label?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const AudioListenButton: React.FC<AudioListenButtonProps> = ({
  textToRead,
  label = 'Listen to Advisory',
  className = '',
  variant = 'secondary',
}) => {
  const { speak, stopSpeaking, isSpeaking } = useApp();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(textToRead);
    }
  };

  const variantStyles = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs',
    secondary: 'bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs',
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={isSpeaking ? 'Stop speaking' : label}
      title={isSpeaking ? 'Stop speaking' : label}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
        isSpeaking ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse' : variantStyles[variant]
      } ${className}`}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-amber-700" />
          <span>Stop Listening</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-teal-700" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
