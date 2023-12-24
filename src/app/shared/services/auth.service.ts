import { ILogin, ILoginRes } from "../types/auth.type"
import http from "../utils/http";

const authService = {
    login: async (values: ILogin) => {
        const data = await http.post<any>('/api/admin/auth/login', values)
        return data
    },
    verify: async () => {
        const data = await http.get<any>('/api/admin/auth/verify')
        return data
    }
}

export default authService