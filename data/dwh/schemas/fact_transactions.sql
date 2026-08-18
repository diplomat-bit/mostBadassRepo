// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/data/dwh/schemas/fact_transactions.sql
================================================================================

-- =============================================================================
--
-- FILE:          fact_transactions.sql
--
-- PROJECT:       Unified Financial Data Platform
--
-- PURPOSE:       Creates the core fact table for all financial transactions.
--                This table is designed for high-performance analytical queries
--                and serves as the central point for integrating data from
--                various sources like Plaid, Stripe, Auth0, and cloud providers.
--
-- PLATFORM:      Designed for modern cloud data warehouses like Snowflake,
--                BigQuery, or Redshift. Syntax is largely ANSI SQL.
--
-- =============================================================================

-- Note for BigQuery Users:
-- CREATE OR REPLACE TABLE `your_project.your_dataset.fact_transactions`
-- PARTITION BY DATE(transaction_timestamp_utc)
-- CLUSTER BY dim_user_key, dim_account_key, dim_category_key
-- AS ( ... );

-- Note for Snowflake Users:
CREATE OR REPLACE TABLE fact_transactions (

    -- -------------------------------------------------------------------------
    -- KEYS
    -- -------------------------------------------------------------------------

    -- Surrogate key for the fact table, uniquely identifying each transaction record.
    transaction_key BIGINT NOT NULL PRIMARY KEY,

    -- Foreign Keys to Dimension Tables
    dim_date_key INT NOT NULL,                      -- FK to dim_date, representing the transaction date.
    dim_time_key INT NOT NULL,                      -- FK to dim_time, representing the time of day.
    dim_user_key BIGINT NOT NULL,                   -- FK to dim_user, identifying the user who initiated the transaction.
    dim_account_key BIGINT NOT NULL,                -- FK to dim_account, identifying the financial account used.
    dim_merchant_key BIGINT,                        -- FK to dim_merchant, for purchase transactions. NULL for transfers.
    dim_location_key BIGINT,                        -- FK to dim_location, for the geographic location of the transaction.
    dim_category_key INT NOT NULL,                  -- FK to dim_category, for transaction classification (e.g., Groceries, Travel).
    dim_payment_method_key INT NOT NULL,            -- FK to dim_payment_method (e.g., Credit Card, ACH, Crypto).
    dim_currency_key INT NOT NULL,                  -- FK to dim_currency, for the transaction's original currency.
    dim_device_key BIGINT,                          -- FK to dim_device, identifying the device used (e.g., Mobile App, Web).
    dim_auth_session_key BIGINT,                    -- FK to dim_auth_session, linking to Auth0 session data for security analysis.
    dim_plaid_item_key BIGINT,                      -- FK to dim_plaid_item, linking to the Plaid-connected financial institution.
    dim_cloud_provider_key INT,                     -- FK to dim_cloud_provider, for cloud spend transactions (AWS, GCP, Azure).
    dim_transaction_status_key INT NOT NULL,        -- FK to dim_transaction_status (e.g., Pending, Completed, Failed).

    -- -------------------------------------------------------------------------
    -- DEGENERATE DIMENSIONS
    -- -------------------------------------------------------------------------

    -- The unique transaction identifier from the source system (e.g., Plaid transaction_id, Stripe charge_id).
    -- This is the natural key and is crucial for traceability and idempotency in ETL.
    source_transaction_id VARCHAR(255) NOT NULL,

    -- Authorization code from the payment processor, if applicable.
    source_authorization_code VARCHAR(100),

    -- Any other reference number provided by the source system.
    source_reference_number VARCHAR(255),

    -- The original, unaltered transaction description or memo from the source.
    transaction_description VARCHAR(1000),

    -- -------------------------------------------------------------------------
    -- MEASURES (FACTS)
    -- -------------------------------------------------------------------------

    -- The transaction amount in its original currency (e.g., 10.50 for EUR 10.50).
    -- Positive values typically represent credits/income, negative for debits/expenses.
    transaction_amount DECIMAL(18, 4) NOT NULL,

    -- The transaction amount converted to the primary currency of the account's country (e.g., CAD for a Canadian account).
    local_currency_amount DECIMAL(18, 4),

    -- The transaction amount converted to a standardized reporting currency (e.g., USD) for consistent global analysis.
    reporting_currency_amount DECIMAL(18, 4) NOT NULL,

    -- Any fees associated with the transaction (e.g., processing fees, foreign exchange fees).
    fee_amount DECIMAL(18, 4) DEFAULT 0.00,

    -- The net amount of the transaction (transaction_amount - fee_amount).
    net_amount DECIMAL(18, 4),

    -- The exchange rate applied to convert from the original currency to the reporting currency.
    foreign_exchange_rate DECIMAL(18, 8),

    -- Flag indicating if the transaction was identified as potentially fraudulent by a risk engine.
    is_fraudulent BOOLEAN DEFAULT FALSE,

    -- Flag indicating if this is part of a recurring series (e.g., subscription).
    is_recurring BOOLEAN DEFAULT FALSE,

    -- Flag indicating if this transaction is a reversal or chargeback of a previous transaction.
    is_reversal BOOLEAN DEFAULT FALSE,

    -- Flag indicating if the transaction is still pending and not yet posted.
    is_pending BOOLEAN DEFAULT TRUE,

    -- The time in milliseconds for the transaction to be authorized or processed, if available.
    processing_latency_ms INT,

    -- -------------------------------------------------------------------------
    -- TIMESTAMPS
    -- -------------------------------------------------------------------------

    -- The precise UTC timestamp when the transaction occurred or was initiated.
    transaction_timestamp_utc TIMESTAMP_NTZ NOT NULL,

    -- The UTC timestamp when the transaction was officially posted to the account. This can be later than the transaction_timestamp.
    posted_timestamp_utc TIMESTAMP_NTZ,

    -- -------------------------------------------------------------------------
    -- DATA WAREHOUSE METADATA
    -- -------------------------------------------------------------------------

    -- The timestamp when this record was first inserted into the data warehouse.
    dwh_created_at TIMESTAMP_NTZ DEFAULT CURRENT_TIMESTAMP(),

    -- The timestamp when this record was last updated in the data warehouse.
    dwh_updated_at TIMESTAMP_NTZ,

    -- The identifier of the ETL/ELT batch job that loaded or last updated this record.
    etl_batch_id VARCHAR(255),

    -- The name of the source system from which this data was extracted (e.g., 'PLAID_API', 'STRIPE_WEBHOOKS', 'INTERNAL_LEDGER').
    source_system VARCHAR(100) NOT NULL
)
-- For Snowflake, clustering is critical for performance on a large fact table.
-- Clustering by date is almost always a good idea. User and account are also
-- common high-cardinality dimensions used for filtering.
CLUSTER BY (dim_date_key, dim_user_key, dim_account_key);

