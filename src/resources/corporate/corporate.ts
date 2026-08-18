// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/corporate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AnomaliesAPI from './anomalies';
import { Anomalies, AnomalyListDetectedResponse, AnomalyUpdateStatusParams } from './anomalies';
import * as CardsAPI from './cards';
import {
  CardGetTransactionsResponse,
  CardIssueVirtualCardParams,
  CardIssueVirtualCardResponse,
  CardListAllParams,
  CardListAllResponse,
  CardRequestPhysicalCardParams,
  CardRequestPhysicalCardResponse,
  CardToggleCardLockParams,
  CardUpdateControlsParams,
  Cards,
} from './cards';
import * as ComplianceAPI from './compliance/compliance';
import {
  Compliance,
  ComplianceScreenMediaParams,
  ComplianceScreenMediaResponse,
  ComplianceScreenPepParams,
  ComplianceScreenPepResponse,
  ComplianceScreenSanctionsParams,
  ComplianceScreenSanctionsResponse,
} from './compliance/compliance';
import * as GovernanceAPI from './governance/governance';
import { Governance } from './governance/governance';
import * as RiskAPI from './risk/risk';
import {
  Risk,
  RiskGetRiskExposureResponse,
  RiskRunStressTestParams,
  RiskRunStressTestResponse,
} from './risk/risk';
import * as TreasuryAPI from './treasury/treasury';
import {
  Treasury,
  TreasuryExecuteBulkPayoutsParams,
  TreasuryGetLiquidityPositionsResponse,
} from './treasury/treasury';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';

export class Corporate extends APIResource {
  compliance: ComplianceAPI.Compliance = new ComplianceAPI.Compliance(this._client);
  treasury: TreasuryAPI.Treasury = new TreasuryAPI.Treasury(this._client);
  cards: CardsAPI.Cards = new CardsAPI.Cards(this._client);
  risk: RiskAPI.Risk = new RiskAPI.Risk(this._client);
  governance: GovernanceAPI.Governance = new GovernanceAPI.Governance(this._client);
  anomalies: AnomaliesAPI.Anomalies = new AnomaliesAPI.Anomalies(this._client);

  /**
   * Onboard a New Corporate Entity
   *
   * @example
   * ```ts
   * const response = await client.corporate.onboard({
   *   entityType: 'CORP',
   *   jurisdiction: 'DE',
   *   legalName: 'string',
   *   taxId: 'string',
   *   beneficialOwners: [
   *     {
   *       id: 'string',
   *       name: 'string',
   *       email: 'OJsMNh@jTCbAVwjqYWhGnyLe.nddf',
   *       identityVerified: false,
   *       address: { ... },
   *       preferences: { key_0: 5595 },
   *       securityStatus: { ... },
   *     },
   *     {
   *       id: 'string',
   *       name: 'string',
   *       email: 'VrwpDkjpFxkAg10@iRDWTgHNAzKDVkvGQrZ.ecv',
   *       identityVerified: true,
   *       address: { ... },
   *       preferences: { key_0: 'string' },
   *       securityStatus: { ... },
   *     },
   *   ],
   * });
   * ```
   */
  onboard(body: CorporateOnboardParams, options?: RequestOptions): APIPromise<CorporateOnboardResponse> {
    return this._client.post('/corporate/onboard', { body, ...options });
  }
}

export interface CorporateOnboardResponse {
  corporateId?: string;

  status?: string;
}

export interface CorporateOnboardParams {
  entityType: 'LLC' | 'CORP' | 'NGO' | 'PARTNERSHIP';

  jurisdiction: string;

  /**
   * Registered business name
   */
  legalName: string;

  /**
   * EIN, VAT, or local tax ID
   */
  taxId: string;

  beneficialOwners?: Array<CorporateOnboardParams.BeneficialOwner>;
}

export namespace CorporateOnboardParams {
  export interface BeneficialOwner {
    id: string;

    email: string;

    identityVerified: boolean;

    name: string;

    address?: BeneficialOwner.Address;

    preferences?: unknown;

