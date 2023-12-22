import { Button, Table, Modal } from 'antd';
import { IAccountRes } from '../shared/types/account.type';
import { ColumnsType } from 'antd/es/table'
import { useQuery } from '@tanstack/react-query';
import accountService from '../shared/services/account.service';


const AccountManagement = () => {
    const { data, isLoading, isError } = useQuery<any>({
        queryKey: ['adminaccounts'],
        queryFn: async () => {
            try {
                const data = await accountService.getAccounts()
                return data
            } catch (error) {

            }
        }

    })


    const deleteAccount = (id: any) => {
        Modal.error({
            title: 'Bạn có chắc muốn xoá tài khoản này khỏi hệ thống?',
            content: 'Hành động này sẽ xoá vĩnh viễn tài khoản khỏi hệ thống và sẽ không thể khôi phục lại.',
            okType: 'danger',
            okText: 'Xoá',
            onOk: () => {
                console.log(id)
            }
        });
    };

    const columns: ColumnsType<any> = [
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
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            align: 'center',
        },
        {
            title: 'Hành động',
            key: 'action',
            align: 'center',
            render: (_, record) => <Button onClick={() => deleteAccount(record.id)} danger>Xóa tài khoản</Button>,
        }
    ];

    //hook

    return (
        <>
            <div className='container mx-auto mt-4'>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error loading data</p>}
                {!isLoading && !isError && (
                    <Table
                        dataSource={data?.data?.data.map((account: any) => ({ ...account, key: account.id })) || []}
                        columns={columns}
                        bordered
                        pagination={{
                            defaultCurrent: 1,
                            pageSize: 10,
                            position: ['bottomCenter'],
                            total: data.data.count   //count
                            // current: page,
                        }}
                    />
                )}
            </div>
        </>
    )
}

export default AccountManagement