-- Add comments to the table and columns for data dictionary/cataloging tools.
COMMENT ON TABLE fact_transactions IS 'Core fact table containing all transactional data from various integrated sources. It serves as the central table for financial analysis, fraud detection, and user behavior studies.';
COMMENT ON COLUMN fact_transactions.transaction_key IS 'Surrogate primary key for the transaction fact record.';
COMMENT ON COLUMN fact_transactions.dim_date_key IS 'Foreign key to dim_date, linking to the transaction date.';
COMMENT ON COLUMN fact_transactions.dim_user_key IS 'Foreign key to dim_user, identifying the user associated with the transaction.';
COMMENT ON COLUMN fact_transactions.dim_account_key IS 'Foreign key to dim_account, identifying the financial account used.';
COMMENT ON COLUMN fact_transactions.dim_plaid_item_key IS 'Foreign key to dim_plaid_item, linking to the Plaid-connected financial institution.';
COMMENT ON COLUMN fact_transactions.dim_auth_session_key IS 'Foreign key to dim_auth_session, linking to user session data from Auth0 for security analysis.';
COMMENT ON COLUMN fact_transactions.source_transaction_id IS 'The natural key from the source system (e.g., Plaid transaction_id). Used for traceability.';
COMMENT ON COLUMN fact_transactions.transaction_amount IS 'The gross amount of the transaction in its original currency.';
COMMENT ON COLUMN fact_transactions.reporting_currency_amount IS 'The transaction amount converted to a standard reporting currency (e.g., USD).';
COMMENT ON COLUMN fact_transactions.is_fraudulent IS 'Flag indicating if the transaction was marked as potentially fraudulent.';
COMMENT ON COLUMN fact_transactions.transaction_timestamp_utc IS 'The precise UTC timestamp of when the transaction occurred.';
COMMENT ON COLUMN fact_transactions.source_system IS 'The originating system of the transaction data (e.g., PLAID_API, STRIPE_WEBHOOKS).';