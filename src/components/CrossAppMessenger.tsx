// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/CrossAppMessenger.tsx
================================================================================

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limit } from 'firebase/firestore';

interface Message {
  text: string;
  sender: 'me' | 'remote';
  timestamp: Date;
  senderApp?: string;
}

export const CrossAppMessenger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const appName = "App B"; // This app is App B

  useEffect(() => {
    // 1. Listen to Firestore for real-time sync
    const q = query(
      collection(db, 'cross_app_messages'),
      orderBy('timestamp', 'asc'),
      limit(50)
    );

    const unsubscribeFirestore = onSnapshot(q, (snapshot) => {
      const syncedMessages: Message[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          text: data.text,
          sender: data.senderApp === appName ? 'me' : 'remote',
          timestamp: data.timestamp?.toDate() || new Date(),
          senderApp: data.senderApp
        };
      });
      setMessages(syncedMessages);
      
      // If a new message arrives and it's not from us, open the chat
      const lastMsg = syncedMessages[syncedMessages.length - 1];
      if (lastMsg && lastMsg.sender === 'remote' && !isOpen) {
        setIsOpen(true);
      }
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'cross_app_messages'));

    // 2. Listen to postMessage for direct communication (optional but kept as requested)
    const handlePostMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'CROSS_APP_MSG') {
        console.log("Received direct postMessage from App A:", event.data.text);
        // Note: We don't write to Firestore here because App A should have written it already
        // if it's using the same shared Firestore. If not, we could write it here.
        // For now, we rely on Firestore for the "same conversation" sync.
      }
    };

    window.addEventListener('message', handlePostMessage);
    return () => {
      unsubscribeFirestore();
      window.removeEventListener('message', handlePostMessage);
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputText.trim() || !auth.currentUser) return;

    const text = inputText;
    setInputText('');

    try {
      // 1. Write to Firestore for real-time sync
      await addDoc(collection(db, 'cross_app_messages'), {
        id: crypto.randomUUID(),
        text: text,
        senderApp: appName,
        timestamp: serverTimestamp(),
        userId: auth.currentUser.uid
      });

      // 2. Send via postMessage for direct communication
      const payload = { type: 'CROSS_APP_MSG', text: text };
      window.parent.postMessage(payload, '*');
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-12 right-6 w-12 h-12 bg-[#0078D4] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#005A9E] transition-all z-50 group"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-3 px-2 py-1 bg-[#323130] text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Cross-App Messenger
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-12 right-6 w-80 bg-white shadow-2xl border border-[#EDEBE9] rounded-lg z-50 flex flex-col transition-all ${isMinimized ? 'h-12' : 'h-96'}`}>
      {/* Header */}
      <div className="h-12 bg-[#0078D4] text-white px-4 flex items-center justify-between rounded-t-lg shrink-0">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} />
          <span className="text-sm font-semibold">Support (App A)</span>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F3F2F1]">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 opacity-50">
                <MessageSquare size={32} className="mb-2" />
                <p className="text-xs">No messages yet. Send a message to App A to start the conversation.</p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.sender === 'me' 
                      ? 'bg-[#0078D4] text-white rounded-br-none' 
                      : 'bg-white text-[#323130] border border-[#EDEBE9] rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-[#605E5C] mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#EDEBE9] flex gap-2">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 text-sm bg-[#F3F2F1] border-none rounded px-3 py-2 outline-none focus:ring-1 focus:ring-[#0078D4]"
            />
            <button 
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="p-2 bg-[#0078D4] text-white rounded hover:bg-[#005A9E] disabled:opacity-50 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};
