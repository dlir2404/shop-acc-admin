export interface IAccount {
    id: number,
    username: string,
    password: string,
    heroes_num: number,
    costumes_num: number,
    rank: string | null,
    is_full_gems: boolean | null,
    price: number,
    image_url: string,
}

export interface INewAccount {
    username: string,
    password: string,
    heroes_num: number,
    costumes_num: number,
    rank: string | null,
    is_full_gems: boolean | null,
    price: number,
    image_url: string,
}

export interface IAccountRes {
    rows: IAccount[]
    count: number
}