import { Button, Table, Image, Modal, message } from 'antd';
import { IPurchase } from '../shared/types/purchase.type';
import moment from 'moment';
import { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import purchaseService from '../shared/services/purchase.service';


const PurchaseManagement = () => {

    const queryClient = useQueryClient()

    //api
    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['adminpurchases'],
        queryFn: async () => {
            try {
                const data = await purchaseService.getPurchases()
                return data
            } catch (error) {

            }
        }

    })

    const acceptRequestMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await purchaseService.acceptPurchase(id)
            return response
        },
        onSuccess(data, variables, context) {
            message.success('Chấp nhận yêu cầu mua tài khoản thành công.')
            queryClient.invalidateQueries({ queryKey: ['adminpurchases'] })
        },
        onError(error, variables, context) {
            console.log(error)
            message.error('Có lỗi xảy ra.')
        },
    })

    const denyRequestMutation = useMutation({
        mutationFn: async (id: any) => {
            const response = await purchaseService.denyPurchase(id)
            return response
        },
        onSuccess(data, variables, context) {
            message.success('Đã từ chối yêu cầu.')
            queryClient.invalidateQueries({ queryKey: ['adminpurchases'] })
        },
        onError(error, variables, context) {
            console.log(error)
            message.error('Có lỗi xảy ra.')
        },
    })

    const confirmPurchase = (id: any) => {
        Modal.confirm({
            title: 'Bạn có chắc muốn chấp nhận yêu cầu mua này?',
            content: 'Hành động này xác nhận rằng bạn đã nhận được tiền từ người mua, tài khoản và mật khẩu game liên quân sẽ được gửi tới người mua.',
            okType: 'default',
            okText: 'Chấp nhận',
            onOk: () => {
                acceptRequestMutation.mutate(id)
            }
        })
    }

    const denyPurchase = (id: any) => {
        Modal.error({
            title: 'Bạn có chắc muốn từ chối yêu cầu mua này?',
            content: 'Hành động này xác nhận rằng bạn chưa nhận được tiền từ người mua.',
            okType: 'danger',
            okText: 'Từ chối',
            closable: true,
            cancelText: 'Huỷ',
            onOk: () => {
                denyRequestMutation.mutate(id)
            }
        })
    }

    const columns: ColumnsType<any> = [
        {
            title: 'ID yêu cầu',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'ID người mua',
            dataIndex: 'userId',
            key: 'userId',
            align: 'center',
        },
        {
            title: 'ID tài khoản mua',
            dataIndex: 'accountId',
            key: 'accountId',
            align: 'center',
        },
        {
            title: 'Giá mua',
            dataIndex: 'accountPrice',
            key: 'accountPrice',
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
        },
        {
            title: 'Bill chuyển khoản',
            dataIndex: 'billUrl',
            key: 'billUrl',
            align: 'center',
            render: (_, { billUrl }) => (
                <Image
                    width={100}
                    src={billUrl}
                />
            )
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
                            <Button onClick={() => confirmPurchase(record.id)} className='mr-4'>Đồng ý</Button>
                            <Button onClick={() => denyPurchase(record.id)} danger>Từ chối</Button>
                        </>
                    )
                } else {
                    return ''
                }
            },
        }
    ];

    const dataSource: IPurchase[] = []

    //hook

    return (
        <>
            <div className='container mx-auto mt-4'>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error loading data</p>}
                {!isLoading && !isError && (
                    <Table
                        dataSource={data?.data?.data.map((purchase: any) => ({ ...purchase, key: purchase.id })) || []}
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

export default PurchaseManagement