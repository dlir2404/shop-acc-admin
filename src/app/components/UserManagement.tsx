import { Button, Table, Modal, message } from 'antd';
import moment from 'moment';
import userService from '../shared/services/user.service';
import { ColumnsType } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query';

const UserManagement = () => {

    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                const data = await userService.getUsers()
                return data
            } catch (error) {
                message.error('Có lỗi xảy ra')
                console.log(error)
            }
        }

    })


    //lock modal
    const lockUser = (id: any) => {
        Modal.error({
            title: 'Bạn có chắc muốn khoá người dùng này?',
            content: 'Bạn có thể mở khoá lại cho người dùng sau đó.',
            okType: 'danger',
            okText: 'Khoá',
            onOk: () => {
                console.log(id)
            }
        });
    };


    //column
    const columns: ColumnsType<any> = [
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
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (_, { createdAt }) => (<p>{moment(createdAt).format('DD/MM/YYYY')}</p>)
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => <Button onClick={() => lockUser(record.id)} danger>Khoá tài khoản</Button>,
        }
    ];

    return (
        <>
            <div className='container mx-auto mt-4'>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error loading data</p>}
                {!isLoading && !isError && (
                    <Table
                        dataSource={data?.data?.data.map((user: any) => ({ ...user, key: user.id })) || []}
                        columns={columns}
                        bordered
                        pagination={{
                            defaultCurrent: 1,
                            pageSize: 10,
                            position: ['bottomCenter'],
                            total: data?.data?.count || 1, // Use data?.total to ensure it exists
                        }}
                    />
                )}
            </div>
        </>
    )
}

export default UserManagement