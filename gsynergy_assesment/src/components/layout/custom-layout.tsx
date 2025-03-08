import AppRoutes from '../../routes/routes';
import React, { useState } from 'react';
import {
  AppstoreOutlined,
  AreaChartOutlined,
  BarChartOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar } from 'antd';
import { Button, Layout, Menu, Dropdown, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import './custom-layout.css';
import logo from '../../assets/gs-logo.svg'; 


const { Header, Sider, Content } = Layout;
const CustomLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  return (
    <Layout className="full-height-layout">
      <Header className='header'>
          <img src={logo} alt="Logo" className='logo' />
          <div className='project-title'>Data Viewer App</div>
          <Avatar className='account' size={32} icon={<UserOutlined />} /> 
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
            defaultSelectedKeys={['/']}
            onClick={({ key }) => navigate(key)}
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
