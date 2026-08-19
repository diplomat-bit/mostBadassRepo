import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  Activity,
  Cpu,
  Database,
  HardDrive,
  Network,
  Server,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Terminal,
  Settings,
  Play,
  Square,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  Clock,
  TrendingUp,
  Sliders,
  ShieldAlert,
  Zap,
  Globe,
  ChevronDown,
  ChevronUp,
  Info,
  Eye,
  Skull,
  Pause,
  RotateCcw,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';

// ============================================================================
// ENTERPRISE SYSTEM MONITORING ENGINE - ARCHITECTURAL TYPES & SCHEMAS
// ============================================================================

export type SeverityLevel = 'info' | 'warning' | 'critical' | 'fatal';
export type ServiceStatusType = 'up' | 'down' | 'degraded' | 'maintenance';
export type NodeStatusType = 'online' | 'offline' | 'degraded' | 'provisioning';
export type ProcessStatusType = 'running' | 'sleeping' | 'stopped' | 'zombie';

export interface MetricPoint {
  timestamp: number;
  value: number;
}

export interface CPUMetrics {
  usage: number; // overall percentage
  cores: number[]; // individual core usage percentages
  loadAverage: [number, number, number]; // 1m, 5m, 15m load averages
  temperature: number; // in Celsius
  processesCount: number;
  threadsCount: number;
  contextSwitches: number; // per second
  interrupts: number; // per second
}

export interface MemoryMetrics {
  total: number; // in bytes
  used: number; // in bytes
  free: number; // in bytes
  shared: number; // in bytes
  buffers: number; // in bytes
  cached: number; // in bytes
  available: number; // in bytes
  swapTotal: number; // in bytes
  swapUsed: number; // in bytes
  swapFree: number; // in bytes
  percentage: number;
  swapPercentage: number;
}

export interface DiskPartition {
  mountPoint: string;
  device: string;
  fileSystem: string;
  total: number; // bytes
  used: number; // bytes
  free: number; // bytes
  percentage: number;
  readSpeed: number; // bytes/sec
  writeSpeed: number; // bytes/sec
  iopsRead: number;
  iopsWrite: number;
}

export interface NetworkInterface {
  name: string;
  ipAddress: string;
  macAddress: string;
  rxBytes: number; // total received bytes
  txBytes: number; // total transmitted bytes
  rxSpeed: number; // current rx speed in bytes/sec
  txSpeed: number; // current tx speed in bytes/sec
  rxErrors: number;
  txErrors: number;
  rxPackets: number;
  txPackets: number;
  packetLoss: number; // percentage
  latency: number; // ping to gateway in ms
}

export interface ProcessInfo {
  pid: number;
  ppid: number;
  name: string;
  user: string;
  cpuUsage: number; // percentage
  memoryUsage: number; // percentage
  memoryBytes: number; // bytes
  diskReadBytes: number; // bytes/sec
  diskWriteBytes: number; // bytes/sec
  status: ProcessStatusType;
  threads: number;
  uptime: number; // seconds
  command: string;
}

export interface HealthCheckResult {
  name: string;
  status: 'healthy' | 'unhealthy' | 'warning';
  latencyMs: number;
  message: string;
  lastChecked: number;
}

export interface ServiceHealth {
  id: string;
  name: string;
  version: string;
  status: ServiceStatusType;
  uptime: number; // seconds
  latency: number; // ms
  requestCount: number;
  errorCount: number;
  cpuUsage: number; // percentage
  memoryUsage: number; // bytes
  dependencies: string[]; // IDs of other services
  healthChecks: HealthCheckResult[];
  lastCheck: number; // timestamp
}

export interface SystemAlert {
  id: string;
  nodeId: string;
  severity: SeverityLevel;
  source: string; // e.g., "CPU Monitor", "Database Service"
  message: string;
  value: string;
  threshold: string;
  timestamp: number;
  acknowledged: boolean;
  resolved: boolean;
  resolvedAt?: number;
}

export interface DiagnosticTool {
  id: string;
  name: string;
  description: string;
  category: 'network' | 'database' | 'security' | 'system';
  status: 'idle' | 'running' | 'success' | 'failed';
  lastRun?: number;
  output?: string[];
}

export interface SimulationConfig {
  cpuLoadMultiplier: number; // 1.0 = normal, >1.0 = high load
  memoryLeakRate: number; // bytes per second leak
  networkLatencySpike: number; // ms added latency
  diskFillRate: number; // bytes per second written
  serviceOutageId: string | null; // service ID to simulate down
  packetLossRate: number; // percentage packet loss
}

export interface NodeSpecs {
  cpuModel: string;
  cpuCores: number;
  cpuThreads: number;
  totalMemory: number; // bytes
  totalDisk: number; // bytes
  os: string;
  kernel: string;
  architecture: string;
}

export interface NodeInfo {
  id: string;
  name: string;
  region: string;
  status: NodeStatusType;
  specs: NodeSpecs;
  uptime: number; // seconds
  metrics: {
    cpu: CPUMetrics;
    memory: MemoryMetrics;
    disks: DiskPartition[];
    network: NetworkInterface[];
  };
}

export interface SystemMetricsHistory {
  cpu: MetricPoint[];
  memory: MetricPoint[];
  diskRead: MetricPoint[];
  diskWrite: MetricPoint[];
  networkRx: MetricPoint[];
  networkTx: MetricPoint[];
  latency: MetricPoint[];
}

export interface SystemLogEntry {
  id: string;
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'critical';
  service: string;
  message: string;
  nodeId: string;
}

// ============================================================================
// CORE UTILITY CLASSES & MATHEMATICAL HELPERS
// ============================================================================

export class MetricFormatter {
  static formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  static formatSpeed(bytesPerSec: number, decimals: number = 2): string {
    return `${this.formatBytes(bytesPerSec, decimals)}/s`;
  }

