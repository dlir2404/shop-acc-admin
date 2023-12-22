export interface IUser {
  id: number
  username: string
  createAt: string
}
export interface IUserRes {
  count: number,
  data: IUser[]
}