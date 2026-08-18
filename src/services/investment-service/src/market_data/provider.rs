// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/investment-service/src/market_data/provider.rs
================================================================================

// src/services/investment-service/src/market_data/provider.rs

//! This module provides a unified interface for fetching real-time and historical
//! market data from various third-party providers. It uses a trait-based
//! approach to allow for easy swapping and aggregation of data sources.

use async_trait::async_trait;
use chrono::{DateTime, TimeZone, Utc};
use rand::Rng;
use reqwest::{header, Client};
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::sync::Arc;
use thiserror::Error;

// Assuming a central config module exists at `crate::config` which defines these structs.
// If not, they would be defined here or in a dedicated config file.
use crate::config::{AlpacaConfig, IexConfig, PolygonConfig, Settings};

// --- Core Data Models (Provider-Agnostic) ---
// These structs represent the standardized data format used within our application.
// Each provider implementation is responsible for mapping its specific API response
// to these common models.

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Quote {
    pub symbol: String,
    pub ask_price: f64,
    pub ask_size: u64,
    pub bid_price: f64,
    pub bid_size: u64,
    pub timestamp: DateTime<Utc>,
    /// The name of the provider that supplied this data.
    pub provider: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Trade {
    pub symbol: String,
    pub price: f64,
    pub size: u64,
    pub timestamp: DateTime<Utc>,
    pub exchange: String,
    pub conditions: Vec<String>,
    /// The name of the provider that supplied this data.
    pub provider: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Bar {
    pub symbol: String,
    pub open: f64,
    pub high: f64,
    pub low: f64,
    pub close: f64,
    pub volume: u64,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum AssetClass {
    UsEquity,
    Crypto,
    Fx,
    Option,
    Future,
    Unknown,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct Asset {
    pub symbol: String,
    pub name: String,
    pub asset_class: AssetClass,
    pub exchange: String,
    pub status: String, // e.g., "active", "inactive"
    pub tradable: bool,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum Timeframe {
    OneMin,
    FiveMin,
    FifteenMin,
    OneHour,
    OneDay,
}

// --- Custom Error Type ---

#[derive(Error, Debug)]
pub enum MarketDataError {
    #[error("Provider configuration error: {0}")]
    Configuration(String),
    #[error("Network request failed: {0}")]
    Network(#[from] reqwest::Error),
    #[error("API error from provider: {0}")]
    Api(String),
    #[error("Failed to parse data: {0}")]
    Parse(String),
    #[error("Symbol not found: {0}")]
    SymbolNotFound(String),
    #[error("Unsupported operation: {0}")]
    Unsupported(String),
    #[error("Rate limit exceeded")]
    RateLimited,
    #[error("An unknown error occurred")]
    Unknown,
}

// --- The Core Abstraction: MarketDataProvider Trait ---

/// A trait defining the contract for any market data provider.
/// This allows for a plug-and-play architecture for different data sources.
#[async_trait]
pub trait MarketDataProvider: Send + Sync {
    /// Returns the name of the provider.
    fn name(&self) -> &'static str;

    /// Fetches the latest quote for a given symbol.
    async fn get_latest_quote(&self, symbol: &str) -> Result<Quote, MarketDataError>;

    /// Fetches the latest trade for a given symbol.
    async fn get_latest_trade(&self, symbol: &str) -> Result<Trade, MarketDataError>;

    /// Fetches historical OHLCV (bar) data for a given symbol and timeframe.
    async fn get_historical_bars(
        &self,
        symbol: &str,
        timeframe: Timeframe,
        start: DateTime<Utc>,
        end: DateTime<Utc>,
    ) -> Result<Vec<Bar>, MarketDataError>;

    /// Fetches detailed information about a financial asset.
    async fn get_asset_details(&self, symbol: &str) -> Result<Asset, MarketDataError>;
}

// --- Provider Management ---

/// An enumeration of supported market data providers.
#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ProviderType {
    Alpaca,
    Polygon,
    Iex,
    Mock,
}

/// A factory function to create a concrete `MarketDataProvider` instance
/// based on the application's configuration. This is the single entry point
/// for the rest of the application to get a market data client.
pub fn create_provider(config: &Settings) -> Result<Arc<dyn MarketDataProvider>, MarketDataError> {
    let provider_config = &config.market_data;
    match provider_config.provider {
        ProviderType::Alpaca => {
            let alpaca_config = provider_config.alpaca.as_ref().ok_or_else(|| {
                MarketDataError::Configuration(
                    "Alpaca provider selected but no configuration found".to_string(),
                )
            })?;
            Ok(Arc::new(alpaca::AlpacaProvider::new(
                alpaca_config.clone(),
            )))
        }
        ProviderType::Polygon => {
            let polygon_config = provider_config.polygon.as_ref().ok_or_else(|| {
                MarketDataError::Configuration(
                    "Polygon provider selected but no configuration found".to_string(),
                )
            })?;
            Ok(Arc::new(polygon::PolygonProvider::new(
                polygon_config.clone(),
            )))
        }
        ProviderType::Iex => {
            let iex_config = provider_config.iex.as_ref().ok_or_else(|| {
                MarketDataError::Configuration(
                    "IEX Cloud provider selected but no configuration found".to_string(),
                )
            })?;
            Ok(Arc::new(iex::IexProvider::new(iex_config.clone())))
        }
        ProviderType::Mock => Ok(Arc::new(mock::MockProvider::new())),
    }
}

// --- Aggregator/Failover Provider ---
// This demonstrates the power of the trait-based approach. We can create a "meta-provider"
// that wraps multiple underlying providers for enhanced reliability or data quality.

pub struct AggregatorProvider {
    /// Providers are ordered by priority.
    providers: Vec<Arc<dyn MarketDataProvider>>,
}

impl AggregatorProvider {
    pub fn new(providers: Vec<Arc<dyn MarketDataProvider>>) -> Self {
        if providers.is_empty() {
            panic!("AggregatorProvider must be initialized with at least one provider.");
        }
        Self { providers }
    }
}

#[async_trait]
impl MarketDataProvider for AggregatorProvider {
    fn name(&self) -> &'static str {
        "Aggregator"
    }

    async fn get_latest_quote(&self, symbol: &str) -> Result<Quote, MarketDataError> {
        let mut last_error: Option<MarketDataError> = None;
        for provider in &self.providers {
            match provider.get_latest_quote(symbol).await {
                Ok(quote) => return Ok(quote),
                Err(e) => {
                    tracing::warn!(provider = provider.name(), error = ?e, "Failed to fetch quote, trying next provider.");
                    last_error = Some(e);
                }
            }
        }
        Err(last_error.unwrap_or(MarketDataError::Unknown))
    }

    async fn get_latest_trade(&self, symbol: &str) -> Result<Trade, MarketDataError> {
        let mut last_error: Option<MarketDataError> = None;
        for provider in &self.providers {
            match provider.get_latest_trade(symbol).await {
                Ok(trade) => return Ok(trade),
                Err(e) => {
                    tracing::warn!(provider = provider.name(), error = ?e, "Failed to fetch trade, trying next provider.");
                    last_error = Some(e);
                }
            }
        }
        Err(last_error.unwrap_or(MarketDataError::Unknown))
    }

    async fn get_historical_bars(
        &self,
        symbol: &str,
        timeframe: Timeframe,
        start: DateTime<Utc>,
        end: DateTime<Utc>,
    ) -> Result<Vec<Bar>, MarketDataError> {
        let mut last_error: Option<MarketDataError> = None;
        for provider in &self.providers {
            match provider
                .get_historical_bars(symbol, timeframe, start, end)
                .await
            {
                Ok(bars) if !bars.is_empty() => return Ok(bars),
                Ok(_) => {
                    // Empty but successful response
                    tracing::warn!(provider = provider.name(), "Provider returned no bars, trying next provider.");
                    last_error =
                        Some(MarketDataError::Parse("Provider returned no data".to_string()));
                }
                Err(e) => {
                    tracing::warn!(provider = provider.name(), error = ?e, "Failed to fetch bars, trying next provider.");
                    last_error = Some(e);
                }
            }
        }
        Err(last_error.unwrap_or(MarketDataError::Unknown))
    }

    async fn get_asset_details(&self, symbol: &str) -> Result<Asset, MarketDataError> {
        let mut last_error: Option<MarketDataError> = None;
        for provider in &self.providers {
            match provider.get_asset_details(symbol).await {
                Ok(asset) => return Ok(asset),
                Err(e) => {
                    tracing::warn!(provider = provider.name(), error = ?e, "Failed to fetch asset details, trying next provider.");
                    last_error = Some(e);
                }
            }
        }
        Err(last_error.unwrap_or(MarketDataError::Unknown))
    }
}

// --- Helper Functions ---

impl Timeframe {
    /// Converts the internal Timeframe enum to a string representation for Alpaca.
    pub fn to_alpaca_str(&self) -> &'static str {
        match self {
            Timeframe::OneMin => "1Min",
            Timeframe::FiveMin => "5Min",
            Timeframe::FifteenMin => "15Min",
            Timeframe::OneHour => "1Hour",
            Timeframe::OneDay => "1Day",
        }
    }

    /// Converts the internal Timeframe enum to a string representation for Polygon.
    pub fn to_polygon_str(&self) -> (&'static str, &'static str) {
        match self {
            Timeframe::OneMin => ("1", "minute"),
            Timeframe::FiveMin => ("5", "minute"),
            Timeframe::FifteenMin => ("15", "minute"),
            Timeframe::OneHour => ("1", "hour"),
            Timeframe::OneDay => ("1", "day"),
        }
    }
}

// --- Inline Provider Implementations ---

/// Mock provider for testing and development.
pub mod mock {
    use super::*;
    use chrono::Duration;

    pub struct MockProvider;

    impl Default for MockProvider {
        fn default() -> Self {
            Self::new()
        }
    }

    impl MockProvider {
        pub fn new() -> Self {
            Self
        }
    }

    #[async_trait]
    impl MarketDataProvider for MockProvider {
        fn name(&self) -> &'static str {
            "Mock"
        }

        async fn get_latest_quote(&self, symbol: &str) -> Result<Quote, MarketDataError> {
            let mut rng = rand::thread_rng();
            let price = rng.gen_range(100.0..500.0);
            Ok(Quote {
                symbol: symbol.to_string(),
                ask_price: price + 0.02,
                ask_size: rng.gen_range(1..10) * 100,
                bid_price: price - 0.02,
                bid_size: rng.gen_range(1..10) * 100,
                timestamp: Utc::now(),
                provider: self.name().to_string(),
            })
        }

        async fn get_latest_trade(&self, symbol: &str) -> Result<Trade, MarketDataError> {
            let mut rng = rand::thread_rng();
            Ok(Trade {
                symbol: symbol.to_string(),
                price: rng.gen_range(100.0..500.0),
                size: rng.gen_range(1..50) * 10,
                timestamp: Utc::now(),
                exchange: "MOCK_X".to_string(),
                conditions: vec!["@".to_string()],
                provider: self.name().to_string(),
            })
        }

        async fn get_historical_bars(
            &self,
            symbol: &str,
            _timeframe: Timeframe,
            start: DateTime<Utc>,
            _end: DateTime<Utc>,
        ) -> Result<Vec<Bar>, MarketDataError> {
            let mut bars = Vec::new();
            let mut current_ts = start;
            let mut rng = rand::thread_rng();
            let mut last_close = rng.gen_range(150.0..160.0);

            for _ in 0..50 {
                let open = last_close;
                let high = open + rng.gen_range(0.0..2.5);
                let low = open - rng.gen_range(0.0..2.5);
                let close = rng.gen_range(low..high);
                let volume = rng.gen_range(10000..1000000);

                bars.push(Bar {
                    symbol: symbol.to_string(),
                    open,
                    high,
                    low,
                    close,
                    volume,
                    timestamp: current_ts,
                });

                last_close = close;
                current_ts += Duration::days(1);
            }
            Ok(bars)
        }

        async fn get_asset_details(&self, symbol: &str) -> Result<Asset, MarketDataError> {
            if symbol == "AAPL" {
                Ok(Asset {
                    symbol: "AAPL".to_string(),
                    name: "Apple Inc.".to_string(),
                    asset_class: AssetClass::UsEquity,
                    exchange: "NASDAQ".to_string(),
                    status: "active".to_string(),
                    tradable: true,
                })
            } else {
                Err(MarketDataError::SymbolNotFound(symbol.to_string()))
            }
        }
    }
}

/// Alpaca Data API v2 implementation.
pub mod alpaca {
    use super::*;

    pub struct AlpacaProvider {
        client: Client,
        config: AlpacaConfig,
    }

    impl AlpacaProvider {
        pub fn new(config: AlpacaConfig) -> Self {
            let mut headers = header::HeaderMap::new();
            headers.insert(
                "APCA-API-KEY-ID",
                header::HeaderValue::from_str(&config.api_key).unwrap(),
            );
            headers.insert(
                "APCA-API-SECRET-KEY",
                header::HeaderValue::from_str(&config.secret_key).unwrap(),
            );

            let client = Client::builder()
                .default_headers(headers)
                .build()
                .expect("Failed to build reqwest client for Alpaca");

            Self { client, config }
        }

        fn data_url(&self) -> &str {
            &self.config.data_url
        }

        async fn handle_response<T: for<'de> Deserialize<'de>>(
            &self,
            res: reqwest::Response,
        ) -> Result<T, MarketDataError> {
            match res.status().as_u16() {
                200..=299 => res
                    .json::<T>()
                    .await
                    .map_err(|e| MarketDataError::Parse(e.to_string())),
                404 => {
                    let body = res.text().await.unwrap_or_default();
                    Err(MarketDataError::SymbolNotFound(body))
                }
                429 => Err(MarketDataError::RateLimited),
                _ => {
                    let status = res.status();
                    let body = res.text().await.unwrap_or_default();
                    Err(MarketDataError::Api(format!(
                        "Alpaca API Error: {} - {}",
                        status, body
                    )))
                }
            }
        }
    }

    #[async_trait]
    impl MarketDataProvider for AlpacaProvider {
        fn name(&self) -> &'static str {
            "Alpaca"
        }

        async fn get_latest_quote(&self, symbol: &str) -> Result<Quote, MarketDataError> {
            let url = format!("{}/v2/stocks/{}/quotes/latest", self.data_url(), symbol);
            let res = self.client.get(&url).send().await?;
            let alpaca_quote: Value = self.handle_response(res).await?;

            let quote_data = alpaca_quote.get("quote").ok_or_else(|| {
                MarketDataError::Parse("Missing 'quote' field in Alpaca response".to_string())
            })?;

            let timestamp_str = quote_data["t"]
                .as_str()
                .ok_or_else(|| MarketDataError::Parse("Missing timestamp".to_string()))?;
            let timestamp = DateTime::parse_from_rfc3339(timestamp_str)
                .map_err(|e| MarketDataError::Parse(format!("Invalid timestamp format: {}", e)))?
                .with_timezone(&Utc);

            Ok(Quote {
                symbol: symbol.to_string(),
                ask_price: quote_data["ap"]
                    .as_f64()
                    .ok_or_else(|| MarketDataError::Parse("Missing ask price".to_string()))?,
                ask_size: quote_data["as"]
                    .as_u64()
                    .ok_or_else(|| MarketDataError::Parse("Missing ask size".to_string()))?,
                bid_price: quote_data["bp"]
                    .as_f64()
                    .ok_or_else(|| MarketDataError::Parse("Missing bid price".to_string()))?,
                bid_size: quote_data["bs"]
                    .as_u64()
                    .ok_or_else(|| MarketDataError::Parse("Missing bid size".to_string()))?,
                timestamp,
                provider: self.name().to_string(),
            })
        }

        async fn get_latest_trade(&self, symbol: &str) -> Result<Trade, MarketDataError> {
            let url = format!("{}/v2/stocks/{}/trades/latest", self.data_url(), symbol);
            let res = self.client.get(&url).send().await?;
            let alpaca_trade: Value = self.handle_response(res).await?;

            let trade_data = alpaca_trade.get("trade").ok_or_else(|| {
                MarketDataError::Parse("Missing 'trade' field in Alpaca response".to_string())
            })?;

            let timestamp_str = trade_data["t"]
                .as_str()
                .ok_or_else(|| MarketDataError::Parse("Missing timestamp".to_string()))?;
            let timestamp = DateTime::parse_from_rfc3339(timestamp_str)
                .map_err(|e| MarketDataError::Parse(format!("Invalid timestamp format: {}", e)))?
                .with_timezone(&Utc);

            Ok(Trade {
                symbol: symbol.to_string(),
                price: trade_data["p"]
                    .as_f64()
                    .ok_or_else(|| MarketDataError::Parse("Missing price".to_string()))?,
                size: trade_data["s"]
                    .as_u64()
                    .ok_or_else(|| MarketDataError::Parse("Missing size".to_string()))?,
                timestamp,
                exchange: trade_data["x"].as_str().unwrap_or("").to_string(),
                conditions: trade_data["c"]
                    .as_array()
                    .map(|arr| {
                        arr.iter()
                            .map(|v| v.as_str().unwrap_or("").to_string())
                            .collect()
                    })
                    .unwrap_or_default(),
                provider: self.name().to_string(),
            })
        }

        async fn get_historical_bars(
            &self,
            symbol: &str,
            timeframe: Timeframe,
            start: DateTime<Utc>,
            end: DateTime<Utc>,
        ) -> Result<Vec<Bar>, MarketDataError> {
            let url = format!("{}/v2/stocks/{}/bars", self.data_url(), symbol);
            let res = self
                .client
                .get(&url)
                .query(&[
                    ("timeframe", timeframe.to_alpaca_str()),
                    ("start", &start.to_rfc3339()),
                    ("end", &end.to_rfc3339()),
                    ("limit", "10000"), // Max limit
                ])
                .send()
                .await?;

            let response_value: Value = self.handle_response(res).await?;
            let bars_data = response_value
                .get("bars")
                .ok_or_else(|| MarketDataError::Parse("Missing 'bars' field".to_string()))?
                .as_array()
                .ok_or_else(|| MarketDataError::Parse("'bars' is not an array".to_string()))?;

            bars_data
                .iter()
                .map(|bar_val| {
                    let timestamp_str = bar_val["t"]
                        .as_str()
                        .ok_or_else(|| MarketDataError::Parse("Missing timestamp".to_string()))?;
                    let timestamp = DateTime::parse_from_rfc3339(timestamp_str)
                        .map_err(|e| {
                            MarketDataError::Parse(format!("Invalid timestamp format: {}", e))
                        })?
                        .with_timezone(&Utc);
                    Ok(Bar {
                        symbol: symbol.to_string(),
                        open: bar_val["o"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing open".to_string()))?,
                        high: bar_val["h"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing high".to_string()))?,
                        low: bar_val["l"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing low".to_string()))?,
                        close: bar_val["c"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing close".to_string()))?,
                        volume: bar_val["v"]
                            .as_u64()
                            .ok_or_else(|| MarketDataError::Parse("Missing volume".to_string()))?,
                        timestamp,
                    })
                })
                .collect()
        }

        async fn get_asset_details(&self, _symbol: &str) -> Result<Asset, MarketDataError> {
            Err(MarketDataError::Unsupported(
                "Alpaca data API does not provide asset details.".to_string(),
            ))
        }
    }
}

/// Polygon.io implementation.
pub mod polygon {
    use super::*;

    pub struct PolygonProvider {
        client: Client,
        config: PolygonConfig,
    }

    impl PolygonProvider {
        pub fn new(config: PolygonConfig) -> Self {
            let client = Client::builder()
                .build()
                .expect("Failed to build reqwest client for Polygon");
            Self { client, config }
        }

        async fn handle_response<T: for<'de> Deserialize<'de>>(
            &self,
            res: reqwest::Response,
        ) -> Result<T, MarketDataError> {
            match res.status().as_u16() {
                200..=299 => res
                    .json::<T>()
                    .await
                    .map_err(|e| MarketDataError::Parse(e.to_string())),
                404 => Err(MarketDataError::SymbolNotFound(
                    "Symbol not found".to_string(),
                )),
                429 => Err(MarketDataError::RateLimited),
                _ => {
                    let status = res.status();
                    let body = res.text().await.unwrap_or_default();
                    Err(MarketDataError::Api(format!(
                        "Polygon API Error: {} - {}",
                        status, body
                    )))
                }
            }
        }
    }

    #[async_trait]
    impl MarketDataProvider for PolygonProvider {
        fn name(&self) -> &'static str {
            "Polygon"
        }

        async fn get_latest_quote(&self, _symbol: &str) -> Result<Quote, MarketDataError> {
            Err(MarketDataError::Unsupported(
                "Polygon latest quote REST endpoint not implemented.".to_string(),
            ))
        }

        async fn get_latest_trade(&self, _symbol: &str) -> Result<Trade, MarketDataError> {
            Err(MarketDataError::Unsupported(
                "Polygon latest trade REST endpoint not implemented.".to_string(),
            ))
        }

        async fn get_historical_bars(
            &self,
            symbol: &str,
            timeframe: Timeframe,
            start: DateTime<Utc>,
            end: DateTime<Utc>,
        ) -> Result<Vec<Bar>, MarketDataError> {
            let (multiplier, timespan) = timeframe.to_polygon_str();
            let url = format!(
                "https://api.polygon.io/v2/aggs/ticker/{}/range/{}/{}/{}/{}",
                symbol,
                multiplier,
                timespan,
                start.format("%Y-%m-%d"),
                end.format("%Y-%m-%d")
            );

            let res = self
                .client
                .get(&url)
                .query(&[("apiKey", &self.config.api_key)])
                .send()
                .await?;

            let response_value: Value = self.handle_response(res).await?;
            let bars_data = response_value
                .get("results")
                .ok_or_else(|| MarketDataError::Parse("Missing 'results' field".to_string()))?
                .as_array()
                .ok_or_else(|| MarketDataError::Parse("'results' is not an array".to_string()))?;

            bars_data
                .iter()
                .map(|bar_val| {
                    let ts_millis = bar_val["t"]
                        .as_u64()
                        .ok_or_else(|| MarketDataError::Parse("Missing timestamp".to_string()))?;
                    Ok(Bar {
                        symbol: symbol.to_string(),
                        open: bar_val["o"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing open".to_string()))?,
                        high: bar_val["h"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing high".to_string()))?,
                        low: bar_val["l"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing low".to_string()))?,
                        close: bar_val["c"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing close".to_string()))?,
                        volume: bar_val["v"]
                            .as_u64()
                            .ok_or_else(|| MarketDataError::Parse("Missing volume".to_string()))?,
                        timestamp: Utc
                            .timestamp_millis_opt(ts_millis as i64)
                            .single()
                            .ok_or_else(|| {
                                MarketDataError::Parse("Invalid millisecond timestamp".to_string())
                            })?,
                    })
                })
                .collect()
        }

        async fn get_asset_details(&self, symbol: &str) -> Result<Asset, MarketDataError> {
            let url = format!("https://api.polygon.io/v3/reference/tickers/{}", symbol);
            let res = self
                .client
                .get(&url)
                .query(&[("apiKey", &self.config.api_key)])
                .send()
                .await?;

            let response_value: Value = self.handle_response(res).await?;
            let details = response_value.get("results").ok_or_else(|| {
                MarketDataError::Parse("Missing 'results' field".to_string())
            })?;

            Ok(Asset {
                symbol: details["ticker"].as_str().unwrap_or("").to_string(),
                name: details["name"].as_str().unwrap_or("").to_string(),
                asset_class: match details["market"].as_str() {
                    Some("stocks") => AssetClass::UsEquity,
                    Some("crypto") => AssetClass::Crypto,
                    Some("fx") => AssetClass::Fx,
                    _ => AssetClass::Unknown,
                },
                exchange: details["primary_exchange"]
                    .as_str()
                    .unwrap_or("")
                    .to_string(),
                status: if details["active"].as_bool().unwrap_or(false) {
                    "active".to_string()
                } else {
                    "inactive".to_string()
                },
                tradable: details["active"].as_bool().unwrap_or(false),
            })
        }
    }
}

/// IEX Cloud implementation.
pub mod iex {
    use super::*;

    pub struct IexProvider {
        client: Client,
        config: IexConfig,
    }

    impl IexProvider {
        pub fn new(config: IexConfig) -> Self {
            let client = Client::builder()
                .build()
                .expect("Failed to build reqwest client for IEX");
            Self { client, config }
        }

        fn base_url(&self) -> &str {
            if self.config.use_sandbox {
                "https://sandbox.iexapis.com/stable"
            } else {
                "https://cloud.iexapis.com/stable"
            }
        }

        async fn handle_response<T: for<'de> Deserialize<'de>>(
            &self,
            res: reqwest::Response,
        ) -> Result<T, MarketDataError> {
            match res.status().as_u16() {
                200..=299 => res
                    .json::<T>()
                    .await
                    .map_err(|e| MarketDataError::Parse(e.to_string())),
                404 => Err(MarketDataError::SymbolNotFound(
                    "Symbol not found".to_string(),
                )),
                429 => Err(MarketDataError::RateLimited),
                _ => {
                    let status = res.status();
                    let body = res.text().await.unwrap_or_default();
                    Err(MarketDataError::Api(format!(
                        "IEX Cloud API Error: {} - {}",
                        status, body
                    )))
                }
            }
        }
    }

    #[async_trait]
    impl MarketDataProvider for IexProvider {
        fn name(&self) -> &'static str {
            "IEX Cloud"
        }

        async fn get_latest_quote(&self, symbol: &str) -> Result<Quote, MarketDataError> {
            let url = format!("{}/stock/{}/quote", self.base_url(), symbol);
            let res = self
                .client
                .get(&url)
                .query(&[("token", &self.config.api_key)])
                .send()
                .await?;

            let iex_quote: Value = self.handle_response(res).await?;

            let ts_millis = iex_quote["latestUpdate"]
                .as_i64()
                .ok_or_else(|| MarketDataError::Parse("Missing timestamp".to_string()))?;

            Ok(Quote {
                symbol: symbol.to_string(),
                ask_price: iex_quote["iexAskPrice"].as_f64().unwrap_or(0.0),
                ask_size: iex_quote["iexAskSize"].as_u64().unwrap_or(0),
                bid_price: iex_quote["iexBidPrice"].as_f64().unwrap_or(0.0),
                bid_size: iex_quote["iexBidSize"].as_u64().unwrap_or(0),
                timestamp: Utc
                    .timestamp_millis_opt(ts_millis)
                    .single()
                    .ok_or_else(|| {
                        MarketDataError::Parse("Invalid millisecond timestamp".to_string())
                    })?,
                provider: self.name().to_string(),
            })
        }

        async fn get_latest_trade(&self, _symbol: &str) -> Result<Trade, MarketDataError> {
            Err(MarketDataError::Unsupported(
                "IEX Cloud latest trade requires SSE/Websockets, not available in this REST implementation."
                    .to_string(),
            ))
        }

        async fn get_historical_bars(
            &self,
            symbol: &str,
            _timeframe: Timeframe,
            _start: DateTime<Utc>,
            _end: DateTime<Utc>,
        ) -> Result<Vec<Bar>, MarketDataError> {
            // Note: IEX historical data is often requested by range like '5d', '1m', 'ytd'.
            // Mapping a precise date range is more complex. We'll implement a simple '1m' range.
            let url = format!("{}/stock/{}/chart/1m", self.base_url(), symbol);
            let res = self
                .client
                .get(&url)
                .query(&[("token", &self.config.api_key)])
                .send()
                .await?;

            let bars_data: Vec<Value> = self.handle_response(res).await?;

            bars_data
                .iter()
                .map(|bar_val| {
                    let date_str = bar_val["date"]
                        .as_str()
                        .ok_or_else(|| MarketDataError::Parse("Missing date".to_string()))?;
                    let naive_date = chrono::NaiveDate::parse_from_str(date_str, "%Y-%m-%d")
                        .map_err(|e| {
                            MarketDataError::Parse(format!("Invalid date format: {}", e))
                        })?;
                    let naive_dt = naive_date.and_hms_opt(0, 0, 0).unwrap();

                    Ok(Bar {
                        symbol: symbol.to_string(),
                        open: bar_val["open"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing open".to_string()))?,
                        high: bar_val["high"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing high".to_string()))?,
                        low: bar_val["low"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing low".to_string()))?,
                        close: bar_val["close"]
                            .as_f64()
                            .ok_or_else(|| MarketDataError::Parse("Missing close".to_string()))?,
                        volume: bar_val["volume"]
                            .as_u64()
                            .ok_or_else(|| MarketDataError::Parse("Missing volume".to_string()))?,
                        timestamp: DateTime::<Utc>::from_naive_utc_and_offset(naive_dt, Utc),
                    })
                })
                .collect()
        }

        async fn get_asset_details(&self, symbol: &str) -> Result<Asset, MarketDataError> {
            let url = format!("{}/stock/{}/company", self.base_url(), symbol);
            let res = self
                .client
                .get(&url)
                .query(&[("token", &self.config.api_key)])
                .send()
                .await?;

            let details: Value = self.handle_response(res).await?;

            Ok(Asset {
                symbol: details["symbol"].as_str().unwrap_or("").to_string(),
                name: details["companyName"].as_str().unwrap_or("").to_string(),
                asset_class: AssetClass::UsEquity, // IEX is primarily US equities
                exchange: details["exchange"].as_str().unwrap_or("").to_string(),
                status: "active".to_string(), // Assume active if found
                tradable: true,                // Assume tradable if found
            })
        }
    }
}