// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/services/investment-service/main.rs
================================================================================

// --- Crate Imports ---
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use sqlx::postgres::{PgPool, PgPoolOptions};
use std::net::SocketAddr;
use std::sync::Arc;
use std::time::Duration;
use tokio::signal;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing::{error, info, Level};
use tracing_subscriber::FmtSubscriber;
use uuid::Uuid;

// --- Module Declarations ---
// In a real project, these would be in separate files.
// For this single-file generation, we'll define them inline or as stubs.
mod config;
mod db;
mod error;
mod handlers;
mod integrations;
mod models;
mod services;

// Use our custom error type
use crate::error::AppError;

// --- Application State ---
// This struct holds all shared resources, like database pools and clients for external services.
// Using Arc for thread-safe sharing across handlers.
#[derive(Clone)]
pub struct AppState {
    db_pool: PgPool,
    plaid_client: integrations::plaid::PlaidClient,
    market_data_client: integrations::market_data::MarketDataClient,
    // Placeholder for cloud storage integration (e.g., S3, GCS)
    // cloud_storage_client: integrations::cloud::CloudStorageClient,
    // Placeholder for authentication client (e.g., Auth0 validator)
    // auth_client: integrations::auth::AuthClient,
}

// --- Main Entry Point ---
#[tokio::main]
async fn main() {
    // 1. Initialize Configuration
    let app_config = config::Config::from_env().expect("Failed to load configuration");

    // 2. Initialize Logging (Tracing)
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber).expect("Setting default subscriber failed");

    info!("Starting Investment Service...");
    info!("Log level set to INFO");

    // 3. Initialize Database Connection Pool
    info!(
        "Connecting to database at {}:{}",
        app_config.db_host, app_config.db_port
    );
    let db_pool = PgPoolOptions::new()
        .max_connections(app_config.db_pool_size)
        .connect_timeout(Duration::from_secs(5))
        .connect(&app_config.database_url())
        .await
        .expect("Failed to create database pool");
    info!("Database connection pool established.");

    // Run database migrations
    sqlx::migrate!("./migrations")
        .run(&db_pool)
        .await
        .expect("Failed to run database migrations");
    info!("Database migrations applied successfully.");


    // 4. Initialize Third-Party Service Clients
    let plaid_client = integrations::plaid::PlaidClient::new(
        app_config.plaid_client_id.clone(),
        app_config.plaid_secret.clone(),
        app_config.plaid_env.clone(),
    );
    info!("Plaid client initialized for environment: {}", app_config.plaid_env);

    let market_data_client = integrations::market_data::MarketDataClient::new(
        app_config.alpha_vantage_api_key.clone(),
    );
    info!("Market data client initialized.");

    // 5. Create Shared Application State
    let app_state = Arc::new(AppState {
        db_pool,
        plaid_client,
        market_data_client,
    });

    // 6. Define API Routes
    let app = Router::new()
        .nest("/api/v1", api_routes())
        .with_state(app_state)
        .layer(
            // Configure CORS for frontend access
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods(Any)
                .allow_headers(Any),
        )
        .layer(TraceLayer::new_for_http()); // Add request logging

    // 7. Start the Server
    let addr = SocketAddr::from(([0, 0, 0, 0], app_config.port));
    info!("Server listening on {}", addr);

    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

/// Defines all the v1 API routes for the service.
fn api_routes() -> Router<Arc<AppState>> {
    Router::new()
        .route("/health", get(handlers::health_check))
        .nest("/portfolios", handlers::portfolio_routes())
        .nest("/integrations", handlers::integration_routes())
        .nest("/market-data", handlers::market_data_routes())
}

/// Graceful shutdown handler
async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    info!("Signal received, starting graceful shutdown");
}

// --- Inline Module Implementations ---
// In a real project, these would be in `src/config.rs`, `src/models.rs`, etc.

/// Configuration for the application
mod config {
    use dotenv::dotenv;
    use std::env;

    #[derive(Debug)]
    pub struct Config {
        pub port: u16,
        pub db_host: String,
        pub db_port: u16,
        pub db_user: String,
        pub db_password: String,
        pub db_name: String,
        pub db_pool_size: u32,
        pub plaid_client_id: String,
        pub plaid_secret: String,
        pub plaid_env: String,
        pub alpha_vantage_api_key: String,
    }

