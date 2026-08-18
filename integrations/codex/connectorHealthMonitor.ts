// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/integrations/codex/connectorHealthMonitor.ts
================================================================================

```typescript
import axios, { AxiosError } from 'axios';

// Define the interface for the integration status
interface IntegrationStatus {
  integrationName: string; // Name of the integration
  apiEndpoint: string; // API endpoint being monitored
  status: 'active' | 'inactive' | 'degraded' | 'error'; // Current status
  responseCode?: number; // HTTP response code if applicable
  responseTime?: number; // Response time in milliseconds
  errorDetails?: string; // Error details if any
  lastChecked: Date; // Timestamp of the last check
}

// Define the configuration for each integration
interface IntegrationConfig {
  integrationName: string; // Name of the integration
  apiEndpoint: string; // The base URL or endpoint to check
  healthCheckEndpoint?: string; // Optional: Specific endpoint for health check, defaults to apiEndpoint if not provided
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; // HTTP method, default GET
  headers?: Record<string, string>; // Optional: Headers to include in the health check
  payload?: any; // Optional: Payload for POST, PUT, PATCH requests
  timeout?: number; // Optional: Timeout in milliseconds
}


// Configuration for the service.  Ideally, this would be loaded from a configuration file.
const integrations: IntegrationConfig[] = [
  {
    integrationName: 'Salesforce',
    apiEndpoint: 'https://na.salesforce.com/services/data/v55.0/', // Replace with your Salesforce base URL or health endpoint
    healthCheckEndpoint: '/services/data/v55.0/limits', // Example health check endpoint - limits API
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_SALESFORCE_ACCESS_TOKEN', // Replace with dynamic token retrieval if possible.  NEVER HARDCODE CREDENTIALS IN PRODUCTION CODE.
        'Content-Type': 'application/json'
    },
    timeout: 5000
  },
  {
    integrationName: 'Stripe',
    apiEndpoint: 'https://api.stripe.com/v1', // Replace with your Stripe API base URL
    healthCheckEndpoint: '/charges', // Example: checking the charges endpoint
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_STRIPE_SECRET_KEY', // Replace with secure retrieval of Stripe secret key
        'Content-Type': 'application/json'
    },
    timeout: 3000
  },
  {
    integrationName: 'Google Calendar',
    apiEndpoint: 'https://www.googleapis.com/calendar/v3', // Replace with Google Calendar API base URL
    healthCheckEndpoint: '/users/me/calendarList', // Example calendar list endpoint for health check
    method: 'GET',
    headers: {
        'Authorization': 'Bearer YOUR_GOOGLE_ACCESS_TOKEN',  // Replace with dynamic token retrieval.
        'Content-Type': 'application/json'
    },
    timeout: 4000
  },
  {
      integrationName: 'LinkedIn',
      apiEndpoint: 'https://api.linkedin.com/v2',
      healthCheckEndpoint: '/me', // Check the /me endpoint
      method: 'GET',
      headers: {
          'Authorization': 'Bearer YOUR_LINKEDIN_ACCESS_TOKEN',  // Replace with dynamic token retrieval.
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
      },
      timeout: 6000
  },
  {
      integrationName: 'GitHub',
      apiEndpoint: 'https://api.github.com',
      healthCheckEndpoint: '/user',  // Check the /user endpoint
      method: 'GET',
      headers: {
          'Authorization': 'Bearer YOUR_GITHUB_ACCESS_TOKEN', // Replace with secure mechanism.
          'Content-Type': 'application/json'
      },
      timeout: 5000
  },
  // Add other integrations here
];


class ConnectorHealthMonitor {
  private statusMap: Map<string, IntegrationStatus> = new Map();
  private pollingIntervalMs: number = 60000; // Check every 60 seconds.  Adjust based on needs.
  private intervalId: NodeJS.Timeout | null = null;
  private readonly defaultTimeoutMs: number = 10000; // Default timeout for API requests

  constructor(pollingIntervalMs?: number) {
      if (pollingIntervalMs) {
          this.pollingIntervalMs = pollingIntervalMs;
      }
  }

  // Method to start the monitoring process
  public startMonitoring(): void {
    if (this.intervalId) {
      this.stopMonitoring();  // Ensure we don't start multiple intervals.
    }
    this.checkAllIntegrations(); // Initial check
    this.intervalId = setInterval(() => {
        this.checkAllIntegrations();
    }, this.pollingIntervalMs);
  }

  // Method to stop the monitoring process
  public stopMonitoring(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // Main function to check all integrations
  private async checkAllIntegrations(): Promise<void> {
    for (const integration of integrations) {
      await this.checkIntegration(integration);
    }
  }


  // Method to perform a health check for a single integration
  private async checkIntegration(config: IntegrationConfig): Promise<void> {
    const { integrationName, apiEndpoint, healthCheckEndpoint, method = 'GET', headers, payload, timeout = this.defaultTimeoutMs } = config;
    const checkEndpoint = healthCheckEndpoint ? `${apiEndpoint}${healthCheckEndpoint}` : apiEndpoint; // Use healthCheckEndpoint if provided, otherwise the apiEndpoint

    const startTime = performance.now();
    let status: IntegrationStatus = this.statusMap.get(integrationName) || {
        integrationName: integrationName,
        apiEndpoint: checkEndpoint, // Use the checkEndpoint to display the actual endpoint being checked
        status: 'inactive',
        lastChecked: new Date(),
    };

    try {
      const response = await this.makeApiCall(checkEndpoint, method, headers, payload, timeout); // Pass timeout to makeApiCall
      const endTime = performance.now();
      const responseTime = endTime - startTime;

      status = {
          ...status,
          apiEndpoint: checkEndpoint,
          status: 'active',
          responseCode: response.status,
          responseTime: responseTime,
          errorDetails: undefined, // Clear any previous errors
          lastChecked: new Date(),
      };

    } catch (error: any) { // Use 'any' type to handle both AxiosError and other errors.
        const endTime = performance.now();
        const responseTime = endTime - startTime;

        let errorDetails: string | undefined = 'Unknown error';
        let responseCode: number | undefined;

        if (axios.isAxiosError(error)) { // Check if it's an AxiosError
            const axiosError: AxiosError = error;
            responseCode = axiosError.response?.status;
            errorDetails = `Axios Error: ${axiosError.message} - ${axiosError.code} - ${axiosError.response?.statusText || 'No status text'}`;

            if(axiosError.response) {
                errorDetails += ` - Response Data: ${JSON.stringify(axiosError.response.data)}`; // Include response data if available
            }
        }
        else {
            errorDetails = `General Error: ${error.message || error.toString()}`;
        }


        status = {
            ...status,
            apiEndpoint: checkEndpoint,
            status: 'error',
            responseCode: responseCode,
            responseTime: responseTime,
            errorDetails: errorDetails,
            lastChecked: new Date(),
        };
    } finally {
        this.statusMap.set(integrationName, status);
        this.logStatus(status); // Log the status after each check
    }
  }



  private async makeApiCall(
      url: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
      headers?: Record<string, string>,
      payload?: any,
      timeout: number = this.defaultTimeoutMs  // Default timeout if not specified in config
  ): Promise<any> {
      try {
          const response = await axios({
              method,
              url,
              headers,
              data: payload,
              timeout, // Use the timeout from the config
          });
          return response;
      } catch (error: any) { // Use 'any' for broader error handling
          // Re-throw the error to be caught in checkIntegration
          throw error;
      }
  }


    // Get the current status of all integrations
  public getAllIntegrationStatuses(): IntegrationStatus[] {
    return Array.from(this.statusMap.values());
  }

  // Get the status of a specific integration
  public getIntegrationStatus(integrationName: string): IntegrationStatus | undefined {
    return this.statusMap.get(integrationName);
  }

  // Method to log the status (could be replaced with a more sophisticated logging mechanism)
  private logStatus(status: IntegrationStatus): void {
      console.log(`[${new Date().toISOString()}] Integration: ${status.integrationName} - Status: ${status.status} - Endpoint: ${status.apiEndpoint} - Response Time: ${status.responseTime ? status.responseTime.toFixed(2) + 'ms' : 'N/A'} - Last Checked: ${status.lastChecked.toISOString()} ${status.errorDetails ? '- Error: ' + status.errorDetails : ''}`);
  }
}

export default ConnectorHealthMonitor;
```