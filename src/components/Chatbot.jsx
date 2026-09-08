import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import '../styles/Chatbot.css';

const SparkleIcon = () => (
  <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2L12.0366 7.96342L18 10L12.0366 12.0366L10 18L7.96342 12.0366L2 10L7.96342 7.96342L10 2Z" fill="currentColor"/>
    <path d="M19 14L19.8147 16.3853L22.2 17.2L19.8147 18.0147L19 20.4L18.1853 18.0147L15.8 17.2L18.1853 16.3853L19 14Z" fill="currentColor"/>
  </svg>
);

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = `You are Pravah News Assistant — a helpful, friendly AI chatbot for the Pravah News website.
Your job is to:
- Answer questions about news topics, current events, and journalism
- Help users find news articles and categories on Pravah News
- Explain news terms and topics in simple language
- Provide real-time assistance and use the user's page context.
- Always respond in the same language the user uses (Hindi or English)
- If asked about something unrelated to news/journalism, politely redirect to news topics.
Keep your answers short and to the point (2-4 sentences unless more detail is needed).`;

function Chatbot() {
  const { t } = useTranslation();
  
  const INITIAL_MESSAGES = [
    {
      role: 'assistant',
      text: t('botGreeting'),
    },
  ];

  const [isOpen, setIsOpen]         = useState(false);
  const [messages, setMessages]     = useState(INITIAL_MESSAGES);
  const [input, setInput]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [hasKey, setHasKey]         = useState(!!GEMINI_API_KEY && GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE');
  const messagesEndRef              = useRef(null);
  const inputRef                    = useRef(null);
  const cacheRef = useRef({});

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, messages]);

  const sendMessage = async () => {
    const userText = input.trim();
    if (!userText || loading) return;

    const userMsg = { role: 'user', text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    if (!hasKey) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: t('botApiKeyWarning'),
          },
        ]);
        setLoading(false);
      }, 600);
      return;
    }

    try {
      // Simple in‑memory cache to avoid repeated API calls for the same question
      const cache = cacheRef.current;
      if (cache[userText]) {
        setMessages((prev) => [...prev, { role: 'assistant', text: cache[userText] }]);
        setLoading(false);
        return;
      }

      // Limit the conversation history sent to the API (avoid sending the entire chat)
      const recentHistory = messages.slice(-6).filter(m => m.role !== 'assistant' || m.text !== t('botGreeting'));
      const history = recentHistory.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      // Provide current page context dynamically
      const pageContext = `\nCurrent User Context:\nPage Title: ${document.title}\nPage URL: ${window.location.href}`;
      const dynamicPrompt = SYSTEM_PROMPT + pageContext;

      const body = {
        system_instruction: { parts: [{ text: dynamicPrompt }] },
        contents: [
          ...history,
          { role: 'user', parts: [{ text: userText }] },
        ],
        // Google Search Grounding removed due to API quota constraints on free keys
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        },
      };

      const res = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || 'API Error');
      }

      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || t('botFallback');
      // Store in cache for future identical queries
      cacheRef.current[userText] = replyText;
      setMessages((prev) => [...prev, { role: 'assistant', text: replyText }]);
    } catch (err) {
      let errorMessage = err.message || 'Error';
      if (errorMessage.includes('quota') || errorMessage.includes('429')) {
        errorMessage = "API Quota Limit Reached. Please check your Gemini API Billing/Plan or try again tomorrow.";
      }
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: `❌ ${errorMessage}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => setMessages(INITIAL_MESSAGES);

  return (
    <>
      {/* ─── Floating Toggle Button ─── */}
      <button
        className={`chatbot-fab ${isOpen ? 'chatbot-fab-open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open News Assistant"
        title="Pravah News Assistant"
      >
        {isOpen ? (
          <span className="chatbot-fab-icon">✕</span>
        ) : (
          <>
            <span className="chatbot-fab-icon"><SparkleIcon /></span>
            <span className="chatbot-fab-ping" />
          </>
        )}
      </button>

      {/* ─── Chat Window ─── */}
      {isOpen && (
        <div className="chatbot-window animate-slide-up">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <div className="chatbot-avatar"><SparkleIcon /></div>
              <div>
                <span className="chatbot-name">{t('botName')}</span>
                <span className="chatbot-status">
                  <span className="chatbot-dot" />
                  {loading ? t('botTyping') : t('botOnline')}
                </span>
              </div>
            </div>
            <div className="chatbot-header-actions">
              <button className="chatbot-action-btn" onClick={clearChat} title="Clear chat">🗑️</button>
              <button className="chatbot-action-btn" onClick={() => setIsOpen(false)} title="Close">✕</button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-msg ${msg.role === 'user' ? 'chatbot-msg-user' : 'chatbot-msg-bot'}`}>
                {msg.role === 'assistant' && (
                  <div className="chatbot-bot-avatar"><SparkleIcon /></div>
                )}
                <div className="chatbot-bubble">
                  {msg.text.split('\n').map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chatbot-msg chatbot-msg-bot">
                <div className="chatbot-bot-avatar"><SparkleIcon /></div>
                <div className="chatbot-bubble chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          {messages.length === 1 && (
            <div className="chatbot-quick-prompts">
              {[t('quick1'), t('quick2'), t('quick3')].map((q) => (
                <button key={q} className="chatbot-quick-btn" onClick={() => { setInput(q); setTimeout(sendMessage, 50); }}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              ref={inputRef}
              className="chatbot-input"
              placeholder={t('botAskPlaceholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              disabled={loading}
            />
            <button
              className="chatbot-send-btn"
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              aria-label="Send"
            >
              {loading ? <span className="chatbot-send-spinner" /> : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Chatbot;
