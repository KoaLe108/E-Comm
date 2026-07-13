import axios from 'axios';
import React, { Component } from 'react';
import { Form, Input, Button, Select, Upload, Image, message, Space, Spin, InputNumber } from 'antd';
import { UploadOutlined, DeleteOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class ProductDetail extends Component {
    static contextType = MyContext;
    formRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            imgProduct: '',
            loading: false,
            isNew: !this.props.item?._id,
        };
    }

    render() {
        const categoryOptions = this.state.categories.map((cat) => ({
            label: cat.name,
            value: cat._id,
        }));

        return (
            <Spin spinning={this.state.loading}>
                <Form
                    ref={this.formRef}
                    layout="vertical"
                    onFinish={(values) => this.handleSubmit(values)}
                    initialValues={{
                        _id: this.props.item?._id || '',
                        name: this.props.item?.name || '',
                        price: this.props.item?.price || 0,
                        category: this.props.item?.category?._id || '',
                        quantity: this.props.item?.quantity !== undefined ? this.props.item?.quantity : 0,
                    }}
                >
                    <Form.Item
                        label="Product ID"
                        name="_id"
                    >
                        <Input disabled readOnly />
                    </Form.Item>

                    <Form.Item
                        label="Product Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter product name' }]}
                    >
                        <Input placeholder="Enter product name" />
                    </Form.Item>

                    <Form.Item
                        label="Price"
                        name="price"
                        rules={[{ required: true, message: 'Please enter price' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Enter price"
                            suffix="vnđ"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Please select category' }]}
                    >
                        <Select
                            options={categoryOptions}
                            placeholder="Select a category"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please enter quantity' }]}
                    >
                        <InputNumber
                            style={{ width: '100%' }}
                            min={0}
                            placeholder="Enter quantity"
                        />
                    </Form.Item>

                    <Form.Item label="Product Image">
                        <Upload
                            maxCount={1}
                            accept="image/*"
                            beforeUpload={(file) => {
                                this.handleImageUpload(file);
                                return false;
                            }}
                            listType="picture"
                        >
                            <Button icon={<UploadOutlined />}>
                                Upload Image
                            </Button>
                        </Upload>
                        {this.state.imgProduct && (
                            <div style={{ marginTop: '16px' }}>
                                <Image
                                    width={200}
                                    src={this.state.imgProduct}
                                    alt="Product preview"
                                />
                            </div>
                        )}
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            {this.state.isNew ? (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    icon={<PlusOutlined />}
                                >
                                    Add Product
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        type="primary"
                                        htmlType="submit"
                                        icon={<SaveOutlined />}
                                    >
                                        Update
                                    </Button>
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => this.handleDelete()}
                                    >
                                        Delete
                                    </Button>
                                </>
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Spin>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
        if (this.props.item?.image) {
            this.setState({
                imgProduct: this.props.item.image,
                isNew: !this.props.item._id,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.item !== prevProps.item) {
            if (this.props.item?.image) {
                this.setState({
                    imgProduct: this.props.item.image,
                    isNew: !this.props.item._id,
                });
            }
            this.formRef.current?.setFieldsValue({
                _id: this.props.item?._id || '',
                name: this.props.item?.name || '',
                price: this.props.item?.price || 0,
                category: this.props.item?.category?._id || '',
                quantity: this.props.item?.quantity !== undefined ? this.props.item?.quantity : 0,
            });
        }
    }

    handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            this.setState({ imgProduct: evt.target.result });
        };
        reader.readAsDataURL(file);
    }

    handleSubmit(values) {
        const image = this.state.imgProduct.replace(/^data:image\/[a-z]+;base64,/, '');

        if (!image) {
            message.error('Please upload an image');
            return;
        }

        const product = {
            name: values.name,
            price: values.price,
            category: values.category,
            image: image,
            quantity: values.quantity,
        };

        if (this.state.isNew) {
            this.apiPostProduct(product);
        } else {
            product.id = values._id;
            this.apiPutProduct(product);
        }
    }

    handleDelete() {
        const id = this.props.item?._id;
        if (window.confirm('ARE YOU SURE?')) {
            if (id) {
                this.apiDeleteProduct(id);
            }
        }
    }

    // APIs
    apiPostProduct(prod) {
        this.setState({ loading: true });
        const config = { headers: { 'x-access-token': this.context.token } };
        axios
            .post('/api/admin/products', prod, config)
            .then((res) => {
                if (res.data) {
                    message.success('Product added successfully!');
                    this.apiGetProducts();
                    this.props.onClose?.();
                }
            })
            .catch((error) => {
                message.error('Failed to add product: ' + (error.response?.data?.message || error.message));
                this.setState({ loading: false });
            });
    }

    apiPutProduct(prod) {
        this.setState({ loading: true });
        const config = { headers: { 'x-access-token': this.context.token } };
        axios
            .put('/api/admin/products', prod, config)
            .then((res) => {
                if (res.data) {
                    message.success('Product updated successfully!');
                    this.apiGetProducts();
                    this.props.onClose?.();
                }
            })
            .catch((error) => {
                message.error('Failed to update product: ' + (error.response?.data?.message || error.message));
                this.setState({ loading: false });
            });
    }

    apiDeleteProduct(id) {
        this.setState({ loading: true });
        const config = { headers: { 'x-access-token': this.context.token } };
        axios
            .delete('/api/admin/products/' + id, config)
            .then((res) => {
                if (res.data) {
                    message.success('Product deleted successfully!');
                    this.apiGetProducts();
                    this.props.onClose?.();
                }
            })
            .catch((error) => {
                message.error('Failed to delete product: ' + (error.response?.data?.message || error.message));
                this.setState({ loading: false });
            });
    }

    apiGetProducts() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios
            .get('/api/admin/products?page=' + this.props.curPage, config)
            .then((res) => {
                const result = res.data;
                if (result.products.length !== 0) {
                    this.props.updateProducts(result.products, result.noPages);
                } else {
                    axios
                        .get('/api/admin/products?page=' + (this.props.curPage - 1), config)
                        .then((res) => {
                            const result = res.data;
                            this.props.updateProducts(result.products, result.noPages);
                            this.setState({ loading: false });
                        });
                }
            })
            .catch(() => {
                this.setState({ loading: false });
            });
    }

    apiGetCategories() {
        const config = { headers: { 'x-access-token': this.context.token } };
        axios
            .get('/api/admin/categories', config)
            .then((res) => {
                this.setState({ categories: res.data });
            });
    }
}

export default ProductDetail;
