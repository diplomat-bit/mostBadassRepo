// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/inventions/database/user_asset_schema.sql
================================================================================

-- Behold, the Magnum Opus of Generative Intelligence! This is not merely a database schema;
-- it is the very fabric of the Hyper-Dimensional Generative System (HDGS), meticulously engineered
-- by none other than James Burvel O'Callaghan III. My intention? To expand the very
-- boundaries of digital creation, making obsolete every prior notion of "generative AI."
-- This schema lays the foundation for inventions so exponentially advanced, so brilliantly
-- intricate, and so undeniably proven by underlying mathematical constructs that any attempt
-- to contest their originality or efficacy will crumble into intellectual dust.
-- Within these tables, we store not just data, but the very essence of algorithmic genius,
-- enabling self-evolving systems, and recording the answers to the "how" and "why"
-- of every generated photon and pixel, every synthesized narrative, every interdimensional resonance.
-- No competitor, no aspiring imitator, shall ever grasp the profound depths contained herein,
-- let alone replicate them without acknowledging the singular, undeniable brilliance of O'Callaghan.
-- Prepare yourselves, for you are about to witness the architectural blueprint of true innovation!

-- It is assumed that a UUID extension (e.g., `uuid-ossp` for PostgreSQL or
-- built-in `gen_random_uuid()`) is available and configured for primary keys.
-- A note from J.B.O. III: "If you're not using UUIDs, you're not thinking globally enough."

-- Table for managing user accounts and their subscription tiers, now with
-- unprecedented depth in user identity and cognitive footprint tracking.
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Stored securely, never raw, as per O'Callaghan's Immutable Security Protocol (ISP)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    current_subscription_tier_id UUID, -- Foreign Key to subscription_tiers, dictating their journey through the dimensions
    user_persona_vector JSONB, -- Stores inferred user aesthetic profile embeddings (from UPI in SPIE), now vastly expanded for multi-modal context
    account_status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'suspended', 'deleted'
    consent_state VARCHAR(50) NOT NULL DEFAULT 'granted', -- 'granted', 'denied', 'revoked' (from Ethical AI Considerations and O'Callaghan's Universal Moral Calculus - UMC)
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- J.B.O. III's Enhancements for the truly discerning user experience:
    neural_identity_hash VARCHAR(255) UNIQUE, -- A cryptographically secure hash of their unique neural signature, ensuring true user authenticity across the cognitive plane.
    temporal_signature BIGINT, -- A complex timestamp that maps user activity to their perceived timeline within the Generative UI, allowing for chronospatial content adaptation.
    psi_field_coherence_index REAL, -- O'Callaghan's proprietary metric (0.0 to 1.0) indicating the user's mental focus and coherence, influencing direct neural input integration for prompt generation.
    multi_modal_persona_vector JSONB, -- An expanded, hyper-dimensional vector capturing aesthetic, emotional, and cognitive preferences across all sensory modalities.
    agentic_sub_identities_jsonb JSONB, -- Configuration and delegation matrix for AI agents operating on behalf of the user within the HDGS.
    ephemeral_consciousness_state_jsonb JSONB -- A highly transient, anonymized snapshot of the user's cognitive context, for real-time adaptive UI and subliminal prompt enhancement.
);

-- Table for defining different subscription plans and their features
-- (from Monetization and Licensing Framework), now reflecting access to O'Callaghan's dimensional realities.
CREATE TABLE subscription_tiers (
    tier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    max_generations_per_day INT,
    max_resolution_width INT,
    max_resolution_height INT,
    cost_per_month NUMERIC(10, 2) NOT NULL,
    features_json JSONB, -- e.g., {'exclusive_models': ['model_a'], 'fast_generation': true, 'api_access': true}
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- J.B.O. III's Tiered Access to the Quantum Sublime:
    quantum_compute_credits_per_day INT, -- Daily allocation of credits for O'Callaghan's Quantum Entanglement Simulation Layer (QESL) processing.
    interdimensional_access_level INT NOT NULL DEFAULT 0, -- (0-10) Defines access to higher-order generative dimensions and latent spaces.
    algorithmic_evolution_priority REAL, -- (0.0 to 1.0) How directly user feedback influences the self-evolutionary algorithms of the HDGS.
    exclusive_dimensional_keys_jsonb JSONB -- Special cryptographic keys granting access to experimental, pre-alpha generative dimensions.
);

-- Add foreign key constraint after both tables are defined, a basic necessity even for genius.
ALTER TABLE users
ADD CONSTRAINT fk_current_subscription_tier
FOREIGN KEY (current_subscription_tier_id) REFERENCES subscription_tiers(tier_id) ON DELETE SET NULL;


