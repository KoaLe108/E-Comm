import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Card, Tag, Space, Row, Col, message, Modal, DatePicker, Select } from 'antd';
import { CheckOutlined, FileSearchOutlined, CloseOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

const { RangePicker } = DatePicker;

class Order extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      dateRange: null,
      statusFilter: 'ALL',
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
        width: '20%',
        ellipsis: true,
      },
      {
        title: 'Creation Date',
        dataIndex: 'cdate',
        key: 'cdate',
        width: '15%',
        render: (date) => new Date(date).toLocaleString('vi-VN'),
      },
      {
        title: 'Customer Name',
        dataIndex: ['customer', 'name'],
        key: 'customerName',
        width: '15%',
      },
      {
        title: 'Phone',
        dataIndex: ['customer', 'phone'],
        key: 'phone',
        width: '15%',
      },
      {
        title: 'Total',
        dataIndex: 'total',
        key: 'total',
        width: '15%',
        render: (total) => <strong>{Number(total).toLocaleString('vi-VN')} vnđ</strong>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (status) => {
          const s = status ? status.toLowerCase() : '';
          let color = 'orange';
          if (s === 'completed') color = 'green';
          else if (s === 'cancelled') color = 'red';
          return <Tag color={color} style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>{status}</Tag>;
        },
      },
      {
        title: 'Action',
        key: 'action',
        width: '10%',
        render: (_, record) => (
          <Button
            type="primary"
            size="small"
            icon={<FileSearchOutlined />}
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
        width: '20%',
        ellipsis: true,
      },
      {
        title: 'Product Name',
        dataIndex: ['product', 'name'],
        key: 'name',
        width: '25%',
      },
      {
        title: 'Image',
        dataIndex: ['product', 'image'],
        key: 'image',
        width: '15%',
        render: (image) => (
          <img
            src={image}
            alt="product"
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
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
        width: '10%',
        render: (_, record) => (
          <span>{(record.product.price * record.quantity).toLocaleString('vi-VN')} vnđ</span>
        ),
      },
    ];

    const selectedStatus = this.state.order?.status ? this.state.order.status.toLowerCase() : '';
    let tagColor = 'orange';
    if (selectedStatus === 'completed') tagColor = 'green';
    else if (selectedStatus === 'cancelled') tagColor = 'red';

    const { orders, dateRange, statusFilter } = this.state;
    let displayOrders = orders;

    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day').valueOf();
      const endDate = dateRange[1].endOf('day').valueOf();
      displayOrders = orders.filter(item => {
        const orderTime = new Date(item.cdate).getTime();
        return orderTime >= startDate && orderTime <= endDate;
      });
    }

    if (statusFilter && statusFilter !== 'ALL') {
      displayOrders = displayOrders.filter(item => {
        return item.status && item.status.toUpperCase() === statusFilter.toUpperCase();
      });
    }

    return (
      <div>
        <Card 
          title="Order Management" 
          extra={
            <Space size="large">
              <Space>
                <span style={{ fontSize: '14px', color: '#555' }}>Lọc theo trạng thái:</span>
                <Select
                  value={statusFilter}
                  onChange={(val) => this.setState({ statusFilter: val })}
                  style={{ width: 150 }}
                >
                  <Select.Option value="ALL">Tất cả trạng thái</Select.Option>
                  <Select.Option value="PENDING">Pending</Select.Option>
                  <Select.Option value="COMPLETED">Completed</Select.Option>
                  <Select.Option value="CANCELLED">Cancelled</Select.Option>
                </Select>
              </Space>

              <Space>
                <span style={{ fontSize: '14px', color: '#555' }}>Lọc theo thời gian:</span>
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => this.setState({ dateRange: dates })}
                  format="DD/MM/YYYY"
                  placeholder={['Từ ngày', 'Đến ngày']}
                />
                {(dateRange || statusFilter !== 'ALL') && (
                  <Button 
                    type="link" 
                    onClick={() => this.setState({ dateRange: null, statusFilter: 'ALL' })}
                    style={{ padding: 0 }}
                  >
                    Xóa lọc
                  </Button>
                )}
              </Space>
            </Space>
          }
          style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
        >
          <Table
            columns={orderColumns}
            dataSource={displayOrders.map((item) => ({
              ...item,
              key: item._id,
            }))}
            loading={this.state.loading}
            pagination={{ pageSize: 8 }}
            scroll={{ x: 900 }}
          />
        </Card>

        {this.state.order && (
          <Modal
            title={`Order Detail - ID: ${this.state.order._id}`}
            open={!!this.state.order}
            onCancel={() => this.setState({ order: null })}
            footer={null}
            width={850}
            destroyOnClose
          >
            <div style={{ marginTop: '16px' }}>
              {/* Status Header */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <Tag color={tagColor} style={{ textTransform: 'uppercase', fontWeight: 'bold', fontSize: '13px', padding: '4px 8px' }}>
                  STATUS: {this.state.order.status}
                </Tag>
              </div>

              {/* Customer Details Form Summary */}
              <div style={{ marginBottom: '20px', background: '#f9f9f9', padding: '16px', borderRadius: '8px', border: '1px solid #f0f0f0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#1a1a1a', fontWeight: '700' }}>Customer & Shipping Details</h4>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12}>
                    <p style={{ margin: '4px 0' }}><strong>Full Name:</strong> {this.state.order.customer?.name}</p>
                    <p style={{ margin: '4px 0' }}><strong>Phone Number:</strong> {this.state.order.customer?.phone}</p>
                  </Col>
                  <Col xs={24} sm={12}>
                    <p style={{ margin: '4px 0' }}><strong>Email Address:</strong> {this.state.order.customer?.email}</p>
                    <p style={{ margin: '4px 0' }}><strong>Order Date:</strong> {new Date(this.state.order.cdate).toLocaleString('vi-VN')}</p>
                  </Col>
                </Row>
              </div>

              <Table
                columns={itemColumns}
                dataSource={this.state.order.items?.map((item) => ({
                  ...item,
                  key: item.product._id,
                })) || []}
                pagination={false}
                scroll={{ x: 750 }}
                size="small"
              />
              
              <div style={{ 
                marginTop: '20px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                background: '#f9f9f9',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #f0f0f0'
              }}>
                <div>
                  {selectedStatus !== 'completed' && selectedStatus !== 'cancelled' ? (
                    <Space size="middle">
                      <Button
                        type="primary"
                        size="large"
                        icon={<CheckOutlined />}
                        onClick={() => this.handleConfirm(this.state.order._id)}
                        style={{ background: '#52c41a', borderColor: '#52c41a', fontWeight: '700' }}
                      >
                        CONFIRM ORDER
                      </Button>
                      <Button
                        type="primary"
                        danger
                        size="large"
                        icon={<CloseOutlined />}
                        onClick={() => this.handleCancelOrder(this.state.order._id)}
                        style={{ fontWeight: '700' }}
                      >
                        CANCEL ORDER
                      </Button>
                    </Space>
                  ) : (
                    <span style={{ color: selectedStatus === 'completed' ? '#52c41a' : '#ff4d4f', fontWeight: 'bold', fontSize: '15px' }}>
                      {selectedStatus === 'completed' ? 'Order has been Completed' : 'Order has been Cancelled'}
                    </span>
                  )}
                </div>
                <strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
                  Total Paid: {Number(this.state.order.total).toLocaleString('vi-VN')} vnđ
                </strong>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  handleConfirm(id) {
    if (window.confirm('Are you sure to confirm this order?')) {
      this.apiPutOrderStatus(id, 'COMPLETED');
    }
  }

  handleCancelOrder(id) {
    if (window.confirm('Are you sure to cancel this order?')) {
      this.apiPutOrderStatus(id, 'CANCELLED');
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
          message.success('OrderStatus updated successfully!');
          this.apiGetOrders();
          if (this.state.order && this.state.order._id === id) {
            this.setState({
              order: { ...this.state.order, status: status }
            });
          }
        } else {
          message.error('Failed to update OrderStatus');
        }
      })
      .catch(() => {
        message.error('Connection error updating status');
      });
  }
}

export default Order;