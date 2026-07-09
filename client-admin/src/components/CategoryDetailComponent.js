import axios from 'axios';
import React, { Component } from 'react';
import { Form, Input, Button, Space, message, Spin } from 'antd';
import { SaveOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class CategoryDetail extends Component {
  static contextType = MyContext;
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isNew: !this.props.item?._id,
    };
  }

  render() {
    return (
      <Spin spinning={this.state.loading}>
        <Form
          ref={this.formRef}
          layout="vertical"
          onFinish={(values) => this.handleSubmit(values)}
          initialValues={{
            _id: this.props.item?._id || '',
            name: this.props.item?.name || '',
          }}
        >
          <Form.Item
            label="Category ID"
            name="_id"
          >
            <Input disabled readOnly />
          </Form.Item>

          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: 'Please enter category name' }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item>
            <Space>
              {this.state.isNew ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  Add Category
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
    if (this.props.item) {
      this.setState({
        isNew: !this.props.item._id,
      });
      this.formRef.current?.setFieldsValue({
        _id: this.props.item._id || '',
        name: this.props.item.name || '',
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.item !== prevProps.item) {
      this.setState({
        isNew: !this.props.item?._id,
      });
      this.formRef.current?.setFieldsValue({
        _id: this.props.item?._id || '',
        name: this.props.item?.name || '',
      });
    }
  }

  handleSubmit(values) {
    if (this.state.isNew) {
      this.apiPostCategory({ name: values.name });
    } else {
      this.apiPutCategory(values._id, { name: values.name });
    }
  }

  handleDelete() {
    const id = this.props.item?._id;
    if (window.confirm('ARE YOU SURE?')) {
      if (id) {
        this.apiDeleteCategory(id);
      }
    }
  }

  // APIs
  apiPostCategory(cate) {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/admin/categories', cate, config)
      .then((res) => {
        if (res.data) {
          message.success('Category added successfully!');
          this.apiGetCategories();
          this.props.onClose?.();
        }
      })
      .catch((error) => {
        message.error('Failed to add category: ' + (error.response?.data?.message || error.message));
        this.setState({ loading: false });
      });
  }

  apiPutCategory(id, cate) {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put('/api/admin/categories/' + id, cate, config)
      .then((res) => {
        if (res.data) {
          message.success('Category updated successfully!');
          this.apiGetCategories();
          this.props.onClose?.();
        }
      })
      .catch((error) => {
        message.error('Failed to update category: ' + (error.response?.data?.message || error.message));
        this.setState({ loading: false });
      });
  }

  apiDeleteCategory(id) {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete('/api/admin/categories/' + id, config)
      .then((res) => {
        if (res.data) {
          message.success('Category deleted successfully!');
          this.apiGetCategories();
          this.props.onClose?.();
        }
      })
      .catch((error) => {
        message.error('Failed to delete category: ' + (error.response?.data?.message || error.message));
        this.setState({ loading: false });
      });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.props.updateCategories(res.data);
        this.setState({ loading: false });
      });
  }
}

export default CategoryDetail;