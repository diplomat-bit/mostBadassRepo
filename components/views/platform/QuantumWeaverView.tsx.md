// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/views/platform/QuantumWeaverView.tsx.md
================================================================================

```tsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Bot, DollarSign, Map, Zap, Lightbulb, BrainCircuit } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming a Shadcn/UI setup
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Mock AI service - in a real app, this would make API calls to a backend
// that proxies requests to Gemini/ChatGPT.
const quantumWeaverAIService = {
  // Simulates the AI asking clarifying questions based on the pitch.
  startInquiry: async (pitch: string): Promise<string[]> => {
    console.log("AI Service: Starting inquiry for pitch:", pitch);
    await new Promise(res => setTimeout(res, 1500));
    return [
      "An intriguing concept. To begin, could you elaborate on your target audience? Who are the early adopters you envision?",
      "What is the core problem you are solving for this audience, and how is your solution uniquely better than existing alternatives?",
      "Describe your proposed business model. How will you generate revenue?",
      "What are the key technical components of your solution, and what potential challenges do you foresee in building them?",
      "Let's talk about your defensible moat. What will prevent competitors from replicating your success once you've proven the market?",
    ];
  },

  // Simulates the AI analyzing the conversation and giving a verdict.
  analyzePlan: async (conversation: { role: 'user' | 'ai'; content: string }[]): Promise<{
    analysis: string;
    loanAmount: number;
    viabilityScore: number;
    strengths: string[];
    weaknesses: string[];
  }> => {
    console.log("AI Service: Analyzing conversation:", conversation);
    await new Promise(res => setTimeout(res, 2500));
    const viabilityScore = Math.floor(Math.random() * 41) + 60; // 60-100
    return {
      analysis: `Based on our dialogue, your vision shows significant promise, particularly in its innovative approach to **customer engagement** and a clear understanding of the **market gap**. The proposed revenue model appears robust, though it will require careful validation. The primary challenge will be achieving **scalability** while maintaining quality. Overall, the foundational logic is sound.`,
      loanAmount: Math.floor(viabilityScore * 1000 + Math.random() * 50000),
      viabilityScore,
      strengths: [
        "Innovative Value Proposition",
        "Strong Market Understanding",
        "Clear Revenue Streams",
        "Passionate Founding Vision",
      ],
      weaknesses: [
        "Potential Scalability Hurdles",
        "Unvalidated Customer Acquisition Cost",
        "High Initial Technical Debt Risk",
        "Competitive Market Landscape",
      ],
    };
  },

  // Simulates the AI generating a coaching plan.
  generateCoachingPlan: async (analysis: any): Promise<any> => {
    console.log("AI Service: Generating coaching plan based on analysis:", analysis);
    await new Promise(res => setTimeout(res, 3000));
    return {
      title: "Project Genesis: The First 90 Days",
      phases: [
        {
          title: "Phase 1: Validation & Foundation (Days 1-30)",
          description: "Focus on validating core assumptions and building the essential foundation.",
          milestones: [
            { id: 1, text: "Conduct 20 customer discovery interviews to refine the problem statement.", status: 'todo' },
            { id: 2, text: "Develop a Minimum Viable Product (MVP) feature list based on interview feedback.", status: 'todo' },
            { id: 3, text: "Create a high-fidelity landing page to capture early interest and test messaging.", status: 'todo' },
            { id: 4, text: "Incorporate the legal entity and set up foundational business accounts.", status: 'todo' },
          ],
        },
        {
          title: "Phase 2: MVP Launch & Community Building (Days 31-60)",
          description: "Launch the initial product and cultivate a community of early adopters.",
          milestones: [
            { id: 5, text: "Deploy the MVP to a closed beta group.", status: 'todo' },
            { id: 6, text: "Establish a primary communication channel (e.g., Discord, Slack) for beta users.", status: 'todo' },
            { id: 7, text: "Implement an analytics framework to track key user engagement metrics.", status: 'todo' },
            { id: 8, text: "Iterate on the MVP based on user feedback, aiming for at least two major updates.", status: 'todo' },
          ],
        },
        {
          title: "Phase 3: Growth & Funding Prep (Days 61-90)",
          description: "Focus on initial growth levers and prepare for the next stage of funding.",
          milestones: [
            { id: 9, text: "Identify and test at least two customer acquisition channels.", status: 'todo' },
            { id: 10, text: "Develop a pitch deck using validated metrics from the MVP launch.", status: 'todo' },
            { id: 11, text: "Begin networking with potential angel investors and advisors.", status: 'todo' },
            { id: 12, text: "Create a 6-month product and hiring roadmap.", status: 'todo' },
          ],
        },
      ]
    };
  }
};

type Step = 'pitch' | 'inquiry' | 'verdict' | 'roadmap';
type Message = { role: 'user' | 'ai'; content: string };
type Milestone = { id: number; text: string; status: 'todo' | 'done' };

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

const StepPitch = ({ onPitchSubmit }) => {
  const [pitch, setPitch] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (pitch.trim()) {
      onPitchSubmit(pitch);
    }
  };

  return (
    <motion.div variants={itemVariants} className="w-full max-w-3xl mx-auto">
      <Card className="bg-gray-900/50 border-purple-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-2xl text-purple-300">
            <Lightbulb className="mr-3 h-8 w-8 text-purple-400" />
            The Genesis Seed: Pitch Your Vision
          </CardTitle>
          <CardDescription className="text-gray-400">
            Every great enterprise begins as a fragile idea. Plant your seed here. Describe the world you want to build, the problem you want to solve, the value you will create. Be bold.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="e.g., An AI-powered platform to help freelance writers find high-paying clients by analyzing market trends and personalizing pitches..."
              className="min-h-[200px] bg-gray-950/70 border-gray-700 text-gray-200 focus:ring-purple-500 focus:border-purple-500 text-base"
            />
            <Button disabled={!pitch.trim()} type="submit" className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg">
              Weave the First Thread <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StepInquiry = ({ initialPitch, onInquiryComplete }) => {
    const [conversation, setConversation] = useState<Message[]>([{ role: 'user', content: initialPitch }]);
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userResponse, setUserResponse] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            setIsLoading(true);
            const fetchedQuestions = await quantumWeaverAIService.startInquiry(initialPitch);
            setQuestions(fetchedQuestions);
            setConversation(prev => [...prev, { role: 'ai', content: fetchedQuestions[0] }]);
            setIsLoading(false);
        };
        fetchQuestions();
    }, [initialPitch]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [conversation]);

    const handleResponseSubmit = (e) => {
        e.preventDefault();
        if (!userResponse.trim()) return;

        const newConversation: Message[] = [
            ...conversation,
            { role: 'user', content: userResponse },
        ];
        
        if (currentQuestionIndex < questions.length - 1) {
            const nextQuestionIndex = currentQuestionIndex + 1;
            newConversation.push({ role: 'ai', content: questions[nextQuestionIndex] });
            setCurrentQuestionIndex(nextQuestionIndex);
        } else {
            onInquiryComplete(newConversation);
        }
        
        setConversation(newConversation);
        setUserResponse('');
    };

    const isComplete = currentQuestionIndex >= questions.length - 1;

    return (
        <motion.div variants={itemVariants} className="w-full max-w-4xl mx-auto">
            <Card className="bg-gray-900/50 border-green-500/30 backdrop-blur-sm h-[70vh] flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center text-2xl text-green-300">
                        <BrainCircuit className="mr-3 h-8 w-8 text-green-400" />
                        The Crucible: Maieutic Inquiry
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        The AI co-founder probes your idea, not to find flaws, but to forge strength. Answer thoughtfully to temper your vision in the fires of logic.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col overflow-hidden">
                    <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
                        <div className="space-y-6">
                            {conversation.slice(1).map((msg, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`flex items-start gap-4 ${msg.role === 'ai' ? '' : 'justify-end'}`}
                                >
                                    {msg.role === 'ai' && (
                                        <Avatar className="border border-green-500/50">
                                            <AvatarFallback className="bg-green-900 text-green-300"><Bot /></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`max-w-xl rounded-xl p-4 ${msg.role === 'ai' ? 'bg-gray-800 text-gray-200' : 'bg-purple-800 text-white'}`}>
                                        <Markdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-sm max-w-none">{msg.content}</Markdown>
                                    </div>
                                    {msg.role === 'user' && (
                                        <Avatar className="border border-purple-500/50">
                                            <AvatarFallback className="bg-purple-900 text-purple-300">U</AvatarFallback>
                                        </Avatar>
                                    )}
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex items-start gap-4">
                                    <Avatar className="border border-green-500/50">
                                        <AvatarFallback className="bg-green-900 text-green-300"><Bot /></AvatarFallback>
                                    </Avatar>
                                    <div className="max-w-xl rounded-xl p-4 bg-gray-800 text-gray-200 flex items-center space-x-2">
                                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse delay-0"></span>
                                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse delay-150"></span>
                                        <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse delay-300"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <form onSubmit={handleResponseSubmit} className="mt-4 flex gap-4 items-center border-t border-gray-700 pt-4">
                         <Textarea
                            value={userResponse}
                            onChange={(e) => setUserResponse(e.target.value)}
                            placeholder="Your response..."
                            disabled={isLoading}
                            className="flex-grow bg-gray-950/70 border-gray-700 text-gray-200 focus:ring-purple-500 focus:border-purple-500"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleResponseSubmit(e);
                                }
                            }}
                        />
                        <Button disabled={!userResponse.trim() || isLoading} type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold">
                            {isComplete ? 'Finalize Plan' : 'Respond'} <Zap className="ml-2 h-5 w-5" />
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const StepVerdict = ({ conversation, onVerdictAccepted }) => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAnalysis = async () => {
      setIsLoading(true);
      const analysisResult = await quantumWeaverAIService.analyzePlan(conversation);
      setResult(analysisResult);
      setIsLoading(false);
    };
    getAnalysis();
  }, [conversation]);

  if (isLoading) {
    return (
      <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center text-cyan-300">
        <BrainCircuit className="h-16 w-16 animate-spin-slow text-cyan-400 mb-4" />
        <h2 className="text-2xl font-bold">Quantum Weaver is analyzing the threads...</h2>
        <p className="text-gray-400">Synthesizing dialogue, evaluating potential, calculating viability...</p>
        <Progress value={50} className="w-1/2 mt-4 animate-pulse" />
      </motion.div>
    );
  }

  if (!result) return null;

  return (
    <motion.div variants={itemVariants} className="w-full max-w-5xl mx-auto">
      <Card className="bg-gray-900/50 border-cyan-500/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center text-3xl text-cyan-300">
            <Sparkles className="mr-3 h-10 w-10 text-cyan-400" />
            The Verdict & The Endowment
          </CardTitle>
          <CardDescription className="text-gray-400">
            The crucible has cooled. The AI patron assesses the forged idea and grants the lifeblood of capital your new world needs to survive its infancy.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <Alert className="bg-gray-800/60 border-gray-700">
                    <AlertTitle className="text-cyan-300 font-bold">AI Analysis Summary</AlertTitle>
                    <AlertDescription className="text-gray-300">
                        <Markdown remarkPlugins={[remarkGfm]} className="prose prose-invert prose-sm max-w-none">{result.analysis}</Markdown>
                    </AlertDescription>
                </Alert>
                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-green-900/30 border-green-500/50">
                        <CardHeader><CardTitle className="text-green-300 text-lg">Strengths</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                {result.strengths.map(s => <li key={s}>{s}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                    <Card className="bg-red-900/30 border-red-500/50">
                        <CardHeader><CardTitle className="text-red-300 text-lg">Potential Weaknesses</CardTitle></CardHeader>
                        <CardContent>
                            <ul className="list-disc list-inside text-gray-300 space-y-1">
                                {result.weaknesses.map(w => <li key={w}>{w}</li>)}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4 bg-gray-950/50 p-6 rounded-lg border border-cyan-700">
                <h3 className="text-xl font-bold text-gray-300">Simulated Seed Capital</h3>
                <div className="text-5xl font-extrabold text-cyan-300 tracking-tight">
                    ${result.loanAmount.toLocaleString()}
                </div>
                <p className="text-center text-gray-400">This represents the initial capital injection to fuel your first 90 days.</p>
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-sm font-medium text-gray-300">
                        <span>Viability Score</span>
                        <span>{result.viabilityScore}%</span>
                    </div>
                    <Progress value={result.viabilityScore} className="[&>div]:bg-cyan-400" />
                </div>
                 <Button onClick={() => onVerdictAccepted(result)} className="mt-6 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-lg">
                    Accept Endowment & Generate Roadmap <Map className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StepRoadmap = ({ analysis, onReset }) => {
    const [plan, setPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [milestones, setMilestones] = useState<Milestone[]>([]);

    useEffect(() => {
        const getPlan = async () => {
            setIsLoading(true);
            const generatedPlan = await quantumWeaverAIService.generateCoachingPlan(analysis);
            setPlan(generatedPlan);
            setMilestones(generatedPlan.phases.flatMap(p => p.milestones));
            setIsLoading(false);
        };
        getPlan();
    }, [analysis]);
    
    const toggleMilestone = (id: number) => {
        setMilestones(prev => prev.map(m => m.id === id ? {...m, status: m.status === 'done' ? 'todo' : 'done'} : m));
    };

    const completedMilestones = milestones.filter(m => m.status === 'done').length;
    const totalMilestones = milestones.length;
    const progress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

    if (isLoading) {
        return (
          <motion.div variants={itemVariants} className="flex flex-col items-center justify-center text-center text-purple-300">
            <Map className="h-16 w-16 animate-pulse text-purple-400 mb-4" />
            <h2 className="text-2xl font-bold">Charting the Course...</h2>
            <p className="text-gray-400">The AI Mentor is distilling wisdom from a thousand successful ventures, tailoring a unique path for your dream.</p>
          </motion.div>
        );
    }
    
    if (!plan) return null;

    return (
        <motion.div variants={itemVariants} className="w-full max-w-6xl mx-auto">
            <Card className="bg-gray-900/50 border-orange-500/30 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="flex items-center text-3xl text-orange-300">
                                <Map className="mr-3 h-10 w-10 text-orange-400" />
                                The Weaver's Blueprint: Your 90-Day Odyssey
                            </CardTitle>
                            <CardDescription className="text-gray-400 mt-1">
                                A dream needs a plan. This is your guide through the treacherous early days, ensuring your creation is born with a fighting chance.
                            </CardDescription>
                        </div>
                        <Button onClick={onReset} variant="outline" className="border-purple-400 text-purple-300 hover:bg-purple-900/50 hover:text-purple-200">
                            Start a New Weaving
                        </Button>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between text-sm font-medium text-gray-300 mb-1">
                            <span>Overall Progress</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-yellow-500" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plan.phases.map((phase, index) => (
                            <motion.div
                                key={phase.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.2 }}
                            >
                                <Card className="bg-gray-950/60 border-gray-800 h-full">
                                    <CardHeader>
                                        <CardTitle className="text-xl text-orange-400">Phase {index + 1}: {phase.title}</CardTitle>
                                        <CardDescription className="text-gray-500">{phase.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-3">
                                            {phase.milestones.map(milestone => {
                                                const currentMilestone = milestones.find(m => m.id === milestone.id);
                                                return (
                                                    <li 
                                                        key={milestone.id} 
                                                        className="flex items-center text-gray-300 cursor-pointer group"
                                                        onClick={() => toggleMilestone(milestone.id)}
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mr-3 flex items-center justify-center ${currentMilestone?.status === 'done' ? 'border-green-500 bg-green-500' : 'border-gray-600 group-hover:border-orange-500'}`}>
                                                            {currentMilestone?.status === 'done' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>✓</motion.div>}
                                                        </div>
                                                        <span className={`${currentMilestone?.status === 'done' ? 'line-through text-gray-500' : ''}`}>{milestone.text}</span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const QuantumWeaverView = () => {
  const [step, setStep] = useState<Step>('pitch');
  const [pitch, setPitch] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handlePitchSubmit = (submittedPitch: string) => {
    setPitch(submittedPitch);
    setStep('inquiry');
  };

  const handleInquiryComplete = (finalConversation: Message[]) => {
    setConversation(finalConversation);
    setStep('verdict');
  };

  const handleVerdictAccepted = (result: any) => {
    setAnalysisResult(result);
    setStep('roadmap');
  };

  const handleReset = () => {
    setPitch('');
    setConversation([]);
    setAnalysisResult(null);
    setStep('pitch');
  };

  const renderStep = () => {
    switch (step) {
      case 'pitch':
        return <StepPitch onPitchSubmit={handlePitchSubmit} />;
      case 'inquiry':
        return <StepInquiry initialPitch={pitch} onInquiryComplete={handleInquiryComplete} />;
      case 'verdict':
        return <StepVerdict conversation={conversation} onVerdictAccepted={handleVerdictAccepted} />;
      case 'roadmap':
        return <StepRoadmap analysis={analysisResult} onReset={handleReset} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  const stepIndex = { pitch: 0, inquiry: 1, verdict: 2, roadmap: 3 }[step];
  const steps = ["Pitch", "Inquiry", "Verdict", "Roadmap"];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans p-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black">
        <div className="absolute inset-0 bg-grid-purple-500/[0.05] [mask-image:linear-gradient(to_bottom,white_5%,transparent_100%)]"></div>
        <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-400">
                Quantum Weaver
            </h1>
            <p className="text-xl text-gray-400 mt-2 max-w-3xl mx-auto">
                The high-tech forge where a thread of an idea is woven into the fabric of a tangible enterprise.
            </p>
        </motion.div>
        
        {/* Stepper UI */}
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="flex items-center justify-between">
                {steps.map((s, i) => (
                    <React.Fragment key={s}>
                        <div className="flex flex-col items-center">
                            <motion.div 
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${stepIndex >= i ? 'bg-purple-600 border-purple-400' : 'bg-gray-700 border-gray-500'}`}
                                animate={{ scale: stepIndex === i ? 1.2 : 1 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                                {stepIndex > i ? '✓' : i + 1}
                            </motion.div>
                            <p className={`mt-2 text-sm ${stepIndex >= i ? 'text-purple-300' : 'text-gray-500'}`}>{s}</p>
                        </div>
                        {i < steps.length - 1 && (
                            <motion.div 
                                className="flex-1 h-1 bg-gray-700 rounded-full mx-4"
                                initial={false}
                                animate={{
                                    background: `linear-gradient(to right, #8B5CF6 ${stepIndex > i ? 100 : (stepIndex === i ? 50 : 0)}%, #4B5563 ${stepIndex > i ? 100 : (stepIndex === i ? 50 : 0)}%)`
                                }}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        <main className="flex items-start justify-center">
            <AnimatePresence mode="wait">
                <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    {renderStep()}
                </motion.div>
            </AnimatePresence>
        </main>
    </div>
  );
};

export default QuantumWeaverView;
```