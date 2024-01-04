import { AxiosResponse } from 'axios'
import { IBaseRequestParams, BaseResponse } from "../types/base.type";
import http from '../utils/http';
import { IPurchaseRes } from '../types/purchase.type';


class SellService {
    async getSells() {
        return http.get('api/admin/sell/requests')
    }
    async acceptSell(id: any) {
        return http.post('/api/admin/sell/accept-request/' + id)
    }
    async denySell(id: any) {
        return http.post('/api/admin/sell/deny-request/' + id)
    }

    async confirmPay(id: any, values: any) {
        return http.post('/api/admin/sell/confirm-pay/' + id, values)
    }
}

const sellService = new SellService
export default sellService