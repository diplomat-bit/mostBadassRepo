// REPOSITORY SOURCE: diplomat-bit/jocall3-go | PATH: diplomat-bit-jocall3-go-7054919/web3.go
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

package githubcomjocall3go

import (
	"github.com/diplomat-bit/jocall3-go/option"
)

// Web3Service contains methods and other services that help with interacting with
// the jocall3 API.
//
// Note, unlike clients, this service does not read variables from the environment
// automatically. You should not instantiate this service directly, and instead use
// the [NewWeb3Service] method instead.
type Web3Service struct {
	Options        []option.RequestOption
	Wallets        *Web3WalletService
	Transactions   *Web3TransactionService
	NFTs           *Web3NFTService
	SmartContracts *Web3SmartContractService
}

// NewWeb3Service generates a new service that applies the given options to each
// request. These options are applied after the parent client's options (if there
// is one), and before any request-specific options.
func NewWeb3Service(opts ...option.RequestOption) (r *Web3Service) {
	r = &Web3Service{}
	r.Options = opts
	r.Wallets = NewWeb3WalletService(opts...)
	r.Transactions = NewWeb3TransactionService(opts...)
	r.NFTs = NewWeb3NFTService(opts...)
	r.SmartContracts = NewWeb3SmartContractService(opts...)
	return
}
