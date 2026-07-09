import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, Spin, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Home extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            newprods: [],
            hotprods: [],
            loading: true
        };
    }

    render() {
        const newProducts = this.state.newprods.map((item) => (
            <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                    hoverable
                    cover={
                        <Link to={'/product/' + item._id}>
                            <img
                                src={"data:image/jpg;base64," + item.image}
                                alt={item.name}
                                style={{
                                    height: '250px',
                                    objectFit: 'cover'
                                }}
                            />
                        </Link>
                    }
                    style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Card.Meta
                        title={
                            <Link to={'/product/' + item._id} style={{ color: '#333' }}>
                                {item.name}
                            </Link>
                        }
                        description={
                            <div>
                                <div style={{ marginTop: '8px' }}>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#1890ff'
                                    }}>
                                        {item.price.toLocaleString('vi-VN')} vnđ
                                    </span>
                                </div>
                                <div style={{ marginTop: '4px', fontSize: '13px', color: '#666' }}>
                                    {item.quantity !== undefined && item.quantity > 0 
                                        ? `Số lượng: ${item.quantity}` 
                                        : 'Số lượng: 0 (Hết hàng)'}
                                </div>
                                <Button
                                    type="primary"
                                    block
                                    icon={<ShoppingCartOutlined />}
                                    size="small"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => this.addToCart(item)}
                                    disabled={item.quantity !== undefined && item.quantity <= 0}
                                >
                                    {item.quantity !== undefined && item.quantity <= 0 ? 'Hết hàng' : 'Add to Cart'}
                                </Button>
                            </div>
                        }
                    />
                </Card>
            </Col>
        ));

        const hotProducts = this.state.hotprods.map((item) => (
            <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                <Card
                    hoverable
                    cover={
                        <Link to={'/product/' + item._id}>
                            <div style={{
                                position: 'relative',
                                height: '250px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={"data:image/jpg;base64," + item.image}
                                    alt={item.name}
                                    style={{
                                        height: '100%',
                                        width: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    backgroundColor: '#ff4d4f',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    HOT
                                </div>
                            </div>
                        </Link>
                    }
                    style={{
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <Card.Meta
                        title={
                            <Link to={'/product/' + item._id} style={{ color: '#333' }}>
                                {item.name}
                            </Link>
                        }
                        description={
                            <div>
                                <div style={{ marginTop: '8px' }}>
                                    <span style={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        color: '#1890ff'
                                    }}>
                                        {item.price.toLocaleString('vi-VN')} vnđ
                                    </span>
                                </div>
                                <div style={{ marginTop: '4px', fontSize: '13px', color: '#666' }}>
                                    {item.quantity !== undefined && item.quantity > 0 
                                        ? `Số lượng: ${item.quantity}` 
                                        : 'Số lượng: 0 (Hết hàng)'}
                                </div>
                                <Button
                                    type="primary"
                                    block
                                    icon={<ShoppingCartOutlined />}
                                    size="small"
                                    style={{ marginTop: '10px' }}
                                    onClick={() => this.addToCart(item)}
                                    disabled={item.quantity !== undefined && item.quantity <= 0}
                                >
                                    {item.quantity !== undefined && item.quantity <= 0 ? 'Hết hàng' : 'Add to Cart'}
                                </Button>
                            </div>
                        }
                    />
                </Card>
            </Col>
        ));

        const isLoggedIn = !!this.context.token;

        return (
            <Spin spinning={this.state.loading}>
                <div style={{ padding: '12px' }}>
                    {!isLoggedIn && (
                        <div className="auth-section">
                            <div className="auth-content">
                                <h3>Welcome to KTK Motor Store</h3>
                                <p>Please login or create an account to start shopping</p>
                                <div className="auth-buttons">
                                    <Button
                                        type="primary"
                                        size="large"
                                        onClick={() => this.props.navigate('/login')}
                                    >
                                        Login
                                    </Button>
                                    <Button
                                        type="default"
                                        size="large"
                                        onClick={() => this.props.navigate('/signup')}
                                    >
                                        Sign Up
                                    </Button>
                                    <Button
                                        type="link"
                                        size="large"
                                        onClick={() => this.props.navigate('/active')}
                                        style={{ color: '#1890ff' }}
                                    >
                                        Activate Account
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* NEW PRODUCTS SECTION */}
                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: 'bold',
                            marginBottom: '16px',
                            color: '#1890ff',
                            textAlign: 'center',
                            borderBottom: '2px solid #1890ff',
                            paddingBottom: '8px'
                        }}>
                            🆕 NEW PRODUCTS
                        </h2>
                        {this.state.newprods.length > 0 ? (
                            <Row gutter={[16, 16]}>
                                {newProducts}
                            </Row>
                        ) : (
                            <Empty description="No new products available" />
                        )}
                    </div>

                    {/* HOT PRODUCTS SECTION */}
                    {this.state.hotprods.length > 0 && (
                        <div>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: 'bold',
                                marginBottom: '16px',
                                color: '#ff4d4f',
                                textAlign: 'center',
                                borderBottom: '2px solid #ff4d4f',
                                paddingBottom: '8px'
                            }}>
                                🔥 HOT PRODUCTS
                            </h2>
                            <Row gutter={[16, 16]}>
                                {hotProducts}
                            </Row>
                        </div>
                    )}
                </div>
            </Spin>
        );
    }

    componentDidMount() {
        this.apiGetNewProducts();
        this.apiGetHotProducts();
    }

    addToCart(product) {
        const mycart = [...this.context.mycart];
        const found = mycart.find(x => x.product._id === product._id);
        const maxQty = product.quantity !== undefined ? product.quantity : 10;
        const currentQtyInCart = found ? found.quantity : 0;
        
        if (currentQtyInCart + 1 > maxQty) {
            message.warning(`Xin lỗi, sản phẩm này chỉ còn tối đa ${maxQty} sản phẩm trong kho.`);
            return;
        }

        if (found) {
            found.quantity += 1;
        } else {
            mycart.push({ product: product, quantity: 1 });
        }
        this.context.setMycart(mycart);
        message.success(`${product.name} đã được thêm vào giỏ hàng!`);
    }

    // apis
    apiGetNewProducts() {
        axios
            .get('/api/customer/products/new')
            .then((res) => {
                this.setState({
                    newprods: res.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    apiGetHotProducts() {
        axios.get('/api/customer/products/hot').then((res) => {
            this.setState({ hotprods: res.data });
        });
    }
}
export default withRouter(Home);
