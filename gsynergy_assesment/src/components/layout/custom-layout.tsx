import AppRoutes from '../../routes/routes';
import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';
import { Button, Layout, Menu, Dropdown, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import './custom-layout.css';
import logo from '../../assets/gs-logo.svg'; 


const { Header, Sider, Content } = Layout;
const CustomLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState(window.location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedKey(window.location.pathname);
  }, []);

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
    navigate(key);
  };

  const menu = (
    <Menu>
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout className="full-height-layout">
      <Header className='header'>
          <img src={logo} alt="Logo" className='logo' />
          <div className='project-title'>Data Viewer App</div>
          <Dropdown overlay={menu} className='account'>
            <Avatar size={32} icon={<UserOutlined />} />
          </Dropdown>
      </Header>
      <Layout>
        <Sider trigger={null} collapsible collapsed={collapsed} className='slider'>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className='slider-button'
          />
          <div className="demo-logo-vertical" />
          <Menu
            theme="light"
            mode="inline"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            items={[
              {
                key: '/',
                icon: <ShopOutlined />,
                label: 'Store',
              },
              {
                key: '/sku',
                icon: <AppstoreOutlined />,
                label: 'SKU',
              },
              {
                key: '/planning',
                icon: <AreaChartOutlined />,
                label: 'Planning',
              },
              {
                key: '/charts',
                icon: <BarChartOutlined />,
                label: 'Charts',
              },
            ]}
          />
        </Sider>
        <Content className='content'>
          <AppRoutes />
        </Content>
      </Layout>
    </Layout>
  );
};

export default CustomLayout;
