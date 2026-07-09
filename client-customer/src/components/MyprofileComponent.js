import axios from 'axios';
import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { Form, Input, Button, Card, Row, Col, message, Spin } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, EditOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class Myprofile extends Component {
  static contextType = MyContext;
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    if (this.context.token === '') return (<Navigate replace to='/login' />);

    return (
      <Row
        justify="center"
        align="middle"
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px'
        }}
      >
        <Col xs={22} sm={20} md={12} lg={8} xl={6}>
          <Card
            style={{
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}
          >
            <h2
              style={{
                textAlign: 'center',
                marginBottom: '32px',
                color: '#1890ff',
                fontSize: '24px',
                fontWeight: 'bold'
              }}
            >
              <EditOutlined /> My Profile
            </h2>

            <Spin spinning={this.state.loading}>
              <Form
                ref={this.formRef}
                layout="vertical"
                onFinish={(values) => this.handleUpdate(values)}
                initialValues={
                  this.context.customer
                    ? {
                      username: this.context.customer.username,
                      password: this.context.customer.password,
                      name: this.context.customer.name,
                      phone: this.context.customer.phone,
                      email: this.context.customer.email
                    }
                    : {}
                }
              >
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please enter username' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter username"
                    size="large"
                    disabled
                  />
                </Form.Item>

                <Form.Item
                  label="Full Name"
                  name="name"
                  rules={[{ required: true, message: 'Please enter full name' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Enter full name"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter email' },
                    { type: 'email', message: 'Invalid email format' }
                  ]}
                >
                  <Input
                    prefix={<MailOutlined />}
                    placeholder="Enter email"
                    type="email"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Phone"
                  name="phone"
                  rules={[
                    { required: true, message: 'Please enter phone number' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Phone must be 10-11 digits' }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined />}
                    placeholder="Enter phone number"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please enter password' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Enter password"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    block
                    loading={this.state.loading}
                  >
                    UPDATE PROFILE
                  </Button>
                </Form.Item>
              </Form>
            </Spin>
          </Card>
        </Col>
      </Row>
    );
  }

  handleUpdate(values) {
    this.setState({ loading: true });
    const customer = {
      username: values.username,
      password: values.password,
      name: values.name,
      phone: values.phone,
      email: values.email
    };
    this.apiPutCustomer(this.context.customer._id, customer);
  }

  apiPutCustomer(id, customer) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .put('/api/customer/customers/' + id, customer, config)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data && res.data.success !== false) {
          message.success('Profile updated successfully!');
          this.context.setCustomer(res.data);
        } else {
          message.error('Update failed!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error(error.response?.data?.message || 'An error occurred!');
      });
  }
}
export default Myprofile;
