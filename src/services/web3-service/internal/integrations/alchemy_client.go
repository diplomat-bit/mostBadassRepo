// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/web3-service/internal/integrations/alchemy_client.go
================================================================================

// Package integrations provides clients for interacting with third-party services,
// including blockchain node providers.
package integrations

import (
	"context"
	"encoding/json"
	"fmt"
	"math/big"
	"strings"
	"time"

	"github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/ethclient"
	"golang.org/x/time/rate"
)

const (
	// erc20ABI is the minimal Application Binary Interface for ERC20 tokens
	// needed for balance, symbol, and decimal checks.
	erc20ABI = `[
		{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},
		{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},
		{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}
	]`

	// defaultRequestTimeout is the default timeout for RPC requests.
	defaultRequestTimeout = 15 * time.Second
)

// BlockchainClient defines the interface for a client that interacts with a blockchain node.
// This allows for swapping implementations (e.g., Alchemy, Infura, local node) and mocking for tests.
type BlockchainClient interface {
	GetNativeBalance(ctx context.Context, address common.Address) (*big.Int, error)
	GetERC20Balance(ctx context.Context, contractAddress, walletAddress common.Address) (*big.Int, error)
	GetNFTsForOwner(ctx context.Context, ownerAddress common.Address, contractAddresses []string) (*GetNFTsResponse, error)
	SendRawTransaction(ctx context.Context, tx *types.Transaction) error
	GetTransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error)
	SuggestGasPrice(ctx context.Context) (*big.Int, error)
	EstimateGas(ctx context.Context, msg ethereum.CallMsg) (uint64, error)
	GetChainID(ctx context.Context) (*big.Int, error)
	Close()
}

// AlchemyClientConfig holds the configuration for the AlchemyClient.
type AlchemyClientConfig struct {
	// RPCURL is the full URL to the blockchain node provider (e.g., https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY)
	RPCURL string
	// RequestTimeout is the timeout for individual RPC requests. Defaults to 15 seconds.
	RequestTimeout time.Duration
	// RequestsPerSecond is the rate limit for requests to the provider.
	RequestsPerSecond float64
	// BurstLimit is the burst limit for the rate limiter.
	BurstLimit int
}

// AlchemyClient is a client for interacting with a blockchain node via an RPC endpoint,
// with specialized support for Alchemy's enhanced APIs.
type AlchemyClient struct {
	client  *ethclient.Client
	limiter *rate.Limiter
	erc20ABI abi.ABI
}

// NFT represents a single non-fungible token with its metadata, based on Alchemy's API structure.
type NFT struct {
	Contract struct {
		Address string `json:"address"`
	} `json:"contract"`
	ID struct {
		TokenID       string `json:"tokenId"`
		TokenMetadata struct {
			TokenType string `json:"tokenType"`
		} `json:"tokenMetadata"`
	} `json:"id"`
	Balance     string `json:"balance"`
	Title       string `json:"title"`
	Description string `json:"description"`
	TokenURI    struct {
		Gateway string `json:"gateway"`
		Raw     string `json:"raw"`
	} `json:"tokenUri"`
	Media []struct {
		Gateway string `json:"gateway"`
		Raw     string `json:"raw"`
	} `json:"media"`
	Metadata map[string]interface{} `json:"metadata"`
	TimeLastUpdated string `json:"timeLastUpdated"`
}

// GetNFTsResponse is the structure of the response from Alchemy's alchemy_getNfts method.
type GetNFTsResponse struct {
	OwnedNFTs  []NFT  `json:"ownedNfts"`
	PageKey    string `json:"pageKey"`
	TotalCount int    `json:"totalCount"`
}

// NewAlchemyClient creates and initializes a new AlchemyClient.
// It establishes a connection to the RPC endpoint and performs a health check.
func NewAlchemyClient(config AlchemyClientConfig) (*AlchemyClient, error) {
	if config.RPCURL == "" {
		return nil, fmt.Errorf("RPCURL is required in AlchemyClientConfig")
	}

	if config.RequestTimeout == 0 {
		config.RequestTimeout = defaultRequestTimeout
	}

	ctx, cancel := context.WithTimeout(context.Background(), config.RequestTimeout)
	defer cancel()

	client, err := ethclient.DialContext(ctx, config.RPCURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to RPC endpoint %s: %w", config.RPCURL, err)
	}

	// Perform a simple health check by fetching the chain ID.
	chainID, err := client.ChainID(ctx)
	if err != nil {
		client.Close()
		return nil, fmt.Errorf("failed to fetch chain ID during client initialization: %w", err)
	}

	parsedABI, err := abi.JSON(strings.NewReader(erc20ABI))
	if err != nil {
		// This should not happen with a valid ABI constant.
		client.Close()
		return nil, fmt.Errorf("internal error: failed to parse ERC20 ABI: %w", err)
	}

	// Default rate limit if not provided
	if config.RequestsPerSecond == 0 {
		config.RequestsPerSecond = 10 // A sensible default
	}
	if config.BurstLimit == 0 {
		config.BurstLimit = 5
	}

	limiter := rate.NewLimiter(rate.Limit(config.RequestsPerSecond), config.BurstLimit)

	fmt.Printf("Successfully connected to blockchain node. Chain ID: %s\n", chainID.String())

	return &AlchemyClient{
		client:  client,
		limiter: limiter,
		erc20ABI: parsedABI,
	}, nil
}

