import { Button, Table, Image, Modal, message, Form, Input, Upload } from 'antd';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment';
import { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import sellService from '../shared/services/sell.service';
import { useForm } from 'antd/es/form/Form';
import imgToUrl from '../shared/services/cloudinary.service';
import { useState } from 'react';


const SellManagement = () => {

    const queryClient = useQueryClient()
    const [sellRequest, setSellRequest] = useState<any>(null)
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
    const [isCompleteLoading, setIsCompleteLoading] = useState(false)

    //api
    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['adminsells'],
        queryFn: async () => {
            try {
                const data = await sellService.getSells()
                return data
            } catch (error) {

            }
        }

    })

    const acceptRequestMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await sellService.acceptSell(id)
            return response
        },
        onSuccess(data, variables, context) {
            message.success('Chấp nhận yêu cầu bán tài khoản thành công.')
            queryClient.invalidateQueries({ queryKey: ['adminsells'] })
        },
        onError(error, variables, context) {
            console.log(error)
            message.error('Có lỗi xảy ra.')
        },
    })

    const denyRequestMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await sellService.denySell(id)
            return response
        },
        onSuccess(data, variables, context) {
            message.success('Đã từ chối yêu cầu.')
            queryClient.invalidateQueries({ queryKey: ['adminsells'] })
        },
        onError(error, variables, context) {
            console.log(error)
            message.error('Có lỗi xảy ra.')
        },
    })

    const confirmPayMutation = useMutation({
        mutationFn: async ({ id, body }: { id: any, body: any }) => {
            const response = await sellService.confirmPay(id, body)
            return response
        },
        onSuccess(data, variables, context) {
            message.success('Đã xác nhận thanh toán và thêm tài khoản')
            setIsCompleteLoading(false)
            setIsCompleteModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ['adminsells'] })
        },
        onError(error, variables, context) {
            console.log(error)
            message.error('Có lỗi xảy ra.')
        },
    })

    const confirmSell = (id: any) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn chấp nhận yêu cầu bán này?',
            content: 'Hành động này xác nhận rằng bạn đã chấp nhận thoả thuận bán này, tiếp đó người dùng sẽ gửi thông tin đăng nhập và thanh toán cho bạn.',
            okType: 'default',
            okText: 'Chấp nhận',
            onOk: () => {
                acceptRequestMutation.mutate(id)
            }
        })
    }

    const denySell = (id: any) => {
        Modal.error({
            title: 'Bạn có chắc muốn từ chối yêu cầu mua này?',
            content: 'Hành động này xác nhận rằng bạn từ chối mua tài khoản này',
            okType: 'danger',
            okText: 'Từ chối',
            closable: true,
            maskClosable: true,
            onOk: () => {
                denyRequestMutation.mutate(id)
            }
        })
    }

    const accountSellInfo = (account: any) => {
        Modal.info({
            title: 'Thông tin acc',
            closable: true,
            content: (
                <div>
                    <p className='py-2'>Số tướng: <strong>{account.heroes_num}</strong></p>
                    <p className='py-2'>Số trang phục: <strong>{account.costumes_num}</strong></p>
                    <p className='py-2'>Full ngọc: <strong>{account.is_full_gems ? 'Có' : 'Không'}</strong></p>
                    <p className='py-2'>Rank: <strong>{account.rank}</strong></p>
                    <p className='py-2'>Giá bán:  <strong>{account.price}</strong> đ</p>
                    <p className='py-2 inline-block mr-10'>Ảnh profile: </p>
                    <span className='inline-block w-[100px]'>
                        <Image src={account.image_url}></Image>
                    </span>
                </div>
            ),
            onOk() { },
            okType: 'default'
        });
    };


    const columns: ColumnsType<any> = [
        {
            title: 'ID yêu cầu',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'ID người bán',
            dataIndex: 'userId',
            key: 'userId',
            align: 'center',
        },
        {
            title: 'Thông tin acc',
            key: 'info',
            render: (_, record) => {
                return (
                    <div>
                        <Button onClick={() => accountSellInfo(record)} className='flex items-center w-[207px]'><EyeOutlined />Xem thông tin tài khoản</Button>
                    </div>
                )
            },
            align: 'center',
            width: '210px'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
        },
        {
            title: 'Ngày yêu cầu',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (_, { createdAt }) => (<p>{moment(createdAt).format('DD/MM/YYYY')}</p>)
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => {
                if (record.status === 'Chờ xác nhận') {
                    return (
                        <>
                            <Button onClick={() => confirmSell(record.id)} className='mr-4'>Đồng ý</Button>
                            <Button onClick={() => denySell(record.id)} danger>Từ chối</Button>
                        </>
                    )
                } else if (record.status === 'Đã gửi thông tin thanh toán') {
                    return (
                        <Button
                            onClick={() => {
                                console.log(record)
                                setSellRequest(record)
                                setIsCompleteModalOpen(true)
                            }}>Xem thông tin đăng nhập và thanh toán</Button>
                    )
                } else {
                    return ''
                }
            }
        }
    ];

    const handleComplete = async (id: any, values: any) => {
        try {
            console.log(id)
            let image_url = ''
            const { img, ...body } = values
            setIsCompleteLoading(true)
            if (img.file) {
                image_url = await imgToUrl(img.file)
            }
            body.billUrl = image_url
            confirmPayMutation.mutate({ id, body })
        } catch (error) {
            message.error('Có lỗi xảy ra')
        }
    }

    return (
        <>
            <div className='container mx-auto mt-4'>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error loading data</p>}
                {!isLoading && !isError && (
                    <Table
                        dataSource={data?.data?.data.map((sell: any) => ({ ...sell, key: sell.id })) || []}
                        columns={columns}
                        bordered
                        pagination={{
                            defaultCurrent: 1,
                            pageSize: 10,
                            position: ['bottomCenter'],
                            total: data?.data?.count || 1
                        }}
                    />
                )}
                {isCompleteModalOpen ? (
                    <Modal
                        title="Thông tin đăng nhập và thanh toán"
                        open={isCompleteModalOpen}
                        footer={[
                            <Button onClick={() => setIsCompleteModalOpen(false)} className=''>Huỷ</Button>
                        ]}
                        onCancel={() => setIsCompleteModalOpen(true)}
                    >
                        <div>
                            <p className='py-2'>Tên đăng nhập: <strong>{sellRequest?.username}</strong></p>
                            <p className='py-2'>Mật khẩu: <strong>{sellRequest?.password}</strong></p>
                            <p className='py-2 inline-block mr-10'>QR code: </p>
                            <span className='inline-block w-[100px]'>
                                <Image src={sellRequest?.payUrl}></Image>
                            </span>
                            <div className='border-b-2 mt-6 w-full'></div>
                            <div className='w-full text-center'>
                                <p className='mt-4 mb-10 text-lg font-semibold'>Cập nhật mật khẩu và chuyển khoản</p>
                            </div>
                            <Form
                                labelCol={{ span: 8 }}
                                wrapperCol={{ span: 14 }}
                                onFinish={(values) => handleComplete(sellRequest?.id, values)}
                                layout="horizontal"
                                style={{ maxWidth: 800 }}
                                labelAlign='left'
                            >
                                <Form.Item
                                    label="Mật khẩu mới"
                                    name="password"
                                    rules={[{ required: true, message: 'Bạn chưa nhập trường này' }]}
                                >
                                    <Input />
                                </Form.Item>
                                <Form.Item
                                    label='Bill chuyển khoản'
                                    name='img'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please uploade image'
                                        }
                                    ]}
                                >
                                    <Upload
                                        name='img'
                                        listType="picture-card"
                                        beforeUpload={(file) => {
                                            return new Promise((resolve, reject) => {
                                                if (file.size > 2) {
                                                    reject('File size excceed')
                                                } else {
                                                    resolve('success')
                                                }
                                            })
                                        }}
                                        maxCount={1}
                                    >
                                        <div>
                                            <PlusOutlined />
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>
                                    </Upload>
                                </Form.Item>
                                <Button
                                    className='ml-[140px]'
                                    htmlType='submit'
                                    loading={isCompleteLoading}
                                >
                                    Xác nhận đã chuyển khoản và thêm tài khoản
                                </Button>
                            </Form>
                        </div>
                    </Modal>
                ) : ''}
            </div>
        </>
    )
}

export default SellManagement