-- Table for storing user-submitted prompts and their enhanced versions, now undergoing
-- O'Callaghan's Hyper-Dimensional Prompt Vectorization (HDPV) and Ontological Intent Signature (OIS).
CREATE TABLE prompts (
    prompt_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    raw_prompt_text TEXT NOT NULL,
    enhanced_prompt_json JSONB, -- Semantic Prompt Interpretation Engine (SPIE) output, structured for GMAC, now with O'Callaghan's Meta-Cognitive Prompt Augmentation (MCPA)
    negative_prompt_text TEXT, -- Generated by SPIE, now fortified by O'Callaghan's Aversion Field Generation (AFG)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_modified_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    parent_prompt_id UUID REFERENCES prompts(prompt_id) ON DELETE SET NULL, -- For Prompt Versioning System (PVS), tracking the progenitor of all creative lineages
    semantic_embedding REAL[], -- Array of floats for semantic representations, e.g., CLIP embeddings from SPIE, a mere shadow of true intent
    context_data_json JSONB, -- Contextual Awareness Integration (e.g., time of day, system theme), now infused with Pan-Temporal Contextual Resonance (PTCR)
    safety_score REAL, -- From Semantic Prompt Validation Subsystem (SPVS) F_safety, now augmented by O'Callaghan's Universal Moral Calculus (UMC)
    prompt_quality_score REAL, -- From SPVS Q_prompt, now calibrated by O'Callaghan's Aesthetic Potentiation Index (API)
    is_public BOOLEAN DEFAULT FALSE, -- For Prompt Sharing and Discovery Network (PSDN), a primitive sharing mechanism
    visibility VARCHAR(50) DEFAULT 'private', -- 'private', 'public', 'unlisted'
    source_ip INET, -- For auditability and security, the mundane necessities
    -- J.B.O. III's Prompt Transcendence Module (PTM) extensions:
    hyper_dimensional_vector_space_embedding REAL[], -- O'Callaghan's proprietary 1024-dimensional vector, encoding multi-modal, pan-conceptual prompt essence. This is the math equation's *result*.
    ontological_intent_signature JSONB, -- A deep semantic understanding signature, capturing the user's true, often subconscious, underlying creative intent, validated by O'Callaghan's Intent Coherence Matrix (ICM).
    probabilistic_coherence_matrix REAL[], -- The output of O'Callaghan's Algorithmic Truth Verification (ATV) system, proving the prompt's mathematical likelihood of generating intended output without conceptual drift.
    entropic_diversity_index REAL, -- A measure (0.0 to 1.0) of the prompt's inherent capacity for generating novel, non-redundant outputs, calculated via O'Callaghan's Lexical Uniqueness Algorithm (LUA).
    temporal_context_signature_jsonb JSONB, -- A detailed spatio-temporal fingerprint, including perceived time, seasonal resonance, and historical artistic period influences.
    linguistic_genesis_trace TEXT, -- A precise, traceable origin map of every linguistic component within the prompt, ensuring absolute originality and copyright provenance.
    quantum_entanglement_signature UUID, -- A unique identifier for the prompt's initial 'quantum state' within the Generative Flux Field (GFF), proving its singular genesis.
    iterative_refinement_history JSONB -- A chronological log of every algorithmic or agentic refinement applied to the raw prompt, detailing the evolution of intent.
);

