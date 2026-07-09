import React, { Component } from 'react';
import { Result, Button, Card, Row, Col, Statistic } from 'antd';
import { ShoppingCartOutlined, UserOutlined, ShoppingOutlined, LineChartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const HomeComponent = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Result
        status="success"
        title="Welcome back to KTK MOTOR ADMIN"
        subTitle="Quản lý cửa hàng bán xe máy một cách nhanh chóng và trực quan"
      />

      <Row gutter={[16, 16]} style={{ marginTop: '32px' }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Products Management"
              prefix={<ShoppingOutlined />}
              value="Manage"
              valueStyle={{ color: '#1890ff' }}
            />
            <Button
              type="primary"
              style={{ marginTop: '16px', width: '100%' }}
              onClick={() => navigate('/admin/product')}
            >
              Go to Products
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Categories"
              prefix={<ShoppingCartOutlined />}
              value="Manage"
              valueStyle={{ color: '#52c41a' }}
            />
            <Button
              type="primary"
              style={{ marginTop: '16px', width: '100%' }}
              onClick={() => navigate('/admin/category')}
            >
              Go to Categories
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Customers"
              prefix={<UserOutlined />}
              value="View"
              valueStyle={{ color: '#faad14' }}
            />
            <Button
              type="primary"
              style={{ marginTop: '16px', width: '100%' }}
              onClick={() => navigate('/admin/customer')}
            >
              View Customers
            </Button>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Dashboard Analytics"
              prefix={<LineChartOutlined />}
              value="View"
              valueStyle={{ color: '#eb2f96' }}
            />
            <Button
              type="primary"
              style={{ marginTop: '16px', width: '100%' }}
              onClick={() => navigate('/admin/dashboard')}
            >
              View Dashboard
            </Button>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: '32px' }}>
        <h3>Quick Start</h3>
        <ul style={{ lineHeight: '2' }}>
          <li>Quản lý danh mục sản phẩm và cập nhật giá bán</li>
          <li>Theo dõi đơn hàng và trạng thái giao hàng</li>
          <li>Xem thống kê doanh thu theo ngày, tháng, năm</li>
          <li>Quản lý thông tin khách hàng</li>
          <li>Xuất báo cáo doanh thu dưới dạng PDF</li>
        </ul>
      </Card>
    </div>
  );
};

export default HomeComponent;