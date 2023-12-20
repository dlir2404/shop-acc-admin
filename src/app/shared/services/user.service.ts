import { AxiosResponse } from 'axios'
import { IBaseRequestParams, BaseResponse } from "../types/base.type";
import http from '../utils/http';
import { IUserRes } from '../types/user.type';


class UserService {
    getUsers(
        params?: IBaseRequestParams
    ) : Promise<AxiosResponse<BaseResponse<IUserRes>>> {
        return http.get('/admin/user', { params })
      }
}

const userService = new UserService
export default userService