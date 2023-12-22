export interface ISell {
    id: number
    userId: number
    accountId: number
    accountPrice: number
    status: string
    billUrl: string
    createAt: string
}
export interface ISellRes {
    rows: ISell[]
    count: number
}