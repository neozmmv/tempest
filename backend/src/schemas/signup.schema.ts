import { z } from "zod"

export const signUpRequestSchema = z.object({
    name: z.string().min(1),
    email: z.email(),
    password: z.string().min(8),
    publicKey: z.string().min(1),
    encryptedPrivateKey: z.string().min(1),
    publicSignatureKey: z.string().min(1),
    encryptedPrivateSignatureKey: z.string().min(1),
    encryptionSalt: z.string().min(1),
    encryptionNonce: z.string().min(1),
    signatureNonce: z.string().min(1)
})

export type SignUpRequest = z.infer<typeof signUpRequestSchema>;