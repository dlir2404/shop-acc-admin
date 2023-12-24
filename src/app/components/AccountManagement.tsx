import { Button, Table, Modal, message } from 'antd';
import { IAccount, IAccountRes } from '../shared/types/account.type';
import { ColumnsType } from 'antd/es/table'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import accountService from '../shared/services/account.service';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import {
    Checkbox,
    Form,
    Input,
    InputNumber,
    Select,
    Upload,
} from 'antd';
const { Option } = Select;


const AccountManagement = () => {

    const queryClient = useQueryClient()
    const [isModalAddOpen, setIsModalAddOpen] = useState(false)


    //api
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

    const deleteMutation = useMutation({
        mutationFn: (id: any) => accountService.deleteAccount(id),
        onSuccess(data, variables, context) {
            message.success('Xoá tài khoản thành công')
            queryClient.invalidateQueries({ queryKey: ['adminaccounts'] })
        },
        onError(error: any) {
            message.error(error.response.data.message)
        }
    })

    const addMutation = useMutation({
        mutationFn: (values: IAccount) => accountService.addAccount(values),
        onSuccess(data, variables, context) {
            message.success('Đăng bài thành công')
            queryClient.invalidateQueries({ queryKey: ['adminaccounts'] })
        },
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
                <div>
                    <Button onClick={() => setIsModalAddOpen(true)} className='ml-30 mb-5'>Thêm tài khoản</Button>
                </div>
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
            {isModalAddOpen ?
                (<Modal
                    title="Thêm tài khoản mới"
                    open={isModalAddOpen}
                    footer={[
                        <Button key="back" onClick={() => setIsModalAddOpen(false)}>
                            Huỷ
                        </Button>
                    ]}
                    onCancel={() => setIsModalAddOpen(false)}
                >
                    <Form
                        labelCol={{ span: 6 }}
                        wrapperCol={{ span: 14 }}
                        layout="horizontal"
                        style={{ maxWidth: 800 }}
                        labelAlign='left'
                    >
                        <Form.Item label="Tên tài khoản" name='username'>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu"
                            name="password"
                            rules={[{ required: true, message: 'Bạn chưa nhập trường này' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item label="Select">
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Số tướng">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Số trang phục">
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label='Rank' name="rank">
                            <Select
                                allowClear
                            >
                                <Option value="thachdau">Thách đấu</Option>
                                <Option value="chientuong">Chiến tướng</Option>
                                <Option value="caothu">Cao thủ</Option>
                                <Option value="tinhanh">Tinh Anh</Option>
                                <Option value="kimcuong">Kim Cương</Option>
                                <Option value="bachkim">Bạch kim</Option>
                                <Option value="vang">{'< '}Bạch kim</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Full tướng" name="disabled" valuePropName="checked">
                            <Checkbox></Checkbox>
                        </Form.Item>
                        <Form.Item label="Giá" name='price'>
                            <InputNumber />
                        </Form.Item>
                        <Form.Item label="Ảnh profile" valuePropName="fileList">
                            <Upload action="/upload.do" listType="picture-card">
                                <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>Upload</div>
                                </div>
                            </Upload>
                        </Form.Item>
                        <Button className='bg-[#1777ff] ml-[173px] text-white hover:text-white' htmlType='submit'>Thêm tài khoản</Button>
                    </Form>
                </Modal>) : ''}
        </>
    )
}

export default AccountManagement