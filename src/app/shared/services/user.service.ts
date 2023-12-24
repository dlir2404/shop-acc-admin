import { AxiosResponse } from 'axios'
import { IBaseRequestParams, BaseResponse } from "../types/base.type";
import http from '../utils/http';
import { IUserRes } from '../types/user.type';


class UserService {
    getUsers(
        params?: IBaseRequestParams
    ): Promise<AxiosResponse<BaseResponse<IUserRes>>> {
        return http.get('/api/admin/users', { params })
    }

    async lockUser(id: any) {
        return http.post('/api/admin/users/lock/' + id)
    }

    async unlockUser(id: any) {
        return http.post('/api/admin/users/unlock/' + id)
    }
}

const userService = new UserService
export default userService