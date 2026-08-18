// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/lending/lending.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ApplicationsAPI from './applications';
import {
  ApplicationSubmitParams,
  ApplicationSubmitResponse,
  ApplicationTrackStatusResponse,
  Applications,
} from './applications';
import * as DecisionsAPI from './decisions';
import { DecisionGetRationaleResponse, Decisions } from './decisions';

export class Lending extends APIResource {
  applications: ApplicationsAPI.Applications = new ApplicationsAPI.Applications(this._client);
  decisions: DecisionsAPI.Decisions = new DecisionsAPI.Decisions(this._client);
}

Lending.Applications = Applications;
Lending.Decisions = Decisions;

export declare namespace Lending {
  export {
    Applications as Applications,
    type ApplicationSubmitResponse as ApplicationSubmitResponse,
    type ApplicationTrackStatusResponse as ApplicationTrackStatusResponse,
    type ApplicationSubmitParams as ApplicationSubmitParams,
  };

  export { Decisions as Decisions, type DecisionGetRationaleResponse as DecisionGetRationaleResponse };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/src/resources/lending/lending.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../resource';
import * as DecisionsAPI from './decisions';
import { Decisions } from './decisions';

export class Lending extends APIResource {
  decisions: DecisionsAPI.Decisions = new DecisionsAPI.Decisions(this._client);
}

Lending.Decisions = Decisions;

export declare namespace Lending {
  export { Decisions as Decisions };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/lending/lending.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as ApplicationsAPI from './applications';
import { Applications } from './applications';
import * as DecisionsAPI from './decisions';
import { Decisions } from './decisions';

export class Lending extends APIResource {
  applications: ApplicationsAPI.Applications = new ApplicationsAPI.Applications(this._client);
  decisions: DecisionsAPI.Decisions = new DecisionsAPI.Decisions(this._client);
}

Lending.Applications = Applications;
Lending.Decisions = Decisions;

export declare namespace Lending {
  export { Applications as Applications };

  export { Decisions as Decisions };
}
