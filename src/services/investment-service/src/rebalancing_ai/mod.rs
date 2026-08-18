// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/investment-service/src/rebalancing_ai/mod.rs
================================================================================

//! The core AI module for portfolio rebalancing.
//!
//! This module provides the services, data structures, and algorithms necessary
//! to analyze investment portfolios and generate rebalancing plans. It is designed
//! to be extensible, supporting various rebalancing strategies from simple
//! threshold-based methods to advanced Mean-Variance Optimization.
//!
//! The primary entry point is the `RebalancingService`, which orchestrates the
//! process of generating a `RebalancingPlan`.
//!
//! # Architecture
//!
//! The module is divided into several sub-modules:
//! - `data_models`: Contains the core structs like `Portfolio`, `Asset`, `TradeOrder`, etc.
//! - `error`: Defines the custom error type `RebalancingError`.
//! - `strategies`: Implements different rebalancing strategies (e.g., `ThresholdStrategy`).
//! - `optimizers`: Contains portfolio optimization algorithms like `MeanVarianceOptimizer`.
//! - `risk_models`: Provides models for assessing portfolio risk (e.g., covariance matrix calculation).
//! - `predictors`: Implements models for predicting asset metrics like expected returns.

// Crate dependencies that would be in Cargo.toml:
// async-trait = "0.1"
// chrono = { version = "0.4", features = ["serde"] }
// nalgebra = "0.32"
// reqwest = "0.11"
// serde = { version = "1.0", features = ["derive"] }
// thiserror = "1.0"
// tokio = { version = "1", features = ["full"] }
// tracing = "0.1"
// uuid = { version = "1", features = ["v4", "serde"] }

use std::sync::Arc;
use tracing::{info, instrument};
use uuid::Uuid;

// --- Sub-modules ---

/// Defines custom error types for the rebalancing process.
pub mod error {
    use thiserror::Error;

    /// The primary error type for the rebalancing AI module.
    #[derive(Error, Debug)]
    pub enum RebalancingError {
        #[error("Market data not found for asset: {0}")]
        MarketDataMissing(String),

        #[error("Invalid input: {0}")]
        InvalidInput(String),

        #[error("Optimization failed: {0}")]
        OptimizationError(String),

        #[error("Failed to predict returns: {0}")]
        PredictionError(String),

        #[error("Failed to calculate risk model: {0}")]
        RiskModelError(String),

        #[error("An external service call failed: {0}")]
        ExternalServiceError(#[from] reqwest::Error),

        #[error("An unexpected internal error occurred: {0}")]
        InternalError(String),
    }
}

/// Contains the core data structures used throughout the rebalancing module.
pub mod data_models {
    use crate::rebalancing_ai::error::RebalancingError;
    use chrono::{DateTime, Utc};
    use serde::{Deserialize, Serialize};
    use std::collections::HashMap;
    use uuid::Uuid;

    #[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, Hash)]
    pub enum AssetClass {
        Equity,
        FixedIncome,
        RealEstate,
        Commodity,
        Crypto,
        Cash,
        Other(String),
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct Asset {
        pub id: String,
        pub symbol: String,
        pub name: String,
        pub asset_class: AssetClass,
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct Holding {
        pub asset_id: String,
        pub quantity: f64,
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct Portfolio {
        pub id: Uuid,
        pub user_id: String,
        pub name: String,
        pub holdings: Vec<Holding>,
        pub cash_balance: f64,
    }

    impl Portfolio {
        pub fn get_total_value(&self, market_data: &MarketDataContext) -> Result<f64, RebalancingError> {
            let holdings_value: f64 = self.holdings.iter().try_fold(0.0, |acc, holding| {
                let price = market_data.get_price(&holding.asset_id)?;
                Ok(acc + holding.quantity * price)
            })?;
            Ok(holdings_value + self.cash_balance)
        }
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Default)]
    pub struct TargetAllocation {
        pub allocations: HashMap<AssetClass, f64>,
    }

    impl TargetAllocation {
        pub fn validate(&self) -> Result<(), RebalancingError> {
            if self.allocations.is_empty() {
                return Ok(()); // No targets to validate
            }
            let total_allocation: f64 = self.allocations.values().sum();
            if (total_allocation - 1.0).abs() > 1e-6 {
                return Err(RebalancingError::InvalidInput(format!(
                    "Target allocations must sum to 1.0, but sum to {}",
                    total_allocation
                )));
            }
            Ok(())
        }
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Copy)]
    pub struct MarketPrice {
        pub price: f64,
        pub timestamp: DateTime<Utc>,
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Default)]
    pub struct MarketDataContext {
        pub prices: HashMap<String, MarketPrice>,
        pub assets: HashMap<String, Asset>,
    }

