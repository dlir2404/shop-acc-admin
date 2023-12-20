import { Button, Table } from 'antd';
import { IUser } from '../shared/types/user.type';
import userService from '../shared/services/user.service';
import { ColumnsType } from 'antd/es/table'

const UserManagement = () => {
    const columns: ColumnsType<IUser> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'username',
            key: 'username',
            align: 'center',
        },
        {
            title: 'Ngày tham gia',
            dataIndex: 'createAt',
            key: 'createAt',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: () => <Button danger>Chặn</Button>,
        }
    ];

    const dataSource: IUser[] = []

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

export default UserManagement