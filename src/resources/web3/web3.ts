// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/web3/web3.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ContractsAPI from './contracts';
import { ContractDeployParams, Contracts } from './contracts';
import * as NetworkAPI from './network';
import { Network, NetworkGetStatusResponse } from './network';
import * as NFTsAPI from './nfts';
import { NFTListResponse, NFTMintParams, NFTs } from './nfts';
import * as TransactionsAPI from './transactions';
import {
  TransactionBridgeParams,
  TransactionInitiateParams,
  TransactionSendParams,
  TransactionSendResponse,
  TransactionSwapParams,
  Transactions,
} from './transactions';
import * as WalletsAPI from './wallets';
import {
  WalletCreateParams,
  WalletCreateResponse,
  WalletGetBalancesResponse,
  WalletLinkParams,
  WalletListResponse,
  Wallets,
} from './wallets';

export class Web3 extends APIResource {
  network: NetworkAPI.Network = new NetworkAPI.Network(this._client);
  wallets: WalletsAPI.Wallets = new WalletsAPI.Wallets(this._client);
  transactions: TransactionsAPI.Transactions = new TransactionsAPI.Transactions(this._client);
  nfts: NFTsAPI.NFTs = new NFTsAPI.NFTs(this._client);
  contracts: ContractsAPI.Contracts = new ContractsAPI.Contracts(this._client);
}

Web3.Network = Network;
Web3.Wallets = Wallets;
Web3.Transactions = Transactions;
Web3.NFTs = NFTs;
Web3.Contracts = Contracts;

export declare namespace Web3 {
  export { Network as Network, type NetworkGetStatusResponse as NetworkGetStatusResponse };

  export {
    Wallets as Wallets,
    type WalletCreateResponse as WalletCreateResponse,
    type WalletListResponse as WalletListResponse,
    type WalletGetBalancesResponse as WalletGetBalancesResponse,
    type WalletCreateParams as WalletCreateParams,
    type WalletLinkParams as WalletLinkParams,
  };

  export {
    Transactions as Transactions,
    type TransactionSendResponse as TransactionSendResponse,
    type TransactionBridgeParams as TransactionBridgeParams,
    type TransactionInitiateParams as TransactionInitiateParams,
    type TransactionSendParams as TransactionSendParams,
    type TransactionSwapParams as TransactionSwapParams,
  };

  export { NFTs as NFTs, type NFTListResponse as NFTListResponse, type NFTMintParams as NFTMintParams };

  export { Contracts as Contracts, type ContractDeployParams as ContractDeployParams };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/web3/web3.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as NFTsAPI from './nfts';
import { NFTListParams, NFTListResponse, NFTs } from './nfts';
import * as SmartContractsAPI from './smart-contracts';
import { SmartContracts } from './smart-contracts';
import * as TransactionsAPI from './transactions';
import { Transactions } from './transactions';
import * as WalletsAPI from './wallets';
import {
  WalletCreateParams,
  WalletCreateResponse,
  WalletGetBalanceParams,
  WalletGetBalanceResponse,
  WalletListParams,
  WalletListResponse,
  Wallets,
} from './wallets';

export class Web3 extends APIResource {
  wallets: WalletsAPI.Wallets = new WalletsAPI.Wallets(this._client);
  transactions: TransactionsAPI.Transactions = new TransactionsAPI.Transactions(this._client);
  nfts: NFTsAPI.NFTs = new NFTsAPI.NFTs(this._client);
  smartContracts: SmartContractsAPI.SmartContracts = new SmartContractsAPI.SmartContracts(this._client);
}

Web3.Wallets = Wallets;
Web3.Transactions = Transactions;
Web3.NFTs = NFTs;
Web3.SmartContracts = SmartContracts;

export declare namespace Web3 {
  export {
    Wallets as Wallets,
    type WalletCreateResponse as WalletCreateResponse,
    type WalletListResponse as WalletListResponse,
    type WalletGetBalanceResponse as WalletGetBalanceResponse,
    type WalletCreateParams as WalletCreateParams,
    type WalletListParams as WalletListParams,
    type WalletGetBalanceParams as WalletGetBalanceParams,
  };

  export { Transactions as Transactions };

  export { NFTs as NFTs, type NFTListResponse as NFTListResponse, type NFTListParams as NFTListParams };

  export { SmartContracts as SmartContracts };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/web3/web3.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ContractsAPI from './contracts';
import { Contracts } from './contracts';
import * as NFTsAPI from './nfts';
import { NFTListParams, NFTListResponse, NFTs } from './nfts';
import * as TransactionsAPI from './transactions';
import { TransactionInitiateParams, TransactionInitiateResponse, Transactions } from './transactions';
import * as WalletsAPI from './wallets';
import {
  WalletCreateParams,
  WalletCreateResponse,
  WalletListParams,
  WalletListResponse,
  WalletRetrieveBalancesParams,
  WalletRetrieveBalancesResponse,
  Wallets,
} from './wallets';

export class Web3 extends APIResource {
  wallets: WalletsAPI.Wallets = new WalletsAPI.Wallets(this._client);
  transactions: TransactionsAPI.Transactions = new TransactionsAPI.Transactions(this._client);
  nfts: NFTsAPI.NFTs = new NFTsAPI.NFTs(this._client);
  contracts: ContractsAPI.Contracts = new ContractsAPI.Contracts(this._client);
}

Web3.Wallets = Wallets;
Web3.Transactions = Transactions;
Web3.NFTs = NFTs;
Web3.Contracts = Contracts;

export declare namespace Web3 {
  export {
    Wallets as Wallets,
    type WalletCreateResponse as WalletCreateResponse,
    type WalletListResponse as WalletListResponse,
    type WalletRetrieveBalancesResponse as WalletRetrieveBalancesResponse,
    type WalletCreateParams as WalletCreateParams,
    type WalletListParams as WalletListParams,
    type WalletRetrieveBalancesParams as WalletRetrieveBalancesParams,
  };

  export {
    Transactions as Transactions,
    type TransactionInitiateResponse as TransactionInitiateResponse,
    type TransactionInitiateParams as TransactionInitiateParams,
  };

  export { NFTs as NFTs, type NFTListResponse as NFTListResponse, type NFTListParams as NFTListParams };

  export { Contracts as Contracts };
}
