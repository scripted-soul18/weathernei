import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Bot, 
  User, 
  Sparkles, 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Zap, 
  AlertTriangle,
  Sprout,
  ShieldAlert,
  Anchor,
  Plane,
  ChevronDown
} from 'lucide-react';
import { processWeatherGptQuery } from '../services/aiEngine';
import { SUPPORTED_LANGUAGES, getTranslation } from '../services/translationService';

export default function ChatInterface({
  weatherData,
  currentPersona,
  onChangePersona,
  currentLanguage,
  initialQuery = "",
  onClearInitialQuery
}) {
  const t = getTranslation(currentLanguage);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      text: `👋 **Namaste! I am WeatherGPT**, your conversational AI for meteorological intelligence, disaster alerts, and climate advisory developed for the **Ministry of Earth Sciences (MoES)** & **India Meteorological Department (IMD)**.\n\nAsk me anything in **10 Indian languages** or use the quick prompt buttons below!`,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      metrics: null
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem("weathergpt_gemini_api_key") || "");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const messagesEndRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Handle external query trigger (e.g. from dashboard chip click)
  useEffect(() => {
    if (initialQuery && initialQuery.trim().length > 0) {
      handleSendMessage(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery]);

  // Save API key
  const handleSaveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("weathergpt_gemini_api_key", key);
    setShowApiKeyModal(false);
  };

  // Speech to Text (STT) setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || { voiceCode: "en-IN" };
      recognition.lang = activeLangObj.voiceCode;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };

      recognition.onerror = (e) => {
        console.warn("Speech recognition error:", e);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      speechRecognitionRef.current = recognition;
    }
  }, [currentLanguage]);

  const toggleListening = () => {
    if (!speechRecognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome/Edge or modern desktop browser.");
      return;
    }

    if (isListening) {
      speechRecognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        speechRecognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  // Text to Speech (TTS)
  const handleSpeak = (msgId, text) => {
    if (!window.speechSynthesis) return;

    if (speakingMessageId === msgId) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Strip markdown formatting for cleaner speech
    const cleanText = text.replace(/[*#_`>]/g, "").replace(/\n+/g, ". ");
    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    const activeLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || { voiceCode: "en-IN" };
    utterance.lang = activeLangObj.voiceCode;
    utterance.rate = 1.0;

    utterance.onend = () => setSpeakingMessageId(null);
    utterance.onerror = () => setSpeakingMessageId(null);

    setSpeakingMessageId(msgId);
    window.speechSynthesis.speak(utterance);
  };

  // Copy message text
  const handleCopy = (msgId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Send query to AI
  const handleSendMessage = async (customQuery = null) => {
    const queryToSend = customQuery || inputText;
    if (!queryToSend || queryToSend.trim().length === 0 || isLoading) return;

    const userMessageId = `user_${Date.now()}`;
    const userMessage = {
      id: userMessageId,
      sender: "user",
      text: queryToSend,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customQuery) setInputText("");
    setIsLoading(true);

    try {
      const response = await processWeatherGptQuery({
        query: queryToSend,
        persona: currentPersona,
        language: currentLanguage,
        weatherData,
        conversationHistory: messages,
        apiKey
      });

      const botMessageId = `bot_${Date.now()}`;
      const botMessage = {
        id: botMessageId,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        category: response.category,
        recommendation: response.recommendation,
        metrics: response.metrics
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot_err_${Date.now()}`,
          sender: "bot",
          text: `⚠️ **Meteorological Assistant Error:** Unable to synthesize response. Please try rephrasing your question or check network connection.`,
          timestamp: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonaIcon = (personaId) => {
    switch (personaId) {
      case "kisan": return <Sprout className="w-4 h-4 text-emerald-400" />;
      case "disaster": return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case "marine": return <Anchor className="w-4 h-4 text-cyan-400" />;
      case "aviation": return <Plane className="w-4 h-4 text-amber-400" />;
      default: return <User className="w-4 h-4 text-sky-400" />;
    }
  };

  return (
    <div className="flex flex-col h-[650px] rounded-2xl glass-panel border border-slate-700/60 shadow-2xl overflow-hidden">
      {/* Chat Header */}
      <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white font-display">WeatherGPT Conversational AI</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">
                MoES Intelligence
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Station: <strong className="text-slate-300">{weatherData?.location?.name || "All India"}</strong> • Persona: <span className="capitalize text-cyan-400 font-medium">{currentPersona}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Gemini API Key Config */}
          <button
            onClick={() => setShowApiKeyModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
            title="Configure Gemini LLM API Key (Optional)"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">{apiKey ? "AI Key Linked" : "Add AI Key"}</span>
          </button>

          {/* Reset Chat */}
          <button
            onClick={() => setMessages([messages[0]])}
            title="Clear Chat History"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => {
          const isBot = msg.sender === "bot";
          const isSpeaking = speakingMessageId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-lg transition-all ${
                  isBot
                    ? "bg-slate-900/90 text-slate-200 border border-slate-700/80 rounded-tl-sm"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm"
                }`}
              >
                {/* Message Recommendation Pill if present */}
                {msg.recommendation && (
                  <div className="mb-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>{msg.recommendation}</span>
                  </div>
                )}

                {/* Formatted Markdown Content */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.text.split("\n\n").map((paragraph, pIdx) => {
                    if (paragraph.startsWith("### ")) {
                      return <h4 key={pIdx} className="text-base font-bold text-white font-display mt-2 mb-1">{paragraph.replace("### ", "")}</h4>;
                    }
                    if (paragraph.startsWith("> ")) {
                      return (
                        <blockquote key={pIdx} className="p-2.5 my-2 rounded-lg bg-cyan-950/40 border-l-4 border-cyan-400 text-cyan-100 font-medium">
                          {paragraph.replace("> ", "")}
                        </blockquote>
                      );
                    }
                    return <p key={pIdx}>{paragraph}</p>;
                  })}
                </div>

                {/* Bottom Bar: Timestamp & Audio TTS / Copy buttons */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">{msg.timestamp}</span>
                  {isBot && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.text)}
                        title={isSpeaking ? t.stopSpeaking : t.speakResponse}
                        className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                          isSpeaking ? "text-cyan-400 animate-pulse font-semibold" : "text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        {isSpeaking ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        title="Copy Response"
                        className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isBot && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-cyan-400 shrink-0 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-cyan-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing meteorological ensemble datasets and synoptic charts...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {t.prompts.map((p, pIdx) => (
          <button
            key={pIdx}
            onClick={() => handleSendMessage(p)}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 hover:text-cyan-300 hover:bg-slate-700 border border-slate-700/80 whitespace-nowrap transition-colors"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
        {/* Voice STT Button */}
        <button
          onClick={toggleListening}
          title={isListening ? t.listening : t.voiceInput}
          className={`p-2.5 rounded-xl border transition-all ${
            isListening
              ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse shadow-lg shadow-red-500/20"
              : "bg-slate-800 border-slate-700 text-slate-300 hover:text-cyan-300 hover:bg-slate-700"
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={isListening ? t.listening : t.askAiPlaceholder}
          className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/40 transition-all"
        />

        {/* Send Button */}
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !inputText.trim()}
          className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Gemini API Key Modal Drawer */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white font-display">Configure Gemini AI API Key</h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              WeatherGPT operates 100% out of the box using our built-in <strong>IMD Meteorological Rule & Reasoning Engine</strong>.
              Optionally, link your Google Gemini API key to enable extended multi-turn synthesis and complex climate reasoning.
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gemini API Key (stored safely in local browser storage):
              </label>
              <input
                type="password"
                defaultValue={apiKey}
                id="gemini_key_input"
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const val = document.getElementById("gemini_key_input").value;
                  handleSaveApiKey(val);
                }}
                className="px-4 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-md"
              >
                Save Key
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