    impl Config {
        pub fn from_env() -> Result<Self, env::VarError> {
            dotenv().ok(); // Load .env file if it exists

            Ok(Self {
                port: env::var("PORT").unwrap_or_else(|_| "8080".to_string()).parse().unwrap(),
                db_host: env::var("DB_HOST").unwrap_or_else(|_| "localhost".to_string()),
                db_port: env::var("DB_PORT").unwrap_or_else(|_| "5432".to_string()).parse().unwrap(),
                db_user: env::var("DB_USER")?,
                db_password: env::var("DB_PASSWORD")?,
                db_name: env::var("DB_NAME")?,
                db_pool_size: env::var("DB_POOL_SIZE").unwrap_or_else(|_| "10".to_string()).parse().unwrap(),
                plaid_client_id: env::var("PLAID_CLIENT_ID")?,
                plaid_secret: env::var("PLAID_SECRET")?,
                plaid_env: env::var("PLAID_ENV").unwrap_or_else(|_| "sandbox".to_string()),
                alpha_vantage_api_key: env::var("ALPHA_VANTAGE_API_KEY")?,
            })
        }

        pub fn database_url(&self) -> String {
            format!(
                "postgres://{}:{}@{}:{}/{}",
                self.db_user, self.db_password, self.db_host, self.db_port, self.db_name
            )
        }
    }
}

/// Data models for the application
mod models {
    use super::*;
    use chrono::{DateTime, Utc};
    use sqlx::FromRow;

    #[derive(Debug, Serialize, FromRow)]
    pub struct Portfolio {
        pub id: Uuid,
        pub user_id: String, // Corresponds to Auth0 user ID
        pub name: String,
        pub description: Option<String>,
        pub created_at: DateTime<Utc>,
        pub updated_at: DateTime<Utc>,
    }

    #[derive(Debug, Serialize, FromRow)]
    pub struct Holding {
        pub id: Uuid,
        pub portfolio_id: Uuid,
        pub symbol: String,
        pub quantity: f64,
        pub average_cost_price: f64,
        pub created_at: DateTime<Utc>,
        pub updated_at: DateTime<Utc>,
    }

    #[derive(Debug, Deserialize)]
    pub struct CreatePortfolioPayload {
        pub name: String,
        pub description: Option<String>,
    }

    #[derive(Debug, Deserialize)]
    pub struct AddHoldingPayload {
        pub symbol: String,
        pub quantity: f64,
        pub purchase_price: f64,
    }
}

/// HTTP handlers (controllers)
mod handlers {
    use super::*;
    use crate::models::{AddHoldingPayload, CreatePortfolioPayload};

    pub async fn health_check() -> &'static str {
        "OK"
    }

    pub fn portfolio_routes() -> Router<Arc<AppState>> {
        Router::new()
            .route("/", post(create_portfolio).get(list_portfolios))
            .route("/:portfolio_id", get(get_portfolio_details))
            .route("/:portfolio_id/holdings", post(add_holding_to_portfolio))
    }

    pub fn integration_routes() -> Router<Arc<AppState>> {
        Router::new()
            .route("/plaid/create_link_token", post(create_plaid_link_token))
    }
    
    pub fn market_data_routes() -> Router<Arc<AppState>> {
        Router::new()
            .route("/quote/:symbol", get(get_stock_quote))
    }

    // --- Portfolio Handlers ---
    async fn create_portfolio(
        State(state): State<Arc<AppState>>,
        // TODO: Add middleware to extract user_id from JWT
        // user: User,
        Json(payload): Json<CreatePortfolioPayload>,
    ) -> Result<impl IntoResponse, AppError> {
        let user_id = "dummy_user_id".to_string(); // Placeholder
        let portfolio = services::portfolio::create_portfolio(&state.db_pool, &user_id, payload).await?;
        Ok((StatusCode::CREATED, Json(portfolio)))
    }

    async fn list_portfolios(
        State(state): State<Arc<AppState>>,
        // user: User,
    ) -> Result<impl IntoResponse, AppError> {
        let user_id = "dummy_user_id".to_string(); // Placeholder
        let portfolios = services::portfolio::get_portfolios_for_user(&state.db_pool, &user_id).await?;
        Ok(Json(portfolios))
    }

    async fn get_portfolio_details(
        State(state): State<Arc<AppState>>,
        Path(portfolio_id): Path<Uuid>,
        // user: User,
    ) -> Result<impl IntoResponse, AppError> {
        let user_id = "dummy_user_id".to_string(); // Placeholder
        let details = services::portfolio::get_portfolio_with_holdings(&state.db_pool, &user_id, portfolio_id).await?;
        Ok(Json(details))
    }

    async fn add_holding_to_portfolio(
        State(state): State<Arc<AppState>>,
        Path(portfolio_id): Path<Uuid>,
        // user: User,
        Json(payload): Json<AddHoldingPayload>,
    ) -> Result<impl IntoResponse, AppError> {
        let user_id = "dummy_user_id".to_string(); // Placeholder
        let holding = services::portfolio::add_holding(&state.db_pool, &user_id, portfolio_id, payload).await?;
        Ok((StatusCode::CREATED, Json(holding)))
    }

    // --- Integration Handlers ---
    async fn create_plaid_link_token(
        State(state): State<Arc<AppState>>,
        // user: User,
    ) -> Result<impl IntoResponse, AppError> {
        let user_id = "dummy_user_id".to_string(); // Placeholder
        let token = state.plaid_client.create_link_token(&user_id).await?;
        Ok(Json(serde_json::json!({ "link_token": token })))
    }

    // --- Market Data Handlers ---
    async fn get_stock_quote(
        State(state): State<Arc<AppState>>,
        Path(symbol): Path<String>,
    ) -> Result<impl IntoResponse, AppError> {
        let quote = state.market_data_client.get_quote(&symbol).await?;
        Ok(Json(quote))
    }
}

