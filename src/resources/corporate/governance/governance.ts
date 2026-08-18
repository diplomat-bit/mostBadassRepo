// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/governance/governance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ProposalsAPI from './proposals';
import {
  ProposalCastVoteParams,
  ProposalCreateNewParams,
  ProposalListActiveResponse,
  Proposals,
} from './proposals';

export class Governance extends APIResource {
  proposals: ProposalsAPI.Proposals = new ProposalsAPI.Proposals(this._client);
}

Governance.Proposals = Proposals;

export declare namespace Governance {
  export {
    Proposals as Proposals,
    type ProposalListActiveResponse as ProposalListActiveResponse,
    type ProposalCastVoteParams as ProposalCastVoteParams,
    type ProposalCreateNewParams as ProposalCreateNewParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/governance/governance.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import * as ProposalsAPI from './proposals';
import { Proposals } from './proposals';

export class Governance extends APIResource {
  proposals: ProposalsAPI.Proposals = new ProposalsAPI.Proposals(this._client);
}

Governance.Proposals = Proposals;

export declare namespace Governance {
  export { Proposals as Proposals };
}
