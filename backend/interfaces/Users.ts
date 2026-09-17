
export interface IUser {
    id?: string
    name: string
    email: string
    password: string
    profile_pic?: string
    created_at?: string
}

export interface ISignUpRequest {
    name: string
    email: string
    password: string
    publicKey: string
    encryptedPrivateKey: string 
    publicSignatureKey: string
    encryptedPrivateSignatureKey: string
    encryptionSalt: string
    encryptionNonce: string
    signatureNonce: string
}

export interface ILoginForm {
    email: string
    password: string
}