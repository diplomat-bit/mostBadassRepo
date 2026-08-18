// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/infra/aws/main.tf
================================================================================

# /infra/aws/main.tf
#
# Root Terraform configuration for provisioning all core AWS infrastructure.
# This file sets up the foundational components for a scalable, secure, and highly available
# application environment, designed to support a wide range of integrations and features.

################################################################################
# Terraform & Provider Configuration
################################################################################

terraform {
  required_version = ">= 1.3.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.9"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # S3 backend for remote state management.
  # This should be created manually or via a separate, simpler Terraform config before running this.
  # Example: `aws s3 mb s3://my-project-terraform-state-bucket --region us-east-1`
  #          `aws dynamodb create-table --table-name my-project-terraform-locks ...`
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket-name" # <-- IMPORTANT: CHANGE THIS
  #   key            = "global/aws/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "your-terraform-lock-table-name"   # <-- IMPORTANT: CHANGE THIS
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region
}

################################################################################
# Data Sources
################################################################################

data "aws_availability_zones" "available" {
  state = "available"
}

data "aws_caller_identity" "current" {}

# Data sources to configure Kubernetes and Helm providers after EKS cluster is created.
data "aws_eks_cluster" "cluster" {
  name = module.eks.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks.cluster_id
}

################################################################################
# Locals
################################################################################

locals {
  name   = var.project_name
  region = var.aws_region
  tags = {
    Project     = var.project_name
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = "AI-Programmer"
  }
}

################################################################################
# Networking (VPC)
################################################################################

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "5.1.2"

  name = "${local.name}-vpc"
  cidr = var.vpc_cidr

  azs             = data.aws_availability_zones.available.names
  private_subnets = [for k, v in data.aws_availability_zones.available.names : cidrsubnet(var.vpc_cidr, 8, k)]
  public_subnets  = [for k, v in data.aws_availability_zones.available.names : cidrsubnet(var.vpc_cidr, 8, k + 100)]

  enable_nat_gateway   = true
  single_nat_gateway   = false # Use one NAT Gateway per AZ for high availability
  enable_dns_hostnames = true

  # Tags for subnets
  public_subnet_tags = {
    "kubernetes.io/cluster/${local.name}" = "shared"
    "kubernetes.io/role/elb"              = "1"
  }
  private_subnet_tags = {
    "kubernetes.io/cluster/${local.name}" = "shared"
    "kubernetes.io/role/internal-elb"     = "1"
  }

  tags = local.tags
}

################################################################################
# Kubernetes Cluster (EKS)
################################################################################

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "19.15.3"

  cluster_name    = local.name
  cluster_version = "1.28"

  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnets

  # EKS Managed Node Group(s)
  eks_managed_node_groups = {
    general_purpose = {
      name           = "general-purpose"
      instance_types = ["t3.large", "t3a.large", "m5.large", "m5a.large"]
      min_size       = 2
      max_size       = 5
      desired_size   = 3
      capacity_type  = "ON_DEMAND"
    }
    spot_workloads = {
      name           = "spot-workloads"
      instance_types = ["t3.large", "t3a.large", "m5.large", "m5a.large"]
      min_size       = 1
      max_size       = 10
      desired_size   = 2
      capacity_type  = "SPOT"
    }
  }

  # Enable features for integrations
  cluster_endpoint_public_access = true
  enable_irsa                    = true # IAM Roles for Service Accounts

  # Logging
  cluster_enabled_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  # Add-ons
  cluster_addons = {
    coredns = {
      resolve_conflicts = "OVERWRITE"
    }
    kube-proxy = {}
    vpc-cni = {
      resolve_conflicts = "OVERWRITE"
    }
  }

  tags = local.tags
}

################################################################################
# Kubernetes & Helm Provider Configuration
################################################################################

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
}

provider "helm" {
  kubernetes {
    host                   = data.aws_eks_cluster.cluster.endpoint
    cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
    token                  = data.aws_eks_cluster_auth.cluster.token
  }
}

################################################################################
# Databases (RDS PostgreSQL)
################################################################################

# Password for the database, stored in AWS Secrets Manager
resource "random_password" "db_password" {
  length           = 20
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

resource "aws_secretsmanager_secret" "db_credentials" {
  name        = "${local.name}/rds/master-credentials"
  description = "Master credentials for the primary RDS database"
  tags        = local.tags
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = aws_secretsmanager_secret.db_credentials.id
  secret_string = jsonencode({
    username = var.db_username
    password = random_password.db_password.result
  })
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "${local.name}-rds-sg"
  description = "Allow traffic to RDS from EKS nodes"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "PostgreSQL from EKS nodes"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [module.eks.node_security_group_id]
  }

  tags = local.tags
}

module "rds" {
  source  = "terraform-aws-modules/rds/aws"
  version = "6.1.2"

  identifier = "${local.name}-main-db"

  engine               = "postgres"
  engine_version       = "15.4"
  family               = "postgres15"
  major_engine_version = "15"
  instance_class       = var.db_instance_class

