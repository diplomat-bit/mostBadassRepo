// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/infra/aws/modules/eks/main.tf
================================================================================

# /infra/aws/modules/eks/main.tf

# ------------------------------------------------------------------------------
# EKS Cluster Module
#
# This module provisions a production-ready Amazon EKS cluster.
# Features:
# - Creates EKS Control Plane with configurable networking and logging.
# - Manages multiple, configurable Managed Node Groups.
# - Supports Fargate profiles for serverless pods.
# - Sets up IAM OIDC Provider for IAM Roles for Service Accounts (IRSA).
# - Manages core EKS add-ons (vpc-cni, coredns, kube-proxy, ebs-csi-driver).
# - Creates necessary IAM roles and security groups, or allows using existing ones.
# - Configurable encryption with AWS KMS.
# ------------------------------------------------------------------------------

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    tls = {
      source  = "hashicorp/tls"
      version = ">= 4.0"
    }
  }
}

# ------------------------------------------------------------------------------
# LOCALS
# ------------------------------------------------------------------------------

locals {
  # Determine if we need to create IAM roles or use existing ones
  create_cluster_iam_role = var.cluster_iam_role_arn == null
  create_node_iam_role    = var.node_iam_role_arn == null

  # Consolidate tags
  tags = merge(
    {
      "Name"                                = var.cluster_name
      "terraform-aws-modules/eks/version"   = "1.0.0" # Example version tag
      "eksctl.cluster.k8s.io/v1alpha1/cluster-name" = var.cluster_name # For compatibility with eksctl
      "kubernetes.io/cluster/${var.cluster_name}"  = "owned"
    },
    var.tags
  )
}

# ------------------------------------------------------------------------------
# DATA SOURCES
# ------------------------------------------------------------------------------

data "aws_caller_identity" "current" {}
data "aws_partition" "current" {}
data "aws_region" "current" {}

# OIDC provider data for IRSA
data "tls_certificate" "cluster" {
  # The cluster must be created before this data source can be queried.
  # The `aws_eks_cluster` resource has a `certificate_authority` block,
  # but the OIDC provider requires the root CA thumbprint.
  # We get this from the OIDC issuer URL.
  url = aws_eks_cluster.this.identity[0].oidc[0].issuer
}

# ------------------------------------------------------------------------------
# IAM ROLES & POLICIES
# ------------------------------------------------------------------------------

# IAM Role for the EKS Control Plane
resource "aws_iam_role" "cluster" {
  count = local.create_cluster_iam_role ? 1 : 0

  name               = "${var.cluster_name}-cluster-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "cluster_AmazonEKSClusterPolicy" {
  count = local.create_cluster_iam_role ? 1 : 0

  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.cluster[0].name
}

resource "aws_iam_role_policy_attachment" "cluster_AmazonEKSServicePolicy" {
  # This policy is sometimes required for EKS to manage other AWS resources like ELBs on your behalf.
  count = local.create_cluster_iam_role ? 1 : 0

  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEKSServicePolicy"
  role       = aws_iam_role.cluster[0].name
}