    impl MarketDataContext {
        pub fn get_price(&self, asset_id: &str) -> Result<f64, RebalancingError> {
            self.prices
                .get(asset_id)
                .map(|p| p.price)
                .ok_or_else(|| RebalancingError::MarketDataMissing(asset_id.to_string()))
        }

        pub fn get_asset(&self, asset_id: &str) -> Result<&Asset, RebalancingError> {
            self.assets
                .get(asset_id)
                .ok_or_else(|| RebalancingError::MarketDataMissing(asset_id.to_string()))
        }

        pub fn get_asset_ids(&self) -> Vec<String> {
            self.assets.keys().cloned().collect()
        }

        pub fn validate_for_portfolio(&self, portfolio: &Portfolio) -> Result<(), RebalancingError> {
            for holding in &portfolio.holdings {
                if !self.prices.contains_key(&holding.asset_id) {
                    return Err(RebalancingError::MarketDataMissing(format!(
                        "price for asset {}",
                        holding.asset_id
                    )));
                }
                if !self.assets.contains_key(&holding.asset_id) {
                    return Err(RebalancingError::MarketDataMissing(format!(
                        "asset details for {}",
                        holding.asset_id
                    )));
                }
            }
            Ok(())
        }
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq)]
    pub enum OrderType {
        Buy,
        Sell,
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct TradeOrder {
        pub asset_id: String,
        pub order_type: OrderType,
        pub quantity: f64,
        pub estimated_value: f64,
        pub reason: String,
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq)]
    pub enum PlanStatus {
        Pending,
        Executed,
        Cancelled,
        Failed,
    }

    #[derive(Debug, Serialize, Deserialize, Clone)]
    pub struct RebalancingPlan {
        pub id: Uuid,
        pub portfolio_id: Uuid,
        pub created_at: DateTime<Utc>,
        pub trades: Vec<TradeOrder>,
        pub summary: String,
        pub status: PlanStatus,
    }

    impl RebalancingPlan {
        pub fn no_action(reason: String) -> Self {
            Self {
                id: Uuid::new_v4(),
                portfolio_id: Uuid::nil(),
                created_at: Utc::now(),
                trades: vec![],
                summary: reason,
                status: PlanStatus::Pending,
            }
        }
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Copy, PartialEq, Eq)]
    pub enum RiskProfile {
        Conservative,
        Moderate,
        Aggressive,
        Custom(u32),
    }
}

/// Provides models for assessing portfolio risk (e.g., covariance matrix).
pub mod risk_models {
    use crate::rebalancing_ai::{data_models::MarketDataContext, error::RebalancingError};
    use async_trait::async_trait;
    use nalgebra::DMatrix;

    pub type CovarianceMatrix = DMatrix<f64>;

    /// A trait for models that calculate the risk of a set of assets.
    #[async_trait]
    pub trait RiskModel {
        async fn calculate(
            &self,
            asset_ids: &[String],
            market_data: &MarketDataContext,
        ) -> Result<CovarianceMatrix, RebalancingError>;
    }

    pub mod sample_covariance {
        use super::*;

