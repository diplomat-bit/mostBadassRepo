// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/infra/gcp/main.tf
================================================================================

# /infra/gcp/main.tf
# Root Terraform configuration for provisioning core GCP infrastructure.
# This setup focuses on creating a scalable data and machine learning platform
# using BigQuery for data warehousing and Vertex AI for ML model development and deployment.

terraform {
  required_version = ">= 1.3"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = ">= 4.50.0"
    }
  }

  # --- Production Backend Configuration ---
  # For production, store Terraform state in a GCS bucket.
  # This bucket must be created manually before running `terraform init`.
  # Example: `gsutil mb -p [PROJECT_ID] -l [REGION] gs://[UNIQUE_BUCKET_NAME]/`
  #
  # backend "gcs" {
  #   bucket = "your-terraform-state-bucket-name" # Replace with your unique bucket name
  #   prefix = "infra/gcp/core"
  # }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

#------------------------------------------------------------------------------
# VARIABLES
#------------------------------------------------------------------------------

variable "gcp_project_id" {
  description = "The GCP project ID to deploy resources into."
  type        = string
}

variable "gcp_region" {
  description = "The primary GCP region for resources."
  type        = string
  default     = "us-central1"
}

variable "gcp_zone" {
  description = "The primary GCP zone for zonal resources."
  type        = string
  default     = "us-central1-a"
}

variable "project_name" {
  description = "A unique name for the project, used for naming resources."
  type        = string
  default     = "synergize-ai"
}

#------------------------------------------------------------------------------
# LOCALS
#------------------------------------------------------------------------------

locals {
  # Standardized naming convention for resources
  resource_prefix = "${var.project_name}-${terraform.workspace}"
}

#------------------------------------------------------------------------------
# API & SERVICE ENABLEMENT
#------------------------------------------------------------------------------

resource "google_project_service" "project_apis" {
  for_each = toset([
    "compute.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "storage-component.googleapis.com",
    "bigquery.googleapis.com",
    "aiplatform.googleapis.com",      # Vertex AI
    "notebooks.googleapis.com",       # Vertex AI Workbench
    "cloudresourcemanager.googleapis.com"
  ])

  project                    = var.gcp_project_id
  service                    = each.key
  disable_dependent_services = false
  disable_on_destroy         = false
}

#------------------------------------------------------------------------------
# NETWORKING
#------------------------------------------------------------------------------

resource "google_compute_network" "main_vpc" {
  project                 = var.gcp_project_id
  name                    = "${local.resource_prefix}-main-vpc"
  auto_create_subnetworks = false
  routing_mode            = "REGIONAL"
}

resource "google_compute_subnetwork" "main_subnetwork" {
  project                  = var.gcp_project_id
  name                     = "${local.resource_prefix}-main-subnetwork"
  ip_cidr_range            = "10.0.1.0/24"
  region                   = var.gcp_region
  network                  = google_compute_network.main_vpc.id
  private_ip_google_access = true
}

#------------------------------------------------------------------------------
# IDENTITY & ACCESS MANAGEMENT (IAM)
#------------------------------------------------------------------------------

# Service Account for data ingestion pipelines (e.g., from Plaid, Auth0, etc.)
resource "google_service_account" "data_ingestion_sa" {
  project      = var.gcp_project_id
  account_id   = "${local.resource_prefix}-data-ingestion"
  display_name = "Service Account for Data Ingestion Pipelines"
}

# Service Account for Vertex AI services (Notebooks, Training Jobs, etc.)
resource "google_service_account" "vertex_ai_sa" {
  project      = var.gcp_project_id
  account_id   = "${local.resource_prefix}-vertex-ai"
  display_name = "Service Account for Vertex AI Platform"
}

# Grant Data Ingestion SA permissions to write to GCS and BigQuery
resource "google_project_iam_member" "data_ingestion_gcs_writer" {
  project = var.gcp_project_id
  role    = "roles/storage.objectCreator"
  member  = "serviceAccount:${google_service_account.data_ingestion_sa.email}"
}

resource "google_project_iam_member" "data_ingestion_bq_writer" {
  project = var.gcp_project_id
  role    = "roles/bigquery.dataEditor"
  member  = "serviceAccount:${google_service_account.data_ingestion_sa.email}"
}

resource "google_project_iam_member" "data_ingestion_bq_job_user" {
  project = var.gcp_project_id
  role    = "roles/bigquery.jobUser"
  member  = "serviceAccount:${google_service_account.data_ingestion_sa.email}"
}

# Grant Vertex AI SA permissions to access GCS, BigQuery, and run AI jobs
resource "google_project_iam_member" "vertex_ai_platform_user" {
  project = var.gcp_project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.vertex_ai_sa.email}"
}