/// Business logic
mod services {
    pub mod portfolio {
        use super::super::*;
        use crate::models::{AddHoldingPayload, CreatePortfolioPayload, Holding, Portfolio};
        use serde::Serialize;
        use sqlx::PgPool;
        use uuid::Uuid;

        #[derive(Serialize)]
        pub struct PortfolioDetails {
            #[serde(flatten)]
            pub portfolio: Portfolio,
            pub holdings: Vec<Holding>,
            pub market_value: f64, // Example of added value
        }

        pub async fn create_portfolio(
            pool: &PgPool,
            user_id: &str,
            payload: CreatePortfolioPayload,
        ) -> Result<Portfolio, AppError> {
            let portfolio = sqlx::query_as!(
                Portfolio,
                r#"
                INSERT INTO portfolios (user_id, name, description)
                VALUES ($1, $2, $3)
                RETURNING *
                "#,
                user_id,
                payload.name,
                payload.description
            )
            .fetch_one(pool)
            .await?;
            Ok(portfolio)
        }

        pub async fn get_portfolios_for_user(
            pool: &PgPool,
            user_id: &str,
        ) -> Result<Vec<Portfolio>, AppError> {
            let portfolios = sqlx::query_as!(
                Portfolio,
                "SELECT * FROM portfolios WHERE user_id = $1 ORDER BY created_at DESC",
                user_id
            )
            .fetch_all(pool)
            .await?;
            Ok(portfolios)
        }

        pub async fn get_portfolio_with_holdings(
            pool: &PgPool,
            user_id: &str,
            portfolio_id: Uuid,
        ) -> Result<PortfolioDetails, AppError> {
            let portfolio = sqlx::query_as!(
                Portfolio,
                "SELECT * FROM portfolios WHERE id = $1 AND user_id = $2",
                portfolio_id,
                user_id
            )
            .fetch_optional(pool)
            .await?
            .ok_or_else(|| AppError::NotFound("Portfolio not found".to_string()))?;

            let holdings = sqlx::query_as!(
                Holding,
                "SELECT * FROM holdings WHERE portfolio_id = $1",
                portfolio_id
            )
            .fetch_all(pool)
            .await?;
            
            // Here we could fetch current market prices and calculate total value
            let market_value = 0.0; // Placeholder

            Ok(PortfolioDetails { portfolio, holdings, market_value })
        }

        pub async fn add_holding(
            pool: &PgPool,
            user_id: &str,
            portfolio_id: Uuid,
            payload: AddHoldingPayload,
        ) -> Result<Holding, AppError> {
            // First, verify the user owns the portfolio
            let portfolio_exists: bool = sqlx::query_scalar(
                "SELECT EXISTS(SELECT 1 FROM portfolios WHERE id = $1 AND user_id = $2)"
            )
            .bind(portfolio_id)
            .bind(user_id)
            .fetch_one(pool)
            .await?;

            if !portfolio_exists {
                return Err(AppError::NotFound("Portfolio not found".to_string()));
            }

            // TODO: Logic to merge with existing holding or create a new one
            let holding = sqlx::query_as!(
                Holding,
                r#"
                INSERT INTO holdings (portfolio_id, symbol, quantity, average_cost_price)
                VALUES ($1, $2, $3, $4)
                RETURNING *
                "#,
                portfolio_id,
                payload.symbol.to_uppercase(),
                payload.quantity,
                payload.purchase_price
            )
            .fetch_one(pool)
            .await?;

            Ok(holding)
        }
    }
}