        /// A simple risk model that calculates the sample covariance matrix.
        /// In a real system, this would fetch historical price data.
        #[derive(Default)]
        pub struct SampleCovarianceModel;

        #[async_trait]
        impl RiskModel for SampleCovarianceModel {
            async fn calculate(
                &self,
                asset_ids: &[String],
                _market_data: &MarketDataContext,
            ) -> Result<CovarianceMatrix, RebalancingError> {
                let n = asset_ids.len();
                if n == 0 {
                    return Ok(DMatrix::from_element(0, 0, 0.0));
                }

                // Create a generic plausible matrix: 0.05 variance, 0.01 covariance.
                let mut cov_matrix = DMatrix::from_element(n, n, 0.01);
                for i in 0..n {
                    cov_matrix[(i, i)] = 0.05;
                }
                Ok(cov_matrix)
            }
        }
    }

    pub mod mock {
        use super::*;

        /// A mock risk model for testing purposes.
        pub struct MockRiskModel;

        impl MockRiskModel {
            pub fn new() -> Self { Self }
        }

        #[async_trait]
        impl RiskModel for MockRiskModel {
            async fn calculate(
                &self,
                asset_ids: &[String],
                _market_data: &MarketDataContext,
            ) -> Result<CovarianceMatrix, RebalancingError> {
                let n = asset_ids.len();
                let mut matrix = DMatrix::identity(n, n);
                if n > 1 {
                    matrix[(0, 1)] = 0.2;
                    matrix[(1, 0)] = 0.2;
                }
                Ok(matrix)
            }
        }
    }
}

/// Implements models for predicting asset metrics like expected returns.
pub mod predictors {
    use crate::rebalancing_ai::{data_models::MarketDataContext, error::RebalancingError};
    use async_trait::async_trait;
    use nalgebra::DVector;

    pub type ExpectedReturns = DVector<f64>;

    /// A trait for models that predict the expected returns of assets.
    #[async_trait]
    pub trait ExpectedReturnsPredictor {
        async fn predict(
            &self,
            asset_ids: &[String],
            market_data: &MarketDataContext,
        ) -> Result<ExpectedReturns, RebalancingError>;
    }

    /// A predictor based on market equilibrium (e.g., from CAPM).
    pub struct MarketEquilibriumPredictor;

    #[async_trait]
    impl ExpectedReturnsPredictor for MarketEquilibriumPredictor {
        async fn predict(
            &self,
            asset_ids: &[String],
            _market_data: &MarketDataContext,
        ) -> Result<ExpectedReturns, RebalancingError> {
            // In a real implementation, this would use a model like CAPM.
            // For now, return a generic, plausible vector of returns.
            let returns = DVector::from_element(asset_ids.len(), 0.07); // Assume 7% annual return
            Ok(returns)
        }
    }

    pub mod historical {
        use super::*;

        /// Predicts returns based on historical performance.
        #[derive(Default)]
        pub struct HistoricalReturnsPredictor;

        #[async_trait]
        impl ExpectedReturnsPredictor for HistoricalReturnsPredictor {
            async fn predict(
                &self,
                asset_ids: &[String],
                _market_data: &MarketDataContext,
            ) -> Result<ExpectedReturns, RebalancingError> {
                // In a real implementation, this would fetch historical data.
                let mut returns = Vec::new();
                for id in asset_ids {
                    let ret = match id.as_str() {
                        "AAPL" => 0.15,
                        "BND" => 0.03,
                        _ => 0.05,
                    };
                    returns.push(ret);
                }
                Ok(DVector::from_vec(returns))
            }
        }
    }

    pub mod mock {
        use super::*;

        /// A mock predictor for testing purposes.
        pub struct MockReturnsPredictor;

        impl MockReturnsPredictor {
            pub fn new() -> Self { Self }
        }

