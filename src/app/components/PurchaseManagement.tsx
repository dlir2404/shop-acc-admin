import { Button, Table } from 'antd';
import { IPurchase } from '../shared/types/purchase.type';
import userService from '../shared/services/user.service';
import { ColumnsType } from 'antd/es/table'

const PurchaseManagement = () => {
    const columns: ColumnsType<IPurchase> = [
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
        },
        {
            title: 'Ngày yêu cầu',
            dataIndex: 'createAt',
            key: 'createAt',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: () => (
                <>
                    <Button>Đồng ý</Button>
                    <Button danger>Từ chối</Button>
                </>
            ),
        }
    ];

    const dataSource: IPurchase[] = []

    //hook

    return (
        <>
            <div className='container mx-auto mt-4'>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    bordered
                    pagination={{
                        defaultCurrent: 1,
                        pageSize: 10,
                        position: ['bottomCenter'],
                        total: 50 || 1   //count
                        // current: page,
                    }}
                />
            </div>
        </>
    )
}

export default PurchaseManagement