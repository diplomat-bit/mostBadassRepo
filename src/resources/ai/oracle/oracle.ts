// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/ai/oracle/oracle.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as PredictionsAPI from './predictions';
import {
  PredictionRetrieveInflationParams,
  PredictionRetrieveInflationResponse,
  PredictionRetrieveMarketCrashProbabilityResponse,
  Predictions,
} from './predictions';
import * as SimulateAPI from './simulate';
import {
  Simulate,
  SimulateAdvancedParams,
  SimulateAdvancedResponse,
  SimulateCreateParams,
  SimulateCreateResponse,
  SimulateMonteCarloParams,
} from './simulate';
import * as SimulationsAPI from './simulations';
import { SimulationListResponse, SimulationRetrieveResponse, Simulations } from './simulations';

export class Oracle extends APIResource {
  simulate: SimulateAPI.Simulate = new SimulateAPI.Simulate(this._client);
  predictions: PredictionsAPI.Predictions = new PredictionsAPI.Predictions(this._client);
  simulations: SimulationsAPI.Simulations = new SimulationsAPI.Simulations(this._client);
}

Oracle.Simulate = Simulate;
Oracle.Predictions = Predictions;
Oracle.Simulations = Simulations;

export declare namespace Oracle {
  export {
    Simulate as Simulate,
    type SimulateCreateResponse as SimulateCreateResponse,
    type SimulateAdvancedResponse as SimulateAdvancedResponse,
    type SimulateCreateParams as SimulateCreateParams,
    type SimulateAdvancedParams as SimulateAdvancedParams,
    type SimulateMonteCarloParams as SimulateMonteCarloParams,
  };

  export {
    Predictions as Predictions,
    type PredictionRetrieveInflationResponse as PredictionRetrieveInflationResponse,
    type PredictionRetrieveMarketCrashProbabilityResponse as PredictionRetrieveMarketCrashProbabilityResponse,
    type PredictionRetrieveInflationParams as PredictionRetrieveInflationParams,
  };

  export {
    Simulations as Simulations,
    type SimulationRetrieveResponse as SimulationRetrieveResponse,
    type SimulationListResponse as SimulationListResponse,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/ai/oracle/oracle.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../resource';
import * as PredictionsAPI from './predictions';
import { Predictions } from './predictions';
import * as SimulateAPI from './simulate';
import {
  Simulate,
  SimulateRunAdvancedParams,
  SimulateRunAdvancedResponse,
  SimulateRunStandardParams,
  SimulateRunStandardResponse,
} from './simulate';

export class Oracle extends APIResource {
  simulate: SimulateAPI.Simulate = new SimulateAPI.Simulate(this._client);
  predictions: PredictionsAPI.Predictions = new PredictionsAPI.Predictions(this._client);
}

Oracle.Simulate = Simulate;
Oracle.Predictions = Predictions;

export declare namespace Oracle {
  export {
    Simulate as Simulate,
    type SimulateRunAdvancedResponse as SimulateRunAdvancedResponse,
    type SimulateRunStandardResponse as SimulateRunStandardResponse,
    type SimulateRunAdvancedParams as SimulateRunAdvancedParams,
    type SimulateRunStandardParams as SimulateRunStandardParams,
  };

  export { Predictions as Predictions };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/ai/oracle/oracle.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as PredictionsAPI from './predictions';
import { Predictions } from './predictions';
import * as SimulateAPI from './simulate';
import {
  Simulate,
  SimulateRunAdvancedParams,
  SimulateRunAdvancedResponse,
  SimulateRunStandardParams,
  SimulateRunStandardResponse,
} from './simulate';
import * as SimulationsAPI from './simulations';
import {
  SimulationListParams,
  SimulationListResponse,
  SimulationRetrieveResponse,
  Simulations,
} from './simulations';

export class Oracle extends APIResource {
  simulate: SimulateAPI.Simulate = new SimulateAPI.Simulate(this._client);
  predictions: PredictionsAPI.Predictions = new PredictionsAPI.Predictions(this._client);
  simulations: SimulationsAPI.Simulations = new SimulationsAPI.Simulations(this._client);
}

Oracle.Simulate = Simulate;
Oracle.Predictions = Predictions;
Oracle.Simulations = Simulations;

export declare namespace Oracle {
  export {
    Simulate as Simulate,
    type SimulateRunAdvancedResponse as SimulateRunAdvancedResponse,
    type SimulateRunStandardResponse as SimulateRunStandardResponse,
    type SimulateRunAdvancedParams as SimulateRunAdvancedParams,
    type SimulateRunStandardParams as SimulateRunStandardParams,
  };

  export { Predictions as Predictions };

  export {
    Simulations as Simulations,
    type SimulationRetrieveResponse as SimulationRetrieveResponse,
    type SimulationListResponse as SimulationListResponse,
    type SimulationListParams as SimulationListParams,
  };
}