    securityStatus?: BeneficialOwner.SecurityStatus;
  }

  export namespace BeneficialOwner {
    export interface Address {
      city: string;

      country: string;

      street: string;

      state?: string;

      zip?: string;
    }

    export interface SecurityStatus {
      lastLogin?: string;

      twoFactorEnabled?: boolean;
    }
  }
}

Corporate.Compliance = Compliance;
Corporate.Treasury = Treasury;
Corporate.Cards = Cards;
Corporate.Risk = Risk;
Corporate.Governance = Governance;
Corporate.Anomalies = Anomalies;

export declare namespace Corporate {
  export {
    type CorporateOnboardResponse as CorporateOnboardResponse,
    type CorporateOnboardParams as CorporateOnboardParams,
  };

  export {
    Compliance as Compliance,
    type ComplianceScreenMediaResponse as ComplianceScreenMediaResponse,
    type ComplianceScreenPepResponse as ComplianceScreenPepResponse,
    type ComplianceScreenSanctionsResponse as ComplianceScreenSanctionsResponse,
    type ComplianceScreenMediaParams as ComplianceScreenMediaParams,
    type ComplianceScreenPepParams as ComplianceScreenPepParams,
    type ComplianceScreenSanctionsParams as ComplianceScreenSanctionsParams,
  };

  export {
    Treasury as Treasury,
    type TreasuryGetLiquidityPositionsResponse as TreasuryGetLiquidityPositionsResponse,
    type TreasuryExecuteBulkPayoutsParams as TreasuryExecuteBulkPayoutsParams,
  };

  export {
    Cards as Cards,
    type CardGetTransactionsResponse as CardGetTransactionsResponse,
    type CardIssueVirtualCardResponse as CardIssueVirtualCardResponse,
    type CardListAllResponse as CardListAllResponse,
    type CardRequestPhysicalCardResponse as CardRequestPhysicalCardResponse,
    type CardIssueVirtualCardParams as CardIssueVirtualCardParams,
    type CardListAllParams as CardListAllParams,
    type CardRequestPhysicalCardParams as CardRequestPhysicalCardParams,
    type CardToggleCardLockParams as CardToggleCardLockParams,
    type CardUpdateControlsParams as CardUpdateControlsParams,
  };

  export {
    Risk as Risk,
    type RiskGetRiskExposureResponse as RiskGetRiskExposureResponse,
    type RiskRunStressTestResponse as RiskRunStressTestResponse,
    type RiskRunStressTestParams as RiskRunStressTestParams,
  };

  export { Governance as Governance };

