import { Button, Table } from 'antd';
import { IAccount } from '../shared/types/account.type';
import userService from '../shared/services/user.service';
import { ColumnsType } from 'antd/es/table'

const AccountManagement = () => {
    const columns: ColumnsType<IAccount> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
        },
        {
            title: 'Mật khẩu',
            dataIndex: 'password',
            key: 'password',
            align: 'center',
        },
        {
            title: 'Số tướng',
            dataIndex: 'heroes_num',
            key: 'heroes_num',
            align: 'center',
        },
        {
            title: 'Số tướng',
            dataIndex: 'heroes_num',
            key: 'heroes_num',
            align: 'center',
        },
        {
            title: 'Số trang phục',
            dataIndex: 'costumes_num',
            key: 'costumes_num',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: () => <Button danger>Xóa tài khoản</Button>,
        }
    ];

    const dataSource: IAccount[] = []

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

export default AccountManagement