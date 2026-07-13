import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, Spin, Button, message, Rate } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

const getRating = (id) => {
    let sum = 0;
    for (let i = 0; i < id.length; i++) sum += id.charCodeAt(i);
    const val = 4.0 + (sum % 11) / 10;
    return parseFloat(val.toFixed(1));
};

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
        const newProducts = this.state.newprods.map((item) => {
            const rating = getRating(item._id);
            return (
                <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                        hoverable
                        cover={
                            <Link to={'/product/' + item._id}>
                                <div style={{
                                    background: '#f5f5f5',
                                    padding: '24px 16px',
                                    height: '250px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: '#1890ff',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        NEW
                                    </div>
                                </div>
                            </Link>
                        }
                        style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            border: '1px solid #f0f0f0',
                            background: '#ffffff'
                        }}
                    >
                        <Card.Meta
                            title={
                                <Link to={'/product/' + item._id} style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: '700' }}>
                                    <span style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {item.name}
                                    </span>
                                </Link>
                            }
                            description={
                                <div>
                                    <div style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: '12px', color: '#fadb14' }} />
                                        <span style={{ fontSize: '11px', color: '#8c8c8c' }}>({rating})</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                        <span style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#1a1a1a'
                                        }}>
                                            {item.price.toLocaleString('vi-VN')} vnđ
                                        </span>
                                        <span style={{ fontSize: '12px', color: item.quantity > 0 ? '#52c41a' : '#ff4d4f', fontWeight: '500' }}>
                                            {item.quantity > 0 ? `Còn lại: ${item.quantity}` : 'Hết hàng'}
                                        </span>
                                    </div>
                                    <Button
                                        type="primary"
                                        block
                                        icon={<ShoppingCartOutlined />}
                                        style={{ 
                                            marginTop: '14px', 
                                            borderRadius: '8px',
                                            background: '#1a1a1a',
                                            borderColor: '#1a1a1a',
                                            fontWeight: '600',
                                            height: '38px',
                                            boxShadow: 'none'
                                        }}
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
            );
        });

        const hotProducts = this.state.hotprods.map((item) => {
            const rating = getRating(item._id);
            return (
                <Col key={item._id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                        hoverable
                        cover={
                            <Link to={'/product/' + item._id}>
                                <div style={{
                                    background: '#f5f5f5',
                                    padding: '24px 16px',
                                    height: '250px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    position: 'relative'
                                }}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                            transition: 'transform 0.3s ease',
                                        }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        backgroundColor: '#ff4d4f',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '11px',
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase'
                                    }}>
                                        HOT
                                    </div>
                                </div>
                            </Link>
                        }
                        style={{
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            transition: 'all 0.3s ease',
                            border: '1px solid #f0f0f0',
                            background: '#ffffff'
                        }}
                    >
                        <Card.Meta
                            title={
                                <Link to={'/product/' + item._id} style={{ color: '#1a1a1a', fontSize: '16px', fontWeight: '700' }}>
                                    <span style={{
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 1,
                                        WebkitBoxOrient: 'vertical'
                                    }}>
                                        {item.name}
                                    </span>
                                </Link>
                            }
                            description={
                                <div>
                                    <div style={{ margin: '6px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: '12px', color: '#fadb14' }} />
                                        <span style={{ fontSize: '11px', color: '#8c8c8c' }}>({rating})</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                                        <span style={{
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            color: '#1a1a1a'
                                        }}>
                                            {item.price.toLocaleString('vi-VN')} vnđ
                                        </span>
                                        <span style={{ fontSize: '12px', color: item.quantity > 0 ? '#52c41a' : '#ff4d4f', fontWeight: '500' }}>
                                            {item.quantity > 0 ? `Còn lại: ${item.quantity}` : 'Hết hàng'}
                                        </span>
                                    </div>
                                    <Button
                                        type="primary"
                                        block
                                        icon={<ShoppingCartOutlined />}
                                        style={{ 
                                            marginTop: '14px', 
                                            borderRadius: '8px',
                                            background: '#1a1a1a',
                                            borderColor: '#1a1a1a',
                                            fontWeight: '600',
                                            height: '38px',
                                            boxShadow: 'none'
                                        }}
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
            );
        });

        return (
            <Spin spinning={this.state.loading}>
                <div style={{ padding: '12px', maxWidth: '1200px', margin: '0 auto' }}>
                    {/* HERO BANNER SECTION */}
                    <div className="hero-banner" style={{
                        position: 'relative',
                        background: `linear-gradient(rgba(255,255,255,0.65), rgba(255,255,255,0.7)), url('/hero_banner.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: '16px',
                        padding: '60px 48px',
                        marginBottom: '48px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        minHeight: '400px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        overflow: 'hidden',
                        fontFamily: "'Outfit', sans-serif"
                    }}>
                        <div style={{ maxWidth: '550px', zIndex: 2 }}>
                            <span style={{ 
                                color: '#1890ff', 
                                fontWeight: '700', 
                                letterSpacing: '2px', 
                                textTransform: 'uppercase', 
                                fontSize: '13px',
                                display: 'block',
                                marginBottom: '10px'
                            }}>
                                Premium Ride Experience
                            </span>
                            <h1 style={{ 
                                fontSize: '46px', 
                                fontWeight: '800', 
                                lineHeight: '1.15', 
                                color: '#1a1a1a', 
                                marginTop: '0', 
                                marginBottom: '16px',
                                letterSpacing: '-0.5px'
                            }}>
                                Unleash the Power of Two Wheels
                            </h1>
                            <p style={{ 
                                fontSize: '16px', 
                                color: '#434343', 
                                marginBottom: '28px', 
                                lineHeight: '1.6' 
                            }}>
                                Explore our curated collection of high-performance motorcycles, electric motorbikes, and premium accessories tailored for the modern rider.
                            </p>
                            <Button 
                                type="primary" 
                                size="large" 
                                style={{ 
                                    borderRadius: '25px', 
                                    height: '50px', 
                                    padding: '0 36px', 
                                    fontSize: '16px', 
                                    fontWeight: '700', 
                                    background: '#1a1a1a',
                                    borderColor: '#1a1a1a',
                                    boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)' 
                                }}
                                onClick={() => {
                                    const el = document.getElementById('products-section');
                                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                Shop Now
                            </Button>
                        </div>
                    </div>

                    <div id="products-section">
                        {/* NEW PRODUCTS SECTION */}
                        <div style={{ marginBottom: '48px' }}>
                            <div style={{ marginBottom: '24px' }}>
                                <h2 style={{
                                    fontSize: '26px',
                                    fontWeight: '800',
                                    marginBottom: '4px',
                                    color: '#1a1a1a',
                                    fontFamily: "'Outfit', sans-serif"
                                }}>
                                    New Arrivals
                                </h2>
                                <p style={{ color: '#8c8c8c', margin: 0, fontSize: '14px' }}>
                                    Explore our latest inventory of high-performance motorcycles
                                </p>
                            </div>
                            {this.state.newprods.length > 0 ? (
                                <Row gutter={[24, 24]}>
                                    {newProducts}
                                </Row>
                            ) : (
                                <Empty description="No new products available" />
                            )}
                        </div>

                        {/* HOT PRODUCTS SECTION */}
                        {this.state.hotprods.length > 0 && (
                            <div style={{ marginBottom: '48px' }}>
                                <div style={{ marginBottom: '24px' }}>
                                    <h2 style={{
                                        fontSize: '26px',
                                        fontWeight: '800',
                                        marginBottom: '4px',
                                        color: '#1a1a1a',
                                        fontFamily: "'Outfit', sans-serif"
                                    }}>
                                        Top Selling Products
                                    </h2>
                                    <p style={{ color: '#8c8c8c', margin: 0, fontSize: '14px' }}>
                                        Our most popular and highly rated rides
                                    </p>
                                </div>
                                <Row gutter={[24, 24]}>
                                    {hotProducts}
                                </Row>
                            </div>
                        )}
                    </div>
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