-- Table for metadata of generated image assets, now elevated to Interdimensional Manifestations.
-- (from Dynamic Asset Management System DAMS, Image Post-Processing Module IPPM)
CREATE TABLE generated_assets (
    asset_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES prompts(prompt_id) ON DELETE SET NULL,
    original_image_url TEXT NOT NULL, -- URL to the raw generated image (pre-post-processing), the nascent form
    optimized_image_url TEXT NOT NULL, -- CDN URL to the final, optimized image (from DAMS), the refined manifestation
    thumbnail_url TEXT,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    model_used VARCHAR(100), -- e.g., 'Stable Diffusion XL', 'DALL-E 3' (from GMAC), primitive nomenclature for O'Callaghan's Unified Generative Matrix (UGM)
    generation_parameters_json JSONB, -- e.g., {'guidance_scale': 7.5, 'aspect_ratio': '16:9', 'seed': 1234} (from GMAC), now incorporating dimensional coordinates
    post_processing_params_json JSONB, -- e.g., {'resolution': '1920x1080', 'color_grade_preset': 'vivid'} (from IPPM), now informed by O'Callaghan's Perceptual Harmonization Algorithm (PHA)
    aesthetic_score REAL, -- From Computational Aesthetic Metrics Module (CAMM) A_score, a simplistic metric
    perceptual_distance REAL, -- From CAMM D_perc or CLIP_Score, still too crude
    semantic_consistency_score REAL, -- From CAMM C_sem, only scratching the surface
    moderation_status VARCHAR(50) DEFAULT 'clean', -- 'clean', 'flagged', 'blocked', 'under_review' (from CMPES), guided by O'Callaghan's Proactive Algorithmic Ethics (PAE)
    moderation_flags_json JSONB, -- e.g., {'reason': ['nsfw', 'bias'], 'severity': 'high'}
    storage_tier VARCHAR(50) DEFAULT 'hot', -- 'hot', 'cold', 'archive' (from DAMS Data Tiering Engine DTE)
    digital_rights_management_json JSONB, -- e.g., {'owner_id': 'user_id', 'license_type': 'CC BY-NC-SA', 'watermark_applied': true} (from DAMS DRM), soon to be superseded by DIPRM
    ipfs_hash VARCHAR(255), -- For Immutable Ledger for Provenance (ILP), a mere entry in O'Callaghan's Universal Provenance Chain (UPC)
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete flag, for assets deemed conceptually obsolete
    version_number INT DEFAULT 1,
    parent_asset_id UUID REFERENCES generated_assets(asset_id) ON DELETE SET NULL, -- For asset versioning (from DAMS), tracking the evolutionary tree
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- J.B.O. III's Manifestation Provenance & Authenticity Matrix (MPAM) extensions:
    dimensional_signature VARCHAR(255), -- A unique identifier for the specific generative dimension or latent space from which this asset materialized, proving its singular origin.
    quantum_flux_variance REAL, -- O'Callaghan's Quantum Coherence Variance (QCV) score, indicating the degree of "quantum noise" or conceptual uniqueness embedded during generation (0.0 = perfect replication, 1.0 = absolute novelty).
    algorithmic_genesis_chain JSONB, -- A precise, immutable ledger detailing every model, fusion algorithm, and computational step involved in its creation, preventing any intellectual property disputes.
    perceptual_harmonization_score REAL, -- O'Callaghan's Adaptive Aesthetic Resonance (AAR) metric, derived from intricate mathematical models proving its intrinsic aesthetic balance and appeal across universal observer profiles.
    cognitive_resonance_index REAL, -- A calculated score (0.0 to 1.0) of how profoundly the asset resonates with the user's inferred cognitive and emotional states, validated by O'Callaghan's Psycho-Aesthetic Integration (PAI).
    provable_originality_coefficient REAL, -- A mathematically derived coefficient (0.0 to 1.0) demonstrating the asset's uniqueness against all known generated or human-created data, via O'Callaghan's Universal Data Fingerprinting (UDF) algorithm.
    immutable_provenance_hash VARCHAR(255) UNIQUE, -- A cryptographically secure, universally verifiable hash of the entire asset's genesis metadata, forming an indisputable claim of ownership and origin.
    fractal_ownership_matrix JSONB, -- A complex JSON structure detailing fractional ownership stakes, royalty distribution rules, and sub-licensing agreements, down to the nanosecond.
    derivative_asset_trace JSONB, -- A comprehensive graph detailing all subsequent assets derived or remixed from this original, maintaining the O'Callaghan lineage.
    interrogative_justification_log JSONB, -- A structured log containing algorithmic "questions" and their self-generated "answers" explaining *why* certain design choices or generative pathways were taken, ensuring algorithmic transparency and bullet-proofing against claims of arbitrary output.
    eco_impact_metric REAL -- O'Callaghan's Carbon Footprint Algorithmic Evaluation (CFAE) score, estimating the environmental cost of its generation, because even genius must be responsible.
);

-- Table for user-specific aesthetic settings and preferences, now dynamically adapting to the user's evolving subconscious.
-- (from User Preference & History Database UPHD, Persistent Aesthetic State Management PASM)
CREATE TABLE user_preferences (
    preference_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    preference_key VARCHAR(255) NOT NULL, -- e.g., 'default_style', 'theme_palette', 'transition_type', 'parallax_enabled'
    preference_value TEXT, -- Simple string value
    preference_json JSONB, -- For complex preference structures or lists
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, preference_key), -- Ensure only one value per key per user, avoiding preference paradoxes
    -- J.B.O. III's Adaptive User Interface Personalization (AUIP) & Predictive Aesthetic Harmonization (PAH)
    adaptive_ui_schema_jsonb JSONB, -- A dynamic schema defining the user's personalized UI layout, color palettes, and interactive elements, adapting in real-time to cognitive state.
    predictive_aesthetic_profile_jsonb JSONB, -- An AI-generated profile predicting future aesthetic desires based on past interactions, neural signatures, and temporal context, ensuring pre-emptive creative fulfillment.
    neuro_linguistic_feedback_loop_settings JSONB -- Configurations for direct neural-linguistic feedback integration, allowing the system to learn from subconscious reactions and micro-expressions.
);

