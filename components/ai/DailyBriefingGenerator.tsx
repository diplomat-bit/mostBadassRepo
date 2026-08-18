// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/ai/DailyBriefingGenerator.tsx
================================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, Loader2, RefreshCw, Share2, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { fetchDailyBriefing, generateDailyBriefing } from '@/services/ai/dailyBriefingService';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFinancialGoals } from '@/hooks/useFinancialGoals';
import { useInvestmentPortfolio } from '@/hooks/useInvestmentPortfolio';
import { useBudgets } from '@/hooks/useBudgets';
import { useTransactions } from '@/hooks/useTransactions';
import { getMarketMovers } from '@/data/marketMovers';
import { getUpcomingBills } from '@/data/upcomingBills';
import { getNotifications } from '@/data/notifications';
import { getFinancialGoals } from '@/data/financialGoals';
import { getBudgets } from '@/data/budgets';
import { getPortfolioAssets } from '@/data/portfolioAssets';
import { getTransactions } from '@/data/transactions';
import { getCreditScore } from '@/data/creditScore';
import { usePreferences } from '@/components/preferences/usePreferences';
import { DailyBriefingPreferences, Tone, Length, FocusArea } from '@/components/preferences/preferenceTypes';
import { logUserActivity } from '@/data/accessLogs';

interface DailyBriefingGeneratorProps {
  className?: string;
}

const defaultBriefingPreferences: DailyBriefingPreferences = {
  tone: Tone.Neutral,
  length: Length.Medium,
  focusAreas: [FocusArea.MarketSummary, FocusArea.PersonalFinance, FocusArea.GoalsProgress],
  includeMarketData: true,
  includePersonalizedInsights: true,
  deliveryTime: '08:00',
};

