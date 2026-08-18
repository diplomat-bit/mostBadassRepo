// REPOSITORY SOURCE: diplomat-bit/ci-connect-enterprises | PATH: diplomat-bit-ci-connect-enterprises-4cf6219/views/technical/technicalRegistry.ts
================================================================================


export interface ProtocolSpec {
  id: string;
  title: string;
  description: string;
  category: string;
  tier: 'L1' | 'L2' | 'L3' | 'APEX';
  uptime: string;
  latency: string;
  parity: string;
  load: string;
  hardware: string;
  codeSnippet: string;
}

export const TECHNICAL_REGISTRY: Record<string, ProtocolSpec> = {
  // Foundation
  'overview': {
    id: 'LQI-SYS-OVR',
    title: 'System Overview',
    description: 'The root organizational layer of the Lumina Quantum Mesh. Manages collective parity across all distributed nodes.',
    category: 'FOUNDATION',
    tier: 'APEX',
    uptime: '99.999%',
    latency: '0.0001ms',
    parity: '100%',
    load: '14.2%',
    hardware: 'Lumina Quantum Cluster v6',
    codeSnippet: 'Lumina.initialize({ core: ROOT_NODE, sync: GLOBAL })'
  },
  'nodes': {
    id: 'LQI-NOD-REG',
    title: 'Sovereign Nodes',
    description: 'Self-contained vault architecture performing real-time zero-knowledge proofs for network integrity.',
    category: 'FOUNDATION',
    tier: 'L1',
    uptime: '100%',
    latency: '0.0004ms',
    parity: '99.99%',
    load: '8.1%',
    hardware: 'Bare Metal Obsidian Nodes',
    codeSnippet: 'Node.handshake(ZKP_SIGNATURE, { audit: true })'
  },
  'treasury': {
    id: 'LQI-FIN-TRS',
    title: 'Treasury Hub',
    description: 'Autonomous liquidity routing engine for enterprise-scale asset distribution and collection.',
    category: 'FINANCE',
    tier: 'APEX',
    uptime: '99.99%',
    latency: '0.0012ms',
    parity: '100%',
    load: '42.5%',
    hardware: 'High-Velocity Qubit Array',
    codeSnippet: 'Treasury.route(ASSET_PACKET, { latency: "MINIMAL" })'
  },
  'swift': {
    id: 'LQI-PAY-SWF',
    title: 'Swift Handshake',
    description: 'Cross-border settlement bridge optimized for SWIFT gpi and real-time payment (RTP) rails.',
    category: 'PAYMENTS',
    tier: 'L2',
    uptime: '99.98%',
    latency: '1.4ms',
    parity: '100%',
    load: '65.2%',
    hardware: 'Global Edge Relay Network',
    codeSnippet: 'Bridge.handshake("SWIFT_GPI", { flow: "RTP" })'
  },
  'rsa-oaep': {
    id: 'LQI-SEC-RSA',
    title: 'RSA-4096 Gate',
    description: 'Military-grade encryption gateway utilizing RSA-OAEP padding and rotating high-entropy seeds.',
    category: 'SECURITY',
    tier: 'APEX',
    uptime: '100%',
    latency: '0.0002ms',
    parity: '100%',
    load: '4.1%',
    hardware: 'Hardware Security Module (HSM)',
    codeSnippet: 'Cipher.seal(PAYLOAD, { method: "RSA-OAEP-4096" })'
  },
  'fdx': {
    id: 'LQI-API-FDX',
    title: 'FDX v6.5 Standard',
    description: 'Financial Data Exchange implementation for secure, consumer-permissioned financial data sharing.',
    category: 'PROTOCOL',
    tier: 'L1',
    uptime: '99.99%',
    latency: '0.008ms',
    parity: '99.9%',
    load: '12.4%',
    hardware: 'FDX Compliance Node',
    codeSnippet: 'FDX.sync(CUSTOMER_PROFILE, { version: "6.5" })'
  },
  'alpha': {
    id: 'LQI-INT-ALP',
    title: 'Neural Alpha',
    description: 'Predictive signals derived from sub-space entanglement of global market metadata.',
    category: 'INTELLIGENCE',
    tier: 'APEX',
    uptime: '98.5%',
    latency: '0.00001ms',
    parity: '98.4%',
    load: '92.1%',
    hardware: 'Neural Processing Cluster',
    codeSnippet: 'Oracle.predict(MARKET_ENTROPY, { confidence: 0.98 })'
  },
  'manifesto': {
    id: 'LQI-ADM-MAN',
    title: 'Security Manifesto',
    description: 'The governing logic of zero-persistence data handling and institutional sovereignty.',
    category: 'COMPLIANCE',
    tier: 'APEX',
    uptime: '100%',
    latency: 'N/A',
    parity: '100%',
    load: '0.1%',
    hardware: 'Hard-coded Policy Engine',
    codeSnippet: 'Policy.enforce("ZERO_PERSISTENCE", { shred: true })'
  },
  'vault': {
    id: 'LQI-ADM-VLT',
    title: 'Audit Vault',
    description: 'Immutably signed record storage with 7-pass random overwrite logic post-shredding.',
    category: 'COMPLIANCE',
    tier: 'L3',
    uptime: '100%',
    latency: '0.04ms',
    parity: '100%',
    load: '1.2%',
    hardware: 'WORM (Write Once Read Many) Drive Array',
    codeSnippet: 'Vault.seal(DOCUMENT, { integrity: "SHA-256" })'
  },
  // Adding more slugs to cover all links...
  'trust': { id: 'LQI-FIN-TRT', title: 'Corporate Trust', description: 'Institutional custody protocols.', category: 'FINANCE', tier: 'L1', uptime: '100%', latency: '0.01ms', parity: '100%', load: '10%', hardware: 'Secure Enclave', codeSnippet: 'Custody.init()' },
  'drift': { id: 'LQI-INT-DRF', title: 'Drift Analytics', description: 'Ledger anomaly detection.', category: 'INTELLIGENCE', tier: 'L2', uptime: '99%', latency: '0.005ms', parity: '99%', load: '45%', hardware: 'Analysis Node', codeSnippet: 'Drift.scan()' },
  'sentiment': { id: 'LQI-INT-SEN', title: 'Sentiment Matrix', description: 'NLP market polling.', category: 'INTELLIGENCE', tier: 'L1', uptime: '99%', latency: '0.1ms', parity: '95%', load: '30%', hardware: 'GPU Cluster', codeSnippet: 'Sentiment.poll()' },
  'mesh': { id: 'LQI-NET-MSH', title: 'Mesh Fabric', description: 'Global node distribution.', category: 'NETWORK', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '15%', hardware: 'Fiber Ring', codeSnippet: 'Mesh.link()' },
  'rsa': { id: 'LQI-SEC-RSA-BASE', title: 'RSA Encryption', description: 'Asymmetric cryptography.', category: 'SECURITY', tier: 'L1', uptime: '100%', latency: '0.01ms', parity: '100%', load: '5%', hardware: 'HSM', codeSnippet: 'RSA.sign()' },
  'settlement': { id: 'LQI-PRO-SET', title: 'Subspace Settlement', description: 'Atomic swap protocols.', category: 'PROTOCOL', tier: 'L2', uptime: '99.9%', latency: '0.1ms', parity: '100%', load: '20%', hardware: 'Ledger Cluster', codeSnippet: 'Atomic.swap()' },
  'm2m': { id: 'LQI-PRO-M2M', title: 'M2M Consensus', description: 'Machine-to-machine logic.', category: 'PROTOCOL', tier: 'L2', uptime: '100%', latency: '0.001ms', parity: '100%', load: '10%', hardware: 'P2P Network', codeSnippet: 'P2P.consensus()' },
  'zk': { id: 'LQI-PRO-ZKP', title: 'Zero-Knowledge Vaults', description: 'Privacy-first verification.', category: 'PROTOCOL', tier: 'L3', uptime: '100%', latency: '0.05ms', parity: '100%', load: '5%', hardware: 'Proof Processor', codeSnippet: 'ZKP.verify()' },
  'l2': { id: 'LQI-PRO-L2F', title: 'Layer 2 Fabrics', description: 'Scalability layers.', category: 'PROTOCOL', tier: 'L2', uptime: '99.99%', latency: '0.2ms', parity: '100%', load: '40%', hardware: 'Sequencer Node', codeSnippet: 'L2.batch()' },
  'consensus': { id: 'LQI-PRO-CON', title: 'Hard Consensus', description: 'Immutable state machine.', category: 'PROTOCOL', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '10%', hardware: 'Raft Cluster', codeSnippet: 'Raft.vote()' },
  'advisor': { id: 'LQI-INT-ADV', title: 'Neural Advisor', description: 'Generative advisory node.', category: 'INTELLIGENCE', tier: 'APEX', uptime: '99%', latency: '0.5s', parity: '98%', load: '60%', hardware: 'AI Engine', codeSnippet: 'Advisor.query()' },
  'entropy': { id: 'LQI-INT-ENT', title: 'Entropy Rotation', description: 'Randomness refresh.', category: 'INTELLIGENCE', tier: 'L3', uptime: '100%', latency: '0.001ms', parity: '100%', load: '2%', hardware: 'TRNG Device', codeSnippet: 'Entropy.refresh()' },
  'risk': { id: 'LQI-INT-RSK', title: 'Risk Thresholds', description: 'Policy enforcement.', category: 'INTELLIGENCE', tier: 'L2', uptime: '100%', latency: '0.001ms', parity: '100%', load: '5%', hardware: 'Guardrail Node', codeSnippet: 'Risk.check()' },
  'reg': { id: 'LQI-COM-REG', title: 'Regulatory Handshake', description: 'Compliance reporting.', category: 'COMPLIANCE', tier: 'L1', uptime: '99.9%', latency: '1s', parity: '100%', load: '5%', hardware: 'Reporting DB', codeSnippet: 'Reg.report()' },
  'kyc': { id: 'LQI-COM-KYC', title: 'KYC Identity Core', description: 'Verified credentials.', category: 'COMPLIANCE', tier: 'L2', uptime: '100%', latency: '0.1ms', parity: '100%', load: '8%', hardware: 'Identity Store', codeSnippet: 'KYC.verify()' },
  'sanctions': { id: 'LQI-COM-SNC', title: 'Asset Sanctions', description: 'AML/OFAC screening.', category: 'COMPLIANCE', tier: 'APEX', uptime: '100%', latency: '0.01ms', parity: '100%', load: '12%', hardware: 'Screening Engine', codeSnippet: 'AML.scan()' },
  'ledger': { id: 'LQI-COM-LDG', title: 'Transparent Ledger', description: 'Public auditability.', category: 'COMPLIANCE', tier: 'L1', uptime: '100%', latency: '0.5ms', parity: '100%', load: '25%', hardware: 'Block Indexer', codeSnippet: 'Ledger.audit()' },
  'sustainability': { id: 'LQI-COM-SUS', title: 'ESG Carbon Audit', description: 'Green treasury metrics.', category: 'COMPLIANCE', tier: 'L2', uptime: '99.9%', latency: '1m', parity: '100%', load: '2%', hardware: 'Sensor Grid', codeSnippet: 'ESG.track()' },
  'handshake': { id: 'LQI-FOU-HND', title: 'Identity Handshake', description: 'Node authentication.', category: 'FOUNDATION', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '5%', hardware: 'Auth Hub', codeSnippet: 'Auth.handshake()' },
  'sla': { id: 'LQI-FOU-SLA', title: 'Institutional SLA', description: 'Performance guarantees.', category: 'FOUNDATION', tier: 'L3', uptime: '99.999%', latency: 'N/A', parity: '100%', load: '1%', hardware: 'Monitor Array', codeSnippet: 'SLA.verify()' },
  'archive': { id: 'LQI-NET-ARC', title: 'Genesis Archive', description: 'Historical snapshots.', category: 'NETWORK', tier: 'L3', uptime: '100%', latency: '50ms', parity: '100%', load: '1%', hardware: 'Cold Storage', codeSnippet: 'Archive.fetch()' }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/ci-connect-enterprisesnb | ORIGINAL PATH: diplomat-bit-ci-connect-enterprisesnb-634c26e/views/technical/technicalRegistry.ts
================================================================================


export interface ProtocolSpec {
  id: string;
  title: string;
  description: string;
  category: string;
  tier: 'L1' | 'L2' | 'L3' | 'APEX';
  uptime: string;
  latency: string;
  parity: string;
  load: string;
  hardware: string;
  codeSnippet: string;
}

export const TECHNICAL_REGISTRY: Record<string, ProtocolSpec> = {
  // Foundation
  'overview': {
    id: 'LQI-SYS-OVR',
    title: 'System Overview',
    description: 'The root organizational layer of the Lumina Quantum Mesh. Manages collective parity across all distributed nodes.',
    category: 'FOUNDATION',
    tier: 'APEX',
    uptime: '99.999%',
    latency: '0.0001ms',
    parity: '100%',
    load: '14.2%',
    hardware: 'Lumina Quantum Cluster v6',
    codeSnippet: 'Lumina.initialize({ core: ROOT_NODE, sync: GLOBAL })'
  },
  'nodes': {
    id: 'LQI-NOD-REG',
    title: 'Sovereign Nodes',
    description: 'Self-contained vault architecture performing real-time zero-knowledge proofs for network integrity.',
    category: 'FOUNDATION',
    tier: 'L1',
    uptime: '100%',
    latency: '0.0004ms',
    parity: '99.99%',
    load: '8.1%',
    hardware: 'Bare Metal Obsidian Nodes',
    codeSnippet: 'Node.handshake(ZKP_SIGNATURE, { audit: true })'
  },
  'treasury': {
    id: 'LQI-FIN-TRS',
    title: 'Treasury Hub',
    description: 'Autonomous liquidity routing engine for enterprise-scale asset distribution and collection.',
    category: 'FINANCE',
    tier: 'APEX',
    uptime: '99.99%',
    latency: '0.0012ms',
    parity: '100%',
    load: '42.5%',
    hardware: 'High-Velocity Qubit Array',
    codeSnippet: 'Treasury.route(ASSET_PACKET, { latency: "MINIMAL" })'
  },
  'swift': {
    id: 'LQI-PAY-SWF',
    title: 'Swift Handshake',
    description: 'Cross-border settlement bridge optimized for SWIFT gpi and real-time payment (RTP) rails.',
    category: 'PAYMENTS',
    tier: 'L2',
    uptime: '99.98%',
    latency: '1.4ms',
    parity: '100%',
    load: '65.2%',
    hardware: 'Global Edge Relay Network',
    codeSnippet: 'Bridge.handshake("SWIFT_GPI", { flow: "RTP" })'
  },
  'rsa-oaep': {
    id: 'LQI-SEC-RSA',
    title: 'RSA-4096 Gate',
    description: 'Military-grade encryption gateway utilizing RSA-OAEP padding and rotating high-entropy seeds.',
    category: 'SECURITY',
    tier: 'APEX',
    uptime: '100%',
    latency: '0.0002ms',
    parity: '100%',
    load: '4.1%',
    hardware: 'Hardware Security Module (HSM)',
    codeSnippet: 'Cipher.seal(PAYLOAD, { method: "RSA-OAEP-4096" })'
  },
  'fdx': {
    id: 'LQI-API-FDX',
    title: 'FDX v6.5 Standard',
    description: 'Financial Data Exchange implementation for secure, consumer-permissioned financial data sharing.',
    category: 'PROTOCOL',
    tier: 'L1',
    uptime: '99.99%',
    latency: '0.008ms',
    parity: '99.9%',
    load: '12.4%',
    hardware: 'FDX Compliance Node',
    codeSnippet: 'FDX.sync(CUSTOMER_PROFILE, { version: "6.5" })'
  },
  'alpha': {
    id: 'LQI-INT-ALP',
    title: 'Neural Alpha',
    description: 'Predictive signals derived from sub-space entanglement of global market metadata.',
    category: 'INTELLIGENCE',
    tier: 'APEX',
    uptime: '98.5%',
    latency: '0.00001ms',
    parity: '98.4%',
    load: '92.1%',
    hardware: 'Neural Processing Cluster',
    codeSnippet: 'Oracle.predict(MARKET_ENTROPY, { confidence: 0.98 })'
  },
  'manifesto': {
    id: 'LQI-ADM-MAN',
    title: 'Security Manifesto',
    description: 'The governing logic of zero-persistence data handling and institutional sovereignty.',
    category: 'COMPLIANCE',
    tier: 'APEX',
    uptime: '100%',
    latency: 'N/A',
    parity: '100%',
    load: '0.1%',
    hardware: 'Hard-coded Policy Engine',
    codeSnippet: 'Policy.enforce("ZERO_PERSISTENCE", { shred: true })'
  },
  'vault': {
    id: 'LQI-ADM-VLT',
    title: 'Audit Vault',
    description: 'Immutably signed record storage with 7-pass random overwrite logic post-shredding.',
    category: 'COMPLIANCE',
    tier: 'L3',
    uptime: '100%',
    latency: '0.04ms',
    parity: '100%',
    load: '1.2%',
    hardware: 'WORM (Write Once Read Many) Drive Array',
    codeSnippet: 'Vault.seal(DOCUMENT, { integrity: "SHA-256" })'
  },
  // Adding more slugs to cover all links...
  'trust': { id: 'LQI-FIN-TRT', title: 'Corporate Trust', description: 'Institutional custody protocols.', category: 'FINANCE', tier: 'L1', uptime: '100%', latency: '0.01ms', parity: '100%', load: '10%', hardware: 'Secure Enclave', codeSnippet: 'Custody.init()' },
  'drift': { id: 'LQI-INT-DRF', title: 'Drift Analytics', description: 'Ledger anomaly detection.', category: 'INTELLIGENCE', tier: 'L2', uptime: '99%', latency: '0.005ms', parity: '99%', load: '45%', hardware: 'Analysis Node', codeSnippet: 'Drift.scan()' },
  'sentiment': { id: 'LQI-INT-SEN', title: 'Sentiment Matrix', description: 'NLP market polling.', category: 'INTELLIGENCE', tier: 'L1', uptime: '99%', latency: '0.1ms', parity: '95%', load: '30%', hardware: 'GPU Cluster', codeSnippet: 'Sentiment.poll()' },
  'mesh': { id: 'LQI-NET-MSH', title: 'Mesh Fabric', description: 'Global node distribution.', category: 'NETWORK', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '15%', hardware: 'Fiber Ring', codeSnippet: 'Mesh.link()' },
  'rsa': { id: 'LQI-SEC-RSA-BASE', title: 'RSA Encryption', description: 'Asymmetric cryptography.', category: 'SECURITY', tier: 'L1', uptime: '100%', latency: '0.01ms', parity: '100%', load: '5%', hardware: 'HSM', codeSnippet: 'RSA.sign()' },
  'settlement': { id: 'LQI-PRO-SET', title: 'Subspace Settlement', description: 'Atomic swap protocols.', category: 'PROTOCOL', tier: 'L2', uptime: '99.9%', latency: '0.1ms', parity: '100%', load: '20%', hardware: 'Ledger Cluster', codeSnippet: 'Atomic.swap()' },
  'm2m': { id: 'LQI-PRO-M2M', title: 'M2M Consensus', description: 'Machine-to-machine logic.', category: 'PROTOCOL', tier: 'L2', uptime: '100%', latency: '0.001ms', parity: '100%', load: '10%', hardware: 'P2P Network', codeSnippet: 'P2P.consensus()' },
  'zk': { id: 'LQI-PRO-ZKP', title: 'Zero-Knowledge Vaults', description: 'Privacy-first verification.', category: 'PROTOCOL', tier: 'L3', uptime: '100%', latency: '0.05ms', parity: '100%', load: '5%', hardware: 'Proof Processor', codeSnippet: 'ZKP.verify()' },
  'l2': { id: 'LQI-PRO-L2F', title: 'Layer 2 Fabrics', description: 'Scalability layers.', category: 'PROTOCOL', tier: 'L2', uptime: '99.99%', latency: '0.2ms', parity: '100%', load: '40%', hardware: 'Sequencer Node', codeSnippet: 'L2.batch()' },
  'consensus': { id: 'LQI-PRO-CON', title: 'Hard Consensus', description: 'Immutable state machine.', category: 'PROTOCOL', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '10%', hardware: 'Raft Cluster', codeSnippet: 'Raft.vote()' },
  'advisor': { id: 'LQI-INT-ADV', title: 'Neural Advisor', description: 'Generative advisory node.', category: 'INTELLIGENCE', tier: 'APEX', uptime: '99%', latency: '0.5s', parity: '98%', load: '60%', hardware: 'AI Engine', codeSnippet: 'Advisor.query()' },
  'entropy': { id: 'LQI-INT-ENT', title: 'Entropy Rotation', description: 'Randomness refresh.', category: 'INTELLIGENCE', tier: 'L3', uptime: '100%', latency: '0.001ms', parity: '100%', load: '2%', hardware: 'TRNG Device', codeSnippet: 'Entropy.refresh()' },
  'risk': { id: 'LQI-INT-RSK', title: 'Risk Thresholds', description: 'Policy enforcement.', category: 'INTELLIGENCE', tier: 'L2', uptime: '100%', latency: '0.001ms', parity: '100%', load: '5%', hardware: 'Guardrail Node', codeSnippet: 'Risk.check()' },
  'reg': { id: 'LQI-COM-REG', title: 'Regulatory Handshake', description: 'Compliance reporting.', category: 'COMPLIANCE', tier: 'L1', uptime: '99.9%', latency: '1s', parity: '100%', load: '5%', hardware: 'Reporting DB', codeSnippet: 'Reg.report()' },
  'kyc': { id: 'LQI-COM-KYC', title: 'KYC Identity Core', description: 'Verified credentials.', category: 'COMPLIANCE', tier: 'L2', uptime: '100%', latency: '0.1ms', parity: '100%', load: '8%', hardware: 'Identity Store', codeSnippet: 'KYC.verify()' },
  'sanctions': { id: 'LQI-COM-SNC', title: 'Asset Sanctions', description: 'AML/OFAC screening.', category: 'COMPLIANCE', tier: 'APEX', uptime: '100%', latency: '0.01ms', parity: '100%', load: '12%', hardware: 'Screening Engine', codeSnippet: 'AML.scan()' },
  'ledger': { id: 'LQI-COM-LDG', title: 'Transparent Ledger', description: 'Public auditability.', category: 'COMPLIANCE', tier: 'L1', uptime: '100%', latency: '0.5ms', parity: '100%', load: '25%', hardware: 'Block Indexer', codeSnippet: 'Ledger.audit()' },
  'sustainability': { id: 'LQI-COM-SUS', title: 'ESG Carbon Audit', description: 'Green treasury metrics.', category: 'COMPLIANCE', tier: 'L2', uptime: '99.9%', latency: '1m', parity: '100%', load: '2%', hardware: 'Sensor Grid', codeSnippet: 'ESG.track()' },
  'handshake': { id: 'LQI-FOU-HND', title: 'Identity Handshake', description: 'Node authentication.', category: 'FOUNDATION', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '5%', hardware: 'Auth Hub', codeSnippet: 'Auth.handshake()' },
  'sla': { id: 'LQI-FOU-SLA', title: 'Institutional SLA', description: 'Performance guarantees.', category: 'FOUNDATION', tier: 'L3', uptime: '99.999%', latency: 'N/A', parity: '100%', load: '1%', hardware: 'Monitor Array', codeSnippet: 'SLA.verify()' },
  'archive': { id: 'LQI-NET-ARC', title: 'Genesis Archive', description: 'Historical snapshots.', category: 'NETWORK', tier: 'L3', uptime: '100%', latency: '50ms', parity: '100%', load: '1%', hardware: 'Cold Storage', codeSnippet: 'Archive.fetch()' }
};


================================================================================
// APPENDED FROM REPO: diplomat-bit/citi-connect-enterprise | ORIGINAL PATH: diplomat-bit-citi-connect-enterprise-0d00736/views/technical/technicalRegistry.ts
================================================================================


export interface ProtocolSpec {
  id: string;
  title: string;
  description: string;
  category: string;
  tier: 'L1' | 'L2' | 'L3' | 'APEX';
  uptime: string;
  latency: string;
  parity: string;
  load: string;
  hardware: string;
  codeSnippet: string;
}

export const TECHNICAL_REGISTRY: Record<string, ProtocolSpec> = {
  // Foundation
  'overview': {
    id: 'LQI-SYS-OVR',
    title: 'System Overview',
    description: 'The root organizational layer of the Lumina Quantum Mesh. Manages collective parity across all distributed nodes.',
    category: 'FOUNDATION',
    tier: 'APEX',
    uptime: '99.999%',
    latency: '0.0001ms',
    parity: '100%',
    load: '14.2%',
    hardware: 'Lumina Quantum Cluster v6',
    codeSnippet: 'Lumina.initialize({ core: ROOT_NODE, sync: GLOBAL })'
  },
  'nodes': {
    id: 'LQI-NOD-REG',
    title: 'Sovereign Nodes',
    description: 'Self-contained vault architecture performing real-time zero-knowledge proofs for network integrity.',
    category: 'FOUNDATION',
    tier: 'L1',
    uptime: '100%',
    latency: '0.0004ms',
    parity: '99.99%',
    load: '8.1%',
    hardware: 'Bare Metal Obsidian Nodes',
    codeSnippet: 'Node.handshake(ZKP_SIGNATURE, { audit: true })'
  },
  'treasury': {
    id: 'LQI-FIN-TRS',
    title: 'Treasury Hub',
    description: 'Autonomous liquidity routing engine for enterprise-scale asset distribution and collection.',
    category: 'FINANCE',
    tier: 'APEX',
    uptime: '99.99%',
    latency: '0.0012ms',
    parity: '100%',
    load: '42.5%',
    hardware: 'High-Velocity Qubit Array',
    codeSnippet: 'Treasury.route(ASSET_PACKET, { latency: "MINIMAL" })'
  },
  'swift': {
    id: 'LQI-PAY-SWF',
    title: 'Swift Handshake',
    description: 'Cross-border settlement bridge optimized for SWIFT gpi and real-time payment (RTP) rails.',
    category: 'PAYMENTS',
    tier: 'L2',
    uptime: '99.98%',
    latency: '1.4ms',
    parity: '100%',
    load: '65.2%',
    hardware: 'Global Edge Relay Network',
    codeSnippet: 'Bridge.handshake("SWIFT_GPI", { flow: "RTP" })'
  },
  'rsa-oaep': {
    id: 'LQI-SEC-RSA',
    title: 'RSA-4096 Gate',
    description: 'Military-grade encryption gateway utilizing RSA-OAEP padding and rotating high-entropy seeds.',
    category: 'SECURITY',
    tier: 'APEX',
    uptime: '100%',
    latency: '0.0002ms',
    parity: '100%',
    load: '4.1%',
    hardware: 'Hardware Security Module (HSM)',
    codeSnippet: 'Cipher.seal(PAYLOAD, { method: "RSA-OAEP-4096" })'
  },
  'fdx': {
    id: 'LQI-API-FDX',
    title: 'FDX v6.5 Standard',
    description: 'Financial Data Exchange implementation for secure, consumer-permissioned financial data sharing.',
    category: 'PROTOCOL',
    tier: 'L1',
    uptime: '99.99%',
    latency: '0.008ms',
    parity: '99.9%',
    load: '12.4%',
    hardware: 'FDX Compliance Node',
    codeSnippet: 'FDX.sync(CUSTOMER_PROFILE, { version: "6.5" })'
  },
  'alpha': {
    id: 'LQI-INT-ALP',
    title: 'Neural Alpha',
    description: 'Predictive signals derived from sub-space entanglement of global market metadata.',
    category: 'INTELLIGENCE',
    tier: 'APEX',
    uptime: '98.5%',
    latency: '0.00001ms',
    parity: '98.4%',
    load: '92.1%',
    hardware: 'Neural Processing Cluster',
    codeSnippet: 'Oracle.predict(MARKET_ENTROPY, { confidence: 0.98 })'
  },
  'manifesto': {
    id: 'LQI-ADM-MAN',
    title: 'Security Manifesto',
    description: 'The governing logic of zero-persistence data handling and institutional sovereignty.',
    category: 'COMPLIANCE',
    tier: 'APEX',
    uptime: '100%',
    latency: 'N/A',
    parity: '100%',
    load: '0.1%',
    hardware: 'Hard-coded Policy Engine',
    codeSnippet: 'Policy.enforce("ZERO_PERSISTENCE", { shred: true })'
  },
  'vault': {
    id: 'LQI-ADM-VLT',
    title: 'Audit Vault',
    description: 'Immutably signed record storage with 7-pass random overwrite logic post-shredding.',
    category: 'COMPLIANCE',
    tier: 'L3',
    uptime: '100%',
    latency: '0.04ms',
    parity: '100%',
    load: '1.2%',
    hardware: 'WORM (Write Once Read Many) Drive Array',
    codeSnippet: 'Vault.seal(DOCUMENT, { integrity: "SHA-256" })'
  },
  // Adding more slugs to cover all links...
  'trust': { id: 'LQI-FIN-TRT', title: 'Corporate Trust', description: 'Institutional custody protocols.', category: 'FINANCE', tier: 'L1', uptime: '100%', latency: '0.01ms', parity: '100%', load: '10%', hardware: 'Secure Enclave', codeSnippet: 'Custody.init()' },
  'drift': { id: 'LQI-INT-DRF', title: 'Drift Analytics', description: 'Ledger anomaly detection.', category: 'INTELLIGENCE', tier: 'L2', uptime: '99%', latency: '0.005ms', parity: '99%', load: '45%', hardware: 'Analysis Node', codeSnippet: 'Drift.scan()' },
  'sentiment': { id: 'LQI-INT-SEN', title: 'Sentiment Matrix', description: 'NLP market polling.', category: 'INTELLIGENCE', tier: 'L1', uptime: '99%', latency: '0.1ms', parity: '95%', load: '30%', hardware: 'GPU Cluster', codeSnippet: 'Sentiment.poll()' },
  'mesh': { id: 'LQI-NET-MSH', title: 'Mesh Fabric', description: 'Global node distribution.', category: 'NETWORK', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '15%', hardware: 'Fiber Ring', codeSnippet: 'Mesh.link()' },
  'rsa': { id: 'LQI-SEC-RSA-BASE', title: 'RSA Encryption', description: 'Asymmetric cryptography.', category: 'SECURITY', tier: 'L1', uptime: '100%', latency: '0.01ms', parity: '100%', load: '5%', hardware: 'HSM', codeSnippet: 'RSA.sign()' },
  'settlement': { id: 'LQI-PRO-SET', title: 'Subspace Settlement', description: 'Atomic swap protocols.', category: 'PROTOCOL', tier: 'L2', uptime: '99.9%', latency: '0.1ms', parity: '100%', load: '20%', hardware: 'Ledger Cluster', codeSnippet: 'Atomic.swap()' },
  'm2m': { id: 'LQI-PRO-M2M', title: 'M2M Consensus', description: 'Machine-to-machine logic.', category: 'PROTOCOL', tier: 'L2', uptime: '100%', latency: '0.001ms', parity: '100%', load: '10%', hardware: 'P2P Network', codeSnippet: 'P2P.consensus()' },
  'zk': { id: 'LQI-PRO-ZKP', title: 'Zero-Knowledge Vaults', description: 'Privacy-first verification.', category: 'PROTOCOL', tier: 'L3', uptime: '100%', latency: '0.05ms', parity: '100%', load: '5%', hardware: 'Proof Processor', codeSnippet: 'ZKP.verify()' },
  'l2': { id: 'LQI-PRO-L2F', title: 'Layer 2 Fabrics', description: 'Scalability layers.', category: 'PROTOCOL', tier: 'L2', uptime: '99.99%', latency: '0.2ms', parity: '100%', load: '40%', hardware: 'Sequencer Node', codeSnippet: 'L2.batch()' },
  'consensus': { id: 'LQI-PRO-CON', title: 'Hard Consensus', description: 'Immutable state machine.', category: 'PROTOCOL', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '10%', hardware: 'Raft Cluster', codeSnippet: 'Raft.vote()' },
  'advisor': { id: 'LQI-INT-ADV', title: 'Neural Advisor', description: 'Generative advisory node.', category: 'INTELLIGENCE', tier: 'APEX', uptime: '99%', latency: '0.5s', parity: '98%', load: '60%', hardware: 'AI Engine', codeSnippet: 'Advisor.query()' },
  'entropy': { id: 'LQI-INT-ENT', title: 'Entropy Rotation', description: 'Randomness refresh.', category: 'INTELLIGENCE', tier: 'L3', uptime: '100%', latency: '0.001ms', parity: '100%', load: '2%', hardware: 'TRNG Device', codeSnippet: 'Entropy.refresh()' },
  'risk': { id: 'LQI-INT-RSK', title: 'Risk Thresholds', description: 'Policy enforcement.', category: 'INTELLIGENCE', tier: 'L2', uptime: '100%', latency: '0.001ms', parity: '100%', load: '5%', hardware: 'Guardrail Node', codeSnippet: 'Risk.check()' },
  'reg': { id: 'LQI-COM-REG', title: 'Regulatory Handshake', description: 'Compliance reporting.', category: 'COMPLIANCE', tier: 'L1', uptime: '99.9%', latency: '1s', parity: '100%', load: '5%', hardware: 'Reporting DB', codeSnippet: 'Reg.report()' },
  'kyc': { id: 'LQI-COM-KYC', title: 'KYC Identity Core', description: 'Verified credentials.', category: 'COMPLIANCE', tier: 'L2', uptime: '100%', latency: '0.1ms', parity: '100%', load: '8%', hardware: 'Identity Store', codeSnippet: 'KYC.verify()' },
  'sanctions': { id: 'LQI-COM-SNC', title: 'Asset Sanctions', description: 'AML/OFAC screening.', category: 'COMPLIANCE', tier: 'APEX', uptime: '100%', latency: '0.01ms', parity: '100%', load: '12%', hardware: 'Screening Engine', codeSnippet: 'AML.scan()' },
  'ledger': { id: 'LQI-COM-LDG', title: 'Transparent Ledger', description: 'Public auditability.', category: 'COMPLIANCE', tier: 'L1', uptime: '100%', latency: '0.5ms', parity: '100%', load: '25%', hardware: 'Block Indexer', codeSnippet: 'Ledger.audit()' },
  'sustainability': { id: 'LQI-COM-SUS', title: 'ESG Carbon Audit', description: 'Green treasury metrics.', category: 'COMPLIANCE', tier: 'L2', uptime: '99.9%', latency: '1m', parity: '100%', load: '2%', hardware: 'Sensor Grid', codeSnippet: 'ESG.track()' },
  'handshake': { id: 'LQI-FOU-HND', title: 'Identity Handshake', description: 'Node authentication.', category: 'FOUNDATION', tier: 'L1', uptime: '100%', latency: '0.001ms', parity: '100%', load: '5%', hardware: 'Auth Hub', codeSnippet: 'Auth.handshake()' },
  'sla': { id: 'LQI-FOU-SLA', title: 'Institutional SLA', description: 'Performance guarantees.', category: 'FOUNDATION', tier: 'L3', uptime: '99.999%', latency: 'N/A', parity: '100%', load: '1%', hardware: 'Monitor Array', codeSnippet: 'SLA.verify()' },
  'archive': { id: 'LQI-NET-ARC', title: 'Genesis Archive', description: 'Historical snapshots.', category: 'NETWORK', tier: 'L3', uptime: '100%', latency: '50ms', parity: '100%', load: '1%', hardware: 'Cold Storage', codeSnippet: 'Archive.fetch()' }
};
