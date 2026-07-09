import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Card, Tag, Space, Modal } from 'antd';
import { MailOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class Customer extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      orders: [],
      order: null,
      loading: false
    };
  }

  render() {
    const customerColumns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: '12%',
        ellipsis: true,
      },
      {
        title: 'Username',
        dataIndex: 'username',
        key: 'username',
        width: '12%',
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '15%',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        width: '12%',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: '12%',
      },
      {
        title: 'Password',
        dataIndex: 'password',
        key: 'password',
        width: '10%',
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        width: '8%',
        render: (active) => {
          const color = active === 1 ? 'green' : 'red';
          const text = active === 1 ? 'Active' : 'Inactive';
          return <Tag color={color}>{text}</Tag>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        width: '24%',
        render: (_, record) => (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => this.trCustomerClick(record)}
            >
              View Orders
            </Button>
            {record.active === 0 ? (
              <Button
                type="default"
                size="small"
                icon={<MailOutlined />}
                onClick={() => this.lnkEmailClick(record)}
              >
                Send Email
              </Button>
            ) : (
              <Button
                danger
                size="small"
                icon={<LockOutlined />}
                onClick={() => this.lnkDeactiveClick(record)}
              >
                Deactive
              </Button>
            )}
          </Space>
        ),
      },
    ];

    const orderColumns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: '15%',
        ellipsis: true,
      },
      {
        title: 'Date',
        dataIndex: 'cdate',
        key: 'cdate',
        width: '15%',
        render: (date) => new Date(date).toLocaleDateString(),
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: '12%',
        render: (total) => <span>{Number(total).toLocaleString('vi-VN')} vnđ</span>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '12%',
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
          <Button
            type="link"
            onClick={() => this.setState({ order: record })}
          >
            View Detail
          </Button>
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
        <Card title="Customer Management" style={{ marginBottom: '24px' }}>
          <Table
            columns={customerColumns}
            dataSource={this.state.customers.map((item) => ({
              ...item,
              key: item._id,
            }))}
            loading={this.state.loading}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        </Card>

        {this.state.orders.length > 0 && (
          <Card title="Customer Orders" style={{ marginBottom: '24px' }}>
            <Table
              columns={orderColumns}
              dataSource={this.state.orders.map((item) => ({
                ...item,
                key: item._id,
              }))}
              pagination={false}
              scroll={{ x: 800 }}
            />
          </Card>
        )}

        {this.state.order && (
          <Card title={`Order Detail - ${this.state.order._id}`}>
            <Table
              columns={itemColumns}
              dataSource={this.state.order.items?.map((item) => ({
                ...item,
                key: item.product._id,
              })) || []}
              pagination={false}
              scroll={{ x: 900 }}
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
    this.apiGetCustomers();
  }

  // Event-handlers
  trCustomerClick(item) {
    this.setState({ orders: [], order: null });
    this.apiGetOrdersByCustID(item._id);
  }

  lnkDeactiveClick(item) {
    this.apiPutCustomerDeactive(item._id, item.token);
  }

  lnkActiveClick(item) {
    this.apiPutCustomerActive(item._id, item.token);
  }

  lnkEmailClick(item) {
    this.apiGetCustomerSendmail(item._id);
  }

  // APIs
  apiGetCustomers() {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/customers', config)
      .then((res) => {
        this.setState({ customers: res.data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders/customer/' + cid, config).then((res) => {
      this.setState({ orders: res.data });
    });
  }

  apiPutCustomerDeactive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/deactive/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      }
    });
  }

  apiPutCustomerActive(id, token) {
    const body = { token: token };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/customers/active/' + id, body, config).then((res) => {
      if (res.data) {
        this.apiGetCustomers();
      }
    });
  }

  apiGetCustomerSendmail(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/customers/sendmail/' + id, config)
      .then((res) => {
        Modal.success({
          title: 'Email Sent',
          content: res.data.message,
        });
      });
  }
}

export default Customer;