  export {
    Anomalies as Anomalies,
    type AnomalyListDetectedResponse as AnomalyListDetectedResponse,
    type AnomalyUpdateStatusParams as AnomalyUpdateStatusParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/corporate/corporate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as CardsAPI from './cards/cards';
import {
  CardFreezeParams,
  CardFreezeResponse,
  CardIssueVirtualParams,
  CardIssueVirtualResponse,
  CardListParams,
  CardListResponse,
  Cards,
} from './cards/cards';
import * as ComplianceAPI from './compliance/compliance';
import { Compliance } from './compliance/compliance';
import * as RiskAPI from './risk/risk';
import { Risk } from './risk/risk';
import * as TreasuryAPI from './treasury/treasury';
import {
  Treasury,
  TreasuryForecastCashFlowParams,
  TreasuryForecastCashFlowResponse,
} from './treasury/treasury';

export class Corporate extends APIResource {
  compliance: ComplianceAPI.Compliance = new ComplianceAPI.Compliance(this._client);
  treasury: TreasuryAPI.Treasury = new TreasuryAPI.Treasury(this._client);
  cards: CardsAPI.Cards = new CardsAPI.Cards(this._client);
  risk: RiskAPI.Risk = new RiskAPI.Risk(this._client);
}

Corporate.Compliance = Compliance;
Corporate.Treasury = Treasury;
Corporate.Cards = Cards;
Corporate.Risk = Risk;

export declare namespace Corporate {
  export { Compliance as Compliance };

  export {
    Treasury as Treasury,
    type TreasuryForecastCashFlowResponse as TreasuryForecastCashFlowResponse,
    type TreasuryForecastCashFlowParams as TreasuryForecastCashFlowParams,
  };

  export {
    Cards as Cards,
    type CardListResponse as CardListResponse,
    type CardFreezeResponse as CardFreezeResponse,
    type CardIssueVirtualResponse as CardIssueVirtualResponse,
    type CardListParams as CardListParams,
    type CardFreezeParams as CardFreezeParams,
    type CardIssueVirtualParams as CardIssueVirtualParams,
  };

  export { Risk as Risk };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/corporate.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AnomaliesAPI from './anomalies';
import {
  Anomalies,
  AnomalyListParams,
  AnomalyListResponse,
  AnomalyUpdateStatusParams,
  AnomalyUpdateStatusResponse,
} from './anomalies';
import * as CardsAPI from './cards/cards';
import {
  CardFreezeParams,
  CardFreezeResponse,
  CardIssueVirtualParams,
  CardIssueVirtualResponse,
  CardListParams,
  CardListResponse,
  CardListTransactionsParams,
  CardListTransactionsResponse,
  Cards,
} from './cards/cards';
import * as ComplianceAPI from './compliance/compliance';
import { Compliance } from './compliance/compliance';
import * as GovernanceAPI from './governance/governance';
import { Governance } from './governance/governance';
import * as RiskAPI from './risk/risk';
import { Risk } from './risk/risk';
import * as TreasuryAPI from './treasury/treasury';
import {
  Treasury,
  TreasuryRetrieveCashFlowForecastParams,
  TreasuryRetrieveCashFlowForecastResponse,
  TreasuryRetrieveLiquidityPositionsResponse,
} from './treasury/treasury';

export class Corporate extends APIResource {
  compliance: ComplianceAPI.Compliance = new ComplianceAPI.Compliance(this._client);
  treasury: TreasuryAPI.Treasury = new TreasuryAPI.Treasury(this._client);
  cards: CardsAPI.Cards = new CardsAPI.Cards(this._client);
  risk: RiskAPI.Risk = new RiskAPI.Risk(this._client);
  governance: GovernanceAPI.Governance = new GovernanceAPI.Governance(this._client);
  anomalies: AnomaliesAPI.Anomalies = new AnomaliesAPI.Anomalies(this._client);
}

Corporate.Compliance = Compliance;
Corporate.Treasury = Treasury;
Corporate.Cards = Cards;
Corporate.Risk = Risk;
Corporate.Governance = Governance;
Corporate.Anomalies = Anomalies;

export declare namespace Corporate {
  export { Compliance as Compliance };

  export {
    Treasury as Treasury,
    type TreasuryRetrieveCashFlowForecastResponse as TreasuryRetrieveCashFlowForecastResponse,
    type TreasuryRetrieveLiquidityPositionsResponse as TreasuryRetrieveLiquidityPositionsResponse,
    type TreasuryRetrieveCashFlowForecastParams as TreasuryRetrieveCashFlowForecastParams,
  };

  export {
    Cards as Cards,
    type CardListResponse as CardListResponse,
    type CardFreezeResponse as CardFreezeResponse,
    type CardIssueVirtualResponse as CardIssueVirtualResponse,
    type CardListTransactionsResponse as CardListTransactionsResponse,
    type CardListParams as CardListParams,
    type CardFreezeParams as CardFreezeParams,
    type CardIssueVirtualParams as CardIssueVirtualParams,
    type CardListTransactionsParams as CardListTransactionsParams,
  };

  export { Risk as Risk };

  export { Governance as Governance };

  export {
    Anomalies as Anomalies,
    type AnomalyListResponse as AnomalyListResponse,
    type AnomalyUpdateStatusResponse as AnomalyUpdateStatusResponse,
    type AnomalyListParams as AnomalyListParams,
    type AnomalyUpdateStatusParams as AnomalyUpdateStatusParams,
  };
}
