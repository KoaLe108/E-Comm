import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Card, Tag, Space } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null,
      loading: false
    };
  }

  render() {
    const orderColumns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: '15%',
        ellipsis: true,
      },
      {
        title: 'Creation Date',
        dataIndex: 'cdate',
        key: 'cdate',
        width: '15%',
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: 'Customer Name',
        dataIndex: ['customer', 'name'],
        key: 'customerName',
        width: '12%',
      },
      {
        title: 'Phone',
        dataIndex: ['customer', 'phone'],
        key: 'phone',
        width: '12%',
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: '10%',
        render: (total) => <span>{Number(total).toLocaleString('vi-VN')} vnđ</span>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (status) => {
          const color = status === 'completed' ? 'green' : 'orange';
          return <Tag color={color}>{status}</Tag>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        width: '16%',
        render: (_, record) => (
          <Space>
            {record.status !== 'completed' && (
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => this.handleConfirm(record._id)}
              >
                Confirm
              </Button>
            )}
            <Button
              type="default"
              size="small"
              onClick={() => this.setState({ order: record })}
            >
              View Detail
            </Button>
          </Space>
        ),
      },
    ];

    const itemColumns = [
      {
        title: 'No.',
        key: 'index',
        width: '8%',
        render: (_, __, index) => index + 1,
      },
      {
        title: 'Product ID',
        dataIndex: ['product', '_id'],
        key: '_id',
        width: '15%',
        ellipsis: true,
      },
      {
        title: 'Product Name',
        dataIndex: ['product', 'name'],
        key: 'name',
        width: '15%',
      },
      {
        title: 'Image',
        dataIndex: ['product', 'image'],
        key: 'image',
        width: '10%',
        render: (image) => (
          <img
            src={"data:image/jpg;base64," + image}
            alt="product"
            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
          />
        ),
      },
      {
        title: 'Price',
        dataIndex: ['product', 'price'],
        key: 'price',
        width: '12%',
        render: (price) => <span>{price.toLocaleString('vi-VN')} vnđ</span>,
      },
      {
        title: 'Quantity',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '10%',
      },
      {
        title: 'Amount',
        key: 'amount',
        width: '12%',
        render: (_, record) => (
          <span>{(record.product.price * record.quantity).toLocaleString('vi-VN')} vnđ</span>
        ),
      },
    ];

    return (
      <div>
        <Card title="Order Management" style={{ marginBottom: '24px' }}>
          <Table
            columns={orderColumns}
            dataSource={this.state.orders.map((item) => ({
              ...item,
              key: item._id,
            }))}
            loading={this.state.loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </Card>

        {this.state.order && (
          <Card title={`Order Detail - ${this.state.order._id}`}>
            <Table
              columns={itemColumns}
              dataSource={this.state.order.items?.map((item, index) => ({
                ...item,
                key: item.product._id,
              })) || []}
              pagination={false}
              scroll={{ x: 800 }}
            />
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <strong>Total: {Number(this.state.order.total).toLocaleString('vi-VN')} vnđ</strong>
            </div>
          </Card>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  handleConfirm(id) {
    if (window.confirm('Are you sure to confirm this order?')) {
      this.apiPutOrderStatus(id, 'completed');
    }
  }

  apiGetOrders() {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/orders', config)
      .then((res) => {
        this.setState({ orders: res.data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put('/api/admin/orders/' + id + '/status', body, config)
      .then((res) => {
        if (res.data.success) {
          this.apiGetOrders();
        }
      });
  }
}

export default Order;