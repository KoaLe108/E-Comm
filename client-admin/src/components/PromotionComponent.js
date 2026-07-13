import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Modal, Card, Form, Input, InputNumber, Switch, Popconfirm, message, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class Promotion extends Component {
  static contextType = MyContext;
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      promotions: [],
      itemSelected: null,
      showModal: false,
      loading: false,
      isNew: true
    };
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: '20%',
        ellipsis: true,
      },
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: '15%',
        render: (text) => <strong style={{ color: '#1890ff' }}>{text}</strong>
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
      },
      {
        title: 'Discount',
        dataIndex: 'discountPercentage',
        key: 'discountPercentage',
        width: '15%',
        render: (pct) => <span>{pct}%</span>
      },
      {
        title: 'Quantity (Limit)',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '12%',
        render: (qty) => <span>{qty !== undefined && qty !== null ? qty : 0}</span>
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        width: '10%',
        render: (isActive, record) => (
          <Switch
            checked={isActive}
            onChange={(checked) => this.handleStatusChange(checked, record)}
          />
        )
      },
      {
        title: 'Action',
        key: 'action',
        width: '15%',
        render: (_, record) => (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#1890ff' }} />}
              onClick={() => this.handleEdit(record)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure to delete this promotion?"
              onConfirm={() => this.handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              >
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ];

    return (
      <div>
        <Card
          title="Promotions & Discount Codes"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => this.handleAddNew()}
            >
              ADD NEW PROMOTION
            </Button>
          }
          style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <Table
            columns={columns}
            dataSource={this.state.promotions.map((item) => ({
              ...item,
              key: item._id,
            }))}
            loading={this.state.loading}
            pagination={{ pageSize: 8 }}
          />
        </Card>

        {this.state.showModal && (
          <Modal
            title={this.state.isNew ? "Add New Promotion" : "Edit Promotion"}
            open={this.state.showModal}
            onCancel={() => this.closeModal()}
            footer={null}
            destroyOnClose
          >
            <Form
              ref={this.formRef}
              layout="vertical"
              onFinish={(values) => this.handleSubmit(values)}
              initialValues={{
                code: this.state.itemSelected?.code || '',
                name: this.state.itemSelected?.name || '',
                discountPercentage: this.state.itemSelected?.discountPercentage || 10,
                isActive: this.state.itemSelected?.isActive !== undefined ? this.state.itemSelected?.isActive : true,
                quantity: this.state.itemSelected?.quantity !== undefined ? this.state.itemSelected?.quantity : 10
              }}
            >
              <Form.Item
                name="code"
                label="Promotion Code"
                rules={[
                  { required: true, message: 'Please enter promotion code' },
                  { pattern: /^[A-Z0-9]+$/, message: 'Code must contain only uppercase letters and numbers' }
                ]}
              >
                <Input 
                  placeholder="e.g. SUMMER20" 
                  disabled={!this.state.isNew} 
                  style={{ textTransform: 'uppercase' }}
                  onChange={(e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }}
                />
              </Form.Item>

              <Form.Item
                name="name"
                label="Promotion Name / Description"
                rules={[{ required: true, message: 'Please enter promotion name' }]}
              >
                <Input placeholder="e.g. Summer Discount 20%" />
              </Form.Item>

              <Form.Item
                name="discountPercentage"
                label="Discount Percentage (%)"
                rules={[
                  { required: true, message: 'Please enter discount percentage' },
                  { type: 'number', min: 1, max: 100, message: 'Value must be between 1 and 100' }
                ]}
              >
                <InputNumber style={{ width: '100%' }} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />
              </Form.Item>

              <Form.Item
                name="quantity"
                label="Quantity (Usage Limit)"
                rules={[
                  { required: true, message: 'Please enter usage limit quantity' },
                  { type: 'number', min: 0, message: 'Quantity must be at least 0' }
                ]}
              >
                <InputNumber style={{ width: '100%' }} precision={0} placeholder="e.g. 10" />
              </Form.Item>

              <Form.Item
                name="isActive"
                label="Active Status"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>

              <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                <Space>
                  <Button onClick={() => this.closeModal()}>Cancel</Button>
                  <Button type="primary" htmlType="submit">
                    {this.state.isNew ? "Create" : "Save Changes"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetPromotions();
  }

  // event-handlers
  handleAddNew() {
    this.setState({
      itemSelected: null,
      isNew: true,
      showModal: true,
    });
  }

  handleEdit(item) {
    this.setState({
      itemSelected: item,
      isNew: false,
      showModal: true
    });
  }

  closeModal() {
    this.setState({ showModal: false, itemSelected: null });
  }

  handleStatusChange(checked, record) {
    const updated = { ...record, isActive: checked };
    this.apiUpdatePromotion(record._id, updated, true);
  }

  handleSubmit(values) {
    if (this.state.isNew) {
      this.apiCreatePromotion(values);
    } else {
      this.apiUpdatePromotion(this.state.itemSelected._id, values, false);
    }
  }

  // apis
  apiGetPromotions() {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/promotions', config)
      .then((res) => {
        this.setState({ promotions: res.data, loading: false });
      })
      .catch((err) => {
        this.setState({ loading: false });
        message.error('Failed to load promotions');
      });
  }

  apiCreatePromotion(promotion) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .post('/api/admin/promotions', promotion, config)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          message.success(result.message);
          this.closeModal();
          this.apiGetPromotions();
        } else {
          message.error(result.message);
        }
      })
      .catch((err) => {
        message.error('Failed to create promotion');
      });
  }

  apiUpdatePromotion(id, values, isStatusOnly = false) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put(`/api/admin/promotions/${id}`, values, config)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          message.success(result.message);
          if (!isStatusOnly) this.closeModal();
          this.apiGetPromotions();
        } else {
          message.error(result.message);
        }
      })
      .catch((err) => {
        message.error('Failed to update promotion');
      });
  }

  handleDelete(id) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .delete(`/api/admin/promotions/${id}`, config)
      .then((res) => {
        const result = res.data;
        if (result.success) {
          message.success(result.message);
          this.apiGetPromotions();
        } else {
          message.error(result.message);
        }
      })
      .catch((err) => {
        message.error('Failed to delete promotion');
      });
  }
}

export default Promotion;
