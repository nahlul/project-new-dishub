import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Halo! Saya CS AI Trans Koetaradja. Ada yang bisa saya bantu tentang layanan Trans Koetaradja? 😊'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, session_id: `user_${Date.now()}` })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            if (!data.startsWith('ERROR:')) {
              assistantMessage += data;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'assistant', content: assistantMessage };
                return newMessages;
              });
            }
          }
        }
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Hubungi kami di +62 811 6712349.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button onClick={() => setIsOpen(true)} className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white shadow-2xl">
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">AI</span>
          </Button>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col">
            <div className="bg-gradient-to-r from-sky-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><Bot className="w-6 h-6" /></div>
                <div>
                  <h3 className="font-bold">CS AI Trans Koetaradja</h3>
                  <p className="text-xs">Online - Siap Membantu</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full"><X className="w-5 h-5" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-start space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-sky-600' : 'bg-gray-300'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-gray-700" />}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white text-gray-800'}`}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && <div className="flex justify-start"><div className="bg-white rounded-2xl px-4 py-3"><div className="flex space-x-1"><div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" /><div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></div></div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ketik pertanyaan..." className="flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sky-500" disabled={isLoading} />
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} className="bg-sky-600 px-4 rounded-xl"><Send className="w-5 h-5" /></Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">Powered by AI</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;
