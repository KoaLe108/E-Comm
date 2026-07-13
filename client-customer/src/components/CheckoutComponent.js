import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Row, Col, Card, Statistic, message, Divider, Space, Image, Spin, Input } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, QrcodeOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import CartUtil from '../utils/CartUtil';
import withRouter from '../utils/withRouter';

class Checkout extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      promoCodeInput: '',
      discountPercentage: 0,
      appliedCode: ''
    };
  }

  componentDidMount() {
    // If cart is empty, redirect back to cart page
    if (!this.context.mycart || this.context.mycart.length === 0) {
      message.warning('Giỏ hàng của bạn đang trống!');
      this.props.navigate('/mycart');
    }
  }

  render() {
    const { mycart, customer } = this.context;
    if (!mycart || mycart.length === 0) {
      return <Spin spinning style={{ minHeight: '300px' }} />;
    }

    const subtotal = CartUtil.getTotal(mycart);
    const discountAmount = subtotal * (this.state.discountPercentage / 100);
    const total = subtotal - discountAmount;

    // QR Payment URL Generation (VietQR API)
    const bankId = 'mbbank';
    const accountNo = '999999999999';
    const accountName = 'KTK MOTOR';
    const description = `KTKMOTOR THANH TOAN DON HANG`;
    const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?amount=${total}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;

    const columns = [
      {
        title: 'Tên xe máy',
        dataIndex: ['product', 'name'],
        key: 'name',
      },
      {
        title: 'Hình ảnh',
        dataIndex: ['product', 'image'],
        key: 'image',
        render: (image) => <img src={image} width="50px" height="50px" alt="product" style={{ objectFit: 'cover', borderRadius: '4px' }} />,
      },
      {
        title: 'Đơn giá',
        dataIndex: ['product', 'price'],
        key: 'price',
        render: (price) => <span>{price.toLocaleString('vi-VN')} vnđ</span>,
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
      },
      {
        title: 'Thành tiền',
        key: 'amount',
        render: (_, record) => (
          <span>{(record.product.price * record.quantity).toLocaleString('vi-VN')} vnđ</span>
        ),
      },
    ];

    const dataSource = mycart.map((item) => ({
      key: item.product._id,
      ...item,
    }));

    return (
      <div style={{ padding: '24px' }}>
        <Spin spinning={this.state.loading} tip="Đang xử lý đặt hàng...">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => this.props.navigate('/mycart')}
            style={{ marginBottom: '20px' }}
          >
            Quay lại giỏ hàng
          </Button>

          <Row gutter={[24, 24]}>
            {/* Order Items Info */}
            <Col xs={24} lg={14}>
              <Card title="Thông tin đơn hàng" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '8px' }}>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  pagination={false}
                  size="small"
                />
                <Divider />
                <div style={{ textAlign: 'right', paddingRight: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#666', margin: '4px 0' }}>
                    Tạm tính: <strong>{subtotal.toLocaleString('vi-VN')} vnđ</strong>
                  </p>
                  {this.state.appliedCode && (
                    <p style={{ fontSize: '14px', color: '#52c41a', margin: '4px 0' }}>
                      Mã giảm giá ({this.state.appliedCode} -{this.state.discountPercentage}%): <strong style={{ color: '#52c41a' }}>-{discountAmount.toLocaleString('vi-VN')} vnđ</strong>
                    </p>
                  )}
                  <Divider style={{ margin: '12px 0' }} />
                  <Statistic
                    title="Tổng số tiền thanh toán"
                    value={total}
                    suffix=" vnđ"
                    valueStyle={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: '24px' }}
                    formatter={(value) => value.toLocaleString('vi-VN')}
                  />
                </div>
              </Card>
            </Col>

            {/* Payment Section with QR Code */}
            <Col xs={24} lg={10}>
              <Card
                title={<Space><QrcodeOutlined /> Thanh toán qua chuyển khoản ngân hàng QR</Space>}
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)', borderRadius: '8px', textAlign: 'center' }}
              >
                {/* Promotion Input */}
                <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '14px', color: '#333' }}>Mã khuyến mãi</div>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input 
                      placeholder="Nhập mã khuyến mãi (e.g. WINTER30)" 
                      value={this.state.promoCodeInput}
                      onChange={(e) => this.setState({ promoCodeInput: e.target.value })}
                      disabled={!!this.state.appliedCode}
                    />
                    <Button 
                      type="primary" 
                      onClick={() => this.handleApplyPromoCode()}
                      disabled={!!this.state.appliedCode}
                    >
                      Áp dụng
                    </Button>
                  </Space.Compact>
                  {this.state.appliedCode && (
                    <div style={{ color: '#52c41a', marginTop: '6px', fontSize: '13px', fontWeight: '500' }}>
                      Đã áp dụng mã <strong>{this.state.appliedCode}</strong> (Giảm {this.state.discountPercentage}%)!
                    </div>
                  )}
                </div>

                <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
                  Quét mã QR bằng ứng dụng ngân hàng của bạn để thanh toán tự động, hoặc chuyển khoản theo thông tin bên dưới:
                </p>

                <div style={{ background: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '20px', textAlign: 'left' }}>
                  <p style={{ margin: '4px 0' }}><strong>Ngân hàng:</strong> MB Bank (Ngân hàng Quân Đội)</p>
                  <p style={{ margin: '4px 0' }}><strong>Số tài khoản:</strong> 999999999999</p>
                  <p style={{ margin: '4px 0' }}><strong>Tên chủ tài khoản:</strong> KTK MOTOR</p>
                  <p style={{ margin: '4px 0' }}><strong>Số tiền:</strong> <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>{total.toLocaleString('vi-VN')} vnđ</span></p>
                  <p style={{ margin: '4px 0' }}><strong>Nội dung chuyển khoản:</strong> <span style={{ color: '#1890ff', fontWeight: 'bold' }}>{description}</span></p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <Image
                    src={qrUrl}
                    alt="VietQR Payment Code"
                    width={220}
                    height={220}
                    style={{ border: '1px solid #eee', padding: '10px', background: '#fff', borderRadius: '8px' }}
                    placeholder={
                      <div style={{ width: 220, height: 220, display: 'flex', justifyContent: 'center', alignContent: 'center', background: '#f5f5f5' }}>
                        <Spin size="large" style={{ marginTop: '90px' }} />
                      </div>
                    }
                  />
                </div>

                <Button
                  type="primary"
                  size="large"
                  icon={<CheckCircleOutlined />}
                  block
                  onClick={() => this.handleConfirmPayment(total, mycart, customer)}
                  style={{ height: '50px', fontSize: '16px', fontWeight: 'bold', background: '#52c41a', borderColor: '#52c41a' }}
                >
                  XÁC NHẬN ĐÃ CHUYỂN KHOẢN & ĐẶT HÀNG
                </Button>
              </Card>
            </Col>
          </Row>
        </Spin>
      </div>
    );
  }

  handleApplyPromoCode() {
    const code = this.state.promoCodeInput.trim().toUpperCase();
    if (!code) {
      message.warning('Vui lòng nhập mã khuyến mãi');
      return;
    }
    
    this.setState({ loading: true });
    const body = { code: code };
    const config = { headers: { 'x-access-token': this.context.token } };
    
    axios
      .post('/api/customer/promotions/validate', body, config)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data && res.data.success) {
          message.success(res.data.message);
          this.setState({
            discountPercentage: res.data.discountPercentage,
            appliedCode: res.data.code
          });
        } else {
          message.error(res.data ? res.data.message : 'Áp dụng mã khuyến mãi thất bại');
        }
      })
      .catch((err) => {
        this.setState({ loading: false });
        message.error('Lỗi khi kiểm tra mã khuyến mãi');
      });
  }

  handleConfirmPayment(total, items, customer) {
    if (!customer) {
      message.warning('Vui lòng đăng nhập để hoàn tất đơn hàng!');
      this.props.navigate('/login');
      return;
    }

    this.setState({ loading: true });
    const body = { total: total, items: items, customer: customer, promoCode: this.state.appliedCode };
    const config = { headers: { 'x-access-token': this.context.token } };

    axios
      .post('/api/customer/checkout', body, config)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data) {
          message.success('Đặt hàng và thanh toán thành công!');
          this.context.setMycart([]);
          this.props.navigate('/myorders');
        } else {
          message.error('Đặt hàng thất bại!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error(error.response?.data?.message || 'Có lỗi xảy ra trong quá trình xử lý!');
      });
  }
}

export default withRouter(Checkout);
