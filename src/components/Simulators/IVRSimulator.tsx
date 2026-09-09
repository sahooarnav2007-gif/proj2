'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  PhoneCall, 
  PhoneOff, 
  Volume2, 
  VolumeX,
  Play,
  Pause,
  Sparkles,
  Award
} from 'lucide-react';

export const IVRSimulator: React.FC = () => {
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedResponse, setSelectedResponse] = useState<string | null>(null);
  const [audioTimer, setAudioTimer] = useState<number>(0);
  const [callLang, setCallLang] = useState<'mr' | 'hi'>('mr');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [coinsEarned, setCoinsEarned] = useState<boolean>(false);
  const [voiceLoaded, setVoiceLoaded] = useState<boolean>(false);

  // Audio Speech Synthesis & Voice Detection
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoices = () => {
        const v = window.speechSynthesis.getVoices();
        if (v.length > 0) {
          setVoiceLoaded(true);
        }
      };
      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Web Audio DTMF Keypad Tones
  const playDTMFTone = (key: string) => {
    try {
      if (typeof window === 'undefined') return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const dtmfFreqs: Record<string, [number, number]> = {
        '1': [697, 1209],
        '2': [697, 1336],
        '3': [697, 1477],
        'dial': [400, 450]
      };

      const [f1, f2] = dtmfFreqs[key] || [770, 1336];
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.frequency.value = f1;
      osc2.frequency.value = f2;
      
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.3);
      osc2.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  };

  const speakPrompt = (devanagariText: string, phoneticText: string, lang: 'mr' | 'hi') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || isMuted) return;
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    
    // Find native regional voice (Marathi or Hindi)
    const nativeVoice = voices.find(v => {
      const vLang = v.lang.toLowerCase();
      const vName = v.name.toLowerCase();
      if (lang === 'mr') {
        return vLang.startsWith('mr') || vName.includes('marathi');
      }
      return vLang.startsWith('hi') || vName.includes('hindi');
    });

    // Indian English fallback voice if available
    const indianVoice = nativeVoice || voices.find(v => 
      v.lang.toLowerCase().includes('in') || 
      v.name.toLowerCase().includes('india') ||
      v.name.toLowerCase().includes('hindi') ||
      v.name.toLowerCase().includes('marathi')
    );

    // If native Devanagari TTS voice is available, use Devanagari text.
    // If standard English TTS is used, use Romanized phonetic text so English TTS pronounces full words without skipping!
    const textToSpeak = nativeVoice ? devanagariText : phoneticText;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    if (nativeVoice) {
      utterance.voice = nativeVoice;
      utterance.lang = lang === 'mr' ? 'mr-IN' : 'hi-IN';
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
    } else if (indianVoice) {
      utterance.voice = indianVoice;
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1.05;
    } else {
      utterance.lang = 'en-US';
      utterance.rate = 0.88;
      utterance.pitch = 1.02;
    }

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (callState === 'connected') {
      interval = setInterval(() => {
        setAudioTimer(prev => prev + 1);
      }, 1000);

      // Auto-trigger voice synthesis when connected
      const devanagariPrompt = callLang === 'mr'
        ? "नमस्कार मनीषाजी! कौशल्य विकास विभागाकडून हा कॉल आहे. औषधी वनस्पती प्रक्रिया प्रशिक्षणानंतर तुम्ही सध्या काम करत आहात का? बचत गटामध्ये किंवा स्वयंरोजगारासाठी एक दाबा. कंपनीत नोकरीसाठी दोन दाबा. काम शोधत असल्यास तीन दाबा."
        : "नमस्ते मनीषाजी! कौशल विकास विभाग की ओर से यह कॉल है। जड़ी-बूटी प्रसंस्करण प्रशिक्षण के बाद क्या आप कार्यरत हैं? स्वयं सहायता समूह या स्वरोजगार के लिए एक दबाएं। कंपनी में नौकरी के लिए दो दबाएं। काम की तलाश में हैं तो तीन दबाएं।";

      const phoneticPrompt = callLang === 'mr'
        ? "Namaskaar Manishaji! Maharashtra Kaushalya Vikas Vibhaaga kadun ha call aahe. Aushadhi vanaspati prakriya prashikshananantar tumhi sadhya kaam karat aahat ka? Bachat gat kinva swayam-rojgaarasathi ek daba. Companyt nokreesathi don daba. Kaam shodhat aaslyas teen daba."
        : "Namaste Manishaji! Maharashtra Kaushal Vikas Vibhag ki or se yeh call hai. Jadi-booti prashikshan ke baad kya aap karyarat hain? Swayam sahayata samooh ya swarojgaar ke liye ek dabayein. Company mein naukree ke liye do dabayein. Kaam ki talaash mein hain toh teen dabayein.";
      
      speakPrompt(devanagariPrompt, phoneticPrompt, callLang);

      return () => {
        clearInterval(interval);
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      };
    } else {
      setAudioTimer(0);
      setIsPlayingAudio(false);
    }
  }, [callState, callLang, voiceLoaded]);

  const startCall = () => {
    playDTMFTone('dial');
    setCallState('calling');
    setCurrentStep(1);
    setSelectedResponse(null);
    setCoinsEarned(false);
    setTimeout(() => {
      setCallState('connected');
    }, 1400);
  };

  const endCall = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
    }, 2000);
  };

  const handleSelectOption = (key: string, label: string) => {
    playDTMFTone(key);
    setSelectedResponse(`Keypad Pressed [${key}] : ${label}`);
    setCoinsEarned(true);

    const devanagariConfirmation = callLang === 'mr'
      ? (key === '1' 
          ? "धन्यवाद मनीषाजी! तुमचा स्वयंरोजगार मासिक उत्पन्न तेवीस हजार पाचशे रुपये गडचिरोली जिल्हा ट्रॅकरमध्ये यशस्वीरित्या नोंदवला गेला आहे. तुम्हाला पन्नास स्किल कॉइन्स मिळाले आहेत."
          : key === '2'
          ? "धन्यवाद मनीषाजी! तुमची कंपनी नोकरी यशस्वीरित्या नोंदवली गेली आहे. तुम्हाला पन्नास स्किल कॉइन्स मिळाले आहेत."
          : "धन्यवाद मनीषाजी! तुमची नोंदणी झाली आहे. महाविकास रोजगार केंद्र लवकरच नवीन संधीसाठी संपर्क करेल.")
      : (key === '1'
          ? "धन्यवाद मनीषाजी! आपका स्वरोजगार रिकॉर्ड तेईस हजार पांच सौ रुपये गडचिरोली जिला पोर्टल में दर्ज कर लिया गया है। आपको पचास स्किल कॉइन्स मिले हैं।"
          : key === '2'
          ? "धन्यवाद मनीषाजी! आपकी कंपनी नौकरी सफलतापूर्वक दर्ज कर ली गई है। आपको पचास स्किल कॉइन्स मिले हैं।"
          : "धन्यवाद मनीषाजी! आपका अनुरोध दर्ज कर लिया गया है। रोजगार केंद्र जल्द ही संपर्क करेगा।");

    const phoneticConfirmation = callLang === 'mr'
      ? (key === '1'
          ? "Dhanyavaad Manishaji! Tumcha swayam-rojgaar maasik utpanna tevees hajaar paashshe rupaye Gadchiroli jilhaa tracker madhye nondavlaa gelaa aahe. Tumhaala pannaas skill coins milaale aahat."
          : key === '2'
          ? "Dhanyavaad Manishaji! Tumchi company nokree Gadchiroli DSDC tracker madhye nondavli geli aahe. Tumhaala pannaas skill coins milaale aahat."
          : "Dhanyavaad Manishaji! Tumchi nodni zhaali aahe. Mahavikas Rojgar Kendra tumhala lakarach navya sandhi sathi sampark karel.")
      : (key === '1'
          ? "Dhanyavaad Manishaji! Aapka swarojgaar record te-ees hazaar paanch sau rupaye Gadchiroli zila portal mein darj kar liya gaya hai. Aapko pachaas skill coins mile hain."
          : key === '2'
          ? "Dhanyavaad Manishaji! Aapki company naukree portal mein darj ho gayi hai. Aapko pachaas skill coins mile hain."
          : "Dhanyavaad Manishaji! Aapka anurodh darj kar liya gaya hai. Rojgar kendra jald hi aapse sampark karega.");

    setTimeout(() => {
      setCurrentStep(2);
      speakPrompt(devanagariConfirmation, phoneticConfirmation, callLang);
    }, 600);
  };

  const toggleSpeechAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const devanagariText = currentStep === 1
        ? (callLang === 'mr'
            ? "नमस्कार मनीषाजी! कौशल्य विकास विभागाकडून हा कॉल आहे. बचत गटामध्ये किंवा स्वयंरोजगारासाठी एक दाबा. नोकरीसाठी दोन दाबा. काम शोधत असल्यास तीन दाबा."
            : "नमस्ते मनीषाजी! कौशल विकास विभाग की ओर से यह कॉल है। स्वरोजगार के लिए एक दबाएं। नौकरी के लिए दो दबाएं। काम की तलाश में हैं तो तीन दबाएं।")
        : (callLang === 'mr'
            ? "धन्यवाद मनीषाजी! तुमचा स्वयंरोजगार यशस्वीरित्या नोंदवला गेला आहे."
            : "धन्यवाद मनीषाजी! आपका स्वरोजगार सफलतापूर्वक दर्ज हो गया है।");

      const phoneticText = currentStep === 1
        ? (callLang === 'mr'
            ? "Namaskaar Manishaji! Maharashtra Kaushalya Vikas Vibhaaga kadun ha call aahe. Bachat gat kinva swayam-rojgaarasathi ek daba. Companyt nokreesathi don daba. Kaam shodhat aaslyas teen daba."
            : "Namaste Manishaji! Maharashtra Kaushal Vikas Vibhag ki or se yeh call hai. Swayam sahayata samooh ya swarojgaar ke liye ek dabayein. Company mein naukree ke liye do dabayein. Kaam ki talaash mein hain toh teen dabayein.")
        : (callLang === 'mr'
            ? "Dhanyavaad Manishaji! Tumcha swayam-rojgaar record nondavlaa gelaa aahe."
            : "Dhanyavaad Manishaji! Aapka swarojgaar record darj ho gaya hai.");

      speakPrompt(devanagariText, phoneticText, callLang);
    }
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
            <span className="p-2 bg-orange-100 dark:bg-orange-950/60 rounded-xl text-orange-600 dark:text-orange-400">
              <PhoneCall className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>AI Interactive Voice Response (IVR) Agent</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  Live Web Audio Synthesizer
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Automated vernacular voice calls for rural 2G keypad phones across Gadchiroli, Nandurbar, and Solapur.
              </p>
            </div>
          </div>
        </div>

        {/* Dialect Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Voice Dialect:</span>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => {
                setCallLang('mr');
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                callLang === 'mr' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              मराठी (Marathi)
            </button>
            <button
              onClick={() => {
                setCallLang('hi');
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
              }}
              className={`px-3 py-1 rounded-lg font-bold transition ${
                callLang === 'hi' ? 'bg-orange-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Phone Call Screen */}
      <div className="max-w-md mx-auto bg-slate-950 rounded-3xl p-6 text-white shadow-2xl border-4 border-slate-800 flex flex-col items-center justify-between min-h-[530px] relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-orange-600/15 rounded-full blur-2xl pointer-events-none"></div>

        {/* Top Calling Status */}
        <div className="text-center w-full z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-600 mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/30 mb-3 animate-pulse">
            🎙️
          </div>
          <h4 className="text-lg font-black text-slate-100">
            {callLang === 'mr' ? 'महाराष्ट्र कौशल्य AI व्हॉईस एजंट' : 'महाराष्ट्र कौशल AI वॉइस एजेंट'}
          </h4>
          <p className="text-xs text-orange-400 font-mono mt-0.5">
            {callState === 'idle' ? 'Trainee: Manisha Madavi (+91 93708 66201)' :
             callState === 'calling' ? 'Connecting to Gadchiroli BSNL Cellular Node...' :
             callState === 'connected' ? `Live Call (${formatSeconds(audioTimer)})` : 'Call Completed'}
          </p>
        </div>

        {/* Audio Waveform Equalizer & Live Speech Engine */}
        {callState === 'connected' && (
          <div className="w-full my-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3 z-10">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isPlayingAudio ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`}></span>
                {isPlayingAudio ? 'Speaking in Vernacular...' : 'Audio Stream Active'}
              </span>

              <button
                onClick={toggleSpeechAudio}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-lg text-[11px] font-bold flex items-center gap-1 transition"
              >
                {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlayingAudio ? 'Mute Speech' : 'Play Speech'}</span>
              </button>
            </div>

            {/* Equalizer Frequency Bars */}
            <div className="flex items-center justify-center gap-1.5 h-9 bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              {[40, 85, 100, 60, 30, 95, 80, 45, 90, 70, 50, 85, 65, 95, 40].map((h, i) => (
                <div
                  key={i}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    isPlayingAudio ? 'bg-orange-500 animate-pulse' : 'bg-slate-700'
                  }`}
                  style={{
                    height: isPlayingAudio ? `${h}%` : '20%',
                    animationDelay: `${i * 0.08}s`
                  }}
                ></div>
              ))}
            </div>

            {/* Bilingual Voice Transcript */}
            <div className="text-xs bg-slate-950/90 p-3.5 rounded-xl border border-slate-800 leading-relaxed text-slate-200">
              {currentStep === 1 ? (
                callLang === 'mr' ? (
                  <p>
                    🔊 <strong>AI ऑपरेटर:</strong> &ldquo;नमस्कार मनीषाजी! कौशल्य विकास विभागाकडून हा कॉल आहे. औषधी वनस्पती प्रक्रिया प्रशिक्षणानंतर तुम्ही सध्या काम करत आहात का? <br/>
                    <strong className="text-orange-400">१ दाबा:</strong> बचत गटामध्ये / स्वयंरोजगार <br/>
                    <strong className="text-orange-400">२ दाबा:</strong> कंपनीत नोकरी <br/>
                    <strong className="text-orange-400">३ दाबा:</strong> काम शोधत आहे&rdquo;
                  </p>
                ) : (
                  <p>
                    🔊 <strong>AI ऑपरेटर:</strong> &ldquo;नमस्ते मनीषाजी! कौशल विकास विभाग की ओर से यह कॉल है। जड़ी-बूटी प्रसंस्करण प्रशिक्षण के बाद क्या आप कार्यरत हैं? <br/>
                    <strong className="text-orange-400">1 दबाएं:</strong> स्वयं सहायता समूह / स्वरोजगार <br/>
                    <strong className="text-orange-400">2 दबाएं:</strong> कंपनी में नौकरी <br/>
                    <strong className="text-orange-400">3 दबाएं:</strong> काम की तलाश में&rdquo;
                  </p>
                )
              ) : (
                <div className="space-y-2">
                  <p className="text-emerald-300 font-medium">
                    🔊 <strong>AI ऑपरेटर:</strong> {callLang === 'mr' 
                      ? 'धन्यवाद! तुमचा स्वयंरोजगार (मासिक उत्पन्न: ₹23,500) गडचिरोली जिल्हा ट्रॅकरमध्ये यशस्वीरित्या नोंदवला गेला आहे.' 
                      : 'धन्यवाद! आपका स्वरोजगार रिकॉर्ड (मासिक आय: ₹23,500) सफलतापूर्वक दर्ज कर लिया गया है।'}
                  </p>
                  {coinsEarned && (
                    <div className="bg-emerald-950/80 border border-emerald-800 p-2 rounded-lg text-emerald-400 text-[11px] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>Telemetry Synced with DSDC Portal</span>
                      </span>
                      <span className="text-amber-300 font-mono">+50 SkillCoins</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {selectedResponse && (
              <div className="text-[11px] text-amber-300 font-mono text-center bg-slate-950 p-1.5 rounded-lg border border-slate-800">
                {selectedResponse}
              </div>
            )}
          </div>
        )}

        {/* Dialpad Interactive Options */}
        {callState === 'connected' && currentStep === 1 && (
          <div className="grid grid-cols-3 gap-2 w-full my-2 z-10">
            <button
              onClick={() => handleSelectOption('1', 'Self-Employed / SHG')}
              className="bg-slate-900 hover:bg-orange-600 text-white font-bold p-3 rounded-xl border border-slate-800 hover:border-orange-500 transition flex flex-col items-center group shadow-md"
            >
              <span className="text-base group-hover:scale-110 transition">1</span>
              <span className="text-[10px] text-slate-400 group-hover:text-white">स्वयंरोजगार</span>
            </button>
            <button
              onClick={() => handleSelectOption('2', 'Company Job')}
              className="bg-slate-900 hover:bg-orange-600 text-white font-bold p-3 rounded-xl border border-slate-800 hover:border-orange-500 transition flex flex-col items-center group shadow-md"
            >
              <span className="text-base group-hover:scale-110 transition">2</span>
              <span className="text-[10px] text-slate-400 group-hover:text-white">नोकरी</span>
            </button>
            <button
              onClick={() => handleSelectOption('3', 'Job Seeking')}
              className="bg-slate-900 hover:bg-orange-600 text-white font-bold p-3 rounded-xl border border-slate-800 hover:border-orange-500 transition flex flex-col items-center group shadow-md"
            >
              <span className="text-base group-hover:scale-110 transition">3</span>
              <span className="text-[10px] text-slate-400 group-hover:text-white">शोधत आहे</span>
            </button>
          </div>
        )}

        {/* Bottom Call Controls */}
        <div className="flex items-center gap-6 mt-4 z-10">
          {callState === 'idle' ? (
            <button
              onClick={startCall}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-full flex items-center gap-2 shadow-lg shadow-orange-600/30 transition text-sm hover:scale-105 active:scale-95"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Trigger Test IVR Call (With Audio)</span>
            </button>
          ) : callState === 'calling' ? (
            <div className="text-xs text-orange-400 animate-pulse flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping"></span>
              <span>Dialing Gadchiroli BSNL Cellular Node...</span>
            </div>
          ) : callState === 'connected' ? (
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3 rounded-full border transition ${
                  isMuted ? 'bg-rose-600 border-rose-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              <button
                onClick={endCall}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold p-3.5 rounded-full shadow-lg shadow-rose-600/30 transition hover:scale-105 active:scale-95"
                title="Hang Up"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-400">Call Ended Successfully</div>
          )}
        </div>
      </div>
    </div>
  );
};
