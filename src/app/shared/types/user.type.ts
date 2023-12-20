export interface IUser {
    id: number
    username: string
    createAt: string
  }
  export interface IUserRes {
    rows: IUser[]
    count: number
  }