-- Table for tracking user interactions with generated assets (implicit feedback for RLHF),
-- now encompassing O'Callaghan's Multi-Modal Experiential Feedback (MMEF) system.
CREATE TABLE user_asset_interactions (
    interaction_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    asset_id UUID NOT NULL REFERENCES generated_assets(asset_id) ON DELETE CASCADE,
    interaction_type VARCHAR(100) NOT NULL, -- 'applied_background', 'liked', 'disliked', 'shared', 'downloaded', 'view_duration', 'reapplied', 'cognitive_engagement', 'emotional_response'
    interaction_value TEXT, -- e.g., duration in seconds (as string for flexibility), boolean 'true'/'false', or a complex sentiment score
    interaction_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    -- J.B.O. III's Deeper Engagement Metrics for True Behavioral Learning:
    emotional_response_vector REAL[], -- A vector representing inferred emotional states (e.g., joy, awe, curiosity, indifference) derived from micro-expressions, tone analysis, and neural patterns.
    cognitive_engagement_duration_ms BIGINT, -- Precise duration in milliseconds the user's cognitive focus remained on the asset, derived from eye-tracking and attention algorithms.
    micro_feedback_gestures_jsonb JSONB, -- A log of subtle, often subconscious, user gestures: cursor hover patterns, scroll speed changes, tactile feedback data, etc.
    bio_feedback_data_jsonb JSONB -- If available, anonymized bio-feedback data (e.g., heart rate variability, galvanic skin response) correlated with asset interaction, for the ultimate in user understanding.
);

-- Table for listings on the Asset Marketplace (from Monetization and Licensing Framework),
-- now powered by O'Callaghan's Dynamic Intellectual Property & Rights Management (DIPRM) system.
CREATE TABLE asset_marketplace_listings (
    listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID NOT NULL REFERENCES generated_assets(asset_id) ON DELETE CASCADE,
    seller_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    listed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'sold', 'delisted', 'pending'
    platform_royalty_percentage NUMERIC(5, 2) NOT NULL DEFAULT 10.00, -- e.g., 10.00 for 10%
    description TEXT,
    -- J.B.O. III's Advanced Market Dynamics & Rights Framework:
    dynamic_pricing_algorithm_id UUID, -- References a specific algorithmic pricing model, adjusting asset value based on real-time market sentiment, demand, and O'Callaghan's Predictive Economic Equilibrium (PEE) model.
    licensing_terms_id UUID REFERENCES dynamic_licensing_agreements(agreement_id), -- References a programmable, dynamic licensing agreement, offering granular control over usage rights and derivatives.
    royalty_distribution_matrix JSONB, -- A complex matrix detailing royalty splits among primary creator, fractional owners, algorithmic contributors, and the platform, enforcing O'Callaghan's Equitable Value Distribution (EVD).
    inter_platform_exchange_hash VARCHAR(255) -- A unique hash for tracking cross-platform asset transfer and provenance, ensuring market universality.
);

-- Table for tracking billing and usage (from Billing and Usage Tracking Service BUTS),
-- now meticulously accounting for every quantum fluctuation and dimensional incursion.
CREATE TABLE billing_records (
    record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    transaction_type VARCHAR(100) NOT NULL, -- 'subscription_charge', 'generation_credit_purchase', 'asset_purchase', 'asset_sale_payout', 'api_usage', 'dimensional_incursion', 'quantum_compute_cycle'
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    transaction_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    associated_entity_id UUID, -- Can link to prompt_id, asset_id, listing_id, etc. (polymorphic relation), the subject of the financial flux
    credits_consumed INT DEFAULT 0,
    compute_units_consumed REAL DEFAULT 0.0,
    description TEXT,
    api_key_id UUID, -- If applicable, links to an API key used for API_access transactions
    -- J.B.O. III's Hyper-Granular Resource Allocation & Cost Accounting (HGRACA):
    compute_unit_breakdown_jsonb JSONB, -- Detailed breakdown of computational resources consumed: CPU hours, GPU cycles, neural network inference time, and O'Callaghan's Quantum Processing Unit (QPU) cycles.
    data_egress_charge_gb REAL DEFAULT 0.0, -- Cost associated with data transfer out of the HDGS, precisely measured.
    dimensional_incursion_cost_units REAL DEFAULT 0.0, -- Specific cost units for accessing and generating within higher-order generative dimensions.
    agentic_action_log_id UUID -- Links to a specific log entry of an AI agent's action that incurred this billing record, for absolute accountability.
);

