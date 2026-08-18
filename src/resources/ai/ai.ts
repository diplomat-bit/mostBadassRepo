// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/ai.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ModelsAPI from './models';
import { ModelFineTuneParams, ModelFineTuneResponse, ModelRetrieveVersionsResponse, Models } from './models';
import * as AdsAPI from './ads/ads';
import { AdListResponse, AdOptimizeParams, AdOptimizeResponse, AdRetrieveResponse, Ads } from './ads/ads';
import * as AdvisorAPI from './advisor/advisor';
import { Advisor } from './advisor/advisor';
import * as AgentAPI from './agent/agent';
import { Agent, AgentRetrieveCapabilitiesResponse } from './agent/agent';
import * as IncubatorAPI from './incubator/incubator';
import {
  Incubator,
  IncubatorRetrievePitchesResponse,
  IncubatorValidateParams,
  IncubatorValidateResponse,
} from './incubator/incubator';
import * as OracleAPI from './oracle/oracle';
import { Oracle } from './oracle/oracle';

export class AI extends APIResource {
  oracle: OracleAPI.Oracle = new OracleAPI.Oracle(this._client);
  incubator: IncubatorAPI.Incubator = new IncubatorAPI.Incubator(this._client);
  ads: AdsAPI.Ads = new AdsAPI.Ads(this._client);
  advisor: AdvisorAPI.Advisor = new AdvisorAPI.Advisor(this._client);
  agent: AgentAPI.Agent = new AgentAPI.Agent(this._client);
  models: ModelsAPI.Models = new ModelsAPI.Models(this._client);
}

AI.Oracle = Oracle;
AI.Incubator = Incubator;
AI.Ads = Ads;
AI.Advisor = Advisor;
AI.Agent = Agent;
AI.Models = Models;

export declare namespace AI {
  export { Oracle as Oracle };

  export {
    Incubator as Incubator,
    type IncubatorRetrievePitchesResponse as IncubatorRetrievePitchesResponse,
    type IncubatorValidateResponse as IncubatorValidateResponse,
    type IncubatorValidateParams as IncubatorValidateParams,
  };

  export {
    Ads as Ads,
    type AdRetrieveResponse as AdRetrieveResponse,
    type AdListResponse as AdListResponse,
    type AdOptimizeResponse as AdOptimizeResponse,
    type AdOptimizeParams as AdOptimizeParams,
  };

  export { Advisor as Advisor };

  export { Agent as Agent, type AgentRetrieveCapabilitiesResponse as AgentRetrieveCapabilitiesResponse };

  export {
    Models as Models,
    type ModelFineTuneResponse as ModelFineTuneResponse,
    type ModelRetrieveVersionsResponse as ModelRetrieveVersionsResponse,
    type ModelFineTuneParams as ModelFineTuneParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/ai/ai.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as AdsAPI from './ads';
import { Ads } from './ads';
import * as AdvisorAPI from './advisor/advisor';
import { Advisor, AdvisorChatParams, AdvisorChatResponse } from './advisor/advisor';
import * as IncubatorAPI from './incubator/incubator';
import {
  Incubator,
  IncubatorGeneratePitchParams,
  IncubatorGeneratePitchResponse,
} from './incubator/incubator';
import * as OracleAPI from './oracle/oracle';
import { Oracle } from './oracle/oracle';

export class AI extends APIResource {
  advisor: AdvisorAPI.Advisor = new AdvisorAPI.Advisor(this._client);
  oracle: OracleAPI.Oracle = new OracleAPI.Oracle(this._client);
  incubator: IncubatorAPI.Incubator = new IncubatorAPI.Incubator(this._client);
  ads: AdsAPI.Ads = new AdsAPI.Ads(this._client);
}

AI.Advisor = Advisor;
AI.Oracle = Oracle;
AI.Incubator = Incubator;
AI.Ads = Ads;

export declare namespace AI {
  export {
    Advisor as Advisor,
    type AdvisorChatResponse as AdvisorChatResponse,
    type AdvisorChatParams as AdvisorChatParams,
  };

  export { Oracle as Oracle };

  export {
    Incubator as Incubator,
    type IncubatorGeneratePitchResponse as IncubatorGeneratePitchResponse,
    type IncubatorGeneratePitchParams as IncubatorGeneratePitchParams,
  };

  export { Ads as Ads };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/ai.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AdsAPI from './ads';
import { AdListParams, AdListResponse, AdRetrieveOperationStatusResponse, Ads } from './ads';
import * as AgentAPI from './agent';
import { Agent } from './agent';
import * as ModelsAPI from './models';
import { Models } from './models';
import * as AdvisorAPI from './advisor/advisor';
import {
  Advisor,
  AdvisorChatParams,
  AdvisorChatResponse,
  AdvisorRetrieveHistoryParams,
  AdvisorRetrieveHistoryResponse,
} from './advisor/advisor';
import * as IncubatorAPI from './incubator/incubator';
import {
  Incubator,
  IncubatorListPitchesParams,
  IncubatorListPitchesResponse,
  IncubatorSubmitPitchParams,
  IncubatorSubmitPitchResponse,
} from './incubator/incubator';
import * as OracleAPI from './oracle/oracle';
import { Oracle } from './oracle/oracle';

export class AI extends APIResource {
  advisor: AdvisorAPI.Advisor = new AdvisorAPI.Advisor(this._client);
  oracle: OracleAPI.Oracle = new OracleAPI.Oracle(this._client);
  incubator: IncubatorAPI.Incubator = new IncubatorAPI.Incubator(this._client);
  ads: AdsAPI.Ads = new AdsAPI.Ads(this._client);
  agent: AgentAPI.Agent = new AgentAPI.Agent(this._client);
  models: ModelsAPI.Models = new ModelsAPI.Models(this._client);
}

AI.Advisor = Advisor;
AI.Oracle = Oracle;
AI.Incubator = Incubator;
AI.Ads = Ads;
AI.Agent = Agent;
AI.Models = Models;

export declare namespace AI {
  export {
    Advisor as Advisor,
    type AdvisorChatResponse as AdvisorChatResponse,
    type AdvisorRetrieveHistoryResponse as AdvisorRetrieveHistoryResponse,
    type AdvisorChatParams as AdvisorChatParams,
    type AdvisorRetrieveHistoryParams as AdvisorRetrieveHistoryParams,
  };

  export { Oracle as Oracle };

  export {
    Incubator as Incubator,
    type IncubatorListPitchesResponse as IncubatorListPitchesResponse,
    type IncubatorSubmitPitchResponse as IncubatorSubmitPitchResponse,
    type IncubatorListPitchesParams as IncubatorListPitchesParams,
    type IncubatorSubmitPitchParams as IncubatorSubmitPitchParams,
  };

  export {
    Ads as Ads,
    type AdListResponse as AdListResponse,
    type AdRetrieveOperationStatusResponse as AdRetrieveOperationStatusResponse,
    type AdListParams as AdListParams,
  };

  export { Agent as Agent };

  export { Models as Models };
}
