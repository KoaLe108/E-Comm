import axios from 'axios';
import React, { Component } from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import withRouter from '../utils/withRouter';

class Signup extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
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
              <UserAddOutlined /> Create Account
            </h2>

            <Form
              ref={this.formRef}
              layout="vertical"
              onFinish={(values) => this.handleSignup(values)}
            >
              <Form.Item
                label="Username"
                name="username"
                rules={[
                  { required: true, message: 'Please enter username' },
                  { min: 3, message: 'Username must be at least 3 characters' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Enter username"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please enter full name' }]}
              >
                <Input
                  prefix={<UserAddOutlined />}
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
                rules={[
                  { required: true, message: 'Please enter password' },
                  { min: 6, message: 'Password must be at least 6 characters' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter password"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Passwords do not match'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm password"
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
                  style={{ marginBottom: '10px' }}
                >
                  SIGN UP
                </Button>
              </Form.Item>

              <Form.Item>
                <Button
                  block
                  onClick={() => this.props.navigate('/login')}
                >
                  Already have account? Login
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    );
  }

  handleSignup(values) {
    this.setState({ loading: true });
    const account = {
      username: values.username,
      password: values.password,
      name: values.name,
      phone: values.phone,
      email: values.email
    };
    this.apiSignup(account);
  }

  apiSignup(account) {
    axios
      .post('/api/customer/signup', account)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data && res.data.success !== false) {
          message.success(res.data.message || 'Sign up successfully! Please login.');
          this.props.navigate('/login');
        } else {
          message.error(res.data.message || 'Sign up failed!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error(error.response?.data?.message || 'An error occurred!');
      });
  }
}
export default withRouter(Signup);