  allocated_storage = 100
  max_allocated_storage = 500

  db_name  = var.db_name
  username = jsondecode(aws_secretsmanager_secret_version.db_credentials.secret_string)["username"]
  password = jsondecode(aws_secretsmanager_secret_version.db_credentials.secret_string)["password"]
  port     = 5432

  multi_az               = true
  db_subnet_group_name   = module.vpc.database_subnet_group_name
  vpc_security_group_ids = [aws_security_group.rds.id]

  maintenance_window              = "Mon:00:00-Mon:03:00"
  backup_window                   = "03:00-06:00"
  backup_retention_period         = 7
  copy_tags_to_snapshot           = true
  deletion_protection             = var.environment == "prod"
  performance_insights_enabled    = true
  performance_insights_retention_period = 7
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = local.tags
}

################################################################################
# Caching (ElastiCache Redis)
################################################################################

# Security Group for ElastiCache
resource "aws_security_group" "redis" {
  name        = "${local.name}-redis-sg"
  description = "Allow traffic to ElastiCache Redis from EKS nodes"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description     = "Redis from EKS nodes"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [module.eks.node_security_group_id]
  }

  tags = local.tags
}

module "elasticache_redis" {
  source  = "terraform-aws-modules/elasticache/aws"
  version = "1.3.0"

  cluster_id           = "${local.name}-redis"
  engine               = "redis"
  family               = "redis7"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 2 # For a multi-AZ cluster
  replication_group_id = "${local.name}-redis-rg"

  subnet_ids             = module.vpc.private_subnets
  security_group_ids     = [aws_security_group.redis.id]
  parameter_group_name   = "default.redis7"
  automatic_failover_enabled = true
  multi_az_enabled           = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true

  tags = local.tags
}

################################################################################
# Storage (S3 Buckets)
################################################################################

# Private bucket for application uploads, logs, etc.
resource "aws_s3_bucket" "private" {
  bucket = "${local.name}-private-storage-${data.aws_caller_identity.current.account_id}"
  tags   = local.tags
}

resource "aws_s3_bucket_versioning" "private" {
  bucket = aws_s3_bucket.private.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "private" {
  bucket = aws_s3_bucket.private.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "private" {
  bucket                  = aws_s3_bucket.private.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "private" {
  bucket = aws_s3_bucket.private.id

  rule {
    id     = "intelligent-tiering"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "INTELLIGENT_TIERING"
    }
  }

  rule {
    id     = "expire-incomplete-uploads"
    status = "Enabled"
    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

# Public bucket for static assets, to be served via CloudFront
resource "aws_s3_bucket" "public_assets" {
  bucket = "${local.name}-public-assets-${data.aws_caller_identity.current.account_id}"
  tags   = local.tags
}

resource "aws_s3_bucket_versioning" "public_assets" {
  bucket = aws_s3_bucket.public_assets.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "public_assets" {
  bucket = aws_s3_bucket.public_assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "public_assets" {
  bucket                  = aws_s3_bucket.public_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

################################################################################
# Outputs
################################################################################

output "project_name" {
  description = "The name of the project."
  value       = local.name
}

output "aws_region" {
  description = "The AWS region where the infrastructure is deployed."
  value       = local.region
}

output "vpc_id" {
  description = "The ID of the VPC."
  value       = module.vpc.vpc_id
}

output "vpc_public_subnets" {
  description = "List of public subnet IDs."
  value       = module.vpc.public_subnets
}

output "vpc_private_subnets" {
  description = "List of private subnet IDs."
  value       = module.vpc.private_subnets
}

output "eks_cluster_id" {
  description = "The name of the EKS cluster."
  value       = module.eks.cluster_id
}

output "eks_cluster_endpoint" {
  description = "The endpoint for the EKS cluster's API server."
  value       = module.eks.cluster_endpoint
}

output "eks_cluster_oidc_issuer_url" {
  description = "The OIDC issuer URL for the EKS cluster, used for IRSA."
  value       = module.eks.oidc_provider
}

output "rds_instance_endpoint" {
  description = "The connection endpoint for the RDS instance."
  value       = module.rds.db_instance_address
  sensitive   = true
}

output "rds_instance_port" {
  description = "The port for the RDS instance."
  value       = module.rds.db_instance_port
}

output "rds_credentials_secret_arn" {
  description = "The ARN of the Secrets Manager secret containing the DB credentials."
  value       = aws_secretsmanager_secret.db_credentials.arn
}

output "redis_primary_endpoint" {
  description = "The primary endpoint for the ElastiCache Redis cluster."
  value       = module.elasticache_redis.primary_endpoint_address
  sensitive   = true
}

output "s3_private_bucket_id" {
  description = "The ID of the private S3 bucket."
  value       = aws_s3_bucket.private.id
}

output "s3_public_assets_bucket_id" {
  description = "The ID of the public assets S3 bucket."
  value       = aws_s3_bucket.public_assets.id
}