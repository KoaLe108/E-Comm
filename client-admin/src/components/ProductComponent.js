import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Modal, Space, Card, Row, Col, Pagination } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import ProductDetail from './ProductDetailComponent';

class Product extends Component {
    static contextType = MyContext;
    constructor(props) {
        super(props);
        this.state = {
            products: [],
            noPages: 0,
            curPage: 1,
            itemSelected: null,
            showDetail: false,
            loading: false
        };
    }

    render() {
        const columns = [
            {
                title: 'ID',
                dataIndex: '_id',
                key: '_id',
                width: '15%',
                ellipsis: true,
            },
            {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '20%',
            },
            {
                title: 'Price',
                dataIndex: 'price',
                key: 'price',
                width: '10%',
                render: (price) => <span>{price.toLocaleString('vi-VN')} vnđ</span>,
            },
            {
                title: 'Category',
                dataIndex: ['category', 'name'],
                key: 'category',
                width: '15%',
            },
            {
                title: 'Quantity',
                dataIndex: 'quantity',
                key: 'quantity',
                width: '10%',
                render: (qty) => qty !== undefined ? qty : 0,
            },
            {
                title: 'Date Created',
                dataIndex: 'cdate',
                key: 'cdate',
                width: '15%',
                render: (date) => new Date(date).toLocaleDateString(),
            },
            {
                title: 'Image',
                dataIndex: 'image',
                key: 'image',
                width: '10%',
                render: (image) => (
                    <img
                        src={image}
                        alt="product"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                ),
            },
            {
                title: 'Action',
                key: 'action',
                width: '10%',
                render: (_, record) => (
                    <Button type="link" onClick={() => this.trItemClick(record)}>
                        Edit
                    </Button>
                ),
            },
        ];

        return (
            <div>
                <Card
                    title="Quản lý sản phẩm xe máy"
                    extra={
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => this.handleAddNew()}
                        >
                            ADD NEW PRODUCT
                        </Button>
                    }
                >
                    <Table
                        columns={columns}
                        dataSource={this.state.products.map((item) => ({
                            ...item,
                            key: item._id,
                        }))}
                        loading={this.state.loading}
                        pagination={false}
                        scroll={{ x: 800 }}
                    />
                    <Row style={{ marginTop: '16px', justifyContent: 'center' }}>
                        <Pagination
                            current={this.state.curPage}
                            total={this.state.noPages * 10}
                            pageSize={10}
                            onChange={(page) => this.lnkPageClick(page)}
                        />
                    </Row>
                </Card>

                {this.state.showDetail && (
                    <Modal
                        title="Product Detail"
                        open={this.state.showDetail}
                        onCancel={() => this.closeDetail()}
                        footer={null}
                        width={800}
                    >
                        <ProductDetail
                            item={this.state.itemSelected}
                            curPage={this.state.curPage}
                            updateProducts={this.updateProducts}
                            onClose={() => this.closeDetail()}
                        />
                    </Modal>
                )}
            </div>
        );
    }

    componentDidMount() {
        this.apiGetProducts(this.state.curPage);
    }

    // event-handlers
    lnkPageClick(index) {
        this.apiGetProducts(index);
    }

    trItemClick(item) {
        this.setState({ itemSelected: item, showDetail: true });
    }

    handleAddNew() {
        this.setState({
            itemSelected: { _id: '', name: '', price: '', category: { _id: '' }, image: '', quantity: 0 },
            showDetail: true,
        });
    }

    closeDetail() {
        this.setState({ showDetail: false, itemSelected: null });
    }

    // apis
    apiGetProducts(page) {
        this.setState({ loading: true });
        const config = { headers: { 'x-access-token': this.context.token } };
        axios
            .get('/api/admin/products?page=' + page, config)
            .then((res) => {
                const result = res.data;
                this.setState({
                    products: result.products,
                    noPages: result.noPages,
                    curPage: result.curPage,
                    loading: false,
                });
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    updateProducts = (products, noPages) => {
        this.setState({ products: products, noPages: noPages });
    };
}

export default Product;
