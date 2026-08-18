// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/DemoBankVoiceServicesView.tsx
================================================================================

```typescript
// components/views/platform/DemoBankVoiceServicesView.tsx

// Import necessary React hooks and types
import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react';
// Import a charting library for visualizations. Recharts is a great open-source choice.
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// --- TYPE DEFINITIONS ---

type VoiceOption = {
    name: string;
    lang: string;
    voice: SpeechSynthesisVoice;
};

type TranscriptionResult = {
    id: string;
    timestamp: Date;
    text: string;
    isFinal: boolean;
    confidence?: number;
};

type AIAnalysis = {
    sentiment: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
    sentimentScore: number;
    intent: 'General Inquiry' | 'Transaction' | 'Support Request' | 'Navigation' | 'Unknown';
    language: string;
    keywords: string[];
};

type ActivityLogItem = {
    id: string;
    type: 'TTS' | 'STT';
    content: string;
    timestamp: Date;
    analysis?: AIAnalysis;
    voice?: string;
};

type VoiceServicesState = {
    activityLog: ActivityLogItem[];
    ttsCharsToday: number;
    transcriptionMinutes: number;
    transcriptionAccuracy: number;
};

type VoiceServicesAction =
    | { type: 'ADD_LOG'; payload: ActivityLogItem }
    | { type: 'UPDATE_METRICS'; payload: { ttsChars?: number; transcriptionSeconds?: number } };


// --- UTILITY & MOCK FUNCTIONS ---

// Mock AI service call (e.g., to Gemini or ChatGPT)
const simulateAIAnalysis = async (text: string): Promise<AIAnalysis> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const sentimentScore = (Math.random() * 2) - 1; // -1 to 1
            const sentiment = sentimentScore > 0.3 ? 'Positive' : sentimentScore < -0.3 ? 'Negative' : 'Neutral';
            
            const intents: AIAnalysis['intent'][] = ['General Inquiry', 'Transaction', 'Support Request', 'Navigation'];
            const randomIntent = text.toLowerCase().includes('balance') || text.toLowerCase().includes('transfer') ? 'Transaction' : intents[Math.floor(Math.random() * intents.length)];

            // Simple keyword extraction
            const keywords = text.toLowerCase().split(' ').filter(word => word.length > 4 && !['about', 'please', 'could', 'would'].includes(word)).slice(0, 5);

            resolve({
                sentiment,
                sentimentScore,
                intent: randomIntent,
                language: 'en-US', // Mock language detection
                keywords,
            });
        }, 1500); // Simulate network latency
    });
};


// --- CUSTOM HOOKS ---

const useSpeechSynthesis = () => {
    const [voices, setVoices] = useState<VoiceOption[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setSupported(true);
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices();
                const mappedVoices = availableVoices
                    .map(voice => ({ name: voice.name, lang: voice.lang, voice }))
                    .filter(v => v.lang.startsWith('en')); // Filter for English voices for simplicity
                setVoices(mappedVoices);
            };

            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const speak = useCallback((text: string, voiceName?: string, rate = 1, pitch = 1) => {
        if (!supported || speaking) return;

        const utterance = new SpeechSynthesisUtterance(text);
        const selectedVoice = voices.find(v => v.name === voiceName);
        if (selectedVoice) {
            utterance.voice = selectedVoice.voice;
        }
        utterance.rate = rate;
        utterance.pitch = pitch;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    }, [supported, voices, speaking]);

    const cancel = useCallback(() => {
        if (speaking) {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    }, [speaking]);

    return { speak, cancel, speaking, voices, supported };
};

const useSpeechRecognition = (onResult: (result: TranscriptionResult) => void) => {
    const [isListening, setIsListening] = useState(false);
    const [supported, setSupported] = useState(false);
    const recognitionRef = React.useRef<any>(null); // Using 'any' for SpeechRecognition due to vendor prefixes

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);
            recognition.onerror = () => setIsListening(false);

            recognition.onresult = (event: any) => {
                let finalTranscript = '';
                let interimTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                if (finalTranscript) {
                    onResult({
                        id: `final-${Date.now()}`,
                        timestamp: new Date(),
                        text: finalTranscript.trim(),
                        isFinal: true,
                        confidence: event.results[event.results.length-1][0].confidence,
                    });
                }
                if (interimTranscript) {
                    onResult({
                        id: `interim-${Date.now()}`,
                        timestamp: new Date(),
                        text: interimTranscript.trim(),
                        isFinal: false,
                    });
                }
            };
            recognitionRef.current = recognition;
        }
    }, [onResult]);
    
    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    return { isListening, startListening, stopListening, supported };
};

// --- REDUCER ---

const initialState: VoiceServicesState = {
    activityLog: [],
    ttsCharsToday: 500000,
    transcriptionMinutes: 1200,
    transcriptionAccuracy: 98,
};

function voiceServicesReducer(state: VoiceServicesState, action: VoiceServicesAction): VoiceServicesState {
    switch (action.type) {
        case 'ADD_LOG':
            return {
                ...state,
                activityLog: [action.payload, ...state.activityLog].slice(0, 50), // Keep log size manageable
            };
        case 'UPDATE_METRICS':
            return {
                ...state,
                ttsCharsToday: state.ttsCharsToday + (action.payload.ttsChars || 0),
                transcriptionMinutes: state.transcriptionMinutes + Math.round((action.payload.transcriptionSeconds || 0) / 60),
            };
        default:
            return state;
    }
}


// --- UI SUB-COMPONENTS ---

// A more robust Card component. Assuming a similar one exists from the original code.
const Card: React.FC<{ title?: string; className?: string; children: React.ReactNode }> = ({ title, className, children }) => (
    <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6 shadow-lg ${className}`}>
        {title && <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>}
        {children}
    </div>
);