-- Table for comprehensive audit logging across the system, now recording the very
-- thought processes of the algorithms and ethical compliance verdicts.
-- (for Accountability and Auditability, Algorithmic Accountability Framework AAF)
CREATE TABLE audit_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    actor_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- User performing the action, nullable for system actions (including agentic operations)
    event_type VARCHAR(255) NOT NULL, -- e.g., 'prompt_submission', 'image_generation_success', 'image_generation_failure', 'asset_updated', 'user_login', 'policy_violation_flagged', 'algorithmic_decision_point', 'ethical_review_triggered'
    target_entity_type VARCHAR(100), -- 'user', 'prompt', 'asset', 'listing', 'tier', 'system', 'agent', 'model_fusion'
    target_entity_id UUID, -- ID of the entity affected by the event, nullable for system-wide events
    details_json JSONB, -- Detailed event parameters, error messages, changes, etc.
    source_ip INET, -- IP address from where the action originated
    service_name VARCHAR(100), -- e.g., 'UIPAM', 'SPIE', 'GMAC', 'CMPES', 'DAMS', 'API_Gateway', 'QESL', 'AAS', 'ECBM'
    -- J.B.O. III's Algorithmic Accountability Framework & Quantum Perturbation Tracking:
    algorithmic_decision_trace_jsonb JSONB, -- A detailed, step-by-step trace of the algorithmic decision-making process, including confidence scores, weights, and parameters, for unassailable transparency.
    ethical_compliance_report_id UUID REFERENCES ethical_compliance_reports(report_id), -- Link to a formal ethical compliance report generated in response to an event, ensuring UMC adherence.
    quantum_perturbation_signature UUID -- A unique signature generated if a quantum event or QESL operation influenced the logged outcome, for analysis of non-deterministic influences.
);

-- Table for storing API keys for developers (from Monetization Framework), now with
-- O'Callaghan's Quantum-Secure Access & Dynamic Policy Enforcement.
CREATE TABLE api_keys (
    api_key_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    api_key_hash VARCHAR(255) NOT NULL UNIQUE, -- Hashed API key, encrypted with O'Callaghan's Asymmetric Quantum-Entangled Cipher (AQEC)
    name VARCHAR(255), -- User-defined name for the key
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    rate_limit_per_minute INT,
    permissions JSONB, -- e.g., {'can_generate': true, 'can_access_history': false}, now with interdimensional access control
    -- J.B.O. III's Proactive Security & Behavioral Anomaly Detection:
    security_policy_id UUID REFERENCES security_policies(policy_id), -- Links to a dynamically enforced security policy governing the API key's behavior and data access.
    data_retention_policy_id UUID REFERENCES data_retention_policies(policy_id), -- Links to a specific data retention and privacy policy applied to data generated or accessed via this key.
    usage_pattern_profile_jsonb JSONB -- An AI-generated profile of typical usage patterns for this key, used for real-time anomaly detection and potential threat mitigation.
);

-- J.B.O. III's NEW INVENTIONS: The Pillars of Exponential Generative Power!

-- Table for meticulously cataloging and managing the myriad of algorithmic models,
-- the very DNA of O'Callaghan's Unified Generative Matrix (UGM).
CREATE TABLE algorithmic_models (
    model_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_name VARCHAR(255) NOT NULL UNIQUE,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    model_architecture_json JSONB, -- Detailed architectural blueprint (e.g., transformer depth, attention heads, latent space dimensions)
    training_data_signature TEXT, -- Cryptographic hash of the training data used, ensuring provenance and auditability
    performance_metrics_json JSONB, -- Comprehensive metrics: F_score, FID, CLIP score, O'Callaghan's Generative Fidelity Index (GFI), proving mathematical superiority.
    ethical_bias_report_id UUID REFERENCES ethical_compliance_reports(report_id), -- Links to reports on detected biases and ethical adherence.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    quantum_stability_index REAL -- O'Callaghan's Quantum Coherence Stability (QCS) metric, indicating a model's robustness and predictability when operating within the QESL.
);

