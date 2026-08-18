// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/components/integrations/IntegrationStatusPanel.tsx
================================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, Switch, Tooltip, message, Space, Spin, Alert, Popconfirm } from 'antd';
import { CheckCircleOutlined, ExclamationCircleOutlined, SyncOutlined, SettingOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import {
  getGoogleIntegrationStatus, connectGoogle, disconnectGoogle,
  getLinkedInIntegrationStatus, connectLinkedIn, disconnectLinkedIn,
  getGitHubIntegrationStatus, connectGitHub, disconnectGitHub,
  refreshGoogleToken, refreshLinkedInToken, refreshGitHubToken
} from '../../services/integrationService'; // Assuming an integration service

// Define styled components for consistent UI
const StyledCard = styled(Card)`
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const IntegrationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const IntegrationStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const StatusText = styled.span<{ connected: boolean }>`
  color: ${props => (props.connected ? '#52c41a' : '#f5222d')};
`;

const LastSyncedText = styled.span`
  font-size: 0.85em;
  color: #8c8c8c;
  margin-top: 8px;
  display: block;
`;

const IntegrationDescription = styled.p`
  color: #595959;
  font-size: 0.9em;
  margin-bottom: 16px;
`;

// Define types for integration status
interface IntegrationInfo {
  name: string;
  connected: boolean;
  lastSynced: string | null;
  error: string | null;
  scopes: string[];
}

const IntegrationStatusPanel: React.FC = () => {
  const [googleStatus, setGoogleStatus] = useState<IntegrationInfo | null>(null);
  const [linkedInStatus, setLinkedInStatus] = useState<IntegrationInfo | null>(null);
  const [gitHubStatus, setGitHubStatus] = useState<IntegrationInfo | null>(null);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [refreshing, setRefreshing] = useState<Record<string, boolean>>({});

  const fetchIntegrationStatus = useCallback(async () => {
    setLoading({ google: true, linkedin: true, github: true });
    try {
      const [google, linkedin, github] = await Promise.all([
        getGoogleIntegrationStatus(),
        getLinkedInIntegrationStatus(),
        getGitHubIntegrationStatus(),
      ]);
      setGoogleStatus(google);
      setLinkedInStatus(linkedin);
      setGitHubStatus(github);
    } catch (error) {
      message.error('Failed to fetch integration statuses.');
      console.error('Error fetching integration statuses:', error);
    } finally {
      setLoading({ google: false, linkedin: false, github: false });
    }
  }, []);

  useEffect(() => {
    fetchIntegrationStatus();
  }, [fetchIntegrationStatus]);

  const handleConnect = async (provider: string) => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    try {
      let success = false;
      switch (provider) {
        case 'google':
          success = await connectGoogle();
          break;
        case 'linkedin':
          success = await connectLinkedIn();
          break;
        case 'github':
          success = await connectGitHub();
          break;
        default:
          break;
      }
      if (success) {
        message.success(`${provider.charAt(0).toUpperCase() + provider.slice(1)} connected successfully!`);
        await fetchIntegrationStatus();
      } else {
        message.error(`Failed to connect ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
      }
    } catch (error) {
      message.error(`An error occurred while connecting ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
      console.error(`Error connecting ${provider}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleDisconnect = async (provider: string) => {
    setLoading(prev => ({ ...prev, [provider]: true }));
    try {
      let success = false;
      switch (provider) {
        case 'google':
          success = await disconnectGoogle();
          break;
        case 'linkedin':
          success = await disconnectLinkedIn();
          break;
        case 'github':
          success = await disconnectGitHub();
          break;
        default:
          break;
      }
      if (success) {
        message.warn(`${provider.charAt(0).toUpperCase() + provider.slice(1)} disconnected.`);
        await fetchIntegrationStatus();
      } else {
        message.error(`Failed to disconnect ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
      }
    } catch (error) {
      message.error(`An error occurred while disconnecting ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
      console.error(`Error disconnecting ${provider}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [provider]: false }));
    }
  };

  const handleRefresh = async (provider: string) => {
    setRefreshing(prev => ({ ...prev, [provider]: true }));
    try {
      let success = false;
      switch (provider) {
        case 'google':
          success = await refreshGoogleToken();
          break;
        case 'linkedin':
          success = await refreshLinkedInToken();
          break;
        case 'github':
          success = await refreshGitHubToken();
          break;
        default:
          break;
      }
      if (success) {
        message.success(`Token for ${provider.charAt(0).toUpperCase() + provider.slice(1)} refreshed.`);
        await fetchIntegrationStatus();
      } else {
        message.error(`Failed to refresh token for ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
      }
    } catch (error) {
      message.error(`An error occurred while refreshing token for ${provider.charAt(0).toUpperCase() + provider.slice(1)}.`);
      console.error(`Error refreshing token for ${provider}:`, error);
    } finally {
      setRefreshing(prev => ({ ...prev, [provider]: false }));
    }
  };

  const renderIntegrationCard = (integration: IntegrationInfo | null, provider: string, description: string) => (
    <StyledCard
      title={
        <IntegrationHeader>
          <Space>
            {provider.charAt(0).toUpperCase() + provider.slice(1)}
            <Tooltip title="View integration settings">
              <Button type="text" icon={<SettingOutlined />} />
            </Tooltip>
          </Space>
          <IntegrationStatus>
            {integration?.connected ? (
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
            ) : (
              <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
            )}
            <StatusText connected={integration?.connected || false}>
              {integration?.connected ? 'Connected' : 'Disconnected'}
            </StatusText>
          </IntegrationStatus>
        </IntegrationHeader>
      }
      loading={loading[provider]}
    >
      <IntegrationDescription>{description}</IntegrationDescription>
      {integration?.lastSynced && integration.connected && (
        <LastSyncedText>Last Synced: {new Date(integration.lastSynced).toLocaleString()}</LastSyncedText>
      )}
      {integration?.error && (
        <Alert
          message="Connection Error"
          description={integration.error}
          type="error"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      )}
      {integration?.scopes && integration.scopes.length > 0 && integration.connected && (
        <Alert
          message="Granted Permissions (Scopes)"
          description={
            <ul>
              {integration.scopes.map((scope, index) => (
                <li key={index}>{scope}</li>
              ))}
            </ul>
          }
          type="info"
          style={{ marginBottom: '16px' }}
        />
      )}
      <Space wrap>
        <Button
          type={integration?.connected ? 'default' : 'primary'}
          onClick={() => (integration?.connected ? handleDisconnect(provider) : handleConnect(provider))}
          loading={loading[provider]}
          icon={integration?.connected ? <DeleteOutlined /> : null}
        >
          {integration?.connected ? `Disconnect ${provider.charAt(0).toUpperCase() + provider.slice(1)}` : `Connect ${provider.charAt(0).toUpperCase() + provider.slice(1)}`}
        </Button>
        {integration?.connected && (
          <Button
            onClick={() => handleRefresh(provider)}
            loading={refreshing[provider]}
            icon={<SyncOutlined />}
          >
            Refresh Token
          </Button>
        )}
        <Tooltip title="This integration enables enhanced features like AI-powered content generation, data analysis, and automation.">
          <Button icon={<QuestionCircleOutlined />}>What does this do?</Button>
        </Tooltip>
      </Space>
    </StyledCard>
  );

  return (
    <div>
      <h2>External Service Integrations</h2>
      <p>
        Manage connections to third-party services to unlock advanced features, automate workflows, and enrich your data.
        Ensure your integrations are secure and up-to-date for optimal performance.
      </p>

      {renderIntegrationCard(
        googleStatus,
        'google',
        'Connect with Google services (e.g., Google Drive, Calendar, Gmail) to enable seamless file management, scheduling, and AI-powered email drafting. This integration leverages Google Gemini for advanced AI capabilities.'
      )}

      {renderIntegrationCard(
        linkedInStatus,
        'linkedin',
        'Integrate with LinkedIn to personalize your professional network, generate AI-driven LinkedIn articles, and analyze industry trends. This powers features like AI-suggested connections and content optimization.'
      )}

      {renderIntegrationCard(
        gitHubStatus,
        'github',
        'Link your GitHub account for advanced code analysis, AI-powered pull request summaries, automated documentation, and generative code features. Essential for developers and team collaboration.'
      )}

      {/* Potentially add more integration cards as needed */}
      <StyledCard
        title={
          <IntegrationHeader>
            <Space>
              AI Sentient Asset Management
              <Tooltip title="View integration settings">
                <Button type="text" icon={<SettingOutlined />} />
              </Tooltip>
            </Space>
            <IntegrationStatus>
              <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
              <StatusText connected={false}>Not Configured</StatusText>
            </IntegrationStatus>
          </IntegrationHeader>
        }
      >
        <IntegrationDescription>
          Integrate with the AI Sentient Asset Management API for real-time portfolio optimization, predictive market analysis, and AI-driven investment strategies. This requires specific API keys and configuration.
        </IntegrationDescription>
        <Button type="primary" onClick={() => message.info('Redirecting to configuration for AI Sentient Asset Management...')}>
          Configure AI Sentient Asset Management
        </Button>
      </StyledCard>

      <StyledCard
        title={
          <IntegrationHeader>
            <Space>
              Biometric Quantum Authentication
              <Tooltip title="View integration settings">
                <Button type="text" icon={<SettingOutlined />} />
              </Tooltip>
            </Space>
            <IntegrationStatus>
              <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
              <StatusText connected={false}>Not Configured</StatusText>
            </IntegrationStatus>
          </IntegrationHeader>
        }
      >
        <IntegrationDescription>
          Enable Biometric Quantum Authentication for next-generation security. This integration leverages advanced biometric sensors and quantum-safe encryption for user verification.
        </IntegrationDescription>
        <Button type="primary" onClick={() => message.info('Redirecting to configuration for Biometric Quantum Authentication...')}>
          Configure Biometric Quantum Authentication
        </Button>
      </StyledCard>

      <StyledCard
        title={
          <IntegrationHeader>
            <Space>
              Hyper-Personalized Economic Governance
              <Tooltip title="View integration settings">
                <Button type="text" icon={<SettingOutlined />} />
              </Tooltip>
            </Space>
            <IntegrationStatus>
              <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
              <StatusText connected={false}>Not Configured</StatusText>
            </IntegrationStatus>
          </IntegrationHeader>
        }
      >
        <IntegrationDescription>
          Connect to the Hyper-Personalized Economic Governance engine for dynamic financial planning, automated regulatory compliance, and AI-driven policy recommendations tailored to your unique economic profile.
        </IntegrationDescription>
        <Button type="primary" onClick={() => message.info('Redirecting to configuration for Hyper-Personalized Economic Governance...')}>
          Configure Economic Governance
        </Button>
      </StyledCard>

      <StyledCard
        title={
          <IntegrationHeader>
            <Space>
              Multiverse Financial Projection
              <Tooltip title="View integration settings">
                <Button type="text" icon={<SettingOutlined />} />
              </Tooltip>
            </Space>
            <IntegrationStatus>
              <ExclamationCircleOutlined style={{ color: '#f5222d' }} />
              <StatusText connected={false}>Not Configured</StatusText>
            </IntegrationStatus>
          </IntegrationHeader>
        }
      >
        <IntegrationDescription>
          Access the Multiverse Financial Projection API to simulate complex economic scenarios, forecast market shifts across various parallel realities, and gain strategic insights from AI-driven probabilistic models.
        </IntegrationDescription>
        <Button type="primary" onClick={() => message.info('Redirecting to configuration for Multiverse Financial Projection...')}>
          Configure Multiverse Projection
        </Button>
      </StyledCard>
    </div>
  );
};

export default IntegrationStatusPanel;