const VoiceServicesDashboard: React.FC<{ stats: VoiceServicesState }> = ({ stats }) => {
    const usageData = useMemo(() => [
        { name: '8am', tts: 4000, stt: 240 },
        { name: '10am', tts: 3000, stt: 139 },
        { name: '12pm', tts: 2000, stt: 980 },
        { name: '2pm', tts: 2780, stt: 390 },
        { name: '4pm', tts: 1890, stt: 480 },
        { name: '6pm', tts: 2390, stt: 380 },
        { name: '8pm', tts: 3490, stt: 430 },
    ], []);

    const intentData = useMemo(() => [
        { name: 'Transactions', value: 400 },
        { name: 'Support', value: 300 },
        { name: 'Inquiries', value: 300 },
        { name: 'Navigation', value: 200 },
    ], []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="text-center"><p className="text-3xl font-bold text-cyan-400">{stats.ttsCharsToday.toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">TTS Characters Used (Today)</p></Card>
            <Card className="text-center"><p className="text-3xl font-bold text-cyan-400">{stats.transcriptionMinutes.toLocaleString()}</p><p className="text-sm text-gray-400 mt-1">Minutes Transcribed (Today)</p></Card>
            <Card className="text-center"><p className="text-3xl font-bold text-cyan-400">{stats.transcriptionAccuracy}%</p><p className="text-sm text-gray-400 mt-1">Avg. Transcription Accuracy</p></Card>
            
            <Card title="API Usage (Last 12 Hours)" className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={usageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                        <Legend />
                        <Line type="monotone" dataKey="tts" name="TTS Chars" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line type="monotone" dataKey="stt" name="STT Mins" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>

            <Card title="User Intent Distribution">
                 <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={intentData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {intentData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }} />
                    </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};


const TextToSpeechPanel: React.FC<{ onGenerate: (text: string, voice?: string) => void }> = ({ onGenerate }) => {
    const { speak, cancel, speaking, voices, supported } = useSpeechSynthesis();
    const [text, setText] = useState('Welcome to Demo Bank. Ask me about your balance or recent transactions.');
    const [selectedVoice, setSelectedVoice] = useState<string>('');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    
    useEffect(() => {
        if (voices.length > 0 && !selectedVoice) {
            const defaultVoice = voices.find(v => v.name.includes('Google') && v.lang === 'en-US') || voices[0];
            setSelectedVoice(defaultVoice.name);
        }
    }, [voices, selectedVoice]);

    const handleSpeak = () => {
        speak(text, selectedVoice, rate, pitch);
        onGenerate(text, selectedVoice);
    };

    if (!supported) {
        return <Card title="Text-to-Speech"><p className="text-yellow-400">Your browser does not support the Web Speech API.</p></Card>;
    }
    
    return (
        <Card title="AI Text-to-Speech (TTS) Engine">
            <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full h-24 bg-gray-900/70 p-3 rounded text-white font-mono text-sm focus:ring-cyan-500 focus:border-cyan-500 transition"
                placeholder="Enter text to synthesize..."
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                    <label htmlFor="voice-select" className="block text-sm font-medium text-gray-400 mb-1">Voice</label>
                    <select
                        id="voice-select"
                        value={selectedVoice}
                        onChange={e => setSelectedVoice(e.target.value)}
                        className="w-full bg-gray-700 p-2 rounded text-white focus:ring-cyan-500 focus:border-cyan-500"
                    >
                        {voices.map(v => <option key={v.name} value={v.name}>{v.name} ({v.lang})</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="rate-slider" className="block text-sm font-medium text-gray-400 mb-1">Rate: {rate.toFixed(1)}</label>
                    <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(parseFloat(e.target.value))} className="w-full" />
                </div>
                 <div>
                    <label htmlFor="pitch-slider" className="block text-sm font-medium text-gray-400 mb-1">Pitch: {pitch.toFixed(1)}</label>
                    <input id="pitch-slider" type="range" min="0" max="2" step="0.1" value={pitch} onChange={e => setPitch(parseFloat(e.target.value))} className="w-full" />
                </div>
            </div>
            <button 
                onClick={speaking ? cancel : handleSpeak} 
                className={`w-full mt-4 py-2 rounded transition-colors ${speaking ? 'bg-red-600 hover:bg-red-700' : 'bg-cyan-600 hover:bg-cyan-700'}`}
            >
                {speaking ? 'Stop Speaking' : 'Generate & Speak'}
            </button>
        </Card>
    );
};


const SpeechToTextPanel: React.FC<{ onTranscribe: (result: TranscriptionResult, analysis: AIAnalysis) => void }> = ({ onTranscribe }) => {
    const [interimTranscript, setInterimTranscript] = useState('');
    const [finalTranscript, setFinalTranscript] = useState('');
    const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const handleResult = useCallback((result: TranscriptionResult) => {
        if (result.isFinal) {
            setInterimTranscript('');
            const newFinal = (finalTranscript + ' ' + result.text).trim();
            setFinalTranscript(newFinal);
            
            setIsAnalyzing(true);
            simulateAIAnalysis(newFinal).then(analysisResult => {
                setAnalysis(analysisResult);
                onTranscribe(result, analysisResult);
                setIsAnalyzing(false);
            });
        } else {
            setInterimTranscript(result.text);
        }
    }, [finalTranscript, onTranscribe]);
    
    const { isListening, startListening, stopListening, supported } = useSpeechRecognition(handleResult);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
        } else {
            setFinalTranscript('');
            setAnalysis(null);
            startListening();
        }
    };
    
    if (!supported) {
        return <Card title="Speech-to-Text"><p className="text-yellow-400">Your browser does not support the Web Speech API.</p></Card>;
    }
    
    return (
        <Card title="AI Speech-to-Text (STT) & Analysis">
            <div className="flex flex-col items-center">
                <button 
                    onClick={toggleListening}
                    className={`relative w-24 h-24 rounded-full transition-all duration-300 flex items-center justify-center
                        ${isListening ? 'bg-red-500 shadow-red-500/50' : 'bg-cyan-500 shadow-cyan-500/50'} 
                        text-white shadow-lg`}
                >
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
                    </svg>
                    {isListening && <div className="absolute inset-0 rounded-full bg-white/20 animate-ping"></div>}
                </button>
                <p className="mt-4 text-gray-400">{isListening ? 'Listening...' : 'Tap to start transcribing'}</p>
            </div>
            
            <div className="mt-6 p-4 bg-gray-900/70 rounded min-h-[100px]">
                <p className="text-white">{finalTranscript} <span className="text-gray-500">{interimTranscript}</span></p>
            </div>
            
            {(isAnalyzing || analysis) && (
                 <div className="mt-4 p-4 border border-gray-700 rounded">
                    <h4 className="font-semibold text-cyan-400 mb-2">AI Analysis</h4>
                    {isAnalyzing && <p className="text-gray-400">Analyzing speech...</p>}
                    {analysis && !isAnalyzing && (
                        <div className="text-sm space-y-2 text-gray-300">
                            <p><strong>Sentiment:</strong> {analysis.sentiment} ({analysis.sentimentScore.toFixed(2)})</p>
                            <p><strong>Predicted Intent:</strong> {analysis.intent}</p>
                            <p><strong>Keywords:</strong> {analysis.keywords.join(', ')}</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};


const ActivityLog: React.FC<{ log: ActivityLogItem[] }> = ({ log }) => (
    <Card title="Real-time Activity Log">
        <div className="h-96 overflow-y-auto pr-2">
            {log.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No activity yet. Use the tools above to see logs.</p>
            ) : (
                <ul className="space-y-4">
                    {log.map(item => (
                        <li key={item.id} className="p-3 bg-gray-900/50 rounded-md border-l-4 border-cyan-500">
                            <div className="flex justify-between items-center">
                                <span className={`text-sm font-bold ${item.type === 'TTS' ? 'text-purple-400' : 'text-green-400'}`}>{item.type} Request</span>
                                <span className="text-xs text-gray-500">{item.timestamp.toLocaleTimeString()}</span>
                            </div>
                            <p className="text-gray-300 mt-2 italic">"{item.content}"</p>
                            {item.voice && <p className="text-xs text-gray-500 mt-1">Voice: {item.voice}</p>}
                            {item.analysis && (
                                <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700 flex gap-4">
                                    <span>Sentiment: {item.analysis.sentiment}</span>
                                    <span>Intent: {item.analysis.intent}</span>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </Card>
);

// --- MAIN COMPONENT ---

const DemoBankVoiceServicesView: React.FC = () => {
    const [state, dispatch] = useReducer(voiceServicesReducer, initialState);
    
    const handleTtsGenerate = useCallback((text: string, voice?: string) => {
        const logItem: ActivityLogItem = {
            id: `tts-${Date.now()}`,
            type: 'TTS',
            content: text,
            timestamp: new Date(),
            voice: voice,
        };
        dispatch({ type: 'ADD_LOG', payload: logItem });
        dispatch({ type: 'UPDATE_METRICS', payload: { ttsChars: text.length } });
    }, []);
    
    const handleTranscription = useCallback((result: TranscriptionResult, analysis: AIAnalysis) => {
        const logItem: ActivityLogItem = {
            id: result.id,
            type: 'STT',
            content: result.text,
            timestamp: result.timestamp,
            analysis,
        };
        dispatch({ type: 'ADD_LOG', payload: logItem });
        // Assuming a fixed speech rate for demo metric calculation
        const durationSeconds = result.text.split(' ').length / 2.5;
        dispatch({ type: 'UPDATE_METRICS', payload: { transcriptionSeconds: durationSeconds } });
    }, []);

    return (
        <div className="space-y-8 p-4 sm:p-6">
            <header>
                <h1 className="text-4xl font-bold text-white tracking-tight">AI Voice Services Platform</h1>
                <p className="text-lg text-gray-400 mt-2">Harness the power of AI for text-to-speech, transcription, and conversational intelligence.</p>
            </header>
            
            <VoiceServicesDashboard stats={state} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TextToSpeechPanel onGenerate={handleTtsGenerate} />
                <SpeechToTextPanel onTranscribe={handleTranscription} />
            </div>

            <ActivityLog log={state.activityLog} />
        </div>
    );
};

export default DemoBankVoiceServicesView;
```