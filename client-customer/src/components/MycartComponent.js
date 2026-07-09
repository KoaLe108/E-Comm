import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Row, Col, Card, Statistic, Empty, Popconfirm, message } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Mycart extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    const columns = [
      {
        title: 'Product Name',
        dataIndex: ['product', 'name'],
        key: 'name',
        render: (text) => <span>{text}</span>,
      },
      {
        title: 'Category',
        dataIndex: ['product', 'category', 'name'],
        key: 'category',
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
        width: 80,
        render: (quantity) => <span>{quantity}</span>,
      },
      {
        title: 'Amount',
        key: 'amount',
        render: (_, record) => (
          <span>{(record.product.price * record.quantity).toLocaleString('vi-VN')} vnđ</span>
        ),
      },
      {
        title: 'Action',
        key: 'action',
        width: 100,
        render: (_, record) => (
          <Popconfirm
            title="Remove Item"
            description="Are you sure to remove this item?"
            onConfirm={() => this.lnkRemoveClick(record.product._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              type="primary"
              size="small"
              icon={<DeleteOutlined />}
            >
              Remove
            </Button>
          </Popconfirm>
        ),
      },
    ];

    const dataSource = this.context.mycart.map((item, index) => ({
      key: item.product._id,
      ...item,
      index: index + 1,
    }));

    const total = CartUtil.getTotal(this.context.mycart);

    return (
      <div style={{ padding: '20px' }}>
        <Card title="Shopping Cart" extra={<ShoppingOutlined />}>
          {this.context.mycart.length === 0 ? (
            <Empty
              description="Your cart is empty"
              style={{ marginTop: '50px' }}
            />
          ) : (
            <>
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                size="small"
                scroll={{ x: 800 }}
              />

              <Row
                gutter={16}
                style={{ marginTop: '20px', justifyContent: 'flex-end' }}
              >
                <Col>
                  <Card>
                    <Statistic
                      title="Total Amount"
                      value={total}
                      suffix=" vnđ"
                      precision={0}
                      formatter={(value) => value.toLocaleString('vi-VN')}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginTop: '20px' }}>
                <Col>
                  <Button
                    onClick={() => this.props.navigate('/home')}
                  >
                    Continue Shopping
                  </Button>
                </Col>
                <Col>
                  <Button
                    type="primary"
                    size="large"
                    loading={this.state.loading}
                    onClick={() => this.lnkCheckoutClick()}
                  >
                    Proceed to Checkout
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Card>
      </div>
    );
  }

  // event-handlers
  lnkRemoveClick(id) {
    const mycart = [...this.context.mycart];
    const index = mycart.findIndex(x => x.product._id === id);
    if (index !== -1) {
      mycart.splice(index, 1);
      this.context.setMycart(mycart);
      message.success('Item removed from cart');
    }
  }

  lnkCheckoutClick() {
    if (this.context.mycart && this.context.mycart.length > 0) {
      const customer = this.context.customer;
      if (customer) {
        this.props.navigate('/checkout');
      } else {
        message.warning('Vui lòng đăng nhập để tiếp tục thanh toán');
        this.props.navigate('/login');
      }
    } else {
      message.error('Giỏ hàng của bạn đang trống!');
    }
  }

  // apis
  apiCheckout(total, items, customer) {
    const body = { total: total, items: items, customer: customer };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/customer/checkout', body, config)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data) {
          message.success('Checkout successful!');
          this.context.setMycart([]);
          this.props.navigate('/myorders');
        } else {
          message.error('Checkout failed!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error(error.response?.data?.message || 'An error occurred!');
      });
  }
}
export default withRouter(Mycart);