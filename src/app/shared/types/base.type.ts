export type IBaseRequestParams = {
    page?: number
    pageSize?: number
    [key: string]: any
}

export interface BaseResponse<T> {
    status: number
    data: T
}