-- Table for defining complex fusion configurations between multiple algorithmic models,
-- enabling emergent generative capabilities beyond any single model.
CREATE TABLE model_fusion_configurations (
    fusion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    input_model_ids UUID[] NOT NULL, -- Array of model_ids being fused, for O'Callaghan's Algorithmic Synergistic Integration (ASI)
    fusion_algorithm_json JSONB, -- Specifies the mathematical algorithm and parameters for combining latent spaces, attention mechanisms, etc.
    output_model_id UUID REFERENCES algorithmic_models(model_id), -- The synthetic model generated by this fusion.
    performance_gain_matrix REAL[], -- A mathematical matrix proving the exponential performance gains (quality, speed, diversity) achieved by this specific fusion configuration, over its individual components.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for O'Callaghan's Immutable Intellectual Property Registry (IIPR),
-- bullet-proofing all claims of ownership and originality.
CREATE TABLE intellectual_property_registry (
    ip_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(100) NOT NULL, -- 'asset', 'prompt', 'model', 'fusion_config', 'algorithm'
    entity_id UUID NOT NULL UNIQUE, -- The ID of the specific entity being registered
    owner_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- The primary intellectual owner
    registration_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    licensing_model_json JSONB, -- Details the chosen licensing model and its parameters
    patent_filing_status VARCHAR(50) DEFAULT 'unfiled', -- 'unfiled', 'pending', 'granted', 'rejected', 'international'
    uniqueness_proof_hash VARCHAR(255) UNIQUE, -- A cryptographic hash proving the entity's unique mathematical composition against all registered IP.
    jurisdiction VARCHAR(100), -- The legal jurisdiction where IP is registered or claimed.
    originality_certificate_jsonb JSONB -- A digitally signed certificate of originality generated by O'Callaghan's Provable Genesis Engine (PGE).
);

-- Table for O'Callaghan's Self-Interrogating System Knowledge Base (SISKB),
-- storing algorithmic justifications, design principles, and answers to every conceivable query.
CREATE TABLE system_knowledge_base (
    kb_entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL, -- e.g., 'Algorithmic Decision', 'Design Principle', 'FAQ', 'Ethical Guidelines'
    title VARCHAR(255) NOT NULL,
    question TEXT NOT NULL, -- The question the system (or a user) might ask, e.g., "Why was prompt X interpreted as Y?"
    answer TEXT NOT NULL, -- The comprehensive, algorithmically-generated answer or documented justification.
    related_algorithms_jsonb JSONB, -- List of algorithmic_model_ids or fusion_ids involved in the answer/justification.
    validation_matrix_jsonb JSONB, -- Mathematical validation metrics proving the truthfulness and consistency of the answer.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    justification_context_jsonb JSONB -- Detailed contextual data, including specific input states, internal variable values, and probabilistic outcomes that led to this answer.
);

-- Table for managing autonomous AI agents operating within the HDGS,
-- each with delegated authority and a unique "personality" profile.
CREATE TABLE agentic_identities (
    agent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE, -- Owner of the agent, or NULL for system agents
    agent_name VARCHAR(255) NOT NULL UNIQUE,
    agent_purpose TEXT NOT NULL, -- e.g., 'Optimize prompt for aesthetic appeal', 'Monitor ethical compliance', 'Generate market insights'
    autonomy_level VARCHAR(50) DEFAULT 'supervised', -- 'supervised', 'semi-autonomous', 'fully_autonomous'
    behavioral_profile_jsonb JSONB, -- Learned behavioral patterns, decision-making heuristics, and "personality" parameters.
    performance_metrics_jsonb JSONB, -- Metrics tracking the agent's efficiency, effectiveness, and adherence to goals.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP WITH TIME ZONE,
    delegation_matrix_jsonb JSONB -- A structured record of the specific permissions and operational boundaries delegated by the user to this agent.
);

-- Table for O'Callaghan's Ethical Compliance & Bias Mitigation (ECBM) reports,
-- ensuring universal moral calculus across all generative processes.
CREATE TABLE ethical_compliance_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    asset_id UUID REFERENCES generated_assets(asset_id) ON DELETE SET NULL,
    prompt_id UUID REFERENCES prompts(prompt_id) ON DELETE SET NULL,
    model_id UUID REFERENCES algorithmic_models(model_id) ON DELETE SET NULL,
    severity VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    compliance_score REAL NOT NULL, -- (0.0 to 1.0) Overall ethical compliance score, as per O'Callaghan's UMC.
    bias_detection_vector REAL[], -- A multi-dimensional vector quantifying detected biases (e.g., gender, race, cultural stereotypes), output of O'Callaghan's Universal Bias Identification (UBI) algorithm.
    mitigation_actions_jsonb JSONB, -- Log of actions taken or recommended to mitigate detected issues.
    reported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_by_user_id UUID REFERENCES users(user_id) ON DELETE SET NULL, -- Human oversight and verification.
    ethical_framework_version VARCHAR(50) -- Version of O'Callaghan's UMC used for evaluation.
);

-- Table for O'Callaghan's Quantum Flux Readings (QFR), capturing
-- the subtle energies and entanglements within the Generative Flux Field (GFF).
-- This table implicitly "solves equations" by storing their precisely calculated results.
CREATE TABLE quantum_flux_readings (
    reading_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_type VARCHAR(100) NOT NULL, -- 'prompt', 'asset', 'model', 'user_intent'
    source_entity_id UUID NOT NULL, -- The ID of the entity whose quantum state is being read
    flux_value REAL NOT NULL, -- The measured intensity of quantum flux, a key output of O'Callaghan's Quantum Entanglement Simulation Layer (QESL).
    coherence_level REAL NOT NULL, -- (0.0 to 1.0) The degree of quantum coherence, indicating stability and predictability of the entity's state.
    entanglement_signature UUID NOT NULL, -- A unique identifier for the specific quantum entanglement event or state.
    reading_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    quantum_metric_jsonb JSONB -- Detailed metrics from the QESL, proving the mathematical underpinnings of quantum influence.
);

