// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/src/libs/database-lib/migrations/001_initial_schema.sql
================================================================================

--
-- PostgreSQL initial schema migration
--
-- This script sets up the core tables for the application, including multi-tenancy,
-- users, authentication, RBAC, integrations, and audit logging.
-- It is designed to be extensible for future integrations with services like
-- Plaid, Stripe, AWS, GCP, etc.
--

-- Enable the uuid-ossp extension to generate UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to automatically update 'updated_at' timestamps
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- Core Tenancy and User Management
-- =============================================================================

-- Tenants table: Represents an organization or a customer account.
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- e.g., 'active', 'trial', 'suspended'
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE tenants IS 'Represents an organization or customer account in the multi-tenant system.';
COMMENT ON COLUMN tenants.settings IS 'Tenant-specific configuration and feature flags.';

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON tenants
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Users table: Stores user profiles.
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255), -- Can be null for SSO-only users
    full_name VARCHAR(255),
    avatar_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'invited', -- e.g., 'invited', 'active', 'deactivated'
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE users IS 'Core user accounts, associated with a tenant.';
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- User Identities table: For multi-provider authentication (OAuth, SAML, etc.).
CREATE TABLE user_identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- e.g., 'auth0', 'google', 'github', 'local_password'
    provider_user_id TEXT NOT NULL,
    provider_data JSONB, -- Stores tokens, profile info from the provider
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (provider, provider_user_id)
);
COMMENT ON TABLE user_identities IS 'Links a user account to one or more external authentication providers.';
CREATE INDEX idx_user_identities_user_id ON user_identities(user_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON user_identities
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- =============================================================================
-- Role-Based Access Control (RBAC)
-- =============================================================================

-- Roles table: Defines roles within the system.
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE, -- NULL for system-wide roles
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, name)
);
COMMENT ON TABLE roles IS 'Defines user roles, which can be system-wide or tenant-specific.';

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON roles
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Permissions table: Defines granular permissions.
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE, -- e.g., 'users:create', 'billing:read'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE permissions IS 'Defines granular actions that can be performed in the system.';

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON permissions
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Join table for roles and permissions.
CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);
COMMENT ON TABLE role_permissions IS 'Associates permissions with roles.';

-- Join table for users and roles.
CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);
COMMENT ON TABLE user_roles IS 'Assigns roles to users.';


-- =============================================================================
-- API Access and Integrations
-- =============================================================================

-- API Keys table: For programmatic access.
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- User who created the key
    name VARCHAR(255) NOT NULL,
    hashed_key VARCHAR(255) NOT NULL UNIQUE,
    key_prefix VARCHAR(10) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ,
    last_used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE api_keys IS 'Stores hashed API keys for programmatic access by tenants.';