# IAM Role for the EKS Worker Nodes
resource "aws_iam_role" "nodes" {
  count = local.create_node_iam_role ? 1 : 0

  name               = "${var.cluster_name}-node-role"
  assume_role_policy = jsonencode({
    Version   = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
  tags = local.tags
}

resource "aws_iam_role_policy_attachment" "nodes_AmazonEKSWorkerNodePolicy" {
  count = local.create_node_iam_role ? 1 : 0

  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.nodes[0].name
}

resource "aws_iam_role_policy_attachment" "nodes_AmazonEC2ContainerRegistryReadOnly" {
  count = local.create_node_iam_role ? 1 : 0

  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.nodes[0].name
}

resource "aws_iam_role_policy_attachment" "nodes_AmazonEKS_CNI_Policy" {
  count = local.create_node_iam_role ? 1 : 0

  policy_arn = "arn:${data.aws_partition.current.partition}:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.nodes[0].name
}

# ------------------------------------------------------------------------------
# NETWORKING (SECURITY GROUPS)
# ------------------------------------------------------------------------------

resource "aws_security_group" "cluster" {
  name        = "${var.cluster_name}-cluster-sg"
  description = "EKS cluster communication with worker nodes"
  vpc_id      = var.vpc_id
  tags        = merge(local.tags, { "Name" = "${var.cluster_name}-cluster-sg" })
}

# Allow all egress from the cluster control plane
resource "aws_security_group_rule" "cluster_egress" {
  security_group_id = aws_security_group.cluster.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

# Allow nodes to communicate with the cluster API server
resource "aws_security_group_rule" "cluster_ingress_nodes" {
  security_group_id        = aws_security_group.cluster.id
  type                     = "ingress"
  from_port                = 443
  to_port                  = 443
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.nodes.id
  description              = "Allow worker nodes to communicate with the cluster API server"
}

resource "aws_security_group" "nodes" {
  name        = "${var.cluster_name}-node-sg"
  description = "Security group for all nodes in the cluster"
  vpc_id      = var.vpc_id
  tags        = merge(local.tags, { "Name" = "${var.cluster_name}-node-sg" })
}

# Allow all egress from nodes
resource "aws_security_group_rule" "nodes_egress" {
  security_group_id = aws_security_group.nodes.id
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
}

# Allow nodes to communicate with each other
resource "aws_security_group_rule" "nodes_ingress_self" {
  security_group_id = aws_security_group.nodes.id
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  self              = true
  description       = "Allow nodes to communicate with each other"
}

# Allow cluster control plane to communicate with nodes (for kubelet, metrics-server)
resource "aws_security_group_rule" "nodes_ingress_cluster" {
  security_group_id        = aws_security_group.nodes.id
  type                     = "ingress"
  from_port                = 0
  to_port                  = 0
  protocol                 = "-1"
  source_security_group_id = aws_security_group.cluster.id
  description              = "Allow cluster control plane to communicate with nodes"
}

# ------------------------------------------------------------------------------
# EKS CLUSTER
# ------------------------------------------------------------------------------

resource "aws_cloudwatch_log_group" "this" {
  count = length(var.cluster_enabled_log_types) > 0 ? 1 : 0

  name              = "/aws/eks/${var.cluster_name}/cluster"
  retention_in_days = var.cloudwatch_log_group_retention_in_days
  kms_key_id        = var.cloudwatch_log_group_kms_key_id
  tags              = local.tags
}

resource "aws_eks_cluster" "this" {
  name     = var.cluster_name
  version  = var.cluster_version
  role_arn = local.create_cluster_iam_role ? aws_iam_role.cluster[0].arn : var.cluster_iam_role_arn

  vpc_config {
    subnet_ids              = var.subnet_ids
    security_group_ids      = [aws_security_group.cluster.id]
    endpoint_private_access = var.cluster_endpoint_private_access
    endpoint_public_access  = var.cluster_endpoint_public_access
    public_access_cidrs     = var.public_access_cidrs
  }

  dynamic "encryption_config" {
    for_each = var.kms_key_arn != null ? [1] : []
    content {
      provider {
        key_arn = var.kms_key_arn
      }
      resources = ["secrets"]
    }
  }

  enabled_cluster_log_types = var.cluster_enabled_log_types

  tags = local.tags

  depends_on = [
    aws_iam_role_policy_attachment.cluster_AmazonEKSClusterPolicy,
    aws_iam_role_policy_attachment.cluster_AmazonEKSServicePolicy,
    aws_cloudwatch_log_group.this,
  ]
}

# ------------------------------------------------------------------------------
# IAM OIDC Provider for IRSA (IAM Roles for Service Accounts)
# ------------------------------------------------------------------------------

resource "aws_iam_openid_connect_provider" "this" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.cluster.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.this.identity[0].oidc[0].issuer

  tags = local.tags
}

# ------------------------------------------------------------------------------
# EKS MANAGED NODE GROUPS
# ------------------------------------------------------------------------------

resource "aws_eks_node_group" "this" {
  for_each = var.managed_node_groups

  cluster_name    = aws_eks_cluster.this.name
  node_group_name = each.key
  node_role_arn   = local.create_node_iam_role ? aws_iam_role.nodes[0].arn : var.node_iam_role_arn
  subnet_ids      = each.value.subnet_ids

  ami_type       = lookup(each.value, "ami_type", "AL2_x86_64")
  capacity_type  = lookup(each.value, "capacity_type", "ON_DEMAND")
  disk_size      = lookup(each.value, "disk_size", 20)
  instance_types = each.value.instance_types
  release_version = lookup(
    each.value,
    "release_version",
    aws_eks_cluster.this.version # Defaults to cluster version
  )

  remote_access {
    ec2_ssh_key               = lookup(each.value, "ec2_ssh_key", null)
    source_security_group_ids = lookup(each.value, "source_security_group_ids", [])
  }

  scaling_config {
    desired_size = each.value.desired_size
    max_size     = each.value.max_size
    min_size     = each.value.min_size
  }

  update_config {
    max_unavailable = lookup(each.value, "max_unavailable", 1)
  }

  labels = merge(
    {
      "eks.amazonaws.com/nodegroup" = each.key
    },
    lookup(each.value, "labels", {})
  )

  dynamic "taint" {
    for_each = lookup(each.value, "taints", [])
    content {
      key    = taint.value.key
      value  = taint.value.value
      effect = taint.value.effect
    }
  }

  tags = merge(
    local.tags,
    { "Name" = "${var.cluster_name}-${each.key}-node" },
    lookup(each.value, "tags", {})
  )

  depends_on = [
    aws_iam_role_policy_attachment.nodes_AmazonEKSWorkerNodePolicy,
    aws_iam_role_policy_attachment.nodes_AmazonEC2ContainerRegistryReadOnly,
    aws_iam_role_policy_attachment.nodes_AmazonEKS_CNI_Policy,
  ]
}

# ------------------------------------------------------------------------------
# EKS FARGATE PROFILES
# ------------------------------------------------------------------------------

resource "aws_eks_fargate_profile" "this" {
  for_each = var.fargate_profiles

  cluster_name           = aws_eks_cluster.this.name
  fargate_profile_name   = each.key
  pod_execution_role_arn = each.value.pod_execution_role_arn
  subnet_ids             = each.value.subnet_ids

  dynamic "selector" {
    for_each = each.value.selectors
    content {
      namespace = selector.value.namespace
      labels    = lookup(selector.value, "labels", null)
    }
  }

  tags = merge(
    local.tags,
    { "Name" = "${var.cluster_name}-${each.key}-fargate" },
    lookup(each.value, "tags", {})
  )
}

# ------------------------------------------------------------------------------
# EKS ADD-ONS
# ------------------------------------------------------------------------------

resource "aws_eks_addon" "this" {
  for_each = var.cluster_addons

  cluster_name                = aws_eks_cluster.this.name
  addon_name                  = each.key
  addon_version               = lookup(each.value, "addon_version", null)
  resolve_conflicts_on_create = lookup(each.value, "resolve_conflicts_on_create", "OVERWRITE")
  resolve_conflicts_on_update = lookup(each.value, "resolve_conflicts_on_update", "PRESERVE")
  service_account_role_arn    = lookup(each.value, "service_account_role_arn", null)
  configuration_values        = lookup(each.value, "configuration_values", null)

  tags = merge(
    local.tags,
    { "eks_addon" = each.key }
  )
}