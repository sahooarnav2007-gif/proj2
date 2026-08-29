'use client';

import React, { useState } from 'react';
import { 
  Send, 
  CheckCheck, 
  ShieldCheck, 
  RotateCcw, 
  Paperclip,
  Phone,
  Video,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  buttons?: { id: string; label: string }[];
  isSalarySlip?: boolean;
}

export const WhatsAppBotSimulator: React.FC<{ onOutcomeSubmitted?: (data: any) => void }> = ({ onOutcomeSubmitted }) => {
  const [lang, setLang] = useState<'mr' | 'en' | 'hi'>('mr');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: '🙏 नमस्कार स्वप्निलजी! महाराष्ट्र शासन कौशल्य विकास विभाग (MSSDS) कडून हा संदेश आहे. तुम्ही ITI औंध, पुणे येथून "EV Powertrain Tech" चा कोर्स पूर्ण केला होता.\n\nतुम्ही अजूनही Tata Motors मध्ये कार्यरत आहात का? (६ महिन्यांचा करिअर फॉलो-अप)',
      timestamp: '10:42 AM',
      buttons: [
        { id: 'same_job', label: '✅ हो, कार्यरत आहे' },
        { id: 'promoted', label: '🚀 हो, पदोन्नती झाली' },
        { id: 'self_emp', label: '💼 स्वतःचा व्यवसाय सुरू केला' },
        { id: 'seeking', label: '🔍 नवीन नोकरी शोधत आहे' }
      ]
    }
  ]);

  const [inputVal, setInputVal] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const switchLanguage = (newLang: 'mr' | 'en' | 'hi') => {
    setLang(newLang);
    if (newLang === 'mr') {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: '🙏 नमस्कार स्वप्निलजी! महाराष्ट्र शासन कौशल्य विकास विभाग (MSSDS) कडून हा संदेश आहे. तुम्ही ITI औंध, पुणे येथून "EV Powertrain Tech" चा कोर्स पूर्ण केला होता.\n\nतुम्ही अजूनही Tata Motors मध्ये कार्यरत आहात का? (६ महिन्यांचा करिअर फॉलो-अप)',
          timestamp: '10:42 AM',
          buttons: [
            { id: 'same_job', label: '✅ हो, कार्यरत आहे' },
            { id: 'promoted', label: '🚀 हो, पदोन्नती झाली' },
            { id: 'self_emp', label: '💼 स्वतःचा व्यवसाय सुरू केला' },
            { id: 'seeking', label: '🔍 नवीन नोकरी शोधत आहे' }
          ]
        }
      ]);
    } else if (newLang === 'en') {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: '🙏 Hello Swapnil! This is an automated follow-up from Government of Maharashtra (MSSDS). You completed the "EV Powertrain Tech" course from ITI Aundh, Pune.\n\nAre you still actively working at Tata Motors? (6-Month Longitudinal Check-in)',
          timestamp: '10:42 AM',
          buttons: [
            { id: 'same_job', label: '✅ Yes, Same Job' },
            { id: 'promoted', label: '🚀 Promoted / Salary Hike' },
            { id: 'self_emp', label: '💼 Started Own Business' },
            { id: 'seeking', label: '🔍 Looking for New Job' }
          ]
        }
      ]);
    } else {
      setMessages([
        {
          id: '1',
          sender: 'bot',
          text: '🙏 नमस्ते स्वप्निलजी! महाराष्ट्र सरकार कौशल विकास विभाग (MSSDS) की ओर से यह संदेश है। आपने ITI औंध, पुणे से "EV Powertrain Tech" कोर्स पूरा किया था।\n\nक्या आप अभी भी Tata Motors में कार्यरत हैं? (6-माह कॅरियर फॉलो-अप)',
          timestamp: '10:42 AM',
          buttons: [
            { id: 'same_job', label: '✅ हाँ, कार्यरत हूँ' },
            { id: 'promoted', label: '🚀 पदोन्नति / वेतन वृद्धि' },
            { id: 'self_emp', label: '💼 खुद का व्यवसाय शुरू किया' },
            { id: 'seeking', label: '🔍 नई नौकरी खोज रहा हूँ' }
          ]
        }
      ]);
    }
  };

  const handleButtonClick = (btn: { id: string; label: string }) => {
    // Add user response
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: btn.label,
      timestamp: '10:43 AM'
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      if (btn.id === 'same_job' || btn.id === 'promoted') {
        const replyText = lang === 'mr' 
          ? '🎉 अभिनंदन! कृपया तुमचा सध्याचा मासिक पगार (Take-home salary) किती आहे ते सांगा? (उदा. 34000)'
          : lang === 'en'
          ? '🎉 Great! Please reply with your current monthly take-home salary in ₹ (e.g. 34000)'
          : '🎉 बहुत बढ़िया! कृपया अपना वर्तमान मासिक वेतन बताएं (उदा. 34000)';

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: replyText,
            timestamp: '10:43 AM'
          }
        ]);
      } else if (btn.id === 'self_emp') {
        const replyText = lang === 'mr'
          ? '💼 उत्तम! तुमच्या उद्योगाचा उद्यम नोंदणी क्रमांक (Udyam Number) असल्यास सांगा किंवा व्यवसायाचे नाव टाईप करा.'
          : lang === 'en'
          ? '💼 Fantastic! Please share your Udyam Registration Number or Business Name to verify your self-employment status.'
          : '💼 शानदार! कृपया अपना उद्यम पंजीकरण नंबर या व्यवसाय का नाम दर्ज करें।';

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: replyText,
            timestamp: '10:43 AM'
          }
        ]);
      } else {
        const replyText = lang === 'mr'
          ? '🤝 काळजी करू नका! महाराष्ट्र शासनाच्या महास्वयंम (Mahaswayam) पोर्टलवर तुमच्यासाठी 12 नवीन EV कंपन्यांमध्ये भरती सुरू आहे. आम्ही तुमच्या समुपदेशकाशी (Counselor) संपर्क साधत आहोत.'
          : lang === 'en'
          ? '🤝 No worries! We have connected your profile with 12 open EV technician vacancies on Mahaswayam portal. An ITI counselor will assist you shortly.'
          : '🤝 चिंता न करें! आपके लिए महास्वयं पोर्टल पर 12 नई रिक्तियों के अवसर उपलब्ध हैं। काउंसलर आपसे जल्द संपर्क करेंगे।';

        setMessages(prev => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'bot',
            text: replyText,
            timestamp: '10:43 AM'
          }
        ]);
      }
    }, 1000);
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputVal,
      timestamp: '10:44 AM'
    };

    setMessages(prev => [...prev, userMsg]);
    const entered = inputVal;
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);

      const replyText = lang === 'mr'
        ? `✅ धन्यवाद स्वप्निलजी! तुमची माहिती (मासिक वेतन: ₹${entered}) सुरक्षितपणे नोंदवली गेली आहे. \n\n🔒 EPFO डेटाबेसशी जुळवणी पूर्ण झाली (Trust Score: 98%). \n🪙 तुम्हाला +50 SkillCoins मिळाले आहेत!`
        : lang === 'en'
        ? `✅ Thank you Swapnil! Your record (Monthly Wage: ₹${entered}) has been securely logged into the State Longitudinal Ledger.\n\n🔒 Triangulated with EPFO Provident Fund (Trust Score: 98%).\n🪙 You earned +50 SkillCoins!`
        : `✅ धन्यवाद स्वप्निलजी! आपका रिकॉर्ड (वेतन: ₹${entered}) सुरक्षित रूप से दर्ज कर लिया गया है।\n\n🔒 EPFO के साथ 98% सत्यापन पूर्ण।\n🪙 आपको +50 SkillCoins मिले हैं!`;

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: replyText,
          timestamp: '10:44 AM'
        }
      ]);

      if (onOutcomeSubmitted) {
        onOutcomeSubmitted({
          salary: Number(entered) || 34000,
          status: 'employed_formal',
          channel: 'whatsapp'
        });
      }
    }, 1200);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              WhatsApp Conversational Re-Engagement Bot (Live Simulator)
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Zero-app friction: Trainees update job continuity, promotions, or self-employment via interactive WhatsApp buttons.
          </p>
        </div>

        {/* Language Switcher for Bot */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Bot Language:</span>
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
            <button
              onClick={() => switchLanguage('mr')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                lang === 'mr' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              मराठी (Marathi)
            </button>
            <button
              onClick={() => switchLanguage('hi')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                lang === 'hi' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => switchLanguage('en')}
              className={`px-2.5 py-1 rounded font-bold transition ${
                lang === 'en' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={() => switchLanguage(lang)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* WhatsApp Phone Mockup */}
      <div className="max-w-md mx-auto bg-slate-950 rounded-[36px] p-3 shadow-2xl border-4 border-slate-700">
        <div className="w-full h-[580px] bg-[#0b141a] rounded-[28px] overflow-hidden flex flex-col relative text-white font-sans">
          {/* WhatsApp Header */}
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  ⚡
                </div>
                <span className="w-2.5 h-2.5 bg-emerald-500 border-2 border-[#1f2c34] rounded-full absolute bottom-0 right-0"></span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold text-sm text-slate-100">MahaSkill Bot</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <span className="text-[10px] text-emerald-400 block font-medium">Official MSSDS Verified</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <Phone className="w-4 h-4" />
              <Video className="w-4 h-4" />
              <MoreVertical className="w-4 h-4" />
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0b141a] text-xs">
            <div className="text-center my-1">
              <span className="bg-[#182229] text-slate-400 text-[10px] px-2.5 py-1 rounded-md shadow-xs">
                🔒 Messages are end-to-end encrypted & DPDP 2023 compliant
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 shadow-md whitespace-pre-wrap leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#005c4b] text-white rounded-tr-none'
                      : 'bg-[#202c33] text-slate-100 rounded-tl-none'
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'user' && <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                </div>

                {/* Interactive Buttons */}
                {msg.buttons && (
                  <div className="mt-2 space-y-1.5 w-[85%]">
                    {msg.buttons.map((btn) => (
                      <button
                        key={btn.id}
                        onClick={() => handleButtonClick(btn)}
                        className="w-full text-left bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-cyan-300 font-semibold px-3 py-2 rounded-xl transition flex items-center justify-between text-xs shadow-xs"
                      >
                        <span>{btn.label}</span>
                        <span>›</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 bg-[#202c33] px-3 py-2 rounded-xl w-24">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          {/* WhatsApp Bottom Input */}
          <form onSubmit={handleSendText} className="p-2 bg-[#1f2c34] flex items-center gap-2 border-t border-slate-800">
            <button type="button" className="text-slate-400 hover:text-slate-200 p-1">
              <Paperclip className="w-4 h-4" />
            </button>
            <input
              type="text"
              placeholder={lang === 'mr' ? "येथे संदेश टाईप करा..." : "Type a message..."}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-[#2a3942] text-white text-xs px-3 py-2 rounded-xl focus:outline-none placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white hover:bg-[#029070] transition shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
