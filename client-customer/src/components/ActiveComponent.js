import axios from 'axios';
import React, { Component } from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { LockOutlined, FileProtectOutlined } from '@ant-design/icons';

class Active extends Component {
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
              <FileProtectOutlined /> Activate Account
            </h2>

            <Form
              ref={this.formRef}
              layout="vertical"
              onFinish={(values) => this.handleActive(values)}
            >
              <Form.Item
                label="Account ID"
                name="id"
                rules={[{ required: true, message: 'Please enter account ID' }]}
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder="Enter your account ID"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                label="Activation Token"
                name="token"
                rules={[{ required: true, message: 'Please enter activation token' }]}
              >
                <Input.TextArea
                  placeholder="Enter your activation token"
                  rows={4}
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
                  ACTIVATE ACCOUNT
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    );
  }

  handleActive(values) {
    this.setState({ loading: true });
    this.apiActive(values.id, values.token);
  }

  apiActive(id, token) {
    const body = { id, token };
    axios
      .post('/api/customer/active', body)
      .then((res) => {
        this.setState({ loading: false });
        if (res.data && res.data.success !== false) {
          message.success(res.data.message || 'Account activated successfully!');
          this.formRef.current?.resetFields();
        } else {
          message.error(res.data.message || 'Activation failed!');
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        message.error(error.response?.data?.message || 'An error occurred!');
      });
  }
}
export default Active;
