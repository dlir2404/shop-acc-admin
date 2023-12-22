'use client'
import Image from 'next/image'
import React, { useState } from 'react';
import { ContactsOutlined, UserOutlined, ShoppingCartOutlined, RedEnvelopeOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import UserManagement from './components/UserManagement';
import AccountManagement from './components/AccountManagement';
import PurchaseManagement from './components/PurchaseManagement';

export default function Home() {
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

  const [current, setCurrent] = useState('user management');

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
  };

  const renderContent = (current: string) => {
    if (current === 'user management') return (<UserManagement />)
    else if (current === 'account management') return (<AccountManagement />)
    else if (current === 'purchase management') return (<PurchaseManagement />)
  }

  return (
    <div className='mt-20'>
      <Menu className='justify-center' onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />
      {renderContent(current)}
    </div>
  )
}