// Close terminates the RPC connection.
func (c *AlchemyClient) Close() {
	c.client.Close()
}

// GetNativeBalance retrieves the native currency (e.g., ETH) balance for a given address.
func (c *AlchemyClient) GetNativeBalance(ctx context.Context, address common.Address) (*big.Int, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return nil, err
	}

	balance, err := c.client.BalanceAt(ctx, address, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to get native balance for address %s: %w", address.Hex(), err)
	}
	return balance, nil
}

// GetERC20Balance retrieves the token balance for a given ERC20 contract and wallet address.
func (c *AlchemyClient) GetERC20Balance(ctx context.Context, contractAddress, walletAddress common.Address) (*big.Int, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return nil, err
	}

	data, err := c.erc20ABI.Pack("balanceOf", walletAddress)
	if err != nil {
		return nil, fmt.Errorf("failed to pack data for balanceOf call: %w", err)
	}

	callMsg := ethereum.CallMsg{
		To:   &contractAddress,
		Data: data,
	}

	result, err := c.client.CallContract(ctx, callMsg, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to call contract %s for balance of %s: %w", contractAddress.Hex(), walletAddress.Hex(), err)
	}

	balance := new(big.Int)
	balance.SetBytes(result)

	return balance, nil
}

// GetNFTsForOwner fetches all NFTs for a given owner, optionally filtered by contract addresses.
// This uses Alchemy's custom `alchemy_getNfts` RPC method for efficiency.
func (c *AlchemyClient) GetNFTsForOwner(ctx context.Context, ownerAddress common.Address, contractAddresses []string) (*GetNFTsResponse, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return nil, err
	}

	params := map[string]interface{}{
		"owner":        ownerAddress.Hex(),
		"withMetadata": true,
	}
	if len(contractAddresses) > 0 {
		params["contractAddresses"] = contractAddresses
	}

	var result GetNFTsResponse
	// Access the underlying rpc.Client to make a custom call.
	err := c.client.Client().CallContext(ctx, &result, "alchemy_getNfts", params)
	if err != nil {
		// Try to unmarshal a potential error response from the provider
		var rpcErr struct {
			Error struct {
				Code    int    `json:"code"`
				Message string `json:"message"`
			} `json:"error"`
		}
		if jsonErr := json.Unmarshal([]byte(err.Error()), &rpcErr); jsonErr == nil && rpcErr.Error.Message != "" {
			return nil, fmt.Errorf("alchemy_getNfts RPC error: %s (code: %d)", rpcErr.Error.Message, rpcErr.Error.Code)
		}
		return nil, fmt.Errorf("failed to call alchemy_getNfts for owner %s: %w", ownerAddress.Hex(), err)
	}

	return &result, nil
}

// SendRawTransaction broadcasts a signed transaction to the network.
func (c *AlchemyClient) SendRawTransaction(ctx context.Context, tx *types.Transaction) error {
	if err := c.limiter.Wait(ctx); err != nil {
		return err
	}

	err := c.client.SendTransaction(ctx, tx)
	if err != nil {
		return fmt.Errorf("failed to send raw transaction %s: %w", tx.Hash().Hex(), err)
	}
	return nil
}

// GetTransactionReceipt retrieves the receipt of a mined transaction.
func (c *AlchemyClient) GetTransactionReceipt(ctx context.Context, txHash common.Hash) (*types.Receipt, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return nil, err
	}

	receipt, err := c.client.TransactionReceipt(ctx, txHash)
	if err != nil {
		return nil, fmt.Errorf("failed to get transaction receipt for hash %s: %w", txHash.Hex(), err)
	}
	return receipt, nil
}

// SuggestGasPrice retrieves the suggested gas price for a transaction.
func (c *AlchemyClient) SuggestGasPrice(ctx context.Context) (*big.Int, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return nil, err
	}

	gasPrice, err := c.client.SuggestGasPrice(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to suggest gas price: %w", err)
	}
	return gasPrice, nil
}

// EstimateGas estimates the gas needed to execute a specific transaction.
func (c *AlchemyClient) EstimateGas(ctx context.Context, msg ethereum.CallMsg) (uint64, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return 0, err
	}

	gas, err := c.client.EstimateGas(ctx, msg)
	if err != nil {
		return 0, fmt.Errorf("failed to estimate gas: %w", err)
	}
	return gas, nil
}

// GetChainID retrieves the current chain ID for the connected network.
func (c *AlchemyClient) GetChainID(ctx context.Context) (*big.Int, error) {
	if err := c.limiter.Wait(ctx); err != nil {
		return nil, err
	}

	chainID, err := c.client.ChainID(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get chain ID: %w", err)
	}
	return chainID, nil
}