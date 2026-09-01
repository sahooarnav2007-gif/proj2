'use client';

import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  VolumeX
} from 'lucide-react';

export const IVRSimulator: React.FC = () => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [audioTimer, setAudioTimer] = useState<number>(0);
  const [callLang, setCallLang] = useState<'mr' | 'hi'>('mr');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setAudioTimer(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setAudioTimer(0);
    }
  }, [callState]);

  const startCall = () => {
    setCallState('calling');
    setCurrentStep(1);
    setSelectedResponse(null);
    setTimeout(() => {
      setCallState('connected');
    }, 1500);
  };

  const endCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
    }, 2000);
  };

  const handleSelectOption = (key: string, label: string) => {
    setSelectedResponse(`Pressed [${key}] : ${label}`);
    setTimeout(() => {
      setCurrentStep(2);
    }, 1000);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Interactive Voice Response (IVR) Simulator
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Designed for rural trainees with basic feature phones (2G/3G) in Gadchiroli, Nandurbar, and Solapur districts.
          </p>
        </div>

        {/* Call Language Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Voice Dialect:</span>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => setCallLang('mr')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                callLang === 'mr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              मराठी (Marathi)
            </button>
            <button
              onClick={() => setCallLang('hi')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                callLang === 'hi' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Phone Call Screen */}
      <div className="max-w-md mx-auto bg-slate-900 rounded-3xl p-6 text-white shadow-2xl border-4 border-slate-800 flex flex-col items-center justify-between min-h-[520px]">
        {/* Top Calling Status */}
        <div className="text-center w-full">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/30 mb-3">
            🎙️
          </div>
          <h4 className="text-lg font-bold text-slate-100">
            {callLang === 'mr' ? 'महाराष्ट्र कौशल्य ऑटो-कॉल' : 'महाराष्ट्र कौशल ऑटो-कॉल'}
          </h4>
          <p className="text-xs text-indigo-400 font-mono">
            {callState === 'idle' ? 'Trainee: Manisha Madavi (+91 93708 66201)' :
             callState === 'calling' ? 'Connecting to Gadchiroli...' :
             callState === 'connected' ? `In Call (${formatSeconds(audioTimer)})` : 'Call Finished'}
          </p>
        </div>

        {/* Audio Waveform Simulator */}
        {callState === 'connected' && (
          <div className="w-full my-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700 space-y-3">
            <div className="flex items-center justify-center gap-1.5 h-8">
              {[40, 75, 100, 60, 30, 90, 80, 45, 95, 70, 50, 85].map((h, i) => (
                <div
                  key={i}
                  className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
                  style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>

            {/* Bilingual Voice Transcript */}
            <div className="text-xs bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed text-indigo-200">
              {currentStep === 1 ? (
                callLang === 'mr' ? (
                  <p>
                    🔊 <strong>AI ऑपरेटर:</strong> &ldquo;नमस्कार मनीषाजी! कौशल्य विकास विभागाकडून हा कॉल आहे. औषधी वनस्पती प्रक्रिया प्रशिक्षणानंतर तुम्ही सध्या काम करत आहात का? <br/>
                    <strong>१ दाबा:</strong> बचत गटामध्ये / स्वयंरोजगार <br/>
                    <strong>२ दाबा:</strong> कंपनीत नोकरी <br/>
                    <strong>३ दाबा:</strong> काम शोधत आहे&rdquo;
                  </p>
                ) : (
                  <p>
                    🔊 <strong>AI ऑपरेटर:</strong> &ldquo;नमस्ते मनीषाजी! कौशल विकास विभाग की ओर से यह कॉल है। जड़ी-बूटी प्रसंस्करण प्रशिक्षण के बाद क्या आप वर्तमान में कार्यरत हैं? <br/>
                    <strong>1 दबाएं:</strong> स्वयं सहायता समूह / स्वरोजगार <br/>
                    <strong>2 दबाएं:</strong> निजी कंपनी में नौकरी <br/>
                    <strong>3 दबाएं:</strong> काम की तलाश में&rdquo;
                  </p>
                )
              ) : (
                <p className="text-emerald-300">
                  🔊 <strong>AI ऑपरेटर:</strong> {callLang === 'mr' ? 'धन्यवाद! तुमचा स्वयंरोजगार (मासिक उत्पन्न: ₹23,500) गडचिरोली जिल्हा ट्रॅकरमध्ये यशस्वीरित्या नोंदवला गेला आहे.' : 'धन्यवाद! आपका स्वरोजगार रिकॉर्ड (मासिक आय: ₹23,500) सफलतापूर्वक दर्ज कर लिया गया है।'}
                </p>
              )}
            </div>

            {selectedResponse && (
              <div className="text-[11px] text-amber-300 font-mono text-center">
                {selectedResponse}
              </div>
            )}
          </div>
        )}

        {/* Dialpad Interactive Options */}
        {callState === 'connected' && currentStep === 1 && (
          <div className="grid grid-cols-3 gap-2 w-full my-2">
            <button
              onClick={() => handleSelectOption('1', 'Self-Employed / SHG')}
              className="bg-slate-800 hover:bg-indigo-600 text-white font-bold p-3 rounded-xl border border-slate-700 transition flex flex-col items-center"
            >
              <span className="text-base">1</span>
              <span className="text-[10px] text-slate-300">स्वयंरोजगार</span>
            </button>
            <button
              onClick={() => handleSelectOption('2', 'Company Job')}
              className="bg-slate-800 hover:bg-indigo-600 text-white font-bold p-3 rounded-xl border border-slate-700 transition flex flex-col items-center"
            >
              <span className="text-base">2</span>
              <span className="text-[10px] text-slate-300">नोकरी</span>
            </button>
            <button
              onClick={() => handleSelectOption('3', 'Job Seeking')}
              className="bg-slate-800 hover:bg-indigo-600 text-white font-bold p-3 rounded-xl border border-slate-700 transition flex flex-col items-center"
            >
              <span className="text-base">3</span>
              <span className="text-[10px] text-slate-300">शोधत आहे</span>
            </button>
          </div>
        )}

        {/* Bottom Call Controls */}
        <div className="flex items-center gap-6 mt-4">
          {callState === 'idle' ? (
            <button
              onClick={startCall}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition text-sm"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Trigger Test IVR Call</span>
            </button>
          ) : callState === 'calling' ? (
            <div className="text-xs text-indigo-400 animate-pulse">Dialing trainee phone...</div>
          ) : callState === 'connected' ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full border ${isMuted ? 'bg-rose-600 border-rose-500' : 'bg-slate-800 border-slate-700'}`}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={endCall}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold p-3.5 rounded-full shadow-lg shadow-rose-600/30 transition"
                title="Hang Up"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Call Ended</div>
          )}
        </div>
      </div>
    </div>
  );
};
