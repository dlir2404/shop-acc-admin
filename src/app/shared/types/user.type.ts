export interface IUser {
  id: number
  username: string
  isLocked: number
  createAt: string
}
export interface IUserRes {
  count: number,
  data: IUser[]
}