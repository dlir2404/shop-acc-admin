import { AxiosResponse } from 'axios'
import { IBaseRequestParams, BaseResponse } from "../types/base.type";
import http from '../utils/http';
import { IAccountRes } from '../types/account.type';


class AccountService {
    getAccounts(
        params?: IBaseRequestParams
    ): Promise<AxiosResponse<BaseResponse<IAccountRes>>> {
        return http.get('api/admin/accounts', { params })
    }
}

const accountService = new AccountService
export default accountService