        #[async_trait]
        impl ExpectedReturnsPredictor for MockReturnsPredictor {
            async fn predict(
                &self,
                asset_ids: &[String],
                _market_data: &MarketDataContext,
            ) -> Result<ExpectedReturns, RebalancingError> {
                let mut returns = Vec::new();
                for id in asset_ids {
                    let ret = match id.as_str() {
                        "AAPL" => 0.20,
                        "BND" => 0.04,
                        _ => 0.06,
                    };
                    returns.push(ret);
                }
                Ok(DVector::from_vec(returns))
            }
        }
    }
}

/// Contains portfolio optimization algorithms.
pub mod optimizers {
    use crate::rebalancing_ai::error::RebalancingError;
    use nalgebra::{DMatrix, DVector};
    use serde::{Deserialize, Serialize};

    /// Trait for portfolio optimization algorithms.
    pub trait PortfolioOptimizer {
        fn optimize(&self) -> Result<DVector<f64>, RebalancingError>;
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Copy)]
    pub struct MvoConfig {
        pub risk_aversion: f64,
        pub max_iterations: u32,
        pub tolerance: f64,
    }

    /// Implements Mean-Variance Optimization (MVO).
    pub struct MeanVarianceOptimizer {
        expected_returns: DVector<f64>,
        covariance_matrix: DMatrix<f64>,
        risk_aversion: f64,
    }

    impl MeanVarianceOptimizer {
        pub fn new(
            expected_returns: DVector<f64>,
            covariance_matrix: DMatrix<f64>,
            risk_aversion: f64,
        ) -> Self {
            Self {
                expected_returns,
                covariance_matrix,
                risk_aversion,
            }
        }
    }

    impl PortfolioOptimizer for MeanVarianceOptimizer {
        fn optimize(&self) -> Result<DVector<f64>, RebalancingError> {
            let n = self.expected_returns.len();
            if n == 0 {
                return Ok(DVector::from_vec(vec![]));
            }
            if self.covariance_matrix.shape() != (n, n) {
                return Err(RebalancingError::InvalidInput(
                    "Dimension mismatch between returns and covariance matrix".to_string(),
                ));
            }

            // This uses a simplified analytical solution. A real-world implementation
            // would use a quadratic programming solver to handle constraints like no short-selling.
            let sigma_inv = self.covariance_matrix.clone().try_inverse().ok_or_else(|| {
                RebalancingError::OptimizationError("Covariance matrix is singular".to_string())
            })?;

            let ones = DVector::from_element(n, 1.0);
            let term1 = &sigma_inv * &self.expected_returns;
            let term2 = &sigma_inv * &ones;

            let a = &self.expected_returns.transpose() * &term2;
            let c = &ones.transpose() * &term2;

            let a_val = a[(0, 0)];
            let c_val = c[(0, 0)];

            if c_val.abs() < 1e-9 {
                return Err(RebalancingError::OptimizationError(
                    "Failed to solve MVO equations".to_string(),
                ));
            }

            let lambda = (a_val - self.risk_aversion * c_val) / c_val;
            let weights = term1 - lambda * term2;
            let optimal_weights = weights / self.risk_aversion;

            let sum_weights = optimal_weights.sum();
            if sum_weights.abs() > 1e-9 {
                Ok(optimal_weights / sum_weights)
            } else {
                Ok(DVector::from_element(n, 1.0 / n as f64))
            }
        }
    }
}

/// Implements different rebalancing strategies.
pub mod strategies {
    use crate::rebalancing_ai::{
        data_models::*,
        error::RebalancingError,
        optimizers::{MvoConfig, PortfolioOptimizer},
    };
    use serde::{Deserialize, Serialize};
    use std::collections::HashMap;
    use tracing::debug;

    #[derive(Debug, Serialize, Deserialize, Clone, Copy)]
    pub enum RebalancingStrategy {
        Threshold(ThresholdConfig),
        MeanVarianceOptimization(MvoConfig),
    }

    #[derive(Debug, Serialize, Deserialize, Clone, Copy)]
    pub struct ThresholdConfig {
        pub deviation_threshold: f64,
    }