const DailyBriefingGenerator: React.FC<DailyBriefingGeneratorProps> = ({ className }) => {
  const { user } = useAuth();
  const [briefing, setBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { preferences, updatePreference } = usePreferences(user?.id || 'guest');
  const briefingPreferences = preferences.dailyBriefing || defaultBriefingPreferences;

  // Fetch relevant data for the briefing
  const { financialGoals, isLoading: loadingGoals } = useFinancialGoals();
  const { portfolio, isLoading: loadingPortfolio } = useInvestmentPortfolio();
  const { budgets, isLoading: loadingBudgets } = useBudgets();
  const { transactions, isLoading: loadingTransactions } = useTransactions();
  const [marketMovers, setMarketMovers] = useState<any[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [creditScore, setCreditScore] = useState<number | null>(null);

  useEffect(() => {
    const loadBriefingData = async () => {
      // Simulate fetching data from mock/demo services
      setMarketMovers(getMarketMovers());
      setUpcomingBills(getUpcomingBills());
      setNotifications(getNotifications());
      setCreditScore(getCreditScore().score);
    };
    loadBriefingData();
  }, []);

  const dataContext = {
    userProfile: user,
    financialGoals: financialGoals,
    investmentPortfolio: portfolio,
    budgets: budgets,
    transactions: transactions,
    marketMovers: marketMovers,
    upcomingBills: upcomingBills,
    notifications: notifications,
    creditScore: creditScore,
  };

  const handleGenerateBriefing = useCallback(async (customPreferences?: DailyBriefingPreferences) => {
    if (!user) {
      setError('Please log in to generate your daily briefing.');
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      logUserActivity(user.id, 'generate_daily_briefing', { preferences: customPreferences || briefingPreferences });
      const generated = await generateDailyBriefing(user.id, dataContext, customPreferences || briefingPreferences);
      setBriefing(generated);
      toast.success('Daily briefing generated successfully!');
    } catch (err) {
      setError('Failed to generate briefing. Please try again.');
      console.error('Error generating daily briefing:', err);
      toast.error('Failed to generate daily briefing.');
    } finally {
      setIsGenerating(false);
    }
  }, [user, dataContext, briefingPreferences]);

  const fetchExistingBriefing = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const existing = await fetchDailyBriefing(user.id);
      if (existing) {
        setBriefing(existing.content);
      }
    } catch (err) {
      console.error('Error fetching existing daily briefing:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchExistingBriefing();
  }, [fetchExistingBriefing]);

  const handlePreferenceChange = (key: keyof DailyBriefingPreferences, value: any) => {
    updatePreference('dailyBriefing', { ...briefingPreferences, [key]: value });
  };

  const handleFocusAreaChange = (area: FocusArea, isChecked: boolean) => {
    let updatedAreas = briefingPreferences.focusAreas ? [...briefingPreferences.focusAreas] : [];
    if (isChecked && !updatedAreas.includes(area)) {
      updatedAreas.push(area);
    } else if (!isChecked && updatedAreas.includes(area)) {
      updatedAreas = updatedAreas.filter((a) => a !== area);
    }
    handlePreferenceChange('focusAreas', updatedAreas);
  };

  const handleShareBriefing = () => {
    if (briefing) {
      // In a real application, this would involve sending the briefing to a backend service
      // that handles secure sharing (e.g., email, messaging platform, internal communication tool).
      // For this demo, we'll just copy it to the clipboard.
      navigator.clipboard.writeText(briefing);
      toast.info('Briefing copied to clipboard. (In a real app, this would trigger secure sharing options.)');
      logUserActivity(user?.id || 'guest', 'share_daily_briefing', { length: briefing.length });
    } else {
      toast.warning('No briefing to share!');
    }
  };

  const isLoadingData = isLoading || loadingGoals || loadingPortfolio || loadingBudgets || loadingTransactions;

  return (
    <Card className={`relative ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <BrainCircuit className="h-6 w-6 text-primary" /> Daily AI Briefing
        </CardTitle>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => handleGenerateBriefing()} disabled={isGenerating || isLoadingData}>
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Generate New Briefing</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleShareBriefing} disabled={!briefing}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Share Briefing</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Briefing Settings</DialogTitle>
                <DialogDescription>
                  Customize how your daily AI financial briefing is generated.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tone" className="text-right">Tone</Label>
                  <Select
                    value={briefingPreferences.tone}
                    onValueChange={(value: Tone) => handlePreferenceChange('tone', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select a tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Tone).map((tone) => (
                        <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="length" className="text-right">Length</Label>
                  <Select
                    value={briefingPreferences.length}
                    onValueChange={(value: Length) => handlePreferenceChange('length', value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Length).map((length) => (
                        <SelectItem key={length} value={length}>{length}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Focus Areas</Label>
                  <div className="col-span-3 grid grid-cols-2 gap-2">
                    {Object.values(FocusArea).map((area) => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox
                          id={area}
                          checked={briefingPreferences.focusAreas?.includes(area)}
                          onCheckedChange={(checked) => handleFocusAreaChange(area, checked as boolean)}
                        />
                        <label htmlFor={area} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          {area}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="includeMarketData" className="text-right">Market Data</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="includeMarketData"
                      checked={briefingPreferences.includeMarketData}
                      onCheckedChange={(checked) => handlePreferenceChange('includeMarketData', checked)}
                    />
                    <label htmlFor="includeMarketData" className="text-sm font-medium leading-none">
                      Include market summary
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="includePersonalizedInsights" className="text-right">Personalized Insights</Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Checkbox
                      id="includePersonalizedInsights"
                      checked={briefingPreferences.includePersonalizedInsights}
                      onCheckedChange={(checked) => handlePreferenceChange('includePersonalizedInsights', checked)}
                    />
                    <label htmlFor="includePersonalizedInsights" className="text-sm font-medium leading-none">
                      Include insights based on your financial data
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="deliveryTime" className="text-right">Delivery Time</Label>
                  <input
                    id="deliveryTime"
                    type="time"
                    className="col-span-3 border p-2 rounded-md"
                    value={briefingPreferences.deliveryTime}
                    onChange={(e) => handlePreferenceChange('deliveryTime', e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => {
                  handleGenerateBriefing(briefingPreferences); // Regenerate with new settings
                  setIsSettingsOpen(false);
                }}>
                  Save & Regenerate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingData && (
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading financial data...
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {!isLoadingData && !briefing && !error && !isGenerating && (
          <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
            <p className="mb-4">Your daily financial briefing will appear here.</p>
            <Button onClick={() => handleGenerateBriefing()} disabled={isGenerating}>
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BrainCircuit className="h-4 w-4 mr-2" />}
              Generate My First Briefing
            </Button>
          </div>
        )}
        {(briefing || isGenerating) && (
          <div className="relative">
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg text-primary">Generating your briefing...</span>
              </div>
            )}
            <div className={`prose dark:prose-invert max-w-none text-sm transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
              {briefing ? (
                // Render markdown content
                briefing.split('\n').map((paragraph, index) => {
                  if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-semibold mt-4 mb-2">{paragraph.substring(4)}</h3>;
                  }
                  if (paragraph.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold mt-6 mb-3">{paragraph.substring(3)}</h2>;
                  }
                  if (paragraph.startsWith('* ')) {
                    return <li key={index} className="ml-4">{paragraph.substring(2)}</li>;
                  }
                  if (paragraph.trim() === '') {
                    return <br key={index} />;
                  }
                  return <p key={index} className="mb-2">{paragraph}</p>;
                })
              ) : (
                <p>No briefing content available.</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyBriefingGenerator;