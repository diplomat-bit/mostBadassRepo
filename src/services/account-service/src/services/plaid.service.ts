// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/account-service/src/services/plaid.service.ts
================================================================================

import { Injectable, Logger } from '@nestjs/common'; // Assuming NestJS for DI and logging
import { ConfigService } from '@nestjs/config';
import {
  Configuration,
  PlaidApi,
  PlaidEnvironments,
  Products,
  CountryCode,
  LinkTokenCreateRequest,
  TransactionsSyncRequest,
  RemovedTransaction,
  Transaction,
  PlaidError,
} from 'plaid';

// Interface for the data access layer that will store Plaid items.
// This keeps the PlaidService decoupled from the database implementation.
export interface IPlaidItemRepository {
  createItem(
    userId: string,
    accessToken: string,
    itemId: string,
    institutionId: string,
    institutionName: string,
  ): Promise<any>;
  getItemByItemId(itemId: string): Promise<{ userId: string; accessToken: string } | null>;
  getItemByUserId(userId: string): Promise<{ accessToken: string; itemId: string } | null>;
  deleteItem(itemId: string): Promise<void>;
  updateItemStatus(itemId: string, status: string): Promise<void>;
  updateTransactionCursor(itemId: string, cursor: string): Promise<void>;
  // Methods to store actual data would also be here
  // e.g., saveTransactions(itemId: string, transactions: Transaction[]): Promise<void>;
}

@Injectable()
export class PlaidService {
  private readonly logger = new Logger(PlaidService.name);
  private readonly plaidClient: PlaidApi;

