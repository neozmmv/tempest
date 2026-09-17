import { x25519 } from "@noble/curves/ed25519.js";
import { ed25519 } from "@noble/curves/ed25519.js";

// base64
export interface KeyPair {
    private: string
    public: string
}

export interface X25519KeyPair extends KeyPair {}
export interface ED25519KeyPair extends KeyPair {}

export function generateX25519KeyPair(): X25519KeyPair {
    const { secretKey, publicKey } = x25519.keygen();
    return {
        private: secretKey.toBase64(),
        public: publicKey.toBase64()
    }
}

export function generateED25519KeyPair(): ED25519KeyPair {
    const { secretKey, publicKey } = ed25519.keygen();
    return {
        private: secretKey.toBase64(),
        public: publicKey.toBase64()
    }
}