/// Third-party integrations
mod integrations {
    pub mod plaid {
        use crate::error::AppError;
        use reqwest::Client;
        use serde_json::json;

        #[derive(Clone)]
        pub struct PlaidClient {
            client_id: String,
            secret: String,
            environment: String,
            http_client: Client,
        }

        impl PlaidClient {
            pub fn new(client_id: String, secret: String, environment: String) -> Self {
                Self {
                    client_id,
                    secret,
                    environment,
                    http_client: Client::new(),
                }
            }

            fn get_url(&self) -> &str {
                match self.environment.as_str() {
                    "sandbox" => "https://sandbox.plaid.com",
                    "development" => "https://development.plaid.com",
                    "production" => "https://production.plaid.com",
                    _ => "https://sandbox.plaid.com",
                }
            }

            pub async fn create_link_token(&self, user_id: &str) -> Result<String, AppError> {
                let url = format!("{}/link/token/create", self.get_url());
                let response = self.http_client
                    .post(&url)
                    .json(&json!({
                        "client_id": self.client_id,
                        "secret": self.secret,
                        "client_name": "Our Awesome Investment App",
                        "user": { "client_user_id": user_id },
                        "products": ["auth", "transactions"],
                        "country_codes": ["US"],
                        "language": "en"
                    }))
                    .send()
                    .await?
                    .json::<serde_json::Value>()
                    .await?;

                response["link_token"]
                    .as_str()
                    .map(String::from)
                    .ok_or_else(|| AppError::InternalServerError("Failed to create Plaid link token".to_string()))
            }
        }
    }

    pub mod market_data {
        use crate::error::AppError;
        use reqwest::Client;
        use serde::Deserialize;
        use std::collections::HashMap;

        #[derive(Clone)]
        pub struct MarketDataClient {
            api_key: String,
            http_client: Client,
        }

        #[derive(Deserialize, Debug, Serialize, Clone)]
        pub struct GlobalQuote {
            #[serde(rename = "01. symbol")]
            pub symbol: String,
            #[serde(rename = "05. price")]
            pub price: String,
            #[serde(rename = "09. change")]
            pub change: String,
            #[serde(rename = "10. change percent")]
            pub change_percent: String,
        }

        impl MarketDataClient {
            pub fn new(api_key: String) -> Self {
                Self {
                    api_key,
                    http_client: Client::new(),
                }
            }

            pub async fn get_quote(&self, symbol: &str) -> Result<GlobalQuote, AppError> {
                let url = format!(
                    "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={}&apikey={}",
                    symbol, self.api_key
                );

                let response = self.http_client
                    .get(&url)
                    .send()
                    .await?
                    .json::<HashMap<String, GlobalQuote>>()
                    .await?;

                response
                    .get("Global Quote")
                    .cloned()
                    .ok_or_else(|| AppError::NotFound(format!("Quote for symbol '{}' not found", symbol)))
            }
        }
    }
}

/// Database interaction logic (stubs, real logic is in services)
mod db {
    // This module would contain more complex queries, transactions, etc.
    // For now, the logic is co-located in the `services` module for simplicity.
}

/// Custom error handling
mod error {
    use super::*;
    use axum::response::{IntoResponse, Response};
    use axum::Json;
    use serde_json::json;

    #[derive(Debug)]
    pub enum AppError {
        SqlxError(sqlx::Error),
        ReqwestError(reqwest::Error),
        InternalServerError(String),
        NotFound(String),
        // Add other specific error types as needed
    }

    impl IntoResponse for AppError {
        fn into_response(self) -> Response {
            let (status, error_message) = match self {
                AppError::SqlxError(e) => {
                    error!("SQLx error: {:?}", e);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "A database error occurred".to_string(),
                    )
                }
                AppError::ReqwestError(e) => {
                    error!("External API error: {:?}", e);
                    (
                        StatusCode::BAD_GATEWAY,
                        "An error occurred with an external service".to_string(),
                    )
                }
                AppError::NotFound(msg) => (StatusCode::NOT_FOUND, msg),
                AppError::InternalServerError(msg) => {
                    error!("Internal Server Error: {}", msg);
                    (
                        StatusCode::INTERNAL_SERVER_ERROR,
                        "An internal server error occurred".to_string(),
                    )
                }
            };

            let body = Json(json!({ "error": error_message }));
            (status, body).into_response()
        }
    }

    impl From<sqlx::Error> for AppError {
        fn from(err: sqlx::Error) -> Self {
            AppError::SqlxError(err)
        }
    }

    impl From<reqwest::Error> for AppError {
        fn from(err: reqwest::Error) -> Self {
            AppError::ReqwestError(err)
        }
    }
}