    /// A trait for executing a rebalancing strategy.
    pub trait StrategyExecutor {
        fn execute(
            &self,
            portfolio: &Portfolio,
            target_allocation: &TargetAllocation,
            market_data: &MarketDataContext,
            risk_profile: &RiskProfile,
        ) -> Result<Vec<TradeOrder>, RebalancingError>;
    }

    pub struct ThresholdStrategy {
        config: ThresholdConfig,
    }

    impl ThresholdStrategy {
        pub fn new(config: ThresholdConfig) -> Self {
            Self { config }
        }
    }

    impl StrategyExecutor for ThresholdStrategy {
        fn execute(
            &self,
            portfolio: &Portfolio,
            target_allocation: &TargetAllocation,
            market_data: &MarketDataContext,
            _risk_profile: &RiskProfile,
        ) -> Result<Vec<TradeOrder>, RebalancingError> {
            let total_value = portfolio.get_total_value(market_data)?;
            if total_value < 1.0 {
                return Ok(vec![]);
            }

            let mut current_allocations = HashMap::<AssetClass, f64>::new();
            for holding in &portfolio.holdings {
                let asset = market_data.get_asset(&holding.asset_id)?;
                let price = market_data.get_price(&holding.asset_id)?;
                let value = holding.quantity * price;
                *current_allocations.entry(asset.asset_class.clone()).or_insert(0.0) += value;
            }

            let mut needs_rebalancing = false;
            for (class, target_pct) in &target_allocation.allocations {
                let current_value = current_allocations.get(class).unwrap_or(&0.0);
                let current_pct = current_value / total_value;
                if (current_pct - target_pct).abs() > self.config.deviation_threshold {
                    needs_rebalancing = true;
                    break;
                }
            }

            if !needs_rebalancing {
                return Ok(vec![]);
            }

            let mut trades = Vec::new();
            for (class, target_pct) in &target_allocation.allocations {
                let target_value = total_value * target_pct;
                let current_value = *current_allocations.get(class).unwrap_or(&0.0);
                let value_diff = target_value - current_value;

                let class_holdings: Vec<_> = portfolio
                    .holdings
                    .iter()
                    .filter(|h| {
                        market_data
                            .get_asset(&h.asset_id)
                            .map_or(false, |a| &a.asset_class == class)
                    })
                    .collect();

                if class_holdings.is_empty() && value_diff > 1.0 {
                    // Need to buy a new asset for this class, which requires a more complex asset selection logic.
                    // For now, we skip this.
                    debug!("Skipping buy for empty asset class {:?}", class);
                    continue;
                }

                for holding in class_holdings {
                    let price = market_data.get_price(&holding.asset_id)?;
                    let holding_value = holding.quantity * price;
                    let proportion = if current_value.abs() > 1e-6 { holding_value / current_value } else { 0.0 };
                    let value_to_trade = value_diff * proportion;
                    let quantity_to_trade = value_to_trade / price;

                    if value_to_trade > 1.0 {
                        trades.push(TradeOrder {
                            asset_id: holding.asset_id.clone(),
                            order_type: OrderType::Buy,
                            quantity: quantity_to_trade,
                            estimated_value: value_to_trade,
                            reason: format!("Aligning {:?} to target.", class),
                        });
                    } else if value_to_trade < -1.0 {
                        trades.push(TradeOrder {
                            asset_id: holding.asset_id.clone(),
                            order_type: OrderType::Sell,
                            quantity: -quantity_to_trade,
                            estimated_value: -value_to_trade,
                            reason: format!("Aligning {:?} to target.", class),
                        });
                    }
                }
            }
            Ok(trades)
        }
    }

    pub struct MvoStrategy {
        optimizer: Box<dyn PortfolioOptimizer + Send + Sync>,
    }

    impl MvoStrategy {
        pub fn new(_config: MvoConfig, optimizer: Box<dyn PortfolioOptimizer + Send + Sync>) -> Self {
            Self { optimizer }
        }
    }

