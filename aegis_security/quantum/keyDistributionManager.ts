// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/aegis_security/quantum/keyDistributionManager.ts
================================================================================

```typescript
// aegis_security/quantum/keyDistributionManager.ts

// Assuming a PQC library compatible with Node.js is available.
// The 'oqs-js' package is a hypothetical wrapper for the Open Quantum Safe library.
// In a real project, you would use a concrete implementation like 'crystals-kyber', etc.
import { KEM } from 'oqs-js'; // Hypothetical package
import { randomBytes, createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { promisify } from 'util';

// --- Interfaces and Types ---

/**
 * Supported Quantum-Resistant Key Encapsulation Mechanisms (KEMs).
 * Based on NIST PQC Standardization Round 3 finalists and Round 4 candidates.
 */
export enum PQCAlgorithm {
    // KEMs
    Kyber512 = 'Kyber-512',
    Kyber768 = 'Kyber-768',
    Kyber1024 = 'Kyber-1024',
    ClassicMcEliece348864 = 'Classic-McEliece-348864',
    SikeP434 = 'SIKE-p434', // Note: SIKE is broken, kept for historical example
    Hqc128 = 'HQC-128',
}

/**
 * Status of a cryptographic key in its lifecycle.
 */
export enum KeyStatus {
    PENDING_GENERATION = 'pending_generation',
    ACTIVE = 'active',
    DEPRECATED = 'deprecated', // Can be used for decryption/decapsulation, but not for new operations
    COMPROMISED = 'compromised', // Should not be used for anything
    DESTROYED = 'destroyed', // Securely deleted
}

/**
 * Metadata associated with a cryptographic key.
 */
export interface KeyMetadata {
    keyId: string;
    entityId: string;
    algorithm: PQCAlgorithm;
    status: KeyStatus;
    createdAt: Date;
    expiresAt: Date | null; // Null for keys that don't expire
    rotatedFromKeyId?: string; // ID of the key this one replaced
    version: number;
}

/**
 * Represents a quantum-resistant key pair.
 */
export interface KeyPair {
    publicKey: Buffer;
    privateKey: Buffer; // This would be securely stored and never directly exposed
}

/**
 * Represents a stored key, including its encrypted private key and metadata.
 */
export interface StoredKey {
    metadata: KeyMetadata;
    publicKey: Buffer;
    encryptedPrivateKey: Buffer; // Encrypted with a master key or derived key
    encryptionIv: Buffer;
    encryptionAuthTag: Buffer;
}

/**
 * Interface for a secure key storage backend.
 * This could be implemented by various systems like HashiCorp Vault, AWS KMS, Azure Key Vault, or a hardware security module (HSM).
 */
export interface IQuantumKeyStore {
    saveKey(key: StoredKey): Promise<void>;
    retrieveKey(entityId: string, keyId: string): Promise<StoredKey | null>;
    findActiveKeyForEntity(entityId: string): Promise<StoredKey | null>;
    updateKeyStatus(entityId: string, keyId: string, status: KeyStatus): Promise<void>;
    listKeysForEntity(entityId: string): Promise<KeyMetadata[]>;
}

/**
 * Configuration for the key rotation policy.
 */
export interface RotationPolicy {
    /** Rotation interval in milliseconds. e.g., 24 * 60 * 60 * 1000 for daily rotation. */
    rotationIntervalMs: number;
    /** Grace period in milliseconds before a deprecated key is destroyed. */
    deprecationGracePeriodMs: number;
    /** If true, automatically rotates keys based on the interval. */
    autoRotate: boolean;
}

/**
 * Configuration for the QuantumKeyDistributionManager.
 */
export interface KeyManagerConfig {
    /** The default PQC algorithm to use for new keys. */
    defaultAlgorithm: PQCAlgorithm;
    /** Key rotation policy. */
    rotationPolicy: RotationPolicy;
    /** A high-entropy secret used to derive keys for encrypting private keys at rest. Should be loaded from a secure source. */
    storageMasterKey: string;
}

// --- Custom Errors ---

export class KeyManagerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'KeyManagerError';
    }
}

export class KeyGenerationError extends KeyManagerError {
    constructor(algorithm: string, reason: string) {
        super(`Failed to generate key for algorithm ${algorithm}: ${reason}`);
        this.name = 'KeyGenerationError';
    }
}

export class KeyStorageError extends KeyManagerError {
    constructor(message: string) {
        super(`Key storage operation failed: ${message}`);
        this.name = 'KeyStorageError';
    }
}

export class KeyNotFoundError extends KeyManagerError {
    constructor(entityId: string, keyId?: string) {
        super(`Could not find key for entity ${entityId}` + (keyId ? ` with ID ${keyId}` : ''));
        this.name = 'KeyNotFoundError';
    }
}


// --- Simple Logger (for demonstration) ---
// In a real application, this would be a more robust logger like Winston or Pino.
const logger = {
    info: (message: string, context?: object) => console.log(`[INFO] ${message}`, context || ''),
    warn: (message: string, context?: object) => console.warn(`[WARN] ${message}`, context || ''),
    error: (message: string, error?: Error, context?: object) => console.error(`[ERROR] ${message}`, context || '', error || ''),
};

// --- In-Memory Key Store (for demonstration) ---
// NOT FOR PRODUCTION USE. Replace with a secure, persistent store.
export class InMemoryKeyStore implements IQuantumKeyStore {
    private store: Map<string, StoredKey> = new Map();

    private getKeyMapId(entityId: string, keyId: string): string {
        return `${entityId}:${keyId}`;
    }

    async saveKey(key: StoredKey): Promise<void> {
        const id = this.getKeyMapId(key.metadata.entityId, key.metadata.keyId);
        if (this.store.has(id)) {
            throw new KeyStorageError(`Key with ID ${key.metadata.keyId} for entity ${key.metadata.entityId} already exists.`);
        }
        this.store.set(id, { ...key }); // Store a copy
        logger.info(`Key saved in-memory for entity ${key.metadata.entityId}`, { keyId: key.metadata.keyId });
    }

    async retrieveKey(entityId: string, keyId: string): Promise<StoredKey | null> {
        const id = this.getKeyMapId(entityId, keyId);
        const key = this.store.get(id);
        return key ? { ...key } : null;
    }

    async findActiveKeyForEntity(entityId: string): Promise<StoredKey | null> {
        for (const key of this.store.values()) {
            if (key.metadata.entityId === entityId && key.metadata.status === KeyStatus.ACTIVE) {
                return { ...key };
            }
        }
        return null;
    }

    async updateKeyStatus(entityId: string, keyId: string, status: KeyStatus): Promise<void> {
        const id = this.getKeyMapId(entityId, keyId);
        const key = this.store.get(id);
        if (!key) {
            throw new KeyNotFoundError(entityId, keyId);
        }
        key.metadata.status = status;
        this.store.set(id, key);
        logger.info(`Updated key status for entity ${entityId}`, { keyId, newStatus: status });
    }

    async listKeysForEntity(entityId: string): Promise<KeyMetadata[]> {
        const keys: KeyMetadata[] = [];
        for (const key of this.store.values()) {
            if (key.metadata.entityId === entityId) {
                keys.push({ ...key.metadata });
            }
        }
        return keys;
    }
}


// --- Main Class: QuantumKeyDistributionManager ---

/**
 * Manages the lifecycle of quantum-resistant cryptographic keys,
 * including generation, secure storage, distribution, and rotation.
 */
export class QuantumKeyDistributionManager {
    private readonly keyStore: IQuantumKeyStore;
    private readonly config: KeyManagerConfig;
    private rotationTimers: Map<string, NodeJS.Timeout> = new Map();
    private readonly scrypt_promisified = promisify(scrypt);

    constructor(keyStore: IQuantumKeyStore, config: KeyManagerConfig) {
        if (!keyStore || !config) {
            throw new Error('Key store and configuration must be provided.');
        }
        this.keyStore = keyStore;
        this.config = config;

        logger.info('QuantumKeyDistributionManager initialized.', { algorithm: config.defaultAlgorithm });
    }

    /**
     * Initializes the manager, setting up rotation schedules for existing entities if needed.
     * This method should be called after instantiation.
     */
    public async initialize(): Promise<void> {
        // In a real scenario, this would scan for all managed entities and set up timers.
        // For this example, we'll assume entities are managed dynamically.
        logger.info('Manager initialization complete.');
    }



    /**
     * Generates a new quantum-resistant key pair for a given entity and stores it.
     * If an active key already exists, it will be deprecated and a new one will be created.
     * @param entityId A unique identifier for the entity (e.g., user ID, service name).
     * @returns The metadata of the newly created active key.
     */
    public async provisionAndRotateKey(entityId: string): Promise<KeyMetadata> {
        logger.info(`Provisioning new key for entity: ${entityId}`);

        const existingActiveKey = await this.keyStore.findActiveKeyForEntity(entityId);
        let version = 1;
        let rotatedFromKeyId: string | undefined = undefined;

        if (existingActiveKey) {
            logger.info(`Deprecating existing active key for rotation.`, { entityId, keyId: existingActiveKey.metadata.keyId });
            await this.keyStore.updateKeyStatus(entityId, existingActiveKey.metadata.keyId, KeyStatus.DEPRECATED);
            version = existingActiveKey.metadata.version + 1;
            rotatedFromKeyId = existingActiveKey.metadata.keyId;
            
            // Schedule cleanup of the old key
            setTimeout(() => {
                this.destroyKey(entityId, existingActiveKey.metadata.keyId).catch(err => 
                    logger.error(`Failed to destroy deprecated key ${existingActiveKey.metadata.keyId}`, err)
                );
            }, this.config.rotationPolicy.deprecationGracePeriodMs);
        }

        const algorithm = this.config.defaultAlgorithm;
        const kem = new KEM(algorithm); // Throws if algorithm is not supported by the OQS library

        let keyPair: { publicKey: Buffer; secretKey: Buffer; };
        try {
             keyPair = await kem.keypair();
        } catch (error) {
            throw new KeyGenerationError(algorithm, error instanceof Error ? error.message : 'Unknown OQS error');
        }

        const newKeyId = randomBytes(16).toString('hex');
        const now = new Date();
        const expiresAt = this.config.rotationPolicy.rotationIntervalMs
            ? new Date(now.getTime() + this.config.rotationPolicy.rotationIntervalMs)
            : null;

        const metadata: KeyMetadata = {
            keyId: newKeyId,
            entityId,
            algorithm,
            status: KeyStatus.ACTIVE,
            createdAt: now,
            expiresAt,
            version,
            rotatedFromKeyId,
        };
        
        const { encryptedPrivateKey, iv, authTag } = await this.encryptPrivateKey(keyPair.secretKey, newKeyId);

        const storedKey: StoredKey = {
            metadata,
            publicKey: keyPair.publicKey,
            encryptedPrivateKey: encryptedPrivateKey,
            encryptionIv: iv,
            encryptionAuthTag: authTag,
        };

        await this.keyStore.saveKey(storedKey);
        logger.info(`Successfully provisioned and stored new active key.`, { entityId, keyId: newKeyId, algorithm });

        // Setup next rotation if auto-rotate is enabled
        if (this.config.rotationPolicy.autoRotate) {
            this.scheduleRotation(entityId);
        }

        return metadata;
    }
    
    /**
     * Retrieves the active public key for a given entity.
     * This is used by other parties to initiate a secure key exchange.
     * @param entityId The ID of the entity whose public key is needed.
     * @returns A Buffer containing the public key.
     */
    public async getActivePublicKey(entityId: string): Promise<Buffer> {
        const activeKey = await this.keyStore.findActiveKeyForEntity(entityId);
        if (!activeKey) {
            throw new KeyNotFoundError(entityId, 'active');
        }
        return activeKey.publicKey;
    }
    
    /**
     * Initiates a key exchange by encapsulating a shared secret with the responder's public key.
     * @param responderId The entity ID of the key recipient.
     * @returns An object containing the generated shared secret and the ciphertext to be sent to the responder.
     */
    public async encapsulateSharedSecret(responderId: string): Promise<{ sharedSecret: Buffer; ciphertext: Buffer; keyId: string }> {
        logger.info(`Initiating key exchange with responder: ${responderId}`);
        const responderActiveKey = await this.keyStore.findActiveKeyForEntity(responderId);
        if (!responderActiveKey) {
            throw new KeyNotFoundError(responderId, 'active');
        }
        
        const { metadata, publicKey } = responderActiveKey;
        const kem = new KEM(metadata.algorithm);
        
        try {
            const { sharedSecret, ciphertext } = await kem.encapsulate(publicKey);
            logger.info(`Successfully encapsulated shared secret for responder.`, { responderId, keyId: metadata.keyId });
            return { sharedSecret, ciphertext, keyId: metadata.keyId };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown OQS error';
            logger.error(`Failed to encapsulate shared secret.`, error, { responderId, keyId: metadata.keyId });
            throw new KeyManagerError(`Encapsulation failed: ${errorMessage}`);
        }
    }

    /**
     * Completes a key exchange by decapsulating a ciphertext to retrieve a shared secret.
     * This is performed by the party who owns the private key.
     * @param responderId The entity ID of the key recipient (i.e., "self").
     * @param keyId The ID of the key pair used for encapsulation.
     * @param ciphertext The ciphertext received from the initiator.
     * @returns The decapsulated shared secret, which should match the initiator's.
     */
    public async decapsulateSharedSecret(responderId: string, keyId: string, ciphertext: Buffer): Promise<Buffer> {
        logger.info(`Attempting to decapsulate ciphertext for key ID: ${keyId}`, { responderId });
        const storedKey = await this.keyStore.retrieveKey(responderId, keyId);
        if (!storedKey) {
            throw new KeyNotFoundError(responderId, keyId);
        }

        if (storedKey.metadata.status === KeyStatus.COMPROMISED || storedKey.metadata.status === KeyStatus.DESTROYED) {
            throw new KeyManagerError(`Attempted to use a key that is compromised or destroyed.`);
        }
        
        const privateKey = await this.decryptPrivateKey(
            storedKey.encryptedPrivateKey,
            storedKey.metadata.keyId,
            storedKey.encryptionIv,
            storedKey.encryptionAuthTag
        );
        
        const kem = new KEM(storedKey.metadata.algorithm);
        
        try {
            const sharedSecret = await kem.decapsulate(ciphertext, privateKey);
            logger.info(`Successfully decapsulated ciphertext.`, { responderId, keyId });
            // Securely wipe the private key from memory after use
            privateKey.fill(0);
            return sharedSecret;
        } catch (error) {
             // Securely wipe the private key from memory on failure
            privateKey.fill(0);
            const errorMessage = error instanceof Error ? error.message : 'Unknown OQS error';
            logger.error(`Failed to decapsulate ciphertext.`, error, { responderId, keyId });
            throw new KeyManagerError(`Decapsulation failed: ${errorMessage}`);
        }
    }

    /**
     * Marks a specific key as compromised.
     * @param entityId The entity that owns the key.
     * @param keyId The ID of the compromised key.
     */
    public async markKeyAsCompromised(entityId: string, keyId: string): Promise<void> {
        logger.warn(`MARKING KEY AS COMPROMISED!`, { entityId, keyId });
        await this.keyStore.updateKeyStatus(entityId, keyId, KeyStatus.COMPROMISED);
        // Trigger an immediate key rotation for the entity.
        await this.provisionAndRotateKey(entityId);
    }
    
    /**
     * Schedules the next automatic key rotation for an entity.
     * @param entityId The ID of the entity to schedule rotation for.
     */
    private scheduleRotation(entityId: string): void {
        // Clear any existing timer for this entity
        if (this.rotationTimers.has(entityId)) {
            clearTimeout(this.rotationTimers.get(entityId)!);
        }
        
        const { rotationIntervalMs } = this.config.rotationPolicy;
        if (rotationIntervalMs <= 0) {
            return;
        }

        const timer = setTimeout(() => {
            logger.info(`Scheduled rotation triggered for entity: ${entityId}`);
            this.provisionAndRotateKey(entityId).catch(err => {
                logger.error(`Automatic key rotation failed for entity ${entityId}`, err);
            });
        }, rotationIntervalMs);

        this.rotationTimers.set(entityId, timer);
        logger.info(`Scheduled next key rotation for entity ${entityId} in ${rotationIntervalMs}ms.`);
    }

    /**
     * Securely destroys a key, making it unrecoverable.
     * @param entityId The entity owning the key.
     * @param keyId The ID of the key to destroy.
     */
    private async destroyKey(entityId: string, keyId: string): Promise<void> {
        logger.warn(`Destroying key. This action is irreversible.`, { entityId, keyId });
        // In a real implementation, this would involve secure deletion from the KMS/HSM.
        // For the in-memory store, we just update the status. A real store might remove the record.
        await this.keyStore.updateKeyStatus(entityId, keyId, KeyStatus.DESTROYED);
    }

    /**
     * Encrypts a private key using AES-256-GCM with a key derived from the master key.
     */
    private async encryptPrivateKey(privateKey: Buffer, salt: string): Promise<{ encryptedPrivateKey: Buffer; iv: Buffer; authTag: Buffer; }> {
        const iv = randomBytes(12);
        const derivedKey = (await this.scrypt_promisified(this.config.storageMasterKey, salt, 32)) as Buffer;
        
        const cipher = createCipheriv('aes-256-gcm', derivedKey, iv);
        const encryptedPrivateKey = Buffer.concat([cipher.update(privateKey), cipher.final()]);
        const authTag = cipher.getAuthTag();
        
        // Securely wipe derived key from memory
        derivedKey.fill(0);

        return { encryptedPrivateKey, iv, authTag };
    }

    /**
     * Decrypts a private key.
     */
    private async decryptPrivateKey(encryptedKey: Buffer, salt: string, iv: Buffer, authTag: Buffer): Promise<Buffer> {
        const derivedKey = (await this.scrypt_promisified(this.config.storageMasterKey, salt, 32)) as Buffer;

        const decipher = createDecipheriv('aes-256-gcm', derivedKey, iv);
        decipher.setAuthTag(authTag);
        
        try {
            const privateKey = Buffer.concat([decipher.update(encryptedKey), decipher.final()]);
            // Securely wipe derived key from memory
            derivedKey.fill(0);
            return privateKey;
        } catch (error) {
            // Securely wipe derived key from memory on failure
            derivedKey.fill(0);
            logger.error('Failed to decrypt private key. Potential tampering detected.', error);
            throw new KeyManagerError('Private key decryption failed.');
        }
    }
}
```