export interface User {
    _id?: string
    username: string
    handcashId: string
    avatarUrl: string
    authToken: string
}

export type TransactionParticipant = {
    username: string,
    avatarUrl: string,
}

export interface Payment {
    _id?: string
    userId: string
    transactionId: string
    usdAmount: number
    sender: TransactionParticipant
    receivers: TransactionParticipant[]
    date: Date
    createdAt?: Date
    updatedAt?: Date
}

export interface Nft {
    _id?: string
    userId: string
    username: string
    origin: string
    transactionId: string
    mediaUrl: string
    name: string
    label: string
    attributes: { name: string; value: string }[]
    createdAt?: Date
    updatedAt?: Date
}