  static formatBitsSpeed(bytesPerSec: number, decimals: number = 2): string {
    const bitsPerSec = bytesPerSec * 8;
    if (bitsPerSec === 0) return '0 bps';
    const k = 1000;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
    const i = Math.floor(Math.log(bitsPerSec) / Math.log(k));
    return parseFloat((bitsPerSec / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  static formatUptime(seconds: number): string {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const parts: string[] = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  }

  static formatPercentage(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
  }

  static formatShortDate(timestamp: number): string {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
}

export class NoiseGenerator {
  private lastValue: number;
  private min: number;
  private max: number;
  private volatility: number;

  constructor(initial: number, min: number, max: number, volatility: number = 0.05) {
    this.lastValue = initial;
    this.min = min;
    this.max = max;
    this.volatility = volatility;
  }

  next(multiplier: number = 1.0): number {
    const changePercent = (Math.random() - 0.5) * 2 * this.volatility;
    let newValue = this.lastValue * (1 + changePercent * multiplier);
    
    // Add a slight pull towards the median to prevent drifting off to infinity
    const median = (this.min + this.max) / 2;
    const pull = (median - newValue) * 0.02;
    newValue += pull;

    // Clamp values
    if (newValue < this.min) newValue = this.min + Math.random() * (this.max - this.min) * 0.1;
    if (newValue > this.max) newValue = this.max - Math.random() * (this.max - this.min) * 0.1;

    this.lastValue = newValue;
    return parseFloat(newValue.toFixed(2));
  }
}

// ============================================================================
// INITIAL STATE GENERATORS & STATIC CONFIGURATIONS
// ============================================================================

export const CLUSTER_NODES_CONFIG = [
  {
    id: 'node-us-east-1',
    name: 'Quantum Core Alpha (US-East)',
    region: 'us-east-1',
    specs: {
      cpuModel: 'AMD EPYC 9654 96-Core Processor',
      cpuCores: 96,
      cpuThreads: 192,
      totalMemory: 512 * 1024 * 1024 * 1024, // 512 GB
      totalDisk: 4096 * 1024 * 1024 * 1024, // 4 TB NVMe
      os: 'Ubuntu 24.04 LTS',
      kernel: 'Linux 6.8.0-31-generic',
      architecture: 'x86_64'
    }
  },
  {
    id: 'node-eu-central-1',
    name: 'Quantum Core Beta (EU-Central)',
    region: 'eu-central-1',
    specs: {
      cpuModel: 'Intel Xeon Platinum 8480+ 56-Core',
      cpuCores: 56,
      cpuThreads: 112,
      totalMemory: 256 * 1024 * 1024 * 1024, // 256 GB
      totalDisk: 2048 * 1024 * 1024 * 1024, // 2 TB NVMe
      os: 'Red Hat Enterprise Linux 9.4',
      kernel: 'Linux 5.14.0-427.13.1.el9_4.x86_64',
      architecture: 'x86_64'
    }
  },
  {
    id: 'node-ap-southeast-1',
    name: 'Quantum Core Gamma (AP-Southeast)',
    region: 'ap-southeast-1',
    specs: {
      cpuModel: 'Apple M3 Ultra 24-Core',
      cpuCores: 24,
      cpuThreads: 24,
      totalMemory: 128 * 1024 * 1024 * 1024, // 128 GB
      totalDisk: 1024 * 1024 * 1024 * 1024, // 1 TB SSD
      os: 'macOS Sonoma 14.5',
      kernel: 'Darwin 23.5.0',
      architecture: 'arm64'
    }
  }
];export const ENTERPRISE_SERVICES_CONFIG = [
  { id: 'srv-auth', name: 'User & Identity Service', version: 'v2.4.1', dependencies: [] },
  { id: 'srv-ledger', name: 'Accounts & Transactions API', version: 'v3.1.0', dependencies: ['srv-auth'] },
  { id: 'srv-ai-advisor', name: 'AI Advisor Service', version: 'v1.8.9', dependencies: ['srv-auth', 'srv-ledger'] },
  { id: 'srv-ai-oracle', name: 'AI Oracle Simulation Engine', version: 'v4.0.2', dependencies: ['srv-ai-advisor'] },
  { id: 'srv-treasury', name: 'Corporate Treasury API', version: 'v2.2.0', dependencies: ['srv-ledger'] },
  { id: 'srv-invest', name: 'Investment Management API', version: 'v2.1.5', dependencies: ['srv-ledger', 'srv-treasury'] },
  { id: 'srv-web3', name: 'Web3 Gateway', version: 'v0.9.4-beta', dependencies: ['srv-auth'] },
  { id: 'srv-payments', name: 'Payments & FX Service', version: 'v3.5.1', dependencies: ['srv-ledger', 'srv-web3'] },
  { id: 'srv-lending', name: 'Lending & CreditFlow Engine', version: 'v1.12.0', dependencies: ['srv-ledger', 'srv-auth'] },
  { id: 'srv-dev', name: 'Developer Platform & Webhooks', version: 'v2.0.0', dependencies: ['srv-auth'] },
  { id: 'srv-openbanking', name: 'OpenBanking Core API', version: 'v1.0.4', dependencies: ['srv-ledger'] },
  { id: 'srv-rwa', name: 'Risk-Weighted Asset Calculator', version: 'v2.7.3', dependencies: ['srv-ledger'] },
  { id: 'srv-liquidity', name: 'Liquidity Simulation Engine', version: 'v3.0.1', dependencies: ['srv-rwa', 'srv-treasury'] },
  { id: 'srv-compliance', name: 'Compliance Automation Service', version: 'v1.5.0', dependencies: ['srv-auth'] },
  { id: 'srv-deck', name: 'Investor Deck Generator', version: 'v1.1.0', dependencies: ['srv-ai-advisor'] },
  { id: 'srv-capital', name: 'Capital Planning Engine', version: 'v2.4.0', dependencies: ['srv-rwa'] },
  { id: 'srv-stress', name: 'Stress Scenario Modeler', version: 'v3.2.1', dependencies: ['srv-liquidity'] },
  { id: 'srv-branch', name: 'Cross-Branch Orchestrator', version: 'v1.0.0', dependencies: ['srv-ledger'] },
  { id: 'srv-shared-id', name: 'Shared Identity Layer', version: 'v5.1.2', dependencies: [] },
  { id: 'srv-audit', name: 'Automated Audit Validator', version: 'v2.0.1', dependencies: ['srv-compliance'] }
];

export const DIAGNOSTIC_TOOLS_CONFIG: DiagnosticTool[] = [
  { id: 'diag-ping', name: 'ICMP Gateway Ping', description: 'Checks network round-trip latency to edge routers.', category: 'network', status: 'idle' },
  { id: 'diag-db-vacuum', name: 'PostgreSQL Vacuum Analyzer', description: 'Analyzes table bloat and runs garbage collection.', category: 'database', status: 'idle' },
  { id: 'diag-sec-scan', name: 'Port & Vulnerability Scanner', description: 'Scans open ports and checks SSL/TLS cipher suites.', category: 'security', status: 'idle' },
  { id: 'diag-disk-io', name: 'FIO Disk Benchmark', description: 'Measures sequential and random read/write IOPS.', category: 'system', status: 'idle' }
];

export const MOCK_PROCESS_NAMES = [
  { name: 'node', user: 'root' },
  { name: 'postgres', user: 'postgres' },
  { name: 'redis-server', user: 'redis' },
  { name: 'nginx', user: 'www-data' },
  { name: 'prometheus', user: 'prometheus' },
  { name: 'grafana-server', user: 'grafana' },
  { name: 'docker-containerd', user: 'root' },
  { name: 'kubelet', user: 'root' },
  { name: 'envoy', user: 'envoy' },
  { name: 'python3', user: 'ai-runner' },
  { name: 'vector', user: 'vector' },
  { name: 'systemd', user: 'root' }
];

// ============================================================================
// SYSTEM METRICS SIMULATION ENGINE
// ============================================================================

export class SystemMetricsSimulator {
  private nodes: NodeInfo[] = [];
  private services: ServiceHealth[] = [];
  private alerts: SystemAlert[] = [];
  private logs: SystemLogEntry[] = [];
  private history: Record<string, SystemMetricsHistory> = {};
  private diagnosticTools: DiagnosticTool[] = [...DIAGNOSTIC_TOOLS_CONFIG];
  private processes: Record<string, ProcessInfo[]> = {};

  // Noise generators mapped by node ID
  private cpuNoise: Record<string, NoiseGenerator> = {};
  private memNoise: Record<string, NoiseGenerator> = {};
  private diskReadNoise: Record<string, NoiseGenerator> = {};
  private diskWriteNoise: Record<string, NoiseGenerator> = {};
  private netRxNoise: Record<string, NoiseGenerator> = {};
  private netTxNoise: Record<string, NoiseGenerator> = {};

  constructor() {
    this.initializeSimulator();
  }

  private initializeSimulator(): void {
    const now = Date.now();

    CLUSTER_NODES_CONFIG.forEach(nodeCfg => {
      const nodeId = nodeCfg.id;

      // Initialize noise generators with realistic baselines
      this.cpuNoise[nodeId] = new NoiseGenerator(25, 5, 95, 0.08);
      this.memNoise[nodeId] = new NoiseGenerator(45, 20, 98, 0.02);
      this.diskReadNoise[nodeId] = new NoiseGenerator(12 * 1024 * 1024, 100 * 1024, 150 * 1024 * 1024, 0.15);
      this.diskWriteNoise[nodeId] = new NoiseGenerator(8 * 1024 * 1024, 50 * 1024, 100 * 1024 * 1024, 0.15);
      this.netRxNoise[nodeId] = new NoiseGenerator(45 * 1024 * 1024, 1 * 1024 * 1024, 250 * 1024 * 1024, 0.12);
      this.netTxNoise[nodeId] = new NoiseGenerator(30 * 1024 * 1024, 500 * 1024, 180 * 1024 * 1024, 0.12);

      // Generate initial metrics
      const initialCpu = this.cpuNoise[nodeId].next();
      const initialMemPct = this.memNoise[nodeId].next();
      const usedMem = Math.floor(nodeCfg.specs.totalMemory * (initialMemPct / 100));
      const freeMem = nodeCfg.specs.totalMemory - usedMem;

      const cpuMetrics: CPUMetrics = {
        usage: initialCpu,
        cores: Array.from({ length: nodeCfg.specs.cpuCores }, () => 
          new NoiseGenerator(initialCpu, 2, 99, 0.15).next()
        ),
        loadAverage: [
          parseFloat((initialCpu / 100 * nodeCfg.specs.cpuCores).toFixed(2)),
          parseFloat((initialCpu / 100 * nodeCfg.specs.cpuCores * 0.9).toFixed(2)),
          parseFloat((initialCpu / 100 * nodeCfg.specs.cpuCores * 0.8).toFixed(2))
        ],
        temperature: parseFloat((40 + (initialCpu * 0.35)).toFixed(1)),
        processesCount: Math.floor(150 + Math.random() * 100),
        threadsCount: Math.floor(800 + Math.random() * 600),
        contextSwitches: Math.floor(5000 + Math.random() * 10000),
        interrupts: Math.floor(3000 + Math.random() * 5000)
      };

      const memoryMetrics: MemoryMetrics = {
        total: nodeCfg.specs.totalMemory,
        used: usedMem,
        free: freeMem,
        shared: Math.floor(nodeCfg.specs.totalMemory * 0.02),
        buffers: Math.floor(nodeCfg.specs.totalMemory * 0.05),
        cached: Math.floor(nodeCfg.specs.totalMemory * 0.15),
        available: freeMem + Math.floor(nodeCfg.specs.totalMemory * 0.1),
        swapTotal: Math.floor(nodeCfg.specs.totalMemory * 0.1),
        swapUsed: Math.floor(nodeCfg.specs.totalMemory * 0.01),
        swapFree: Math.floor(nodeCfg.specs.totalMemory * 0.09),
        percentage: initialMemPct,
        swapPercentage: 10.0
      };

      const diskPartition: DiskPartition = {
        mountPoint: '/',
        device: '/dev/nvme0n1p2',
        fileSystem: 'ext4',
        total: nodeCfg.specs.totalDisk,
        used: Math.floor(nodeCfg.specs.totalDisk * 0.42),
        free: Math.floor(nodeCfg.specs.totalDisk * 0.58),
        percentage: 42.0,
        readSpeed: this.diskReadNoise[nodeId].next(),
        writeSpeed: this.diskWriteNoise[nodeId].next(),
        iopsRead: Math.floor(1200 + Math.random() * 800),
        iopsWrite: Math.floor(800 + Math.random() * 500)
      };

      const netInterface: NetworkInterface = {
        name: 'eth0',
        ipAddress: nodeId === 'node-us-east-1' ? '10.0.1.15' : nodeId === 'node-eu-central-1' ? '10.0.2.24' : '10.0.3.8',
        macAddress: `02:42:ac:11:00:0${Math.floor(Math.random() * 9)}`,
        rxBytes: 1024 * 1024 * 1024 * (50 + Math.random() * 100),
        txBytes: 1024 * 1024 * 1024 * (30 + Math.random() * 80),
        rxSpeed: this.netRxNoise[nodeId].next(),
        txSpeed: this.netTxNoise[nodeId].next(),
        rxErrors: 0,
        txErrors: 0,
        rxPackets: 12000000,
        txPackets: 9500000,
        packetLoss: 0.0,
        latency: 12.5
      };

      this.nodes.push({
        id: nodeId,
        name: nodeCfg.name,
        region: nodeCfg.region,
        status: 'online',
        specs: nodeCfg.specs,
        uptime: Math.floor(86400 * (5 + Math.random() * 20)), // 5 to 25 days
        metrics: {
          cpu: cpuMetrics,
          memory: memoryMetrics,
          disks: [diskPartition],
          network: [netInterface]
        }
      });

      // Initialize history arrays
      this.history[nodeId] = {
        cpu: [],
        memory: [],
        diskRead: [],
        diskWrite: [],
        networkRx: [],
        networkTx: [],
        latency: []
      };

      // Pre-populate history with 30 points
      for (let i = 29; i >= 0; i--) {
        const histTime = now - (i * 3000);
        this.history[nodeId].cpu.push({ timestamp: histTime, value: Math.max(5, initialCpu + (Math.random() - 0.5) * 15) });
        this.history[nodeId].memory.push({ timestamp: histTime, value: Math.max(10, initialMemPct + (Math.random() - 0.5) * 5) });
        this.history[nodeId].diskRead.push({ timestamp: histTime, value: this.diskReadNoise[nodeId].next() });
        this.history[nodeId].diskWrite.push({ timestamp: histTime, value: this.diskWriteNoise[nodeId].next() });
        this.history[nodeId].networkRx.push({ timestamp: histTime, value: this.netRxNoise[nodeId].next() });
        this.history[nodeId].networkTx.push({ timestamp: histTime, value: this.netTxNoise[nodeId].next() });
        this.history[nodeId].latency.push({ timestamp: histTime, value: 10 + Math.random() * 5 });
      }

      // Generate initial processes
      this.processes[nodeId] = this.generateInitialProcesses(nodeCfg.specs.cpuCores, nodeCfg.specs.totalMemory);
    });

    // Initialize services
    this.services = ENTERPRISE_SERVICES_CONFIG.map(srv => {
      const isCore = srv.dependencies.length === 0;
      const latency = isCore ? 5 + Math.random() * 15 : 20 + Math.random() * 40;
      const reqCount = Math.floor(10000 + Math.random() * 50000);
      
      const healthChecks: HealthCheckResult[] = [
        {
          name: 'Database Connection',
          status: 'healthy',
          latencyMs: latency * 0.4,
          message: 'Connection pool active (24/50 connections)',
          lastChecked: now
        },
        {
          name: 'Memory Footprint',
          status: 'healthy',
          latencyMs: 0.1,
          message: 'Heap usage within safe limits',
          lastChecked: now
        }
      ];

      return {
        id: srv.id,
        name: srv.name,
        version: srv.version,
        status: 'up',
        uptime: Math.floor(86400 * (2 + Math.random() * 10)),
        latency,
        requestCount: reqCount,
        errorCount: Math.floor(reqCount * 0.0002), // 0.02% error rate
        cpuUsage: 1.5 + Math.random() * 8,
        memoryUsage: 128 * 1024 * 1024 + Math.floor(Math.random() * 512 * 1024 * 1024),
        dependencies: srv.dependencies,
        healthChecks,
        lastCheck: now
      };
    });

    // Generate initial logs
    this.addLogEntry('info', 'srv-auth', 'User & Identity Service initialized successfully.', 'node-us-east-1');
    this.addLogEntry('info', 'srv-ledger', 'Accounts & Transactions API connected to PostgreSQL cluster.', 'node-us-east-1');
    this.addLogEntry('info', 'srv-ai-oracle', 'AI Oracle Simulation Engine loaded neural weights (v4.0.2).', 'node-ap-southeast-1');
  }

  private generateInitialProcesses(cores: number, totalMemory: number): ProcessInfo[] {
    return MOCK_PROCESS_NAMES.map((proc, index) => {
      const pid = 1000 + index * 142 + Math.floor(Math.random() * 50);
      const cpuUsage = parseFloat((Math.random() * (80 / cores)).toFixed(2));
      const memoryUsage = parseFloat((0.5 + Math.random() * 4).toFixed(2));
      const memoryBytes = Math.floor(totalMemory * (memoryUsage / 100));

      return {
        pid,
        ppid: Math.random() > 0.8 ? 1 : 500 + Math.floor(Math.random() * 100),
        name: proc.name,
        user: proc.user,
        cpuUsage,
        memoryUsage,
        memoryBytes,
        diskReadBytes: Math.floor(Math.random() * 500 * 1024),
        diskWriteBytes: Math.floor(Math.random() * 200 * 1024),
        status: 'running',
        threads: Math.floor(2 + Math.random() * 24),
        uptime: Math.floor(3600 * (1 + Math.random() * 48)),
        command: `/usr/bin/${proc.name} --config=/etc/${proc.name}/${proc.name}.conf`
      };
    });
  }  public addLogEntry(level: 'info' | 'warn' | 'error' | 'critical', service: string, message: string, nodeId: string): void {
    const log: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      timestamp: Date.now(),
      level,
      service,
      message,
      nodeId
    };
    this.logs.unshift(log);
    if (this.logs.length > 500) {
      this.logs.pop();
    }
  }

  private triggerAlert(
    nodeId: string,
    severity: SeverityLevel,
    source: string,
    message: string,
    value: string,
    threshold: string
  ): void {
    const exists = this.alerts.some(
      a => a.nodeId === nodeId && a.source === source && !a.resolved && a.message === message
    );
    if (exists) return;

    const alert: SystemAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
      nodeId,
      severity,
      source,
      message,
      value,
      threshold,
      timestamp: Date.now(),
      acknowledged: false,
      resolved: false
    };

    this.alerts.unshift(alert);
    this.addLogEntry(
      severity === 'fatal' || severity === 'critical' ? 'critical' : 'warn',
      source,
      `ALERT [${severity.toUpperCase()}]: ${message} (Value: ${value}, Threshold: ${threshold})`,
      nodeId
    );
  }

  public acknowledgeAlert(alertId: string): void {
    this.alerts = this.alerts.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, acknowledged: true };
      }
      return alert;
    });
  }

  public resolveAlert(alertId: string): void {
    this.alerts = this.alerts.map(alert => {
      if (alert.id === alertId) {
        return { ...alert, resolved: true, resolvedAt: Date.now() };
      }
      return alert;
    });
  }

  public clearAllAlerts(): void {
    this.alerts = [];
  }

  public runDiagnosticTool(toolId: string, callback?: () => void): void {
    const toolIndex = this.diagnosticTools.findIndex(t => t.id === toolId);
    if (toolIndex === -1) return;

    this.diagnosticTools[toolIndex].status = 'running';
    this.diagnosticTools[toolIndex].lastRun = Date.now();
    this.diagnosticTools[toolIndex].output = ['[INFO] Initializing diagnostic routine...', `[INFO] Target: Local Cluster Node`];

    const tool = this.diagnosticTools[toolIndex];

    setTimeout(() => {
      const updatedTool = { ...this.diagnosticTools[toolIndex] };
      if (!updatedTool.output) updatedTool.output = [];

      try {
        switch (tool.id) {
          case 'diag-ping':
            updatedTool.output.push(
              `[INFO] Pinging default gateway 10.0.0.1 with 64 bytes of data:`,
              `[INFO] 64 bytes from 10.0.0.1: icmp_seq=1 ttl=64 time=${(5 + Math.random() * 5).toFixed(2)} ms`,
              `[INFO] 64 bytes from 10.0.0.1: icmp_seq=2 ttl=64 time=${(4 + Math.random() * 4).toFixed(2)} ms`,
              `[INFO] 64 bytes from 10.0.0.1: icmp_seq=3 ttl=64 time=${(6 + Math.random() * 8).toFixed(2)} ms`,
              `[INFO] --- 10.0.0.1 ping statistics ---`,
              `[INFO] 3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
              `[INFO] rtt min/avg/max/mdev = 4.12/6.24/14.02/2.11 ms`
            );
            updatedTool.status = 'success';
            break;

          case 'diag-db-vacuum':
            updatedTool.output.push(
              `[INFO] Connecting to PostgreSQL cluster...`,
              `[INFO] Database: quantum_ledger_prod`,
              `[INFO] Analyzing table bloat...`,
              `[INFO] Found 14.2MB of dead tuples in table "transactions".`,
              `[INFO] Executing VACUUM ANALYZE on "transactions"...`,
              `[INFO] Executing VACUUM ANALYZE on "user_sessions"...`,
              `[INFO] Vacuum complete. Reclaimed 12.8MB of disk space.`,
              `[INFO] Index scan optimization completed successfully.`
            );
            updatedTool.status = 'success';
            break;

          case 'diag-sec-scan':
            updatedTool.output.push(
              `[INFO] Starting vulnerability scan on local interfaces...`,
              `[INFO] Scanning 1024 standard ports...`,
              `[INFO] Port 22/tcp (SSH) - OPEN (Protocol: OpenSSH_9.6p1 Ubuntu-3ubuntu1)`,
              `[INFO] Port 80/tcp (HTTP) - CLOSED`,
              `[INFO] Port 443/tcp (HTTPS) - OPEN (Protocol: nginx/1.25.3)`,
              `[INFO] Port 5432/tcp (PostgreSQL) - OPEN (Firewalled to internal subnet)`,
              `[INFO] Checking SSL/TLS cipher suites...`,
              `[INFO] TLSv1.3 - ENABLED (Secure)`,
              `[INFO] TLSv1.2 - ENABLED (Secure)`,
              `[INFO] No critical vulnerabilities or open management ports exposed to public interfaces.`
            );
            updatedTool.status = 'success';
            break;

          case 'diag-disk-io':
            const readIops = Math.floor(85000 + Math.random() * 15000);
            const writeIops = Math.floor(42000 + Math.random() * 8000);
            updatedTool.output.push(
              `[INFO] Starting FIO engine (Engine: libaio, Direct: 1, Blocksize: 4k)...`,
              `[INFO] Running sequential read test...`,
              `[INFO] Read Speed: ${(3200 + Math.random() * 400).toFixed(2)} MB/s (IOPS: ${readIops})`,
              `[INFO] Running sequential write test...`,
              `[INFO] Write Speed: ${(1800 + Math.random() * 200).toFixed(2)} MB/s (IOPS: ${writeIops})`,
              `[INFO] Disk latency: 0.12 ms (Read), 0.45 ms (Write)`,
              `[INFO] NVMe health status: 98% (Remaining rated write endurance)`
            );
            updatedTool.status = 'success';
            break;

          default:
            updatedTool.status = 'failed';
            updatedTool.output.push(`[ERROR] Unknown diagnostic tool ID: ${tool.id}`);
        }
      } catch (err: any) {
        updatedTool.status = 'failed';
        updatedTool.output.push(`[FATAL] Diagnostic execution failed: ${err.message || err}`);
      }

      this.diagnosticTools[toolIndex] = updatedTool;
      if (callback) callback();
    }, 2000);
  }

  public tick(config: SimulationConfig): void {
    const now = Date.now();
    const tickInterval = 3; // seconds

    // 1. Update Nodes & Metrics
    this.nodes = this.nodes.map(node => {
      const nodeId = node.id;
      node.uptime += tickInterval;

      // Apply simulation multipliers to noise generators
      const cpuMult = config.cpuLoadMultiplier;
      const rawCpu = this.cpuNoise[nodeId].next(cpuMult);
      const cpuVal = Math.min(100, Math.max(0, rawCpu * cpuMult));

      // Memory Leak simulation
      let memLeakBytes = 0;
      if (config.memoryLeakRate > 0 && nodeId === 'node-us-east-1') {
        memLeakBytes = config.memoryLeakRate * tickInterval;
      }

      const baseMemPct = this.memNoise[nodeId].next();
      const currentUsedMem = Math.min(
        node.specs.totalMemory,
        node.metrics.memory.used + memLeakBytes + Math.floor((baseMemPct - 45) * 0.005 * node.specs.totalMemory)
      );
      const currentFreeMem = node.specs.totalMemory - currentUsedMem;
      const memPct = parseFloat(((currentUsedMem / node.specs.totalMemory) * 100).toFixed(2));

      // Disk Fill simulation
      let diskWriteBytes = 0;
      if (config.diskFillRate > 0 && nodeId === 'node-us-east-1') {
        diskWriteBytes = config.diskFillRate * tickInterval;
      }

      const updatedDisks = node.metrics.disks.map(disk => {
        const newUsed = Math.min(disk.total, disk.used + diskWriteBytes);
        const newFree = disk.total - newUsed;
        const newPct = parseFloat(((newUsed / disk.total) * 100).toFixed(2));
        const readSpd = this.diskReadNoise[nodeId].next();
        const writeSpd = this.diskWriteNoise[nodeId].next() + (config.diskFillRate > 0 ? config.diskFillRate : 0);

        return {
          ...disk,
          used: newUsed,
          free: newFree,
          percentage: newPct,
          readSpeed: readSpd,
          writeSpeed: writeSpd,
          iopsRead: Math.floor(readSpd / 4096),
          iopsWrite: Math.floor(writeSpd / 4096)
        };
      });

      // Network Latency & Packet Loss simulation
      const updatedNetwork = node.metrics.network.map(net => {
        const rxSpd = this.netRxNoise[nodeId].next();
        const txSpd = this.netTxNoise[nodeId].next();
        const latencySpike = config.networkLatencySpike;
        const packetLossRate = config.packetLossRate;

        return {
          ...net,
          rxBytes: net.rxBytes + rxSpd * tickInterval,
          txBytes: net.txBytes + txSpd * tickInterval,
          rxSpeed: rxSpd,
          txSpeed: txSpd,
          packetLoss: parseFloat(Math.min(100, Math.max(0, packetLossRate + (Math.random() * 0.1))).toFixed(2)),
          latency: parseFloat(Math.max(1, (10 + Math.random() * 5) + latencySpike).toFixed(1))
        };
      });

      // CPU Cores & Load Averages
      const updatedCores = node.metrics.cpu.cores.map(coreVal => {
        const coreNoise = new NoiseGenerator(coreVal, 2, 99, 0.15);
        return Math.min(100, Math.max(0, coreNoise.next() * cpuMult));
      });

      const load1 = parseFloat((cpuVal / 100 * node.specs.cpuCores).toFixed(2));
      const load5 = parseFloat((node.metrics.cpu.loadAverage[0] * 0.9 + load1 * 0.1).toFixed(2));
      const load15 = parseFloat((node.metrics.cpu.loadAverage[1] * 0.95 + load5 * 0.05).toFixed(2));

      const cpuMetrics: CPUMetrics = {
        usage: parseFloat(cpuVal.toFixed(2)),
        cores: updatedCores,
        loadAverage: [load1, load5, load15],
        temperature: parseFloat((40 + (cpuVal * 0.45) + (nodeId === 'node-us-east-1' ? config.cpuLoadMultiplier * 2 : 0)).toFixed(1)),
        processesCount: Math.floor(150 + (cpuVal * 0.5) + Math.random() * 10),
        threadsCount: Math.floor(800 + (cpuVal * 2) + Math.random() * 50),
        contextSwitches: Math.floor(5000 + (cpuVal * 120) + Math.random() * 1000),
        interrupts: Math.floor(3000 + (cpuVal * 80) + Math.random() * 800)
      };

      const memoryMetrics: MemoryMetrics = {
        total: node.specs.totalMemory,
        used: currentUsedMem,
        free: currentFreeMem,
        shared: node.metrics.memory.shared,
        buffers: node.metrics.memory.buffers,
        cached: node.metrics.memory.cached,
        available: currentFreeMem + Math.floor(node.specs.totalMemory * 0.1),
        swapTotal: node.metrics.memory.swapTotal,
        swapUsed: node.metrics.memory.swapUsed,
        swapFree: node.metrics.memory.swapFree,
        percentage: memPct,
        swapPercentage: node.metrics.memory.swapPercentage
      };

      // Push to History
      const hist = this.history[nodeId];
      const pushAndShift = (arr: MetricPoint[], val: number) => {
        arr.push({ timestamp: now, value: val });
        if (arr.length > 50) arr.shift();
      };

      pushAndShift(hist.cpu, cpuMetrics.usage);
      pushAndShift(hist.memory, memoryMetrics.percentage);
      pushAndShift(hist.diskRead, updatedDisks[0].readSpeed);
      pushAndShift(hist.diskWrite, updatedDisks[0].writeSpeed);
      pushAndShift(hist.networkRx, updatedNetwork[0].rxSpeed);
      pushAndShift(hist.networkTx, updatedNetwork[0].txSpeed);
      pushAndShift(hist.latency, updatedNetwork[0].latency);

      // Threshold Alerts Check
      if (cpuMetrics.usage > 90) {
        this.triggerAlert(
          nodeId,
          'critical',
          'CPU Monitor',
          `High CPU utilization detected on ${node.name}`,
          `${cpuMetrics.usage}%`,
          '> 90%'
        );
      }
      if (memoryMetrics.percentage > 92) {
        this.triggerAlert(
          nodeId,
          'critical',
          'Memory Monitor',
          `System memory exhaustion warning on ${node.name}`,
          `${memoryMetrics.percentage}%`,
          '> 92%'
        );
      }
      if (updatedDisks[0].percentage > 85) {
        this.triggerAlert(
          nodeId,
          'warning',
          'Disk Monitor',
          `Root partition storage space is running low on ${node.name}`,
          `${updatedDisks[0].percentage}%`,
          '> 85%'
        );
      }
      if (updatedNetwork[0].packetLoss > 2.0) {
        this.triggerAlert(
          nodeId,
          'warning',
          'Network Monitor',
          `Elevated packet loss detected on interface eth0 of ${node.name}`,
          `${updatedNetwork[0].packetLoss}%`,
          '> 2.0%'
        );
      }

      // Update Processes
      this.processes[nodeId] = this.processes[nodeId].map(proc => {
        const procCpuNoise = (Math.random() - 0.5) * 2;
        const procMemNoise = (Math.random() - 0.5) * 0.1;

        let finalCpu = Math.max(0.1, proc.cpuUsage + procCpuNoise);
        if (config.cpuLoadMultiplier > 1.5 && Math.random() > 0.5) {
          finalCpu *= config.cpuLoadMultiplier * 0.8;
        }

        return {
          ...proc,
          cpuUsage: parseFloat(Math.min(99, finalCpu).toFixed(2)),
          memoryUsage: parseFloat(Math.max(0.1, Math.min(95, proc.memoryUsage + procMemNoise)).toFixed(2)),
          diskReadBytes: Math.floor(Math.max(0, proc.diskReadBytes + (Math.random() - 0.5) * 50 * 1024)),
          diskWriteBytes: Math.floor(Math.max(0, proc.diskWriteBytes + (Math.random() - 0.5) * 30 * 1024)),
          uptime: proc.uptime + tickInterval
        };
      });

      return {
        ...node,
        metrics: {
          cpu: cpuMetrics,
          memory: memoryMetrics,
          disks: updatedDisks,
          network: updatedNetwork
        }
      };
    });

    // 2. Update Services
    this.services = this.services.map(srv => {
      srv.uptime += tickInterval;
      const isOutage = config.serviceOutageId === srv.id;

      if (isOutage) {
        if (srv.status !== 'down') {
          this.addLogEntry('critical', srv.id, `Service ${srv.name} entered CRITICAL state: Outage simulated.`, 'node-us-east-1');
          this.triggerAlert(
            'node-us-east-1',
            'fatal',
            srv.name,
            `Service outage detected: ${srv.name} is unresponsive`,
            'DOWN',
            'UP'
          );
        }

        return {
          ...srv,
          status: 'down',
          latency: 0,
          errorCount: srv.errorCount + Math.floor(Math.random() * 10),
          cpuUsage: 0,
          memoryUsage: 0,
          healthChecks: srv.healthChecks.map(hc => ({
            ...hc,
            status: 'unhealthy',
            message: 'Connection timed out (504 Gateway Timeout)',
            lastChecked: now
          })),
          lastCheck: now
        };
      }

      // Check if dependencies are down
      const depDown = srv.dependencies.some(depId => {
        const depSrv = this.services.find(s => s.id === depId);
        return depSrv && depSrv.status === 'down';
      });

      let status: ServiceStatusType = 'up';
      let latency = 5 + Math.random() * 25;
      let errorRate = 0.0002;

      if (depDown) {
        status = 'degraded';
        latency = 150 + Math.random() * 300;
        errorRate = 0.08; // 8% error rate due to missing dependency
        this.triggerAlert(
          'node-us-east-1',
          'warning',
          srv.name,
          `Service ${srv.name} is degraded due to dependency failure`,
          'DEGRADED',
          'UP'
        );
      } else if (config.networkLatencySpike > 50) {
        status = 'degraded';
        latency = 50 + Math.random() * 100 + config.networkLatencySpike;
        errorRate = 0.01;
      }

      const newRequests = Math.floor(50 + Math.random() * 200);
      const newErrors = Math.floor(newRequests * errorRate);

      const updatedHealthChecks = srv.healthChecks.map(hc => {
        let hcStatus: 'healthy' | 'unhealthy' | 'warning' = 'healthy';
        let hcMsg = hc.message;

        if (depDown && hc.name.includes('Database')) {
          hcStatus = 'warning';
          hcMsg = 'Database connection pool degraded (high latency)';
        }

        return {
          ...hc,
          status: hcStatus,
          message: hcMsg,
          latencyMs: parseFloat((latency * 0.4).toFixed(2)),
          lastChecked: now
        };
      });

      return {
        ...srv,
        status,
        latency: parseFloat(latency.toFixed(1)),
        requestCount: srv.requestCount + newRequests,
        errorCount: srv.errorCount + newErrors,
        cpuUsage: parseFloat((1.5 + Math.random() * 8 + (status === 'degraded' ? 5 : 0)).toFixed(2)),
        memoryUsage: Math.min(
          1024 * 1024 * 1024 * 4,
          srv.memoryUsage + Math.floor((Math.random() - 0.48) * 10 * 1024 * 1024)
        ),
        healthChecks: updatedHealthChecks,
        lastCheck: now
      };
    });

    // Randomly generate background logs
    if (Math.random() > 0.7) {
      const randomSrv = this.services[Math.floor(Math.random() * this.services.length)];
      const logTypes: Array<'info' | 'warn' | 'error'> = ['info', 'info', 'info', 'warn'];
      const selectedType = logTypes[Math.floor(Math.random() * logTypes.length)];
      let msg = `Processed transaction batch successfully.`;

      if (selectedType === 'warn') {
        msg = `Database connection pool reached 80% capacity. Spawning auxiliary connections.`;
      }

      this.addLogEntry(selectedType, randomSrv.id, msg, 'node-us-east-1');
    }
  }

  // Getters
  public getNodes(): NodeInfo[] { return this.nodes; }
  public getServices(): ServiceHealth[] { return this.services; }
  public getAlerts(): SystemAlert[] { return this.alerts; }
  public getLogs(): SystemLogEntry[] { return this.logs; }
  public getHistory(nodeId: string): SystemMetricsHistory { return this.history[nodeId]; }
  public getProcesses(nodeId: string): ProcessInfo[] { return this.processes[nodeId] || []; }
  public getDiagnosticTools(): DiagnosticTool[] { return this.diagnosticTools; }
}// ============================================================================
// REACT STATE MANAGEMENT & HOOKS LAYER
// ============================================================================

export interface SystemMetricsContextProps {
  nodes: NodeInfo[];
  services: ServiceHealth[];
  alerts: SystemAlert[];
  logs: SystemLogEntry[];
  diagnosticTools: DiagnosticTool[];
  simulationConfig: SimulationConfig;
  isPaused: boolean;
  selectedNodeId: string;
  selectedServiceId: string | null;
  activeTab: 'overview' | 'nodes' | 'services' | 'processes' | 'diagnostics' | 'alerts' | 'logs' | 'simulation';
  processes: ProcessInfo[];
  history: SystemMetricsHistory;
  tick: () => void;
  acknowledgeAlert: (alertId: string) => void;
  resolveAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  runDiagnostic: (toolId: string) => void;
  updateSimulationConfig: (config: Partial<SimulationConfig>) => void;
  togglePause: () => void;
  setSelectedNodeId: (nodeId: string) => void;
  setSelectedServiceId: (serviceId: string | null) => void;
  setActiveTab: (tab: 'overview' | 'nodes' | 'services' | 'processes' | 'diagnostics' | 'alerts' | 'logs' | 'simulation') => void;
}

export const SystemMetricsContext = React.createContext<SystemMetricsContextProps | undefined>(undefined);

export const SystemMetricsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const simulatorRef = useRef<SystemMetricsSimulator | null>(null);

  // Initialize simulator once
  if (!simulatorRef.current) {
    simulatorRef.current = new SystemMetricsSimulator();
  }

  const simulator = simulatorRef.current;

  // React States synchronized with the simulator
  const [nodes, setNodes] = useState<NodeInfo[]>(() => simulator.getNodes());
  const [services, setServices] = useState<ServiceHealth[]>(() => simulator.getServices());
  const [alerts, setAlerts] = useState<SystemAlert[]>(() => simulator.getAlerts());
  const [logs, setLogs] = useState<SystemLogEntry[]>(() => simulator.getLogs());
  const [diagnosticTools, setDiagnosticTools] = useState<DiagnosticTool[]>(() => simulator.getDiagnosticTools());
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-us-east-1');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'nodes' | 'services' | 'processes' | 'diagnostics' | 'alerts' | 'logs' | 'simulation'>('overview');

  const [simulationConfig, setSimulationConfig] = useState<SimulationConfig>({
    cpuLoadMultiplier: 1.0,
    memoryLeakRate: 0,
    networkLatencySpike: 0,
    diskFillRate: 0,
    serviceOutageId: null,
    packetLossRate: 0.0
  });

  // Synchronize React state with simulator engine
  const syncState = useCallback(() => {
    setNodes([...simulator.getNodes()]);
    setServices([...simulator.getServices()]);
    setAlerts([...simulator.getAlerts()]);
    setLogs([...simulator.getLogs()]);
    setDiagnosticTools([...simulator.getDiagnosticTools()]);
  }, [simulator]);

  // Manual tick trigger
  const tick = useCallback(() => {
    simulator.tick(simulationConfig);
    syncState();
  }, [simulator, simulationConfig, syncState]);

  // Simulation loop
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      tick();
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused, tick]);

  // Action Handlers
  const acknowledgeAlert = useCallback((alertId: string) => {
    simulator.acknowledgeAlert(alertId);
    syncState();
  }, [simulator, syncState]);

  const resolveAlert = useCallback((alertId: string) => {
    simulator.resolveAlert(alertId);
    syncState();
  }, [simulator, syncState]);

  const clearAllAlerts = useCallback(() => {
    simulator.clearAllAlerts();
    syncState();
  }, [simulator, syncState]);

  const runDiagnostic = useCallback((toolId: string) => {
    simulator.runDiagnosticTool(toolId, () => {
      syncState();
    });
    syncState(); // Sync immediately to show "running" status
  }, [simulator, syncState]);

  const updateSimulationConfig = useCallback((newConfig: Partial<SimulationConfig>) => {
    setSimulationConfig(prev => {
      const updated = { ...prev, ...newConfig };
      simulator.addLogEntry(
        'warn',
        'Simulation Engine',
        `Simulation parameters updated: CPU Mult=${updated.cpuLoadMultiplier}x, Leak=${MetricFormatter.formatBytes(updated.memoryLeakRate)}/s, Latency Spike=+${updated.networkLatencySpike}ms`,
        'node-us-east-1'
      );
      return updated;
    });
  }, [simulator]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const nextState = !prev;
      simulator.addLogEntry(
        'info',
        'Simulation Engine',
        `Real-time metrics simulation ${nextState ? 'PAUSED' : 'RESUMED'}.`,
        'node-us-east-1'
      );
      return nextState;
    });
  }, [simulator]);

  // Derived States
  const processes = useMemo(() => {
    return simulator.getProcesses(selectedNodeId);
  }, [simulator, selectedNodeId, nodes]); // depend on nodes to trigger update on tick

  const history = useMemo(() => {
    return simulator.getHistory(selectedNodeId);
  }, [simulator, selectedNodeId, nodes]); // depend on nodes to trigger update on tick

  const contextValue = useMemo<SystemMetricsContextProps>(() => ({
    nodes,
    services,
    alerts,
    logs,
    diagnosticTools,
    simulationConfig,
    isPaused,
    selectedNodeId,
    selectedServiceId,
    activeTab,
    processes,
    history,
    tick,
    acknowledgeAlert,
    resolveAlert,
    clearAllAlerts,
    runDiagnostic,
    updateSimulationConfig,
    togglePause,
    setSelectedNodeId,
    setSelectedServiceId,
    setActiveTab
  }), [
    nodes,
    services,
    alerts,
    logs,
    diagnosticTools,
    simulationConfig,
    isPaused,
    selectedNodeId,
    selectedServiceId,
    activeTab,
    processes,
    history,
    tick,
    acknowledgeAlert,
    resolveAlert,
    clearAllAlerts,
    runDiagnostic,
    updateSimulationConfig,
    togglePause
  ]);

  return (
    <SystemMetricsContext.Provider value={contextValue}>
      {children}
    </SystemMetricsContext.Provider>
  );
};

export const useSystemMetrics = () => {
  const context = React.useContext(SystemMetricsContext);
  if (context === undefined) {
    throw new Error('useSystemMetrics must be used within a SystemMetricsProvider');
  }
  return context;
};

// ============================================================================
// HIGH-PERFORMANCE CUSTOM SVG CHARTING COMPONENTS
// ============================================================================

interface SparklineProps {
  data: MetricPoint[];
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

export const MetricSparkline: React.FC<SparklineProps> = ({
  data,
  color = '#3b82f6',
  width = 120,
  height = 36,
  strokeWidth = 1.5
}) => {
  const points = useMemo(() => {
    if (!data || data.length < 2) return '';
    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min === 0 ? 1 : max - min;

    return data
      .map((d, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((d.value - min) / range) * (height - 4) - 2;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [data, width, height]);

  if (!points) return <div className="text-xs text-gray-400">No data</div>;

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

interface AreaChartProps {
  data: MetricPoint[];
  title: string;
  unit: string;
  color?: string;
  gradientId: string;
  height?: number;
  formatter?: (val: number) => string;
}

export const MetricAreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  unit,
  color = '#3b82f6',
  gradientId,
  height = 200,
  formatter = (val) => val.toFixed(1)
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<SVGSVGElement | null>(null);

  const { points, areaPoints, gridLines, yTicks, xTicks, currentVal, minVal, maxVal, avgVal } = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        points: '',
        areaPoints: '',
        gridLines: [],
        yTicks: [],
        xTicks: [],
        currentVal: 0,
        minVal: 0,
        maxVal: 0,
        avgVal: 0
      };
    }

    const values = data.map(d => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const range = max - min === 0 ? 1 : max - min;

    // Add 10% padding to top and bottom of chart
    const paddedMin = Math.max(0, min - range * 0.1);
    const paddedMax = max + range * 0.1;
    const paddedRange = paddedMax - paddedMin;

    const width = 600; // Internal coordinate system width
    const chartHeight = height - 40; // Leave space for X axis labels

    const mappedPoints = data.map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = chartHeight - ((d.value - paddedMin) / paddedRange) * (chartHeight - 10) - 5;
      return { x, y, value: d.value, timestamp: d.timestamp };
    });

    const pointsStr = mappedPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPointsStr = `${mappedPoints[0]?.x.toFixed(1)},${chartHeight} ` + 
                          pointsStr + 
                          ` ${mappedPoints[mappedPoints.length - 1]?.x.toFixed(1)},${chartHeight}`;

    // Generate Y-axis ticks (4 levels)
    const ticksCount = 4;
    const yTicksList = Array.from({ length: ticksCount }, (_, i) => {
      const val = paddedMin + (paddedRange * i) / (ticksCount - 1);
      const y = chartHeight - (i / (ticksCount - 1)) * (chartHeight - 10) - 5;
      return { val, y };
    });

    // Generate X-axis ticks (5 levels)
    const xTicksCount = 5;
    const xTicksList = Array.from({ length: xTicksCount }, (_, i) => {
      const index = Math.floor((data.length - 1) * i / (xTicksCount - 1));
      const item = data[index];
      const x = (index / (data.length - 1)) * width;
      return {
        label: item ? MetricFormatter.formatShortDate(item.timestamp) : '',
        x
      };
    });

    return {
      points: pointsStr,
      areaPoints: areaPointsStr,
      yTicks: yTicksList,
      xTicks: xTicksList,
      currentVal: data[data.length - 1]?.value || 0,
      minVal: min,
      maxVal: max,
      avgVal: avg
    };
  }, [data, height]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current || !data || data.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const pct = xPos / rect.width;
    const index = Math.min(data.length - 1, Math.max(0, Math.floor(pct * data.length)));
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-slate-900/50 border border-slate-800 rounded-xl">
        <span className="text-slate-500 text-sm">Awaiting telemetry stream...</span>
      </div>
    );
  }

  const activePoint = hoveredIndex !== null ? data[hoveredIndex] : null;
  const activeX = hoveredIndex !== null ? (hoveredIndex / (data.length - 1)) * 100 : null;

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-2xl relative overflow-hidden group">
      {/* Background Grid Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 to-transparent pointer-events-none" />

      {/* Header Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-800/50 pb-3">
        <div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">{title}</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-slate-100 tracking-tight">
              {activePoint ? formatter(activePoint.value) : formatter(currentVal)}
            </span>
            <span className="text-xs font-medium text-slate-400">{unit}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex flex-col">
            <span className="text-slate-500">MAX</span>
            <span className="font-mono font-semibold text-rose-400">{formatter(maxVal)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">MIN</span>
            <span className="font-mono font-semibold text-emerald-400">{formatter(minVal)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-slate-500">AVG</span>
            <span className="font-mono font-semibold text-blue-400">{formatter(avgVal)}</span>
          </div>
          {activePoint && (
            <div className="flex flex-col border-l border-slate-800 pl-4">
              <span className="text-slate-400 font-medium">TIME</span>
              <span className="font-mono text-slate-300">{MetricFormatter.formatShortDate(activePoint.timestamp)}</span>
            </div>
          )}
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative">
        <svg
          ref={containerRef}
          viewBox={`0 0 600 ${height}`}
          className="w-full h-auto overflow-visible select-none cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.00} />
            </linearGradient>
          </defs>

          {/* Horizontal Grid Lines */}
          {yTicks.map((tick, i) => (
            <g key={i} className="opacity-20">
              <line
                x1="0"
                y1={tick.y}
                x2="600"
                y2={tick.y}
                stroke="#475569"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x="595"
                y={tick.y - 4}
                textAnchor="end"
                fill="#94a3b8"
                fontSize="10"
                fontFamily="monospace"
              >
                {formatter(tick.val)}
              </text>
            </g>
          ))}

          {/* Area Path */}
          <polygon
            points={areaPoints}
            fill={`url(#${gradientId})`}
            className="transition-all duration-300"
          />

          {/* Line Path */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
            className="transition-all duration-300"
          />

          {/* X-Axis Labels */}
          {xTicks.map((tick, i) => (
            <text
              key={i}
              x={tick.x}
              y={height - 10}
              textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
              fill="#64748b"
              fontSize="10"
              fontFamily="monospace"
              className="opacity-80"
            >
              {tick.label}
            </text>
          ))}

          {/* Hover Vertical Line & Indicator Dot */}
          {hoveredIndex !== null && activePoint && (
            <g>
              <line
                x1={(hoveredIndex / (data.length - 1)) * 600}
                y1="0"
                x2={(hoveredIndex / (data.length - 1)) * 600}
                y2={height - 40}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <circle
                cx={(hoveredIndex / (data.length - 1)) * 600}
                cy={
                  (height - 40) -
                  ((activePoint.value - Math.min(...data.map(d => d.value))) /
                    (Math.max(...data.map(d => d.value)) - Math.min(...data.map(d => d.value)) || 1)) *
                    (height - 50) -
                  5
                }
                r="5"
                fill={color}
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};export const OverviewTab: React.FC = () => {
  const { nodes, services, alerts, logs } = useSystemMetrics();

  // Calculate aggregate metrics across all online nodes
  const aggregates = useMemo(() => {
    const onlineNodes = nodes.filter(n => n.status === 'online');
    if (onlineNodes.length === 0) {
      return {
        avgCpu: 0,
        avgMem: 0,
        totalDiskUsed: 0,
        totalDiskTotal: 0,
        diskPercentage: 0,
        totalRxSpeed: 0,
        totalTxSpeed: 0,
        onlineCount: 0,
        totalCount: nodes.length
      };
    }

    let totalCpu = 0;
    let totalMemUsed = 0;
    let totalMemTotal = 0;
    let totalDiskUsed = 0;
    let totalDiskTotal = 0;
    let totalRx = 0;
    let totalTx = 0;

    onlineNodes.forEach(node => {
      totalCpu += node.metrics.cpu.usage;
      totalMemUsed += node.metrics.memory.used;
      totalMemTotal += node.metrics.memory.total;
      
      node.metrics.disks.forEach(d => {
        totalDiskUsed += d.used;
        totalDiskTotal += d.total;
      });

      node.metrics.network.forEach(n => {
        totalRx += n.rxSpeed;
        totalTx += n.txSpeed;
      });
    });

    return {
      avgCpu: totalCpu / onlineNodes.length,
      avgMem: (totalMemUsed / totalMemTotal) * 100,
      totalDiskUsed,
      totalDiskTotal,
      diskPercentage: (totalDiskUsed / totalDiskTotal) * 100,
      totalRxSpeed: totalRx,
      totalTxSpeed: totalTx,
      onlineCount: onlineNodes.length,
      totalCount: nodes.length
    };
  }, [nodes]);

  // Count service statuses
  const serviceStats = useMemo(() => {
    return services.reduce(
      (acc, srv) => {
        acc[srv.status] = (acc[srv.status] || 0) + 1;
        return acc;
      },
      { up: 0, down: 0, degraded: 0, maintenance: 0 } as Record<ServiceStatusType, number>
    );
  }, [services]);

  const activeAlerts = useMemo(() => {
    return alerts.filter(a => !a.resolved);
  }, [alerts]);

  return (
    <div className="space-y-6">
      {/* Cluster Status Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Cluster Nodes</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-slate-100">{aggregates.onlineCount}</span>
              <span className="text-xs text-slate-500">/ {aggregates.totalCount} Online</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className={`p-3 rounded-lg border ${serviceStats.down > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : serviceStats.degraded > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Microservices</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-slate-100">{serviceStats.up}</span>
              <span className="text-xs text-slate-500">/ {services.length} Healthy</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className={`p-3 rounded-lg border ${activeAlerts.length > 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Alerts</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className={`text-xl font-bold ${activeAlerts.length > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
                {activeAlerts.length}
              </span>
              <span className="text-xs text-slate-500">Unresolved</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex items-center gap-4 shadow-lg">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Avg Latency</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-bold text-slate-100">
                {(services.reduce((acc, s) => acc + s.latency, 0) / (services.length || 1)).toFixed(1)}
              </span>
              <span className="text-xs text-slate-500">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CPU Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cluster CPU Load</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">
              {aggregates.avgCpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${aggregates.avgCpu}%` }}
            />
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cluster Memory</span>
            <Database className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">
              {aggregates.avgMem.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${aggregates.avgMem}%` }}
            />
          </div>
        </div>

        {/* Disk Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cluster Storage</span>
            <HardDrive className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5 mb-2">
            <span className="text-3xl font-bold text-slate-100 tracking-tight">
              {aggregates.diskPercentage.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-500">
              {MetricFormatter.formatBytes(aggregates.totalDiskUsed, 0)} / {MetricFormatter.formatBytes(aggregates.totalDiskTotal, 0)}
            </span>
          </div>
          <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${aggregates.diskPercentage}%` }}
            />
          </div>
        </div>

        {/* Network Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Network Throughput</span>
            <Network className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">RX (Inbound)</span>
              <span className="font-mono font-semibold text-emerald-400">
                {MetricFormatter.formatBitsSpeed(aggregates.totalRxSpeed)}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">TX (Outbound)</span>
              <span className="font-mono font-semibold text-blue-400">
                {MetricFormatter.formatBitsSpeed(aggregates.totalTxSpeed)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Alerts & Logs Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Alerts Panel */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Active Security & System Alerts</h3>
            </div>
            <span className="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-full font-semibold">
              {activeAlerts.length} Active
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
            {activeAlerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-2">
                <CheckCircle className="w-8 h-8 text-emerald-500/80" />
                <span className="text-sm">All systems operational. No active alerts.</span>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border flex items-start gap-3 transition-all ${
                    alert.severity === 'fatal' || alert.severity === 'critical'
                      ? 'bg-rose-950/20 border-rose-900/50 text-rose-200'
                      : 'bg-amber-950/20 border-amber-900/50 text-amber-200'
                  }`}
                >
                  <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${alert.severity === 'fatal' || alert.severity === 'critical' ? 'text-rose-400' : 'text-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider">{alert.source}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {MetricFormatter.formatShortDate(alert.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs mt-1 text-slate-300 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] font-mono text-slate-400">
                      <span>Value: <strong className="text-slate-200">{alert.value}</strong></span>
                      <span>Threshold: <strong className="text-slate-200">{alert.threshold}</strong></span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Real-time Log Stream Panel */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg flex flex-col h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Real-time Telemetry Stream</h3>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] font-mono text-slate-400 uppercase">Live Connection</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-xs space-y-2 pr-1 custom-scrollbar bg-slate-950/50 p-3 rounded-lg border border-slate-900">
            {logs.slice(0, 50).map(log => (
              <div key={log.id} className="flex items-start gap-2 hover:bg-slate-900/40 p-1 rounded transition-colors">
                <span className="text-slate-600 shrink-0 select-none">
                  [{MetricFormatter.formatShortDate(log.timestamp)}]
                </span>
                <span className={`font-bold shrink-0 select-none uppercase ${
                  log.level === 'critical' ? 'text-rose-500' : log.level === 'error' ? 'text-rose-400' : log.level === 'warn' ? 'text-amber-400' : 'text-blue-400'
                }`}>
                  {log.level.padEnd(4)}
                </span>
                <span className="text-slate-400 shrink-0 select-none">
                  [{log.service}]
                </span>
                <span className="text-slate-300 break-all">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const NodesTab: React.FC = () => {
  const { nodes, selectedNodeId, setSelectedNodeId, history } = useSystemMetrics();

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  if (!selectedNode) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-slate-500">No cluster nodes configured.</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Node Selector Sidebar */}
      <div className="lg:col-span-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cluster Topology</h3>
        <div className="space-y-2">
          {nodes.map(node => {
            const isSelected = node.id === selectedNodeId;
            const cpuUsage = node.metrics.cpu.usage;
            const memUsage = node.metrics.memory.percentage;

            return (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-3 ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2.5">
                    <Server className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="font-bold text-sm text-slate-200 truncate max-w-[180px]">
                      {node.name}
                    </span>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${node.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>CPU</span>
                      <span className="font-mono font-semibold text-slate-300">{cpuUsage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cpuUsage > 85 ? 'bg-rose-500' : cpuUsage > 60 ? 'bg-amber-500' : 'bg-blue-500'}`}
                        style={{ width: `${cpuUsage}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>RAM</span>
                      <span className="font-mono font-semibold text-slate-300">{memUsage.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${memUsage > 85 ? 'bg-rose-500' : memUsage > 60 ? 'bg-amber-500' : 'bg-purple-500'}`}
                        style={{ width: `${memUsage}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-2 mt-1">
                  <span>Region: <strong className="text-slate-400">{node.region}</strong></span>
                  <span>Uptime: <strong className="text-slate-400">{MetricFormatter.formatUptime(node.uptime)}</strong></span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Details Panel */}
      <div className="lg:col-span-8 space-y-6">
        {/* Node Specs Header */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">{selectedNode.name}</h2>
                <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-mono">
                  {selectedNode.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Hardware specifications and real-time kernel telemetry</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">Uptime:</span>
              <span className="text-slate-200 font-semibold">{MetricFormatter.formatUptime(selectedNode.uptime)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Processor</span>
              <span className="text-slate-200 font-medium truncate" title={selectedNode.specs.cpuModel}>
                {selectedNode.specs.cpuModel}
              </span>
              <span className="text-slate-500 font-mono">
                {selectedNode.specs.cpuCores} Cores / {selectedNode.specs.cpuThreads} Threads
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Physical Memory</span>
              <span className="text-slate-200 font-medium">
                {MetricFormatter.formatBytes(selectedNode.specs.totalMemory)}
              </span>
              <span className="text-slate-500 font-mono">ECC Registered DDR5</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Operating System</span>
              <span className="text-slate-200 font-medium">{selectedNode.specs.os}</span>
              <span className="text-slate-500 font-mono truncate" title={selectedNode.specs.kernel}>
                {selectedNode.specs.kernel}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">Architecture</span>
              <span className="text-slate-200 font-medium">{selectedNode.specs.architecture}</span>
              <span className="text-slate-500 font-mono">Virtualization: KVM</span>
            </div>
          </div>
        </div>

        {/* CPU Core Grid */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Logical Core Utilization</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-400">Load: {selectedNode.metrics.cpu.usage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="text-slate-400">Temp: {selectedNode.metrics.cpu.temperature.toFixed(1)}°C</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {selectedNode.metrics.cpu.cores.map((coreVal, idx) => (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800/50 rounded p-2 flex flex-col gap-1 relative overflow-hidden"
              >
                <div className="flex justify-between text-[9px] font-mono text-slate-500 z-10">
                  <span>C{idx}</span>
                  <span className="font-semibold text-slate-300">{coreVal.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden z-10">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      coreVal > 85 ? 'bg-rose-500' : coreVal > 60 ? 'bg-amber-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${coreVal}%` }}
                  />
                </div>
                {/* Subtle background fill based on core load */}
                <div
                  className={`absolute inset-0 opacity-[0.03] transition-all duration-300 ${
                    coreVal > 85 ? 'bg-rose-500' : coreVal > 60 ? 'bg-amber-500' : 'bg-blue-500'
                  }`}
                  style={{ height: `${coreVal}%`, top: 'auto', bottom: 0 }}
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-900 text-xs font-mono">
            <div className="flex justify-between p-2 bg-slate-900/40 rounded border border-slate-900">
              <span className="text-slate-500">Load Average (1m)</span>
              <span className="text-slate-300 font-bold">{selectedNode.metrics.cpu.loadAverage[0]}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900/40 rounded border border-slate-900">
              <span className="text-slate-500">Load Average (5m)</span>
              <span className="text-slate-300 font-bold">{selectedNode.metrics.cpu.loadAverage[1]}</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900/40 rounded border border-slate-900">
              <span className="text-slate-500">Load Average (15m)</span>
              <span className="text-slate-300 font-bold">{selectedNode.metrics.cpu.loadAverage[2]}</span>
            </div>
          </div>
        </div>

        {/* Memory Breakdown */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800/50 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Memory Allocation Breakdown</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {MetricFormatter.formatBytes(selectedNode.metrics.memory.used)} / {MetricFormatter.formatBytes(selectedNode.metrics.memory.total)} ({selectedNode.metrics.memory.percentage.toFixed(1)}%)
            </span>
          </div>

          {/* Stacked Progress Bar */}
          <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden flex mb-6">
            <div
              className="bg-purple-500 h-full transition-all duration-500"
              style={{ width: `${selectedNode.metrics.memory.percentage * 0.7}%` }}
              title="Used Memory"
            />
            <div
              className="bg-indigo-500 h-full transition-all duration-500"
              style={{ width: `${(selectedNode.metrics.memory.cached / selectedNode.metrics.memory.total) * 100}%` }}
              title="Cached"
            />
            <div
              className="bg-blue-500 h-full transition-all duration-500"
              style={{ width: `${(selectedNode.metrics.memory.buffers / selectedNode.metrics.memory.total) * 100}%` }}
              title="Buffers"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span className="text-slate-500">Active Used</span>
              </div>
              <span className="text-slate-200 font-bold">
                {MetricFormatter.formatBytes(selectedNode.metrics.memory.used)}
              </span>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-slate-500">Page Cache</span>
              </div>
              <span className="text-slate-200 font-bold">
                {MetricFormatter.formatBytes(selectedNode.metrics.memory.cached)}
              </span>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-slate-500">Buffers</span>
              </div>
              <span className="text-slate-200 font-bold">
                {MetricFormatter.formatBytes(selectedNode.metrics.memory.buffers)}
              </span>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-700" />
                <span className="text-slate-500">Free Available</span>
              </div>
              <span className="text-slate-200 font-bold">
                {MetricFormatter.formatBytes(selectedNode.metrics.memory.available)}
              </span>
            </div>
          </div>
        </div>

        {/* Storage Partitions */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3 mb-4">
            <HardDrive className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Storage Partitions & Disk I/O</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono">
                  <th className="pb-2 font-semibold">Mount Point</th>
                  <th className="pb-2 font-semibold">Device</th>
                  <th className="pb-2 font-semibold">File System</th>
                  <th className="pb-2 font-semibold">Capacity</th>
                  <th className="pb-2 font-semibold">Used</th>
                  <th className="pb-2 font-semibold">Usage %</th>
                  <th className="pb-2 font-semibold text-right">Read/Write Speed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono">
                {selectedNode.metrics.disks.map((disk, idx) => (
                  <tr key={idx} className="text-slate-300 hover:bg-slate-900/20">
                    <td className="py-3 font-semibold text-slate-200">{disk.mountPoint}</td>
                    <td className="py-3 text-slate-400">{disk.device}</td>
                    <td className="py-3 text-slate-500">{disk.fileSystem}</td>
                    <td className="py-3">{MetricFormatter.formatBytes(disk.total)}</td>
                    <td className="py-3">{MetricFormatter.formatBytes(disk.used)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${disk.percentage > 85 ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${disk.percentage}%` }}
                          />
                        </div>
                        <span>{disk.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex flex-col items-end">
                        <span className="text-emerald-400">R: {MetricFormatter.formatSpeed(disk.readSpeed)}</span>
                        <span className="text-blue-400">W: {MetricFormatter.formatSpeed(disk.writeSpeed)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Network Interfaces */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3 mb-4">
            <Network className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Network Interfaces & Latency</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-500 font-mono">
                  <th className="pb-2 font-semibold">Interface</th>
                  <th className="pb-2 font-semibold">IP Address</th>
                  <th className="pb-2 font-semibold">MAC Address</th>
                  <th className="pb-2 font-semibold">Rx Speed</th>
                  <th className="pb-2 font-semibold">Tx Speed</th>
                  <th className="pb-2 font-semibold">Packet Loss</th>
                  <th className="pb-2 font-semibold text-right">Gateway Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 font-mono">
                {selectedNode.metrics.network.map((net, idx) => (
                  <tr key={idx} className="text-slate-300 hover:bg-slate-900/20">
                    <td className="py-3 font-semibold text-slate-200">{net.name}</td>
                    <td className="py-3 text-slate-400">{net.ipAddress}</td>
                    <td className="py-3 text-slate-500">{net.macAddress}</td>
                    <td className="py-3 text-emerald-400">{MetricFormatter.formatBitsSpeed(net.rxSpeed)}</td>
                    <td className="py-3 text-blue-400">{MetricFormatter.formatBitsSpeed(net.txSpeed)}</td>
                    <td className="py-3">
                      <span className={net.packetLoss > 0 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                        {net.packetLoss.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-200">{net.latency.toFixed(1)} ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};export const ServicesTab: React.FC = () => {
  const {
    services,
    selectedServiceId,
    setSelectedServiceId,
    simulationConfig,
    updateSimulationConfig
  } = useSystemMetrics();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ServiceStatusType>('all');

  // Auto-select first service if none selected
  useEffect(() => {
    if (!selectedServiceId && services.length > 0) {
      setSelectedServiceId(services[0].id);
    }
  }, [services, selectedServiceId, setSelectedServiceId]);

  const filteredServices = useMemo(() => {
    return services.filter(srv => {
      const matchesSearch = srv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            srv.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || srv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [services, searchTerm, statusFilter]);

  const selectedService = useMemo(() => {
    return services.find(s => s.id === selectedServiceId) || services[0];
  }, [services, selectedServiceId]);

  const handleToggleOutage = useCallback((serviceId: string) => {
    if (simulationConfig.serviceOutageId === serviceId) {
      updateSimulationConfig({ serviceOutageId: null });
    } else {
      updateSimulationConfig({ serviceOutageId: serviceId });
    }
  }, [simulationConfig.serviceOutageId, updateSimulationConfig]);

  if (!selectedService) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-slate-500">No microservices configured.</span>
      </div>
    );
  }

  // Calculate error rate
  const errorRate = selectedService.requestCount > 0
    ? (selectedService.errorCount / selectedService.requestCount) * 100
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Service List & Filters */}
      <div className="lg:col-span-5 space-y-4 flex flex-col h-[calc(100vh-220px)] min-h-[600px]">
        {/* Search and Filter Controls */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3 shadow-lg">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search microservices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {(['all', 'up', 'degraded', 'down'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all shrink-0 ${
                  statusFilter === status
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Service List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 border border-dashed border-slate-800 rounded-xl">
              <Info className="w-6 h-6 mb-2 text-slate-600" />
              <span className="text-xs">No services match the filter criteria.</span>
            </div>
          ) : (
            filteredServices.map((srv) => {
              const isSelected = srv.id === selectedServiceId;
              const srvErrorRate = srv.requestCount > 0 ? (srv.errorCount / srv.requestCount) * 100 : 0;

              return (
                <button
                  key={srv.id}
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      srv.status === 'up'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : srv.status === 'degraded'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      <Activity className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-200 truncate max-w-[160px]">
                          {srv.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 shrink-0">
                          {srv.version}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[10px] font-mono text-slate-500">
                        <span>Reqs: <strong className="text-slate-400">{srv.requestCount.toLocaleString()}</strong></span>
                        <span>Errors: <strong className={srv.errorCount > 0 ? 'text-rose-400' : 'text-slate-400'}>{srv.errorCount}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full ${
                      srv.status === 'up'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : srv.status === 'degraded'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {srv.status}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {srv.latency.toFixed(1)} ms
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Service Inspector */}
      <div className="lg:col-span-7 space-y-6">
        {/* Service Header & Control Actions */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/50 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100">{selectedService.name}</h2>
                <span className="text-xs bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full font-mono">
                  {selectedService.id}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Real-time microservice telemetry and dependency mapping</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleToggleOutage(selectedService.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  simulationConfig.serviceOutageId === selectedService.id
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                }`}
              >
                {simulationConfig.serviceOutageId === selectedService.id ? (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    <span>Restore Service</span>
                  </>
                ) : (
                  <>
                    <Skull className="w-3.5 h-3.5" />
                    <span>Simulate Outage</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Service Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <span className="text-slate-500 block mb-1">Uptime</span>
              <span className="text-slate-200 font-bold">
                {MetricFormatter.formatUptime(selectedService.uptime)}
              </span>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <span className="text-slate-500 block mb-1">Avg Latency</span>
              <span className="text-slate-200 font-bold">
                {selectedService.latency.toFixed(1)} ms
              </span>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <span className="text-slate-500 block mb-1">Total Requests</span>
              <span className="text-slate-200 font-bold">
                {selectedService.requestCount.toLocaleString()}
              </span>
            </div>

            <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-900">
              <span className="text-slate-500 block mb-1">Error Rate</span>
              <span className={`font-bold ${errorRate > 5 ? 'text-rose-400' : errorRate > 1 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {errorRate.toFixed(4)}%
              </span>
            </div>
          </div>
        </div>

        {/* Resource Footprint */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3 mb-4">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Resource Footprint</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-500">CPU Allocation</span>
                <span className="text-slate-300 font-bold">{selectedService.cpuUsage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, selectedService.cpuUsage * 5)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono mb-1.5">
                <span className="text-slate-500">Memory Footprint</span>
                <span className="text-slate-300 font-bold">{MetricFormatter.formatBytes(selectedService.memoryUsage)}</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (selectedService.memoryUsage / (1024 * 1024 * 1024)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Dependency Graph Visualization */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3 mb-4">
            <Network className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Dependency Mapping</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Upstream Dependencies */}
            <div className="flex flex-col gap-2 w-full sm:w-1/3">
              <span className="text-[10px] font-mono text-slate-500 uppercase text-center mb-1">Upstream Dependencies</span>
              {selectedService.dependencies.length === 0 ? (
                <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg text-center text-xs text-slate-500 font-mono">
                  None (Core Layer)
                </div>
              ) : (
                selectedService.dependencies.map(depId => {
                  const depSrv = services.find(s => s.id === depId);
                  return (
                    <div
                      key={depId}
                      className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                        depSrv?.status === 'down'
                          ? 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                          : depSrv?.status === 'degraded'
                          ? 'bg-amber-950/20 border-amber-900/50 text-amber-300'
                          : 'bg-slate-900/50 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="truncate">{depSrv?.name || depId}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0 ml-2" />
                    </div>
                  );
                })
              )}
            </div>

            {/* Connection Arrow */}
            <div className="hidden sm:flex flex-col items-center justify-center text-slate-600">
              <span className="text-xs font-mono">➔</span>
            </div>

            {/* Current Service Node */}
            <div className="w-full sm:w-1/3">
              <span className="text-[10px] font-mono text-slate-500 uppercase text-center mb-2 block">Target Node</span>
              <div className={`p-4 rounded-xl border text-center shadow-md ${
                selectedService.status === 'up'
                  ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-400'
                  : selectedService.status === 'degraded'
                  ? 'bg-amber-950/10 border-amber-500/30 text-amber-400'
                  : 'bg-rose-950/10 border-rose-500/30 text-rose-400'
              }`}>
                <span className="font-bold text-xs block truncate">{selectedService.name}</span>
                <span className="text-[10px] font-mono opacity-80 mt-1 block uppercase">{selectedService.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Health Check Diagnostics */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-2 border-b border-slate-800/50 pb-3 mb-4">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Active Health Checks</h3>
          </div>

          <div className="space-y-3">
            {selectedService.healthChecks.map((hc, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-900/40 border border-slate-900 rounded-lg flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-2.5">
                  {hc.status === 'healthy' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : hc.status === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">{hc.name}</span>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{hc.message}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 font-mono text-[10px] text-slate-500">
                  <span className="text-slate-300 font-semibold">{hc.latencyMs.toFixed(2)} ms</span>
                  <span className="mt-1">Checked: {MetricFormatter.formatShortDate(hc.lastChecked)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProcessesTab: React.FC = () => {
  const { processes, selectedNodeId, nodes } = useSystemMetrics();

  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'pid' | 'name' | 'cpuUsage' | 'memoryUsage' | 'uptime'>('cpuUsage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [userFilter, setUserFilter] = useState<string>('all');

  const selectedNode = useMemo(() => {
    return nodes.find(n => n.id === selectedNodeId) || nodes[0];
  }, [nodes, selectedNodeId]);

  // Extract unique users for filtering
  const uniqueUsers = useMemo(() => {
    const users = new Set<string>();
    processes.forEach(p => users.add(p.user));
    return ['all', ...Array.from(users)];
  }, [processes]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedAndFilteredProcesses = useMemo(() => {
    return processes
      .filter(proc => {
        const matchesSearch = proc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              proc.pid.toString().includes(searchTerm) ||
                              proc.command.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesUser = userFilter === 'all' || proc.user === userFilter;
        return matchesSearch && matchesUser;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          valA = (valA as string).toLowerCase();
          valB = (valB as string).toLowerCase();
        }

        if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [processes, searchTerm, sortField, sortDirection, userFilter]);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search processes (PID, name, cmd)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative shrink-0">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              {uniqueUsers.map(user => (
                <option key={user} value={user}>
                  User: {user}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="text-xs font-mono text-slate-500 flex items-center gap-2">
          <span>Target Node:</span>
          <strong className="text-slate-300">{selectedNode?.name || selectedNodeId}</strong>
          <span className="text-slate-700">|</span>
          <span>Active Tasks:</span>
          <strong className="text-slate-300">{sortedAndFilteredProcesses.length}</strong>
        </div>
      </div>

      {/* Process Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-500 font-mono select-none">
                <th className="p-4 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('pid')}>
                  <div className="flex items-center gap-1">
                    <span>PID</span>
                    {sortField === 'pid' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-4 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    <span>Process Name</span>
                    {sortField === 'name' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-4 font-semibold">User</th>
                <th className="p-4 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('cpuUsage')}>
                  <div className="flex items-center gap-1">
                    <span>CPU %</span>
                    {sortField === 'cpuUsage' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-4 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('memoryUsage')}>
                  <div className="flex items-center gap-1">
                    <span>Memory %</span>
                    {sortField === 'memoryUsage' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-4 font-semibold">Memory Bytes</th>
                <th className="p-4 font-semibold">Disk Read/Write</th>
                <th className="p-4 font-semibold cursor-pointer hover:text-slate-300" onClick={() => handleSort('uptime')}>
                  <div className="flex items-center gap-1">
                    <span>Uptime</span>
                    {sortField === 'uptime' && (sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </div>
                </th>
                <th className="p-4 font-semibold text-right">Command</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 font-mono">
              {sortedAndFilteredProcesses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    No active processes match the search criteria.
                  </td>
                </tr>
              ) : (
                sortedAndFilteredProcesses.map((proc) => (
                  <tr key={proc.pid} className="text-slate-300 hover:bg-slate-900/20 transition-colors">
                    <td className="p-4 font-semibold text-slate-400">{proc.pid}</td>
                    <td className="p-4 font-bold text-slate-200">{proc.name}</td>
                    <td className="p-4 text-slate-400">{proc.user}</td>
                    <td className="p-4">
                      <span className={`font-bold ${proc.cpuUsage > 50 ? 'text-rose-400' : proc.cpuUsage > 20 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {proc.cpuUsage.toFixed(1)}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-300">{proc.memoryUsage.toFixed(1)}%</td>
                    <td className="p-4 text-slate-400">{MetricFormatter.formatBytes(proc.memoryBytes)}</td>
                    <td className="p-4">
                      <div className="flex flex-col text-[10px]">
                        <span className="text-emerald-400">R: {MetricFormatter.formatSpeed(proc.diskReadBytes)}</span>
                        <span className="text-blue-400">W: {MetricFormatter.formatSpeed(proc.diskWriteBytes)}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">{MetricFormatter.formatUptime(proc.uptime)}</td>
                    <td className="p-4 text-right text-slate-500 max-w-xs truncate" title={proc.command}>
                      {proc.command}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};export const DiagnosticsTab: React.FC = () => {
  const { diagnosticTools, runDiagnostic } = useSystemMetrics();
  const [selectedToolId, setSelectedToolId] = useState<string>(diagnosticTools[0]?.id || '');
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  const selectedTool = useMemo(() => {
    return diagnosticTools.find(t => t.id === selectedToolId) || diagnosticTools[0];
  }, [diagnosticTools, selectedToolId]);

  // Auto-scroll terminal to bottom when output updates
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTool?.output]);

  const getCategoryColor = (category: DiagnosticTool['category']) => {
    switch (category) {
      case 'network': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'database': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'security': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'system': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Diagnostics Sidebar */}
      <div className="lg:col-span-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Diagnostic Suite</h3>
        <div className="space-y-2">
          {diagnosticTools.map(tool => {
            const isSelected = tool.id === selectedToolId;
            const isRunning = tool.status === 'running';

            return (
              <button
                key={tool.id}
                onClick={() => setSelectedToolId(tool.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-slate-900 border-blue-500/50 shadow-lg shadow-blue-500/5'
                    : 'bg-slate-950 border-slate-800/80 hover:border-slate-700/80'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${getCategoryColor(tool.category)}`}>
                    {tool.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {tool.status === 'running' && (
                      <RefreshCw className="w-3 h-3 text-blue-400 animate-spin" />
                    )}
                    <span className={`text-[10px] font-mono font-bold uppercase ${
                      tool.status === 'success'
                        ? 'text-emerald-400'
                        : tool.status === 'failed'
                        ? 'text-rose-400'
                        : isRunning
                        ? 'text-blue-400'
                        : 'text-slate-500'
                    }`}>
                      {tool.status}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-slate-200">{tool.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{tool.description}</p>
                </div>

                {tool.lastRun && (
                  <div className="text-[10px] font-mono text-slate-500 border-t border-slate-900 pt-2 mt-1">
                    Last Run: <strong>{MetricFormatter.formatShortDate(tool.lastRun)}</strong>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Terminal Console */}
      <div className="lg:col-span-8 flex flex-col h-[calc(100vh-220px)] min-h-[500px] bg-slate-950 border border-slate-800/80 rounded-xl overflow-hidden shadow-2xl">
        {/* Console Header */}
        <div className="bg-slate-900/80 border-b border-slate-800/80 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Diagnostic Console</span>
            {selectedTool && (
              <span className="text-xs text-slate-500 font-mono">/ {selectedTool.id}</span>
            )}
          </div>

          {selectedTool && (
            <button
              onClick={() => runDiagnostic(selectedTool.id)}
              disabled={selectedTool.status === 'running'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                selectedTool.status === 'running'
                  ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{selectedTool.status === 'running' ? 'Executing...' : 'Run Diagnostic'}</span>
            </button>
          )}
        </div>

        {/* Terminal Screen */}
        <div className="flex-1 bg-slate-950 p-5 font-mono text-xs overflow-y-auto space-y-1.5 custom-scrollbar select-text selection:bg-blue-500/30">
          {!selectedTool?.output || selectedTool.output.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
              <Terminal className="w-8 h-8 text-slate-700" />
              <span>Select a diagnostic tool and click "Run Diagnostic" to begin.</span>
            </div>
          ) : (
            <>
              {selectedTool.output.map((line, idx) => {
                let textClass = 'text-slate-300';
                if (line.includes('[ERROR]')) textClass = 'text-rose-400 font-semibold';
                if (line.includes('[FATAL]')) textClass = 'text-rose-500 font-bold bg-rose-950/20 px-1 rounded';
                if (line.includes('[INFO]')) textClass = 'text-slate-400';
                if (line.includes('Speed:') || line.includes('latency:')) textClass = 'text-emerald-400';

                return (
                  <div key={idx} className={`leading-relaxed break-all ${textClass}`}>
                    {line}
                  </div>
                );
              })}
              {selectedTool.status === 'running' && (
                <div className="flex items-center gap-2 text-blue-400 font-semibold animate-pulse mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  <span>Executing diagnostic routine...</span>
                </div>
              )}
              <div ref={terminalEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const AlertsTab: React.FC = () => {
  const { alerts, acknowledgeAlert, resolveAlert, clearAllAlerts } = useSystemMetrics();
  const [severityFilter, setSeverityFilter] = useState<'all' | SeverityLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate Alert Stats
  const stats = useMemo(() => {
    return alerts.reduce(
      (acc, alert) => {
        acc.total++;
        if (alert.resolved) {
          acc.resolved++;
        } else {
          acc.active++;
          if (alert.severity === 'fatal' || alert.severity === 'critical') {
            acc.critical++;
          } else {
            acc.warning++;
          }
        }
        return acc;
      },
      { total: 0, active: 0, resolved: 0, critical: 0, warning: 0 }
    );
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && !alert.resolved) ||
        (statusFilter === 'resolved' && alert.resolved);
      const matchesSearch =
        alert.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.nodeId.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSeverity && matchesStatus && matchesSearch;
    });
  }, [alerts, severityFilter, statusFilter, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Active Alerts</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-bold ${stats.active > 0 ? 'text-rose-400' : 'text-slate-100'}`}>
              {stats.active}
            </span>
            <span className="text-xs text-slate-500">Unresolved</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Critical / Fatal</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-bold ${stats.critical > 0 ? 'text-rose-500' : 'text-slate-100'}`}>
              {stats.critical}
            </span>
            <span className="text-xs text-slate-500">High Priority</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Warnings</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className={`text-2xl font-bold ${stats.warning > 0 ? 'text-amber-400' : 'text-slate-100'}`}>
              {stats.warning}
            </span>
            <span className="text-xs text-slate-500">Medium Priority</span>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 shadow-lg">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Resolved Alerts</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-2xl font-bold text-emerald-400">{stats.resolved}</span>
            <span className="text-xs text-slate-500">Total Cleared</span>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-initial md:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-1">
            {(['active', 'resolved', 'all'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  statusFilter === status
                    ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="flex gap-1">
            {(['all', 'fatal', 'critical', 'warning', 'info'] as const).map(sev => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all ${
                  severityFilter === sev
                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                    : 'bg-slate-900/50 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={clearAllAlerts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-slate-950 border border-slate-800/80 rounded-xl text-slate-500 gap-2">
            <CheckCircle className="w-8 h-8 text-emerald-500/80" />
            <span className="text-sm">No alerts match the current filter criteria.</span>
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'fatal' || alert.severity === 'critical';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  alert.resolved
                    ? 'bg-slate-950/40 border-slate-900 text-slate-400'
                    : isCritical
                    ? 'bg-rose-950/10 border-rose-900/50 text-rose-200 shadow-lg shadow-rose-950/5'
                    : 'bg-amber-950/10 border-amber-900/50 text-amber-200 shadow-lg shadow-amber-950/5'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="shrink-0 mt-0.5">
                    {alert.resolved ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : isCritical ? (
                      <AlertCircle className="w-5 h-5 text-rose-400 animate-pulse" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                        alert.resolved
                          ? 'bg-slate-900 text-slate-500 border border-slate-800'
                          : isCritical
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="font-bold text-sm text-slate-200">{alert.source}</span>
                      <span className="text-xs text-slate-500 font-mono">({alert.nodeId})</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{alert.message}</p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-[10px] font-mono text-slate-500">
                      <span>Value: <strong className="text-slate-300">{alert.value}</strong></span>
                      <span>Threshold: <strong className="text-slate-300">{alert.threshold}</strong></span>
                      <span>Triggered: <strong className="text-slate-400">{MetricFormatter.formatShortDate(alert.timestamp)}</strong></span>
                      {alert.resolvedAt && (
                        <span>Resolved: <strong className="text-emerald-400">{MetricFormatter.formatShortDate(alert.resolvedAt)}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {!alert.resolved && (
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => resolveAlert(alert.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};export const LogsTab: React.FC = () => {
  const { logs, services, nodes } = useSystemMetrics();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<'all' | 'info' | 'warn' | 'error' | 'critical'>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [nodeFilter, setNodeFilter] = useState<string>('all');
  const [limit, setLimit] = useState<number>(100);

  const filteredLogs = useMemo(() => {
    return logs
      .filter(log => {
        const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              log.service.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
        const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
        const matchesNode = nodeFilter === 'all' || log.nodeId === nodeFilter;

        return matchesSearch && matchesLevel && matchesService && matchesNode;
      })
      .slice(0, limit);
  }, [logs, searchTerm, levelFilter, serviceFilter, nodeFilter, limit]);

  const handleExportLogs = () => {
    const logString = filteredLogs
      .map(log => `[${new Date(log.timestamp).toISOString()}] [${log.level.toUpperCase()}] [${log.service}] [${log.nodeId}]: ${log.message}`)
      .join('\n');
    
    const blob = new Blob([logString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `system-telemetry-logs-${Date.now()}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Controls Panel */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-lg">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 min-w-[200px] lg:flex-initial lg:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search log messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Level Filter */}
          <div className="relative shrink-0">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as any)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="info">INFO</option>
              <option value="warn">WARN</option>
              <option value="error">ERROR</option>
              <option value="critical">CRITICAL</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Service Filter */}
          <div className="relative shrink-0">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer max-w-[150px]"
            >
              <option value="all">All Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Node Filter */}
          <div className="relative shrink-0">
            <select
              value={nodeFilter}
              onChange={(e) => setNodeFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Nodes</option>
              {nodes.map(n => (
                <option key={n.id} value={n.id}>{n.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>

          {/* Limit Filter */}
          <div className="relative shrink-0">
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-8 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value={50}>Show 50</option>
              <option value={100}>Show 100</option>
              <option value={250}>Show 250</option>
              <option value={500}>Show 500</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleExportLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all shrink-0 w-full lg:w-auto justify-center"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Logs</span>
        </button>
      </div>

      {/* Log Console Output */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[600px]">
        <div className="bg-slate-900/50 border-b border-slate-800/80 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Structured Log Stream</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            Showing {filteredLogs.length} of {logs.length} entries
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-5 font-mono text-xs space-y-2.5 custom-scrollbar bg-slate-950/40">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-2">
              <Info className="w-8 h-8 text-slate-700" />
              <span>No log entries match the selected filters.</span>
            </div>
          ) : (
            filteredLogs.map(log => {
              let levelClass = 'text-blue-400';
              let bgClass = 'hover:bg-slate-900/20';
              
              if (log.level === 'critical') {
                levelClass = 'text-rose-500 font-bold';
                bgClass = 'bg-rose-950/10 border-l-2 border-rose-500 hover:bg-rose-950/20';
              } else if (log.level === 'error') {
                levelClass = 'text-rose-400 font-semibold';
                bgClass = 'bg-rose-950/5 border-l border-rose-500/50 hover:bg-rose-950/10';
              } else if (log.level === 'warn') {
                levelClass = 'text-amber-400';
                bgClass = 'bg-amber-950/5 border-l border-amber-500/30 hover:bg-amber-950/10';
              }

              return (
                <div
                  key={log.id}
                  className={`p-2 rounded transition-all flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border border-transparent ${bgClass}`}
                >
                  <div className="flex items-center gap-2 shrink-0 select-none text-slate-500 text-[10px] sm:w-44">
                    <span>[{new Date(log.timestamp).toISOString()}]</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 select-none sm:w-24">
                    <span className={`uppercase font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800/50 ${levelClass}`}>
                      {log.level}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 select-none text-slate-400 text-[10px] sm:w-36 truncate">
                    <span className="text-slate-600">srv:</span>
                    <span className="font-semibold text-slate-300">{log.service}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 select-none text-slate-400 text-[10px] sm:w-28 truncate">
                    <span className="text-slate-600">node:</span>
                    <span className="text-slate-400">{log.nodeId}</span>
                  </div>

                  <div className="text-slate-200 break-all flex-1 leading-relaxed">
                    {log.message}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export const SimulationTab: React.FC = () => {
  const { simulationConfig, updateSimulationConfig, services } = useSystemMetrics();

  const handlePreset = (preset: 'normal' | 'heavy-load' | 'leak' | 'network-spike' | 'chaos') => {
    switch (preset) {
      case 'normal':
        updateSimulationConfig({
          cpuLoadMultiplier: 1.0,
          memoryLeakRate: 0,
          networkLatencySpike: 0,
          diskFillRate: 0,
          serviceOutageId: null,
          packetLossRate: 0.0
        });
        break;
      case 'heavy-load':
        updateSimulationConfig({
          cpuLoadMultiplier: 3.5,
          memoryLeakRate: 0,
          networkLatencySpike: 45,
          diskFillRate: 1024 * 1024 * 5, // 5MB/s
          serviceOutageId: null,
          packetLossRate: 0.5
        });
        break;
      case 'leak':
        updateSimulationConfig({
          cpuLoadMultiplier: 1.2,
          memoryLeakRate: 1024 * 1024 * 128, // 128MB/s leak
          networkLatencySpike: 10,
          diskFillRate: 0,
          serviceOutageId: null,
          packetLossRate: 0.0
        });
        break;
      case 'network-spike':
        updateSimulationConfig({
          cpuLoadMultiplier: 1.5,
          memoryLeakRate: 0,
          networkLatencySpike: 450, // +450ms latency
          diskFillRate: 0,
          serviceOutageId: null,
          packetLossRate: 8.5 // 8.5% packet loss
        });
        break;
      case 'chaos':
        const randomService = services[Math.floor(Math.random() * services.length)];
        updateSimulationConfig({
          cpuLoadMultiplier: 4.5,
          memoryLeakRate: 1024 * 1024 * 256,
          networkLatencySpike: 800,
          diskFillRate: 1024 * 1024 * 50,
          serviceOutageId: randomService?.id || null,
          packetLossRate: 15.0
        });
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Preset Scenarios */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Simulation Presets</h3>
          
          <div className="space-y-2.5">
            <button
              onClick={() => handlePreset('normal')}
              className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-emerald-400 block">Normal Operations</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Reset all parameters to baseline values.</span>
              </div>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </button>

            <button
              onClick={() => handlePreset('heavy-load')}
              className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-amber-400 block">Black Friday Traffic</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Simulate high concurrent user load and disk writes.</span>
              </div>
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </button>

            <button
              onClick={() => handlePreset('leak')}
              className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-purple-400 block">Severe Memory Leak</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Simulate a rapid heap allocation leak on Node Alpha.</span>
              </div>
              <Database className="w-4 h-4 text-purple-500" />
            </button>

            <button
              onClick={() => handlePreset('network-spike')}
              className="w-full text-left p-3 rounded-lg border border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-blue-400 block">Network Partition</span>
                <span className="text-[10px] text-slate-500 mt-0.5 block">Simulate high latency and packet loss across regions.</span>
              </div>
              <Network className="w-4 h-4 text-blue-500" />
            </button>

            <button
              onClick={() => handlePreset('chaos')}
              className="w-full text-left p-3 rounded-lg border border-rose-900/50 bg-rose-950/10 hover:bg-rose-950/20 transition-all flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-rose-400 block">Chaos Monkey Mode</span>
                <span className="text-[10px] text-rose-500/80 mt-0.5 block">Trigger catastrophic multi-system failure.</span>
              </div>
              <Skull className="w-4 h-4 text-rose-500 animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: Manual Sliders */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-5 shadow-lg">
          <div className="border-b border-slate-800/50 pb-3 mb-5">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Manual Telemetry Injection</h3>
            <p className="text-xs text-slate-500 mt-1">Fine-tune individual system stress parameters in real-time</p>
          </div>

          <div className="space-y-6">
            {/* CPU Load Multiplier */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">CPU Load Multiplier</span>
                <span className="text-blue-400 font-bold">{simulationConfig.cpuLoadMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="5.0"
                step="0.1"
                value={simulationConfig.cpuLoadMultiplier}
                onChange={(e) => updateSimulationConfig({ cpuLoadMultiplier: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>1.0x (Normal)</span>
                <span>3.0x (High Load)</span>
                <span>5.0x (Extreme Stress)</span>
              </div>
            </div>

            {/* Memory Leak Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">Memory Leak Rate</span>
                <span className="text-purple-400 font-bold">
                  {MetricFormatter.formatBytes(simulationConfig.memoryLeakRate)}/s
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={1024 * 1024 * 512} // 512MB/s
                step={1024 * 1024 * 16} // 16MB steps
                value={simulationConfig.memoryLeakRate}
                onChange={(e) => updateSimulationConfig({ memoryLeakRate: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-purple-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0 Bytes/s (Stable)</span>
                <span>256 MB/s</span>
                <span>512 MB/s (Critical Exhaustion)</span>
              </div>
            </div>

            {/* Network Latency Spike */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">Network Latency Injection</span>
                <span className="text-emerald-400 font-bold">+{simulationConfig.networkLatencySpike} ms</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="10"
                value={simulationConfig.networkLatencySpike}
                onChange={(e) => updateSimulationConfig({ networkLatencySpike: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0 ms (Optimal)</span>
                <span>500 ms (Degraded)</span>
                <span>1000 ms (Timeout Threshold)</span>
              </div>
            </div>

            {/* Packet Loss Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">Packet Loss Rate</span>
                <span className="text-rose-400 font-bold">{simulationConfig.packetLossRate.toFixed(1)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="20.0"
                step="0.5"
                value={simulationConfig.packetLossRate}
                onChange={(e) => updateSimulationConfig({ packetLossRate: parseFloat(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-rose-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0.0% (Perfect Link)</span>
                <span>10.0% (Severe Congestion)</span>
                <span>20.0% (Link Failure)</span>
              </div>
            </div>

            {/* Disk Fill Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 font-semibold">Disk Write Fill Rate</span>
                <span className="text-amber-400 font-bold">
                  {MetricFormatter.formatBytes(simulationConfig.diskFillRate)}/s
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={1024 * 1024 * 100} // 100MB/s
                step={1024 * 1024 * 5} // 5MB steps
                value={simulationConfig.diskFillRate}
                onChange={(e) => updateSimulationConfig({ diskFillRate: parseInt(e.target.value) })}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                <span>0 Bytes/s (Idle)</span>
                <span>50 MB/s</span>
                <span>100 MB/s (Heavy I/O Stress)</span>
              </div>
            </div>

            {/* Service Outage Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 font-semibold block">Targeted Service Outage</label>
              <div className="relative">
                <select
                  value={simulationConfig.serviceOutageId || 'none'}
                  onChange={(e) => updateSimulationConfig({ serviceOutageId: e.target.value === 'none' ? null : e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-3 pr-10 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
                >
                  <option value="none">No Active Outage</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};export const SystemMetricsDashboard: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isPaused,
    togglePause,
    tick,
    alerts,
    nodes,
    services,
    clearAllAlerts,
    runDiagnostic,
    diagnosticTools,
    updateSimulationConfig
  } = useSystemMetrics();

  const [showQuickActions, setShowQuickActions] = useState(false);
  const quickActionsRef = useRef<HTMLDivElement | null>(null);

  // Close quick actions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target as Node)) {
        setShowQuickActions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAlertsCount = useMemo(() => {
    return alerts.filter(a => !a.resolved).length;
  }, [alerts]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'nodes':
        return <NodesTab />;
      case 'services':
        return <ServicesTab />;
      case 'processes':
        return <ProcessesTab />;
      case 'diagnostics':
        return <DiagnosticsTab />;
      case 'alerts':
        return <AlertsTab />;
      case 'logs':
        return <LogsTab />;
      case 'simulation':
        return <SimulationTab />;
      default:
        return <OverviewTab />;
    }
  };

  const handleRunAllDiagnostics = useCallback(() => {
    diagnosticTools.forEach(tool => {
      runDiagnostic(tool.id);
    });
    setShowQuickActions(false);
  }, [diagnosticTools, runDiagnostic]);

  const handleTriggerChaosMonkey = useCallback(() => {
    const randomService = services[Math.floor(Math.random() * services.length)];
    updateSimulationConfig({
      cpuLoadMultiplier: 4.8,
      memoryLeakRate: 1024 * 1024 * 256, // 256MB/s
      networkLatencySpike: 750, // +750ms
      diskFillRate: 1024 * 1024 * 40, // 40MB/s
      serviceOutageId: randomService?.id || null,
      packetLossRate: 12.5
    });
    setActiveTab('simulation');
    setShowQuickActions(false);
  }, [services, updateSimulationConfig, setActiveTab]);

  const handleExportSystemState = useCallback(() => {
    const systemState = {
      timestamp: Date.now(),
      engineVersion: '3.0.1-PROD',
      nodes: nodes.map(n => ({
        id: n.id,
        name: n.name,
        status: n.status,
        cpuUsage: n.metrics.cpu.usage,
        memoryUsage: n.metrics.memory.percentage,
        diskUsage: n.metrics.disks[0]?.percentage || 0
      })),
      services: services.map(s => ({
        id: s.id,
        name: s.name,
        status: s.status,
        latency: s.latency,
        errorCount: s.errorCount
      })),
      activeAlerts: alerts.filter(a => !a.resolved)
    };

    const blob = new Blob([JSON.stringify(systemState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `quantum-system-state-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowQuickActions(false);
  }, [nodes, services, alerts]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'nodes', label: 'Nodes', icon: Server },
    { id: 'services', label: 'Services', icon: Cpu },
    { id: 'processes', label: 'Processes', icon: Sliders },
    { id: 'diagnostics', label: 'Diagnostics', icon: Terminal },
    { id: 'alerts', label: 'Alerts', icon: ShieldAlert, badge: activeAlertsCount > 0 ? activeAlertsCount : undefined },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'simulation', label: 'Simulation', icon: Zap }
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 font-sans selection:bg-blue-500/30">
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/60 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100 uppercase">
                Quantum Core <span className="text-blue-500">3.0</span> Telemetry Engine
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Enterprise-grade cluster monitoring, microservice orchestration, and chaos simulation
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Quick Actions Dropdown */}
          <div className="relative" ref={quickActionsRef}>
            <button
              onClick={() => setShowQuickActions(prev => !prev)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Quick Actions</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuickActions ? 'rotate-180' : ''}`} />
            </button>

            {showQuickActions && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  onClick={handleRunAllDiagnostics}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-colors flex items-center gap-2"
                >
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span>Run All Diagnostics</span>
                </button>
                <button
                  onClick={clearAllAlerts}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-colors flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Clear All Alerts</span>
                </button>
                <button
                  onClick={handleExportSystemState}
                  className="w-full text-left px-4 py-2.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-slate-100 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-purple-400" />
                  <span>Export System State</span>
                </button>
                <div className="border-t border-slate-900 my-1.5" />
                <button
                  onClick={handleTriggerChaosMonkey}
                  className="w-full text-left px-4 py-2.5 text-xs text-rose-400 hover:bg-rose-950/20 hover:text-rose-300 transition-colors flex items-center gap-2 font-semibold"
                >
                  <Skull className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>Trigger Chaos Monkey</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-slate-400">Engine Status:</span>
            <span className="text-slate-200 font-bold uppercase">Active</span>
          </div>

          <button
            onClick={togglePause}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              isPaused
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-4 h-4" />
                <span>Resume Telemetry</span>
              </>
            ) : (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause Telemetry</span>
              </>
            )}
          </button>

          <button
            onClick={tick}
            disabled={!isPaused}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
              !isPaused
                ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
            }`}
            title="Manually trigger a telemetry tick (only available when paused)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Manual Tick</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-slate-900 pb-4 mb-6 overflow-x-auto custom-scrollbar">
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 shadow-lg shadow-blue-500/5'
                  : 'bg-slate-950 border-slate-800/50 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 animate-pulse">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="min-h-[500px]">
        {renderTabContent()}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-blue-500" />
          <span>Quantum Core Telemetry Engine v3.0.1-PROD</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Nodes: <strong className="text-slate-400">{nodes.length}</strong></span>
          <span>Services: <strong className="text-slate-400">{services.length}</strong></span>
          <span>System Time: <strong className="text-slate-400">{new Date().toLocaleTimeString()}</strong></span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// TELEMETRY ENGINE ERROR BOUNDARY & ROOT EXPORT
// ============================================================================

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class TelemetryErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Telemetry Engine Error Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center font-sans">
          <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-2xl p-6 shadow-2xl text-center">
            <div className="p-3 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 w-fit mx-auto mb-4">
              <Skull className="w-8 h-8 animate-pulse" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-100">
              Telemetry Engine Crashed
            </h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              A fatal runtime exception occurred within the real-time simulation loop or rendering pipeline.
            </p>
            <div className="mt-4 p-3 bg-slate-950 rounded-lg border border-slate-800 text-left font-mono text-[10px] text-rose-400 overflow-x-auto max-h-40">
              {this.state.error?.stack || this.state.error?.message || "Unknown Error"}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Hot Reload Dashboard</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const SystemMetrics: React.FC = () => {
  return (
    <TelemetryErrorBoundary>
      <SystemMetricsProvider>
        <SystemMetricsDashboard />
      </SystemMetricsProvider>
    </TelemetryErrorBoundary>
  );
};

export default SystemMetrics;