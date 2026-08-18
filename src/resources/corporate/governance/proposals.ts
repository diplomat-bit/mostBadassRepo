// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/src/resources/corporate/governance/proposals.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';
import { APIPromise } from '../../../core/api-promise';
import { buildHeaders } from '../../../internal/headers';
import { RequestOptions } from '../../../internal/request-options';
import { path } from '../../../internal/utils/path';

export class Proposals extends APIResource {
  /**
   * Cast Vote or Sign Transaction
   *
   * @example
   * ```ts
   * await client.corporate.governance.proposals.castVote(
   *   'string',
   *   {
   *     decision: 'REJECT',
   *     comment: 'string',
   *     signature: 'string',
   *   },
   * );
   * ```
   */
  castVote(proposalID: string, body: ProposalCastVoteParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post(path`/corporate/governance/proposals/${proposalID}/vote`, {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * Create New Multi-sig Financial Proposal
   *
   * @example
   * ```ts
   * await client.corporate.governance.proposals.createNew({
   *   actionType: 'LARGE_PAYMENT',
   *   payload: {},
   *   title: 'string',
   *   description: 'string',
   *   votingPeriodHours: 24,
   * });
   * ```
   */
  createNew(body: ProposalCreateNewParams, options?: RequestOptions): APIPromise<void> {
    return this._client.post('/corporate/governance/proposals', {
      body,
      ...options,
      headers: buildHeaders([{ Accept: '*/*' }, options?.headers]),
    });
  }

  /**
   * List Active Governance Proposals
   *
   * @example
   * ```ts
   * const response =
   *   await client.corporate.governance.proposals.listActive();
   * ```
   */
  listActive(options?: RequestOptions): APIPromise<ProposalListActiveResponse> {
    return this._client.get('/corporate/governance/proposals', options);
  }
}

export interface ProposalListActiveResponse {
  data: Array<ProposalListActiveResponse.Data>;
}

export namespace ProposalListActiveResponse {
  export interface Data {
    id: string;

    requiredApprovals: number;

    status: 'PENDING' | 'APPROVED' | 'EXECUTED' | 'REJECTED';

    title: string;

    currentApprovals?: number;

    description?: string;

    expiresAt?: string;
  }
}

export interface ProposalCastVoteParams {
  decision: 'APPROVE' | 'REJECT';

  comment?: string;

  /**
   * Cryptographic signature if required
   */
  signature?: string;
}

export interface ProposalCreateNewParams {
  actionType: 'TRANSFER_LIMIT_CHANGE' | 'NEW_ADMIN' | 'LARGE_PAYMENT';

  /**
   * The raw action data to be executed upon approval
   */
  payload: unknown;

  title: string;

  description?: string;

  votingPeriodHours?: number;
}

export declare namespace Proposals {
  export {
    type ProposalListActiveResponse as ProposalListActiveResponse,
    type ProposalCastVoteParams as ProposalCastVoteParams,
    type ProposalCreateNewParams as ProposalCreateNewParams,
  };
}


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/src/resources/corporate/governance/proposals.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../../core/resource';

export class Proposals extends APIResource {}