resource "google_project_iam_member" "vertex_ai_gcs_admin" {
  project = var.gcp_project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.vertex_ai_sa.email}"
}

resource "google_project_iam_member" "vertex_ai_bq_reader" {
  project = var.gcp_project_id
  role    = "roles/bigquery.dataViewer"
  member  = "serviceAccount:${google_service_account.vertex_ai_sa.email}"
}

# Allow the Vertex AI SA to act as itself for running pipelines
resource "google_service_account_iam_member" "vertex_ai_sa_self_user" {
  service_account_id = google_service_account.vertex_ai_sa.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.vertex_ai_sa.email}"
}

#------------------------------------------------------------------------------
# CLOUD STORAGE (GCS)
#------------------------------------------------------------------------------

# Bucket for raw data ingested from various integrations
resource "google_storage_bucket" "raw_data_bucket" {
  project                     = var.gcp_project_id
  name                        = "${local.resource_prefix}-raw-data"
  location                    = var.gcp_region
  force_destroy               = false # Set to true for non-production environments
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    action {
      type = "Delete"
    }
    condition {
      age = 30 # Delete raw data after 30 days
    }
  }
}

# Bucket for processed and curated data, ready for analytics and ML
resource "google_storage_bucket" "processed_data_bucket" {
  project                     = var.gcp_project_id
  name                        = "${local.resource_prefix}-processed-data"
  location                    = var.gcp_region
  force_destroy               = false
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}

# Bucket for ML model artifacts, training data, and pipeline outputs
resource "google_storage_bucket" "ml_artifacts_bucket" {
  project                     = var.gcp_project_id
  name                        = "${local.resource_prefix}-ml-artifacts"
  location                    = var.gcp_region
  force_destroy               = false
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }
}

#------------------------------------------------------------------------------
# BIGQUERY DATA WAREHOUSE
#------------------------------------------------------------------------------

resource "google_bigquery_dataset" "main_dataset" {
  project    = var.gcp_project_id
  dataset_id = "synergize_main"
  friendly_name = "Synergize Main Data Warehouse"
  description = "Central data warehouse for all integrated services data."
  location   = var.gcp_region

  # Set default table expiration to 365 days to manage costs
  default_table_expiration_ms = 31536000000
}

resource "google_bigquery_table" "user_events_table" {
  project    = var.gcp_project_id
  dataset_id = google_bigquery_dataset.main_dataset.dataset_id
  table_id   = "user_events"
  description = "Table to store user interaction events from all integrated platforms."

  # Time partitioning improves query performance and cost management
  time_partitioning {
    type  = "DAY"
    field = "event_timestamp"
  }

  # Clustering further optimizes queries on specific columns
  clustering = ["user_id", "event_source"]

  schema = file("${path.module}/schemas/user_events.json")
}

#------------------------------------------------------------------------------
# VERTEX AI - MACHINE LEARNING PLATFORM
#------------------------------------------------------------------------------

# A Vertex AI dataset resource for managing training data
resource "google_vertex_ai_dataset" "user_behavior_dataset" {
  project      = var.gcp_project_id
  display_name = "${local.resource_prefix}-user-behavior-dataset"
  description  = "Dataset for training user behavior models (e.g., churn, LTV)."
  region       = var.gcp_region
  metadata_schema_uri = "gs://google-cloud-aiplatform/schema/dataset/metadata/tabular_1.0.0.yaml"
}

# A managed notebook instance for data scientists to explore data and build models
resource "google_notebooks_instance" "data_science_workbench" {
  project = var.gcp_project_id
  name    = "${local.resource_prefix}-ds-workbench"
  location = var.gcp_zone
  machine_type = "n1-standard-4" # A good starting point

  # Use a standard Google-provided image with common ML libraries
  vm_image {
    project      = "deeplearning-platform-release"
    image_family = "tf-latest-gpu-debian-11" # TensorFlow with GPU support
  }

  # Attach the dedicated Vertex AI service account
  service_account = google_service_account.vertex_ai_sa.email
  service_account_scopes = [
    "https://www.googleapis.com/auth/cloud-platform"
  ]

  # Install additional libraries on startup
  post_startup_script = <<-EOT
    #!/bin/bash
    pip install -q --upgrade "pandas-gbq[gcs]"
    pip install -q --upgrade scikit-learn
    EOT

  network = google_compute_network.main_vpc.id
  subnet  = google_compute_subnetwork.main_subnetwork.id
  no_proxy_access = true # Recommended for security
  no_public_ip = true # Recommended for security

  # Metadata to enable integration with Vertex AI services
  metadata = {
    "proxy-mode" = "service_account"
    "terraform"  = "true"
  }

  depends_on = [
    google_project_service.project_apis
  ]
}