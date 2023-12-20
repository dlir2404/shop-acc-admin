export interface IPurchase {
    id: number
    userId: number
    accountId: number
    accountPrice: number
    status: string
    billUrl: string
    createAt: string
}
export interface IPurchaseRes {
    rows: IPurchase[]
    count: number
}