  constructor(
    private readonly configService: ConfigService,
    // @Inject('IPlaidItemRepository') // Example of DI for the repository
    // private readonly plaidItemRepository: IPlaidItemRepository,
  ) {
    const configuration = new Configuration({
      basePath: PlaidEnvironments[this.configService.get<string>('PLAID_ENV')],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': this.configService.get<string>('PLAID_CLIENT_ID'),
          'PLAID-SECRET': this.configService.get<string>('PLAID_SECRET'),
        },
      },
    });

    this.plaidClient = new PlaidApi(configuration);
    this.logger.log('PlaidService initialized');
  }

  /**
   * Creates a Plaid Link token for a given user to initiate the linking process.
   * @param userId - The unique identifier for the user in our system.
   * @returns The generated link_token.
   */
  async createLinkToken(userId: string): Promise<string> {
    try {
      this.logger.log(`Creating link token for user: ${userId}`);
      const request: LinkTokenCreateRequest = {
        user: {
          client_user_id: userId,
        },
        client_name: this.configService.get<string>('APP_NAME', 'Our Awesome App'),
        products: [Products.Auth, Products.Transactions, Products.Identity],
        country_codes: [CountryCode.Us, CountryCode.Ca],
        language: 'en',
        webhook: this.configService.get<string>('PLAID_WEBHOOK_URL'),
      };

      const response = await this.plaidClient.linkTokenCreate(request);
      this.logger.log(`Successfully created link token for user: ${userId}`);
      return response.data.link_token;
    } catch (error) {
      this.handlePlaidError(error, `Failed to create link token for user ${userId}`);
    }
  }

  /**
   * Creates a Plaid Link token in "update mode" for an existing item.
   * This is used when an item enters an error state and requires user action.
   * @param accessToken - The access token for the item to be updated.
   * @returns The generated link_token for update mode.
   */
  async createUpdateLinkToken(accessToken: string): Promise<string> {
    try {
      this.logger.log(`Creating update link token for an existing item.`);
      const request: LinkTokenCreateRequest = {
        user: {
          // User ID would be fetched based on the access token in a real app
          client_user_id: 'fetched-user-id',
        },
        client_name: this.configService.get<string>('APP_NAME', 'Our Awesome App'),
        country_codes: [CountryCode.Us, CountryCode.Ca],
        language: 'en',
        webhook: this.configService.get<string>('PLAID_WEBHOOK_URL'),
        access_token: accessToken,
      };

      const response = await this.plaidClient.linkTokenCreate(request);
      this.logger.log(`Successfully created update link token.`);
      return response.data.link_token;
    } catch (error) {
      this.handlePlaidError(error, `Failed to create update link token`);
    }
  }

  /**
   * Exchanges a public token from Plaid Link for an access token and item ID.
   * @param publicToken - The public token received from the Plaid Link front-end.
   * @param userId - The ID of the user who completed the flow.
   * @returns An object containing the item_id and access_token.
   */
  async exchangePublicToken(publicToken: string, userId: string): Promise<{ itemId: string; accessToken: string }> {
    try {
      this.logger.log(`Exchanging public token for user: ${userId}`);
      const response = await this.plaidClient.itemPublicTokenExchange({
        public_token: publicToken,
      });

      const { access_token, item_id } = response.data;

      // In a real application, you would now persist this information.
      // const institution = await this.getInstitutionByItemId(item_id);
      // await this.plaidItemRepository.createItem(
      //   userId,
      //   access_token,
      //   item_id,
      //   institution.institution_id,
      //   institution.name
      // );

      this.logger.log(`Successfully exchanged public token for item ID: ${item_id}`);
      return { itemId: item_id, accessToken: access_token };
    } catch (error) {
      this.handlePlaidError(error, `Failed to exchange public token for user ${userId}`);
    }
  }

  /**
   * Fetches account information for a given Plaid item.
   * @param accessToken - The access token for the Plaid item.
   * @returns A list of accounts associated with the item.
   */
  async getAccounts(accessToken: string) {
    try {
      const response = await this.plaidClient.accountsGet({
        access_token: accessToken,
      });
      return response.data.accounts;
    } catch (error) {
      this.handlePlaidError(error, 'Failed to fetch accounts');
    }
  }

  /**
   * Fetches identity information for a given Plaid item.
   * @param accessToken - The access token for the Plaid item.
   * @returns Identity data for the accounts.
   */
  async getIdentity(accessToken: string) {
    try {
      const response = await this.plaidClient.identityGet({
        access_token: accessToken,
      });
      return response.data.accounts;
    } catch (error) {
      this.handlePlaidError(error, 'Failed to fetch identity information');
    }
  }

  /**
   * Fetches ACH authentication data (account and routing numbers).
   * @param accessToken - The access token for the Plaid item.
   * @returns ACH data for the accounts.
   */
  async getAuth(accessToken: string) {
    try {
      const response = await this.plaidClient.authGet({
        access_token: accessToken,
      });
      return {
        accounts: response.data.accounts,
        numbers: response.data.numbers,
      };
    } catch (error) {
      this.handlePlaidError(error, 'Failed to fetch auth data');
    }
  }

  /**
   * Fetches transactions for a Plaid item using the recommended sync endpoint.
   * This method is idempotent and handles pagination via a cursor.
   * @param accessToken - The access token for the Plaid item.
   * @param cursor - The cursor from the previous sync request (or null for the first sync).
   * @returns An object with added, modified, and removed transactions, and the next cursor.
   */
  async syncTransactions(accessToken: string, cursor?: string) {
    const added: Transaction[] = [];
    const modified: Transaction[] = [];
    const removed: RemovedTransaction[] = [];
    let hasMore = true;
    let nextCursor = cursor;

    try {
      while (hasMore) {
        const request: TransactionsSyncRequest = {
          access_token: accessToken,
          cursor: nextCursor,
        };

        const response = await this.plaidClient.transactionsSync(request);
        const data = response.data;

        added.push(...data.added);
        modified.push(...data.modified);
        removed.push(...data.removed);

        hasMore = data.has_more;
        nextCursor = data.next_cursor;
      }

      this.logger.log(`Synced ${added.length} new, ${modified.length} modified, ${removed.length} removed transactions.`);
      return { added, modified, removed, nextCursor };
    } catch (error) {
      this.handlePlaidError(error, 'Failed to sync transactions');
    }
  }

  /**
   * Removes a Plaid item, invalidating its access token.
   * @param accessToken - The access token of the item to remove.
   */
  async removeItem(accessToken: string): Promise<void> {
    try {
      const response = await this.plaidClient.itemRemove({
        access_token: accessToken,
      });

      // In a real application, you would now remove the item from your database.
      // const { item_id } = await this.plaidClient.itemGet({ access_token: accessToken });
      // await this.plaidItemRepository.deleteItem(item_id);

      this.logger.log(`Successfully removed item. Request ID: ${response.data.request_id}`);
    } catch (error) {
      this.handlePlaidError(error, 'Failed to remove item');
    }
  }

  /**
   * Fetches details about a financial institution.
   * @param institutionId - The ID of the institution.
   * @returns Institution details.
   */
  async getInstitutionById(institutionId: string) {
    try {
      const response = await this.plaidClient.institutionsGetById({
        institution_id: institutionId,
        country_codes: [CountryCode.Us, CountryCode.Ca],
      });
      return response.data.institution;
    } catch (error) {
      this.handlePlaidError(error, `Failed to get institution details for ID: ${institutionId}`);
    }
  }

  /**
   * Processes incoming webhooks from Plaid.
   * @param webhookBody - The parsed body of the webhook request.
   */
  async handleWebhook(webhookBody: any): Promise<void> {
    const { webhook_type, webhook_code, item_id, error } = webhookBody;
    this.logger.log(`Received webhook: type=${webhook_type}, code=${webhook_code}, item_id=${item_id}`);

    // In a production environment, you should verify the webhook signature.
    // This requires setting up a JWT key in the Plaid dashboard.
    // const verification = await this.plaidClient.webhookVerificationKeyGet({ key_id: 'key_id_from_header' });
    // ... verification logic ...

    switch (webhook_type) {
      case 'TRANSACTIONS':
        await this.handleTransactionsWebhook(webhook_code, item_id);
        break;
      case 'ITEM':
        await this.handleItemWebhook(webhook_code, item_id, error);
        break;
      // Handle other webhook types like AUTH, IDENTITY, ASSETS, etc.
      default:
        this.logger.warn(`Unhandled webhook type: ${webhook_type}`);
    }
  }

  private async handleTransactionsWebhook(webhookCode: string, itemId: string): Promise<void> {
    // const item = await this.plaidItemRepository.getItemByItemId(itemId);
    // if (!item) {
    //   this.logger.error(`Webhook for unknown item ID: ${itemId}`);
    //   return;
    // }
    // const { accessToken, cursor } = item;

    switch (webhookCode) {
      case 'INITIAL_UPDATE':
      case 'HISTORICAL_UPDATE':
      case 'DEFAULT_UPDATE':
        this.logger.log(`Fetching transaction updates for item: ${itemId}`);
        // In a real app, you'd fetch the access token and cursor from your DB
        // const { added, modified, removed, nextCursor } = await this.syncTransactions(accessToken, cursor);
        // await this.plaidItemRepository.saveTransactions(itemId, [...added, ...modified]);
        // await this.plaidItemRepository.removeTransactions(itemId, removed);
        // await this.plaidItemRepository.updateTransactionCursor(itemId, nextCursor);
        break;
      case 'TRANSACTIONS_REMOVED':
        this.logger.log(`Transactions removed for item: ${itemId}. A full re-sync may be needed.`);
        // Handle removal logic, potentially re-fetching all transactions.
        break;
      default:
        this.logger.warn(`Unhandled transaction webhook code: ${webhookCode}`);
    }
  }

  private async handleItemWebhook(webhookCode: string, itemId: string, error: any): Promise<void> {
    switch (webhookCode) {
      case 'WEBHOOK_UPDATE_ACKNOWLEDGED':
        this.logger.log(`Webhook for item ${itemId} is healthy.`);
        // await this.plaidItemRepository.updateItemStatus(itemId, 'healthy');
        break;
      case 'ERROR':
        this.logger.error(`Item ${itemId} is in an error state: ${JSON.stringify(error)}`);
        // await this.plaidItemRepository.updateItemStatus(itemId, 'error');
        // Trigger a notification to the user to re-link their account.
        // The front-end would then call `createUpdateLinkToken`.
        break;
      case 'PENDING_EXPIRATION':
        this.logger.warn(`Item ${itemId} access token is about to expire. User needs to re-authenticate.`);
        // Trigger a notification to the user.
        break;
      default:
        this.logger.warn(`Unhandled item webhook code: ${webhookCode}`);
    }
  }

  /**
   * A centralized error handler for Plaid API calls.
   * @param error - The error object caught from the Plaid client.
   * @param message - A custom message describing the context of the error.
   */
  private handlePlaidError(error: any, message: string): never {
    if (error instanceof PlaidError) {
      this.logger.error(
        `${message}. Plaid Error: ${error.response.data.error_code} - ${error.response.data.error_message}`,
        error.stack,
      );
      // Re-throw a more specific application error if needed
      throw new Error(`Plaid API Error: ${error.response.data.error_message}`);
    } else {
      this.logger.error(`${message}. Unexpected Error: ${error.message}`, error.stack);
      throw new Error(`An unexpected error occurred while communicating with Plaid: ${error.message}`);
    }
  }
}