CREATE INDEX idx_api_keys_tenant_id ON api_keys(tenant_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON api_keys
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Integrations table: Manages connections to third-party services.
CREATE TABLE integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    provider VARCHAR(100) NOT NULL, -- e.g., 'plaid', 'stripe', 'aws_s3', 'gcp_gcs'
    status VARCHAR(50) NOT NULL DEFAULT 'inactive', -- e.g., 'active', 'inactive', 'error'
    credentials JSONB, -- Encrypted at the application layer
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, provider)
);
COMMENT ON TABLE integrations IS 'Manages tenant-specific configurations for third-party services.';
COMMENT ON COLUMN integrations.credentials IS 'Stores encrypted credentials for third-party APIs.';
CREATE INDEX idx_integrations_tenant_id ON integrations(tenant_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON integrations
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- =============================================================================
-- Plaid Integration Schemas (Example of a specific integration)
-- =============================================================================

-- Plaid Items table: Represents a login to a financial institution.
CREATE TABLE plaid_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    integration_id UUID NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    plaid_item_id TEXT NOT NULL UNIQUE,
    plaid_access_token TEXT NOT NULL, -- Encrypted at the application layer
    institution_id TEXT NOT NULL,
    institution_name TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- e.g., 'active', 'error', 'disconnected'
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE plaid_items IS 'Represents a Plaid Item, a connection to a financial institution.';
CREATE INDEX idx_plaid_items_tenant_id_user_id ON plaid_items(tenant_id, user_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON plaid_items
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Plaid Accounts table: Represents a specific account (checking, savings, etc.).
CREATE TABLE plaid_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plaid_item_id UUID NOT NULL REFERENCES plaid_items(id) ON DELETE CASCADE,
    plaid_account_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    mask VARCHAR(4),
    official_name TEXT,
    type VARCHAR(100) NOT NULL,
    subtype VARCHAR(100),
    current_balance NUMERIC(28, 10),
    available_balance NUMERIC(28, 10),
    iso_currency_code VARCHAR(3),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE plaid_accounts IS 'Represents a specific financial account within a Plaid Item.';
CREATE INDEX idx_plaid_accounts_plaid_item_id ON plaid_accounts(plaid_item_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON plaid_accounts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- =============================================================================
-- System Infrastructure (Audit Logs, Webhooks)
-- =============================================================================

-- Audit Logs table: Records significant events in the system.
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(100),
    target_id TEXT,
    payload JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE audit_logs IS 'Records all significant actions for security and debugging.';
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_target ON audit_logs(target_type, target_id);

-- Webhooks table: For tenants to subscribe to events.
CREATE TABLE webhooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    secret TEXT NOT NULL, -- Encrypted at the application layer
    events JSONB NOT NULL, -- Array of event names, e.g., ["transaction.new", "user.created"]
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'inactive'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE webhooks IS 'Configuration for tenant-specific webhook endpoints.';
CREATE INDEX idx_webhooks_tenant_id ON webhooks(tenant_id);

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON webhooks
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- Webhook Deliveries table: Logs webhook delivery attempts.
CREATE TABLE webhook_deliveries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    webhook_id UUID NOT NULL REFERENCES webhooks(id) ON DELETE CASCADE,
    event VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL, -- 'success', 'failed', 'pending'
    status_code INT,
    request_payload JSONB,
    response_body TEXT,
    delivered_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE webhook_deliveries IS 'Logs the history of webhook delivery attempts.';
CREATE INDEX idx_webhook_deliveries_webhook_id ON webhook_deliveries(webhook_id);
CREATE INDEX idx_webhook_deliveries_status ON webhook_deliveries(status);

-- =============================================================================
-- Initial Data Seeding (System-level roles and permissions)
-- =============================================================================

INSERT INTO permissions (name, description) VALUES
    ('tenants:create', 'Allows creating new tenants.'),
    ('tenants:read', 'Allows reading tenant information.'),
    ('tenants:update', 'Allows updating tenant settings.'),
    ('tenants:delete', 'Allows deleting tenants.'),
    ('users:create', 'Allows inviting/creating new users.'),
    ('users:read', 'Allows reading user profiles.'),
    ('users:update', 'Allows updating user profiles and roles.'),
    ('users:delete', 'Allows deactivating/deleting users.'),
    ('billing:read', 'Allows viewing billing information and invoices.'),
    ('billing:update', 'Allows managing payment methods and subscriptions.'),
    ('integrations:manage', 'Allows connecting and managing third-party integrations.'),
    ('apikeys:manage', 'Allows creating, viewing, and revoking API keys.'),
    ('plaid:link', 'Allows linking Plaid accounts.'),
    ('plaid:read', 'Allows reading data from Plaid accounts.');

-- Note: Further seeding of roles and role_permissions would typically be done
-- in a separate seeding script or by the application logic upon tenant creation.
-- Example of a system admin role:
-- WITH sys_admin_role AS (
--     INSERT INTO roles (name, description) VALUES ('system_admin', 'Super user with all permissions.') RETURNING id
-- )
-- INSERT INTO role_permissions (role_id, permission_id)
-- SELECT sys_admin_role.id, permissions.id FROM sys_admin_role, permissions;