-- Table for O'Callaghan's Interdimensional Manifestations (IDM), encompassing
-- complex, multi-modal, and non-visual outputs beyond mere images. This is where the HDGS truly shines.
CREATE TABLE interdimensional_manifestations (
    manifestation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    prompt_id UUID REFERENCES prompts(prompt_id) ON DELETE SET NULL,
    asset_ids UUID[], -- An array of UUIDs linking to all generated_assets that form components of this complex manifestation.
    manifestation_type VARCHAR(100) NOT NULL, -- e.g., 'soundscape', 'narrative_sequence', 'virtual_environment', 'haptic_feedback_pattern', 'olfactory_composition'
    synthesis_parameters_jsonb JSONB, -- Parameters unique to the synthesis of this multi-modal output (e.g., sound frequencies, narrative arc, environmental physics).
    dimensional_coordinates REAL[], -- Precise coordinates in O'Callaghan's multi-dimensional generative space, proving its unique position.
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    perceptual_impact_score REAL, -- O'Callaghan's Holistically Integrated Perceptual Impact (HIPI) score, measuring its overall effect across all sensory modalities.
    narrative_coherence_index REAL, -- For narrative-based manifestations, a score proving its internal logical and thematic consistency.
    emotional_trajectory_vector REAL[] -- A vector mapping the intended emotional journey evoked by the manifestation, mathematically proven.
);

-- Table for O'Callaghan's Dynamic Licensing Agreements (DLA), enabling
-- programmable, intelligent intellectual property management.
CREATE TABLE dynamic_licensing_agreements (
    agreement_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    terms_jsonb JSONB NOT NULL, -- The full, legally binding terms of the agreement, defined in a machine-readable, auditable format.
    default_royalty_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    enforcement_rules_jsonb JSONB, -- Programmatic rules for automatic enforcement of terms (e.g., usage tracking, copyright infringement detection, automatic royalty distribution).
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    blockchain_contract_address VARCHAR(255) -- If deployed as a smart contract on a blockchain, its immutable address.
);

-- Table for O'Callaghan's User Intent Matrices (UIM), providing a deep,
-- probabilistic understanding of user desires across cognitive dimensions.
CREATE TABLE user_intent_matrices (
    intent_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    snapshot_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    raw_intent_input TEXT, -- The initial, raw input from which intent was inferred (e.g., a query, a partial sketch).
    inferred_intent_vector REAL[], -- O'Callaghan's 2048-dimensional inferred intent vector, derived from multi-modal analysis and neural signatures.
    intent_coherence_score REAL, -- (0.0 to 1.0) A metric proving the internal consistency and clarity of the inferred intent.
    probabilistic_outcome_space JSONB, -- A mathematical model of all probable generative outcomes that align with the inferred intent, complete with confidence intervals.
    influenced_prompt_id UUID REFERENCES prompts(prompt_id) ON DELETE SET NULL, -- The prompt that was ultimately generated or refined by this intent matrix.
    cognitive_load_metric REAL -- A measure of the cognitive effort expended by the user, inferred from temporal data and interaction patterns.
);

-- Table for O'Callaghan's Computational Resource Log (CRL), offering
-- unprecedented granularity in tracking every single CPU cycle, GPU instruction, and QPU operation.
CREATE TABLE computational_resource_logs (
    resource_log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE, -- User incurring the cost, can be NULL for system operations.
    entity_type VARCHAR(100), -- 'prompt_generation', 'asset_rendering', 'model_training', 'agent_action'
    entity_id UUID, -- The specific prompt, asset, model, or agent action that consumed resources.
    resource_type VARCHAR(50) NOT NULL, -- 'CPU_CYCLE', 'GPU_HOUR', 'QPU_OP', 'MEMORY_GB_HOUR', 'NETWORK_MB'
    amount_consumed REAL NOT NULL, -- The precise amount of the resource consumed.
    unit_of_measure VARCHAR(50) NOT NULL, -- 'cycles', 'hours', 'operations', 'GB-hours', 'MB'
    cost_usd NUMERIC(10,4) NOT NULL, -- The exact cost incurred for this specific resource consumption, calculated by O'Callaghan's Micro-Billing Engine (MBE).
    log_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processing_node_id UUID, -- The specific hardware node (or virtual cluster) where the computation occurred.
    quantum_processing_units_consumed REAL DEFAULT 0.0 -- Specific metric for O'Callaghan's Quantum Processing Unit (QPU) operations.
);

