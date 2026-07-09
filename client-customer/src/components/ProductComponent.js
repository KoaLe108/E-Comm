import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Empty, Spin, Button, message } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

class Product extends Component {
    static contextType = MyContext;

    constructor(props) {
        super(props);
        this.state = {
            products: [],
            loading: true
        };
    }

    render() {
        const products = this.state.products.map((item) => (
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
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical'
                                }}>
                                    {item.name}
                                </span>
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

        return (
            <Spin spinning={this.state.loading}>
                <div style={{ padding: '20px' }}>
                    <h2 style={{
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        color: '#1890ff',
                        textAlign: 'center',
                        borderBottom: '2px solid #1890ff',
                        paddingBottom: '10px'
                    }}>
                        🛍️ PRODUCTS
                    </h2>

                    {this.state.products.length > 0 ? (
                        <Row gutter={[16, 16]}>
                            {products}
                        </Row>
                    ) : (
                        <Empty description="No products found" style={{ marginTop: '50px' }} />
                    )}
                </div>
            </Spin>
        );
    }

    componentDidMount() {
        this.loadProducts();
    }

    componentDidUpdate(prevProps) {
        const params = this.props.params;
        if (params.cid && params.cid !== prevProps.params.cid) {
            this.loadProducts();
        } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
            this.loadProducts();
        }
    }

    loadProducts() {
        const params = this.props.params;
        this.setState({ loading: true });
        if (params.cid) {
            this.apiGetProductsByCatID(params.cid);
        } else if (params.keyword) {
            this.apiGetProductsByKeyword(params.keyword);
        }
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
    apiGetProductsByCatID(cid) {
        axios
            .get('/api/customer/products/category/' + cid)
            .then((res) => {
                this.setState({
                    products: res.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    apiGetProductsByKeyword(keyword) {
        axios
            .get('/api/customer/products/search/' + keyword)
            .then((res) => {
                this.setState({
                    products: res.data,
                    loading: false
                });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }
}
export default withRouter(Product);
