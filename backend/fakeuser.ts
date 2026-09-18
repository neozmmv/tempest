import { generateED25519KeyPair, generateX25519KeyPair } from "./src/crypto/keys";
import { randomBytes } from "@noble/ciphers/utils.js";
import { gcm } from "@noble/ciphers/aes.js";
import { argon2id } from "hash-wasm";

// USE THIS LOGIC FOR GENERATING THE KEYS
// IN SIGNUP

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

// 8 letter random name
const name = (() => {
    let name = ""
    for(let i = 0; i < 8; i++) {
        const random = Math.floor(Math.random() * alphabet.length);
        name += alphabet[random];
    }
    return name;
})();

const email = `${name}@mail.com`;
const password = "12345678";
const x25519kp = generateX25519KeyPair();
const ed25519kp = generateED25519KeyPair();

const salt = randomBytes(16);

const derivedKey = await argon2id({
    password,
    salt,
    parallelism: 1,
    iterations: 3,
    memorySize: 65536,
    hashLength: 32,
    outputType: "binary"
})

const encryptionNonce = randomBytes(12); // aes-gcm-256 requires 12
const signatureNonce = randomBytes(12);

const encryptedPrivateX = gcm(derivedKey, encryptionNonce).encrypt(Uint8Array.fromBase64(x25519kp.private))
const encryptedPrivateED = gcm(derivedKey, signatureNonce).encrypt(Uint8Array.fromBase64(ed25519kp.private))


console.log(`
NAME: ${name}
EMAIL: ${email}
PASSWORD: ${password}
PUBLIC KEY (X): ${x25519kp.public}
ENCRYPTED KEY (X): ${encryptedPrivateX.toBase64()}
ENCRYPTED KEY (ED): ${encryptedPrivateED.toBase64()}
PUBLIC KEY (ED): ${ed25519kp.public}
ENCRYPTION NONCE: ${encryptionNonce.toBase64()}
SALT: ${salt.toBase64()}
SIGNATURE NONCE: ${signatureNonce.toBase64()}

`)