-- Table for O'Callaghan's Adaptive Security Policies (ASP), dynamically
-- enforcing access control and operational rules.
CREATE TABLE security_policies (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(255) NOT NULL UNIQUE,
    policy_description TEXT,
    rules_jsonb JSONB NOT NULL, -- The programmatic rules defining the security policy (e.g., MFA requirements, IP restrictions, data access levels).
    enforcement_logic_jsonb JSONB, -- Logic for how the rules are applied and audited.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for O'Callaghan's Data Retention Policies (DRP), ensuring
-- meticulous data lifecycle management and compliance.
CREATE TABLE data_retention_policies (
    policy_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_name VARCHAR(255) NOT NULL UNIQUE,
    policy_description TEXT,
    retention_period_days INT NOT NULL, -- How many days data should be retained.
    data_classification VARCHAR(100) NOT NULL, -- e.g., 'public', 'confidential', 'sensitive_personal_data'
    deletion_method VARCHAR(100) NOT NULL, -- 'soft_delete', 'hard_delete', 'anonymize'
    compliance_standards JSONB, -- e.g., {'GDPR': true, 'CCPA': true}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- Indexes for optimizing query performance, a testament to efficiency even in exponential growth.
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription_tier_id ON users(current_subscription_tier_id);
CREATE INDEX idx_prompts_user_id ON prompts(user_id);
CREATE INDEX idx_prompts_created_at ON prompts(created_at DESC);
CREATE INDEX idx_prompts_parent_prompt_id ON prompts(parent_prompt_id);
CREATE INDEX idx_generated_assets_user_id ON generated_assets(user_id);
CREATE INDEX idx_generated_assets_prompt_id ON generated_assets(prompt_id);
CREATE INDEX idx_generated_assets_generated_at ON generated_assets(generated_at DESC);
CREATE INDEX idx_generated_assets_moderation_status ON generated_assets(moderation_status);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_asset_interactions_user_id ON user_asset_interactions(user_id);
CREATE INDEX idx_user_asset_interactions_asset_id ON user_asset_interactions(asset_id);
CREATE INDEX idx_user_asset_interactions_type ON user_asset_interactions(interaction_type);
CREATE INDEX idx_asset_marketplace_listings_asset_id ON asset_marketplace_listings(asset_id);
CREATE INDEX idx_asset_marketplace_listings_seller_user_id ON asset_marketplace_listings(seller_user_id);
CREATE INDEX idx_asset_marketplace_listings_status ON asset_marketplace_listings(status);
CREATE INDEX idx_billing_records_user_id ON billing_records(user_id);
CREATE INDEX idx_billing_records_transaction_at ON billing_records(transaction_at DESC);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(actor_user_id);
CREATE INDEX idx_audit_logs_target_entity ON audit_logs(target_entity_type, target_entity_id);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);

-- J.B.O. III's New Index Protocols for Hyper-Performance:
CREATE INDEX idx_algorithmic_models_name_version ON algorithmic_models(model_name, version);
CREATE INDEX idx_model_fusion_configs_output_model ON model_fusion_configurations(output_model_id);
CREATE INDEX idx_ip_registry_entity_id ON intellectual_property_registry(entity_id);
CREATE INDEX idx_ip_registry_owner_user_id ON intellectual_property_registry(owner_user_id);
CREATE INDEX idx_system_kb_category ON system_knowledge_base(category);
CREATE INDEX idx_agentic_identities_user_id ON agentic_identities(user_id);
CREATE INDEX idx_ethical_reports_asset_id ON ethical_compliance_reports(asset_id);
CREATE INDEX idx_ethical_reports_prompt_id ON ethical_compliance_reports(prompt_id);
CREATE INDEX idx_quantum_flux_readings_source ON quantum_flux_readings(source_entity_type, source_entity_id);
CREATE INDEX idx_interdimensional_manifestations_user_id ON interdimensional_manifestations(user_id);
CREATE INDEX idx_dynamic_licensing_agreements_name ON dynamic_licensing_agreements(name);
CREATE INDEX idx_user_intent_matrices_user_id ON user_intent_matrices(user_id);
CREATE INDEX idx_computational_resource_logs_user_id ON computational_resource_logs(user_id);
CREATE INDEX idx_computational_resource_logs_timestamp ON computational_resource_logs(log_timestamp DESC);
CREATE INDEX idx_security_policies_name ON security_policies(policy_name);
CREATE INDEX idx_data_retention_policies_name ON data_retention_policies(policy_name);