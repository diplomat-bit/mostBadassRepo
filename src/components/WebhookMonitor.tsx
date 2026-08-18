// REPOSITORY SOURCE: diplomat-bit/partnerportal-microsoft | PATH: diplomat-bit-partnerportal-microsoft-81d9840/src/components/WebhookMonitor.tsx
================================================================================

import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Activity, Clock, Terminal } from 'lucide-react';

export const WebhookMonitor: React.FC = () => {
  const [webhooks, setWebhooks] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'webhooks'), orderBy('timestamp', 'desc'), limit(5));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setWebhooks(snapshot.docs.map(doc => doc.data()));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'webhooks'));

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-[#1E1E1E] text-[#D4D4D4] font-mono text-[10px] p-3 rounded-t-lg border-t border-[#333333] fixed bottom-8 left-64 right-0 z-30">
      <div className="flex items-center gap-2 mb-2 border-b border-[#333333] pb-1">
        <Terminal size={12} className="text-[#0078D4]" />
        <span className="font-bold uppercase tracking-wider">System Webhook Monitor</span>
        <div className="flex items-center gap-1 ml-auto">
          <div className="w-1.5 h-1.5 bg-[#107C10] rounded-full animate-pulse" />
          <span className="text-[#107C10]">LIVE</span>
        </div>
      </div>
      <div className="space-y-1 max-h-24 overflow-y-auto">
        {webhooks.length === 0 ? (
          <div className="opacity-50 italic">Waiting for incoming webhooks...</div>
        ) : (
          webhooks.map((w, i) => (
            <div key={w.id} className="flex items-start gap-2 hover:bg-white/5 p-0.5 rounded transition-colors">
              <span className="text-[#605E5C] whitespace-nowrap">[{new Date(w.timestamp).toLocaleTimeString()}]</span>
              <span className="text-[#0078D4] font-bold">{w.type}</span>
              <span className="truncate opacity-80">{JSON.stringify(w.payload)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
