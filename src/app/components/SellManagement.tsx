import { Button, Table, Image, Modal, message } from 'antd';
import { EyeOutlined } from '@ant-design/icons'
import { IPurchase } from '../shared/types/purchase.type';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import sellService from '../shared/services/sell.service';

const SellManagement = () => {

    const queryClient = useQueryClient()

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

    const confirmSell = (id: any) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn chấp nhận yêu cầu bán này?',
            content: 'Hành động này xác nhận rằng bạn đã chấp nhận thoả thuận bán này, tiếp đó người dùng sẽ gửi thông tin đăng nhập và thanh toán cho bạn.',
            okType: 'primary',
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
            onOk: () => {
                denyRequestMutation.mutate(id)
            }
        })
    }

    const accountSellInfo = (account: any) => {
        Modal.info({
            title: 'Thông tin acc',
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
        });
    };

    const payInfo = (account: any) => {
        Modal.info({
            title: 'Thông tin đăng nhập và thanh toán',
            content: (
                <div>
                    <p className='py-2'>Tên đăng nhập: <strong>{account.username}</strong></p>
                    <p className='py-2'>Mật khẩu: <strong>{account.password}</strong></p>
                    <p className='py-2 inline-block mr-10'>QR code: </p>
                    <span className='inline-block w-[100px]'>
                        <Image src={account.payUrl}></Image>
                    </span>
                </div>
            ),
            okType: 'default',
            okText: 'Xác nhận đã chuyển tiền và thêm tài khoản',
            onOk() { },
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
                        <Button onClick={() => payInfo(record)}>Xem thông tin đăng nhập và thanh toán</Button>
                    )
                } else {
                    return ''
                }
            }
        }
    ];


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
            </div>
        </>
    )
}

export default SellManagement