    impl StrategyExecutor for MvoStrategy {
        fn execute(
            &self,
            portfolio: &Portfolio,
            _target_allocation: &TargetAllocation,
            market_data: &MarketDataContext,
            _risk_profile: &RiskProfile,
        ) -> Result<Vec<TradeOrder>, RebalancingError> {
            let total_value = portfolio.get_total_value(market_data)?;
            if total_value < 1.0 {
                return Ok(vec![]);
            }

            let optimal_weights = self.optimizer.optimize()?;
            let asset_ids: Vec<String> = market_data.get_asset_ids();

            if optimal_weights.len() != asset_ids.len() {
                return Err(RebalancingError::InternalError(
                    "Optimizer returned weights with incorrect dimensions".to_string(),
                ));
            }

            let mut trades = Vec::new();
            let current_holdings: HashMap<_, _> = portfolio.holdings.iter().map(|h| (h.asset_id.clone(), h.quantity)).collect();

            for (i, asset_id) in asset_ids.iter().enumerate() {
                let target_weight = optimal_weights[i];
                let target_value = total_value * target_weight;
                
                let price = market_data.get_price(asset_id)?;
                let current_quantity = *current_holdings.get(asset_id).unwrap_or(&0.0);
                let current_value = current_quantity * price;
                
                let value_diff = target_value - current_value;

                if value_diff.abs() < 1.0 { continue; }

                let quantity_diff = value_diff / price;

                if value_diff > 0.0 {
                    trades.push(TradeOrder {
                        asset_id: asset_id.clone(),
                        order_type: OrderType::Buy,
                        quantity: quantity_diff,
                        estimated_value: value_diff,
                        reason: "Rebalancing to MVO optimal weights".to_string(),
                    });
                } else {
                    trades.push(TradeOrder {
                        asset_id: asset_id.clone(),
                        order_type: OrderType::Sell,
                        quantity: -quantity_diff,
                        estimated_value: -value_diff,
                        reason: "Rebalancing to MVO optimal weights".to_string(),
                    });
                }
            }
            Ok(trades)
        }
    }
}

// --- Re-exports for clean public API ---
pub use data_models::{
    Asset, AssetClass, Holding, MarketDataContext, Portfolio, RebalancingPlan, RiskProfile,
    TargetAllocation, TradeOrder,
};
pub use error::RebalancingError;
pub use optimizers::MeanVarianceOptimizer;
pub use predictors::{ExpectedReturnsPredictor, MarketEquilibriumPredictor};
pub use risk_models::{CovarianceMatrix, RiskModel};
pub use strategies::{MvoStrategy, RebalancingStrategy, StrategyExecutor, ThresholdStrategy};

/// The core AI Rebalancing Service.
///
/// This service orchestrates portfolio rebalancing operations by combining
/// predictive models, risk assessment, and strategic execution.
#[derive(Clone)]
pub struct RebalancingService {
    returns_predictor: Arc<dyn ExpectedReturnsPredictor + Send + Sync>,
    risk_model: Arc<dyn RiskModel + Send + Sync>,
}

impl RebalancingService {
    /// Creates a new instance of the `RebalancingService`.
    pub fn new(
        returns_predictor: Arc<dyn ExpectedReturnsPredictor + Send + Sync>,
        risk_model: Arc<dyn RiskModel + Send + Sync>,
    ) -> Self {
        Self {
            returns_predictor,
            risk_model,
        }
    }

