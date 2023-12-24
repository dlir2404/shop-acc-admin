'use client'
import Link from "next/link"
import { Button, Checkbox, Form, Input, message } from 'antd';
import authService from "../shared/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { ILogin } from "../shared/types/auth.type";
import { useRouter } from "next/navigation";
import localStorageService from "../shared/services/localStorage.service";

const Login = () => {
    const router = useRouter()
    const loginMutation = useMutation({
        mutationFn: (values: ILogin) => authService.login(values),
        onSuccess(data, variables, context) {
            localStorageService.setValue('DINH_LINH_SHOP_ADMIN_TOKEN', 'Bearer ' + data.data.accessToken)
            message.success('Đăng nhập thành công')
            router.push('/')
        },
        onError(error: any) {
            console.log(error)
            message.error(error.response.data.message)
        },
    })

    const onFinish = (values: ILogin) => {
        loginMutation.mutate(values)
    }
    return (
        <>
            <div className="mx-auto max-w-[600px] mt-[200px] border-2 pt-10 px-10 rounded-xl">
                <div className='pb-8 text-center'>
                    <p className='text-lg'>Admin đăng nhập</p>
                </div>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                    labelAlign="left"
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button className="bg-[#1777ff] text-white hover:text-white" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default Login