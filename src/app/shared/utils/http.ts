import axios, { AxiosInstance } from 'axios'
import localStorageService from '../services/localStorage.service'

class Http {
    instance: AxiosInstance
    constructor() {
        const token = localStorageService.getValue('DINH_LINH_SHOP_ADMIN_TOKEN')

        this.instance = axios.create({
            baseURL: 'http://localhost:8080',
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        })
    }
}

const http = new Http().instance

export default http