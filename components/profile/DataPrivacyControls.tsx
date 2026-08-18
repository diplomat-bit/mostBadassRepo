// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/profile/DataPrivacyControls.tsx
================================================================================

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { ExportDataService } from '@/services/data/ExportDataService';
import { AccountDeletionService } from '@/services/user/AccountDeletionService';
import { DataPrivacyService } from '@/services/data/DataPrivacyService';
import { ConsentManagementView } from '@/components/views/megadashboard/regulation/ConsentManagementView';
import { Loader2 } from 'lucide-react';

const DataPrivacyControls: React.FC = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [dataSharingConsent, setDataSharingConsent] = useState(user?.privacySettings?.dataSharingConsent || false);
  const [personalizedAdsConsent, setPersonalizedAdsConsent] = useState(user?.privacySettings?.personalizedAdsConsent || false);
  const [researchUseConsent, setResearchUseConsent] = useState(user?.privacySettings?.researchUseConsent || false);
  const [marketingCommunicationsConsent, setMarketingCommunicationsConsent] = useState(user?.privacySettings?.marketingCommunicationsConsent || false);
  const [aiModelTrainingConsent, setAiModelTrainingConsent] = useState(user?.privacySettings?.aiModelTrainingConsent || false);

  const handleExportData = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to export data.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);
    try {
      const exportResult = await ExportDataService.requestDataExport(user.id);
      toast({
        title: 'Data Export Initiated',
        description: exportResult.message || 'Your data export has been initiated and will be sent to your registered email.',
      });
    } catch (error: any) {
      console.error('Data export failed:', error);
      toast({
        title: 'Export Failed',
        description: error.message || 'There was an error initiating your data export. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to delete your account.',
        variant: 'destructive',
      });
      return;
    }

    if (deleteConfirmation !== user.email) {
      toast({
        title: 'Invalid Confirmation',
        description: 'Please type your email address correctly to confirm account deletion.',
        variant: 'destructive',
      });
      return;
    }

    setIsDeleting(true);
    try {
      await AccountDeletionService.requestAccountDeletion(user.id);
      toast({
        title: 'Account Deletion Request Received',
        description: 'Your account deletion request has been submitted. You will receive an email with further instructions.',
      });
      logout(); // Log out the user after deletion request
    } catch (error: any) {
      console.error('Account deletion failed:', error);
      toast({
        title: 'Deletion Failed',
        description: error.message || 'There was an error processing your account deletion. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePrivacySettingChange = async (settingName: string, value: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to update privacy settings.',
        variant: 'destructive',
      });
      return;
    }

    setter(value); // Optimistically update UI
    try {
      await DataPrivacyService.updatePrivacySetting(user.id, settingName, value);
      toast({
        title: 'Settings Updated',
        description: `${settingName} preference has been updated.`,
      });
    } catch (error: any) {
      console.error(`Failed to update ${settingName}:`, error);
      setter(!value); // Revert UI on error
      toast({
        title: 'Update Failed',
        description: error.message || `Failed to update ${settingName}. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Data Privacy Controls</CardTitle>
        <CardDescription>
          Manage how your data is used, shared, and exported. You have full control over your personal information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Data Sharing Permissions</h3>
          <p className="text-sm text-muted-foreground">
            Control which types of data you allow us to share with third-party partners or for internal enhancements.
          </p>

          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="data-sharing-consent" className="flex flex-col space-y-1">
              <span>General Data Sharing</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Allow sharing of anonymized data with trusted partners to improve services.
              </span>
            </Label>
            <Switch
              id="data-sharing-consent"
              checked={dataSharingConsent}
              onCheckedChange={(checked) => handlePrivacySettingChange('dataSharingConsent', checked, setDataSharingConsent)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="personalized-ads-consent" className="flex flex-col space-y-1">
              <span>Personalized Advertisements</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enable personalized ad experiences based on your activity.
              </span>
            </Label>
            <Switch
              id="personalized-ads-consent"
              checked={personalizedAdsConsent}
              onCheckedChange={(checked) => handlePrivacySettingChange('personalizedAdsConsent', checked, setPersonalizedAdsConsent)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="research-use-consent" className="flex flex-col space-y-1">
              <span>Research and Development</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Allow your anonymized data to be used for internal research and product improvement.
              </span>
            </Label>
            <Switch
              id="research-use-consent"
              checked={researchUseConsent}
              onCheckedChange={(checked) => handlePrivacySettingChange('researchUseConsent', checked, setResearchUseConsent)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="marketing-communications-consent" className="flex flex-col space-y-1">
              <span>Marketing Communications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive promotional emails and updates about new features.
              </span>
            </Label>
            <Switch
              id="marketing-communications-consent"
              checked={marketingCommunicationsConsent}
              onCheckedChange={(checked) => handlePrivacySettingChange('marketingCommunicationsConsent', checked, setMarketingCommunicationsConsent)}
            />
          </div>

          <div className="flex items-center justify-between space-x-2 p-3 border rounded-md">
            <Label htmlFor="ai-model-training-consent" className="flex flex-col space-y-1">
              <span>AI Model Training (Anonymized)</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Contribute anonymized data to train and improve our AI models for better service.
              </span>
            </Label>
            <Switch
              id="ai-model-training-consent"
              checked={aiModelTrainingConsent}
              onCheckedChange={(checked) => handlePrivacySettingChange('aiModelTrainingConsent', checked, setAiModelTrainingConsent)}
            />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Data Management</h3>
          <p className="text-sm text-muted-foreground">
            Tools to export your personal data or manage your account.
          </p>

          <div className="flex flex-col space-y-2 p-4 border rounded-md">
            <Label className="text-base font-medium">Export Your Data</Label>
            <p className="text-sm text-muted-foreground">
              Request a copy of your personal data in a machine-readable format.
            </p>
            <Button onClick={handleExportData} disabled={isExporting} className="w-full sm:w-auto">
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                'Request Data Export'
              )}
            </Button>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <div className="flex flex-col space-y-2 p-4 border rounded-md border-red-300">
                <Label className="text-base font-medium text-red-600">Delete Your Account</Label>
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <Button variant="destructive" className="w-full sm:w-auto">
                  Delete Account
                </Button>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Confirm Account Deletion</DialogTitle>
                <DialogDescription>
                  This action is irreversible. Please type your email address (<strong>{user?.email}</strong>) to confirm you want to permanently delete your account.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <Input
                  id="delete-confirmation"
                  type="email"
                  placeholder="Enter your email to confirm"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <DialogFooter>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmation !== user?.email}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    'I Understand, Delete My Account'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-semibold">Advanced Consent Management</h3>
          <p className="text-sm text-muted-foreground">
            For granular control over specific data processing activities and legal consents.
          </p>
          <ConsentManagementView userId={user?.id || 'guest'} />
        </section>
      </CardContent>
    </Card>
  );
};

export default DataPrivacyControls;