    /// Generates a rebalancing plan based on the chosen strategy.
    #[instrument(skip(self, portfolio, target_allocation, market_data), fields(user_id = %portfolio.user_id, portfolio_id = %portfolio.id))]
    pub async fn generate_plan(
        &self,
        portfolio: &Portfolio,
        target_allocation: &TargetAllocation,
        risk_profile: &RiskProfile,
        strategy: RebalancingStrategy,
        market_data: &MarketDataContext,
    ) -> Result<RebalancingPlan, RebalancingError> {
        info!(strategy = ?strategy, "Generating rebalancing plan");

        if portfolio.holdings.is_empty() && portfolio.cash_balance <= 0.0 {
            return Ok(RebalancingPlan::no_action(
                "Portfolio is empty, no action needed.".to_string(),
            ));
        }
        market_data.validate_for_portfolio(portfolio)?;
        target_allocation.validate()?;

        let executor: Box<dyn StrategyExecutor> = match strategy {
            RebalancingStrategy::Threshold(config) => Box::new(ThresholdStrategy::new(config)),
            RebalancingStrategy::MeanVarianceOptimization(config) => {
                let asset_ids: Vec<String> = market_data.get_asset_ids();
                let expected_returns = self.returns_predictor.predict(&asset_ids, market_data).await?;
                let covariance_matrix = self.risk_model.calculate(&asset_ids, market_data).await?;
                let optimizer = MeanVarianceOptimizer::new(
                    expected_returns,
                    covariance_matrix,
                    config.risk_aversion,
                );
                Box::new(MvoStrategy::new(config, Box::new(optimizer)))
            }
        };

        let trades = executor.execute(portfolio, target_allocation, market_data, risk_profile)?;

        if trades.is_empty() {
             return Ok(RebalancingPlan::no_action(
                "No rebalancing needed, portfolio is within strategy limits.".to_string(),
            ));
        }

        let plan = RebalancingPlan {
            id: Uuid::new_v4(),
            portfolio_id: portfolio.id,
            created_at: chrono::Utc::now(),
            trades,
            summary: format!("Rebalancing plan generated using {:?} strategy.", strategy),
            status: data_models::PlanStatus::Pending,
        };

        info!(plan_id = %plan.id, num_trades = plan.trades.len(), "Successfully generated rebalancing plan");
        Ok(plan)
    }
}

