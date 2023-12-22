import { AxiosResponse } from 'axios'
import { IBaseRequestParams, BaseResponse } from "../types/base.type";
import http from '../utils/http';
import { IPurchaseRes } from '../types/purchase.type';


class PurchaseService {
    getPurchases(
        params?: IBaseRequestParams
    ): Promise<AxiosResponse<BaseResponse<IPurchaseRes>>> {
        return http.get('api/admin/buy/requests', { params })
    }
    async acceptPurchase(id: any) {
        return http.post('/api/admin/buy/accept-request/' + id)
    }
    async denyPurchase(id: any) {
        return http.post('/api/admin/buy/deny-request/' + id)
    }
}

const purchaseService = new PurchaseService
export default purchaseService