import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Table, Card, Row, Col, Drawer, Empty, Tag, Statistic, message } from 'antd';
import { ShoppingCartOutlined, CalendarOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      selectedOrder: null,
      drawerVisible: false,
      loading: false
    };
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    const orderColumns = [
      {
        title: 'Order ID',
        dataIndex: '_id',
        key: '_id',
        render: (text) => <span>{text.substring(0, 8)}...</span>,
      },
      {
        title: 'Date',
        dataIndex: 'cdate',
        key: 'cdate',
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        render: (total) => <span>{total.toLocaleString('vi-VN')} vnđ</span>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status) => {
          let color = 'default';
          if (status === 'Delivered') color = 'green';
          if (status === 'Cancelled') color = 'red';
          if (status === 'Pending') color = 'orange';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
          <a onClick={() => this.showOrderDetail(record)}>View Details</a>
        ),
      },
    ];

    const detailColumns = [
      {
        title: 'Product Name',
        dataIndex: ['product', 'name'],
        key: 'name',
      },
      {
        title: 'Image',
        dataIndex: ['product', 'image'],
        key: 'image',
        render: (image) => <img src={"data:image/jpg;base64," + image} width="60px" height="60px" alt="product" />,
      },
      {
        title: 'Price',
        dataIndex: ['product', 'price'],
        key: 'price',
        render: (price) => <span>{price.toLocaleString('vi-VN')} vnđ</span>,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Amount',
        key: 'amount',
        render: (_, record) => <span>{(record.product.price * record.quantity).toLocaleString('vi-VN')} vnđ</span>,
      },
    ];

    const orderData = this.state.orders.map((order) => ({
      key: order._id,
      ...order,
    }));

    return (
      <div style={{ padding: '20px' }}>
        <Card title="My Orders" extra={<ShoppingCartOutlined />} loading={this.state.loading}>
          {this.state.orders.length === 0 ? (
            <Empty description="No orders yet" style={{ marginTop: '50px' }} />
          ) : (
            <Table
              columns={orderColumns}
              dataSource={orderData}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>

        <Drawer
          title="Order Details"
          placement="right"
          onClose={() => this.setState({ drawerVisible: false })}
          open={this.state.drawerVisible}
          width={700}
        >
          {this.state.selectedOrder && (
            <>
              <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={12}>
                  <Statistic
                    title="Order ID"
                    value={this.state.selectedOrder._id.substring(0, 8)}
                    prefix={<ShoppingCartOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Date"
                    value={new Date(this.state.selectedOrder.cdate).toLocaleDateString()}
                    prefix={<CalendarOutlined />}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: '20px' }}>
                <Col span={12}>
                  <Statistic
                    title="Customer"
                    value={this.state.selectedOrder.customer.name}
                    prefix={<UserOutlined />}
                  />
                </Col>
                <Col span={12}>
                  <Statistic
                    title="Phone"
                    value={this.state.selectedOrder.customer.phone}
                    prefix={<PhoneOutlined />}
                  />
                </Col>
              </Row>

              <h3 style={{ marginTop: '20px', marginBottom: '10px' }}>Items</h3>
              <Table
                columns={detailColumns}
                dataSource={this.state.selectedOrder.items.map((item, index) => ({
                  key: item.product._id,
                  ...item,
                  index: index + 1,
                }))}
                pagination={false}
                size="small"
              />

              <Row style={{ marginTop: '20px', padding: '10px 0', borderTop: '1px solid #f0f0f0' }}>
                <Col span={18} style={{ textAlign: 'right' }}>
                  <strong>Total Amount:</strong>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <strong style={{ fontSize: '16px', color: '#1890ff' }}>
                    {this.state.selectedOrder.total.toLocaleString('vi-VN')} vnđ
                  </strong>
                </Col>
              </Row>

              <Row style={{ marginTop: '10px' }}>
                <Col span={18} style={{ textAlign: 'right' }}>
                  <strong>Status:</strong>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Tag
                    color={
                      this.state.selectedOrder.status === 'Delivered'
                        ? 'green'
                        : this.state.selectedOrder.status === 'Cancelled'
                          ? 'red'
                          : 'orange'
                    }
                  >
                    {this.state.selectedOrder.status}
                  </Tag>
                </Col>
              </Row>
            </>
          )}
        </Drawer>
      </div>
    );
  }

  componentDidMount() {
    this.setState({ loading: true });
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  // event-handlers
  showOrderDetail(order) {
    this.setState({
      selectedOrder: order,
      drawerVisible: true,
    });
  }

  // apis
  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/customer/orders/customer/' + cid, config)
      .then((res) => {
        this.setState({
          orders: res.data,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error(error.response?.data?.message || 'Failed to load orders');
      });
  }
}
export default Myorders;