impl Default for RebalancingService {
    /// Creates a default `RebalancingService` with standard models.
    fn default() -> Self {
        Self::new(
            Arc::new(predictors::historical::HistoricalReturnsPredictor::default()),
            Arc::new(risk_models::sample_covariance::SampleCovarianceModel::default()),
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::rebalancing_ai::{
        data_models::{MarketPrice, ThresholdConfig},
        predictors::mock::MockReturnsPredictor,
        risk_models::mock::MockRiskModel,
    };
    use std::collections::HashMap;

    fn create_test_portfolio() -> Portfolio {
        Portfolio {
            id: Uuid::new_v4(),
            user_id: "user-123".to_string(),
            name: "Test Portfolio".to_string(),
            holdings: vec![
                Holding { asset_id: "AAPL".to_string(), quantity: 10.0 },
                Holding { asset_id: "BND".to_string(), quantity: 50.0 },
            ],
            cash_balance: 1000.0,
        }
    }

    fn create_test_market_data() -> MarketDataContext {
        let mut prices = HashMap::new();
        prices.insert("AAPL".to_string(), MarketPrice { price: 150.0, timestamp: chrono::Utc::now() });
        prices.insert("BND".to_string(), MarketPrice { price: 80.0, timestamp: chrono::Utc::now() });

        let mut assets = HashMap::new();
        assets.insert("AAPL".to_string(), Asset { id: "AAPL".to_string(), symbol: "AAPL".to_string(), asset_class: AssetClass::Equity, name: "Apple Inc.".to_string() });
        assets.insert("BND".to_string(), Asset { id: "BND".to_string(), symbol: "BND".to_string(), asset_class: AssetClass::FixedIncome, name: "Vanguard Total Bond Market ETF".to_string() });

        MarketDataContext { prices, assets }
    }

    #[tokio::test]
    async fn test_generate_plan_threshold_rebalancing() {
        let portfolio = create_test_portfolio();
        let market_data = create_test_market_data();
        // Total value: (10*150) + (50*80) + 1000 = 1500 + 4000 + 1000 = 6500
        // Equity %: 1500 / 6500 = 23.1%
        // FixedIncome %: 4000 / 6500 = 61.5%

        let mut target_allocations = HashMap::new();
        target_allocations.insert(AssetClass::Equity, 0.60);
        target_allocations.insert(AssetClass::FixedIncome, 0.40);
        let target = TargetAllocation { allocations: target_allocations };

        let strategy = RebalancingStrategy::Threshold(ThresholdConfig { deviation_threshold: 0.05 });
        let service = RebalancingService::default();
        let plan = service.generate_plan(&portfolio, &target, &RiskProfile::Moderate, strategy, &market_data).await.unwrap();

        assert!(!plan.trades.is_empty());
        assert_eq!(plan.trades.len(), 2);

        let sell_trade = plan.trades.iter().find(|t| t.order_type == data_models::OrderType::Sell).unwrap();
        let buy_trade = plan.trades.iter().find(|t| t.order_type == data_models::OrderType::Buy).unwrap();

        assert_eq!(sell_trade.asset_id, "BND");
        assert_eq!(buy_trade.asset_id, "AAPL");

        // Target BND value: 6500 * 0.40 = 2600. Current: 4000. Sell 1400 worth.
        assert!((sell_trade.estimated_value - 1400.0).abs() < 1e-9);
        // Target AAPL value: 6500 * 0.60 = 3900. Current: 1500. Buy 2400 worth.
        assert!((buy_trade.estimated_value - 2400.0).abs() < 1e-9);
    }

    #[tokio::test]
    async fn test_generate_plan_no_action_needed() {
        let mut portfolio = create_test_portfolio();
        // Total value = (39 * 150) + (50 * 80) + 150 = 5850 + 4000 + 150 = 10000
        // Equity % = 5850 / 10000 = 58.5%
        // FixedIncome % = 4000 / 10000 = 40.0%
        portfolio.holdings = vec![
            Holding { asset_id: "AAPL".to_string(), quantity: 39.0 },
            Holding { asset_id: "BND".to_string(), quantity: 50.0 },
        ];
        portfolio.cash_balance = 150.0;
        
        let market_data = create_test_market_data();
        let mut target_allocations = HashMap::new();
        target_allocations.insert(AssetClass::Equity, 0.60);
        target_allocations.insert(AssetClass::FixedIncome, 0.40);
        let target = TargetAllocation { allocations: target_allocations };
        let strategy = RebalancingStrategy::Threshold(ThresholdConfig { deviation_threshold: 0.05 });
        let service = RebalancingService::default();
        let plan = service.generate_plan(&portfolio, &target, &RiskProfile::Moderate, strategy, &market_data).await.unwrap();

        // Deviation for Equity is |58.5 - 60| = 1.5%, which is < 5% threshold.
        assert!(plan.trades.is_empty());
        assert!(plan.summary.contains("within strategy limits"));
    }

    #[tokio::test]
    async fn test_mvo_strategy_execution() {
        let portfolio = create_test_portfolio();
        let market_data = create_test_market_data();
        let target = TargetAllocation::default(); // MVO doesn't use target allocations

        let mvo_config = optimizers::MvoConfig { risk_aversion: 2.5, max_iterations: 100, tolerance: 1e-6 };
        let strategy = RebalancingStrategy::MeanVarianceOptimization(mvo_config);

        let mock_returns = Arc::new(MockReturnsPredictor::new());
        let mock_risk = Arc::new(MockRiskModel::new());
        let service = RebalancingService::new(mock_returns, mock_risk);

        let plan = service.generate_plan(&portfolio, &target, &RiskProfile::Aggressive, strategy, &market_data).await.unwrap();

        assert!(!plan.trades.is_empty());
        // With mock data (AAPL higher return), MVO should favor it.
        let buy_aapl = plan.trades.iter().any(|t| t.asset_id == "AAPL" && t.order_type == data_models::OrderType::Buy);
        assert!(buy_aapl);
    }
}