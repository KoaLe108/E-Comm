import React, { Component } from 'react';
import { Layout, Menu, Button, Space, Avatar } from 'antd';
import { LogoutOutlined, DashboardOutlined, ShoppingOutlined, AppstoreOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';

const MenuComponent = (props) => {
  const context = React.useContext(MyContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    context.setToken('');
    context.setUsername('');
    navigate('/');
  };

  const menuItems = [
    {
      key: 'home',
      icon: <DashboardOutlined />,
      label: 'Home',
      onClick: () => navigate('/admin/home'),
    },
    {
      key: 'category',
      icon: <AppstoreOutlined />,
      label: 'Category',
      onClick: () => navigate('/admin/category'),
    },
    {
      key: 'product',
      icon: <ShoppingOutlined />,
      label: 'Product',
      onClick: () => navigate('/admin/product'),
    },
    {
      key: 'order',
      icon: <UnorderedListOutlined />,
      label: 'Order',
      onClick: () => navigate('/admin/order'),
    },
    {
      key: 'customer',
      icon: <UserOutlined />,
      label: 'Customer',
      onClick: () => navigate('/admin/customer'),
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      onClick: () => navigate('/admin/dashboard'),
    },
  ];

  return (
    <Layout.Header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#001529',
        paddingLeft: '50px',
        paddingRight: '50px',
      }}
    >
      <Menu
        mode="horizontal"
        items={menuItems}
        style={{
          flex: 1,
          minWidth: 0,
          background: 'transparent',
        }}
        theme="dark"
      />
      <Space size="large">
        <span style={{ color: 'white', fontSize: '14px' }}>
          <Avatar size="small" icon={<UserOutlined />} />
          {' '}{context.username}
        </span>
        <Button
          type="primary"
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Space>
    </Layout.Header>
  );
};

export default MenuComponent;