'use client'
import Image from 'next/image'
import React, { useState } from 'react';
import { ContactsOutlined, UserOutlined, ShoppingCartOutlined, RedEnvelopeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu, Popover, Avatar, Button, message } from 'antd';
import UserManagement from './components/UserManagement';
import AccountManagement from './components/AccountManagement';
import PurchaseManagement from './components/PurchaseManagement';
import { useRouter } from 'next/navigation';
import { dataTagSymbol, useQuery } from '@tanstack/react-query';
import localStorageService from './shared/services/localStorage.service';

const Home = () => {
  const [current, setCurrent] = useState('user management');
  const router = useRouter()

  const verifyLogin = useQuery({
    queryKey: ['verify'],
    queryFn: async () => {
      const token = localStorageService.getValue('DINH_LINH_SHOP_ADMIN_TOKEN')
      if (!token) {
        const response = await fetch('http://localhost:8080/api/admin/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        return response
      } else {
        const response = await fetch('http://localhost:8080/api/admin/auth/verify', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        });
        return response
      }
    }
  })

  if (verifyLogin.isLoading) return (<p>Loading...</p>)


  if (((verifyLogin.data?.status !== 200) && (verifyLogin.data?.status !== 204)) || verifyLogin.isError) {
    message.error('Unauthorized')
    return router.push('/login')
  } else {
    const items: MenuProps['items'] = [
      {
        label: 'Quản lý người dùng',
        key: 'user management',
        icon: <UserOutlined />,
      },
      {
        label: 'Quản lý tài khoản game',
        key: 'account management',
        icon: <ContactsOutlined />,
      },
      {
        label: 'Quản lý yêu cầu mua tài khoản',
        key: 'purchase management',
        icon: <ShoppingCartOutlined />,
      },
      {
        label: 'Quản lý yêu cầu bán tài khoản',
        key: 'sell management',
        icon: <RedEnvelopeOutlined />
      },
    ];

    const onClick: MenuProps['onClick'] = (e) => {
      setCurrent(e.key);
    };

    const renderContent = (current: string) => {
      if (current === 'user management') return (<UserManagement />)
      else if (current === 'account management') return (<AccountManagement />)
      else if (current === 'purchase management') return (<PurchaseManagement />)
    }

    const handleLogout = () => {
      localStorageService.cleanAll()
      router.push('/login')
      message.success('Đăng xuất thành công')
    }

    return (
      <>
        <div className='flex justify-end mt-10 mr-40'>
          <Popover
            className=''
            content={<Button onClick={handleLogout}>Đăng xuất</Button>}
          >
            <Avatar size="large" icon={<UserOutlined />} />
          </Popover>
        </div>
        <div className='mt-10'>
          <Menu className='justify-center' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
          {renderContent(current)}
        </div>
      </>
    )
  }
}

export default Home