import axios from 'axios';
import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, message, Avatar } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import withRouter from '../utils/withRouter';

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
    return (
      <Row style={{ minHeight: '85vh', background: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
        {/* Left column: Brand/Image section (visible on md and up) */}
        <Col xs={0} md={12} style={{ 
          position: 'relative',
          background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.45)), url('/hero_banner.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '48px',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ maxWidth: '450px', zIndex: 2, fontFamily: "'Outfit', sans-serif" }}>
            <h1 style={{ color: 'white', fontSize: '42px', fontWeight: '800', marginBottom: '16px', letterSpacing: '2px' }}>
              KTK MOTOR
            </h1>
            <p style={{ fontSize: '18px', lineHeight: '1.6', opacity: '0.9', fontWeight: '300' }}>
              Join our community of riders and experience the ultimate premium service.
            </p>
          </div>
        </Col>

        {/* Right column: Login form section */}
        <Col xs={24} md={12} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: '48px 24px',
          background: '#f9f9f9'
        }}>
          <div style={{ width: '100%', maxWidth: '360px' }}>
            <div style={{ marginBottom: '32px', textAlign: 'center' }}>
              <span style={{ 
                fontSize: '26px', 
                fontWeight: '800', 
                color: '#1a1a1a', 
                letterSpacing: '1.5px',
                fontFamily: "'Outfit', sans-serif",
                display: 'block',
                marginBottom: '8px'
              }}>
                KTK MOTOR
              </span>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#434343', margin: 0 }}>
                Welcome Back
              </h2>
              <p style={{ color: '#8c8c8c', marginTop: '4px', fontSize: '14px' }}>
                Please enter your details to sign in
              </p>
            </div>

            <Form
              ref={this.formRef}
              layout="vertical"
              onFinish={(values) => this.handleLogin(values)}
              initialValues={{
                username: 'sonkk',
                password: '123'
              }}
              requiredMark={false}
            >
              <Form.Item
                name="username"
                label={<span style={{ fontWeight: '500', color: '#555' }}>Username</span>}
                rules={[{ required: true, message: 'Please enter username' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Username"
                  size="large"
                  style={{ borderRadius: '8px', background: '#fff' }}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label={<span style={{ fontWeight: '500', color: '#555' }}>Password</span>}
                rules={[{ required: true, message: 'Please enter password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="Password"
                  size="large"
                  style={{ borderRadius: '8px', background: '#fff' }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: '32px' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={this.state.loading}
                  style={{ 
                    borderRadius: '8px', 
                    background: '#1a1a1a', 
                    borderColor: '#1a1a1a',
                    fontWeight: '700',
                    height: '46px',
                    fontSize: '16px',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                  }}
                >
                  Sign In
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '14px', color: '#555' }}>
              <div>
                Don't have an account?{' '}
                <span 
                  onClick={() => this.props.navigate('/signup')}
                  style={{ color: '#1890ff', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Sign Up
                </span>
              </div>
              <div style={{ marginTop: '12px' }}>
                Need to activate your account?{' '}
                <span 
                  onClick={() => this.props.navigate('/active')}
                  style={{ color: '#1890ff', fontWeight: '600', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Activate Now
                </span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  handleLogin(values) {
    this.setState({ loading: true });
    const account = { username: values.username, password: values.password };
    this.apiLogin(account);
  }

  apiLogin(account) {
    axios
      .post('/api/customer/login', account)
      .then((res) => {
        this.setState({ loading: false });
        const result = res.data;
        if (result.success === true) {
          this.context.setToken(result.token);
          this.context.setCustomer(result.customer);
          message.success('Login successful');
          this.props.navigate('/home');
        } else {
          message.error(result.message);
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error('Login error: ' + (error.response?.data?.message || error.message));
      });
  }
}

export default withRouter(Login);
