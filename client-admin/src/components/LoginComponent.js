import axios from 'axios';
import React, { Component } from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';

class Login extends Component {
  static contextType = MyContext;
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  render() {
    if (this.context.token === '') {
      return (
        <Row
          justify="center"
          align="middle"
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
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
                KTK MOTOR ADMIN
              </h2>

              <Form
                ref={this.formRef}
                layout="vertical"
                onFinish={(values) => this.handleLogin(values)}
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: 'Please enter username' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="Username"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: 'Please enter password' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="Password"
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
                    LOGIN
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      );
    }
    return <div />;
  }

  handleLogin(values) {
    this.setState({ loading: true });
    const account = { username: values.username, password: values.password };
    this.apiLogin(account);
  }

  apiLogin(account) {
    axios
      .post('/api/admin/login', account)
      .then((res) => {
        this.setState({ loading: false });
        const result = res.data;
        if (result.success === true) {
          this.context.setToken(result.token);
          this.context.setUsername(account.username);
          message.success('Login successful');
        } else {
          message.error(result.message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.error('Login error:', error);
        message.error(
          'Login error: ' +
            (error.response?.data?.message || error.message || 'Unknown error')
        );
      });
  }
}

export default Login;