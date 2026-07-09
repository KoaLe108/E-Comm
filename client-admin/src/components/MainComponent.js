import React, { Component } from 'react';
import { Layout } from 'antd';
import MyContext from '../contexts/MyContext';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Category from './CategoryComponent';
import Product from './ProductComponent';
import Order from './OrderComponent';
import Customer from './CustomerComponent';
import Dashboard from './DashboardComponent';
import { Routes, Route, Navigate } from 'react-router-dom';

class Main extends Component {
  static contextType = MyContext;

  render() {
    if (this.context.token !== '') {
      return (
        <Layout style={{ minHeight: '100vh' }}>
          <Menu />
          <Layout.Content
            style={{
              padding: '24px',
              background: '#f0f2f5',
            }}
          >
            <Routes>
              <Route path="/admin" element={<Navigate replace to="/admin/home" />} />
              <Route path="/admin/home" element={<Home />} />
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/product" element={<Product />} />
              <Route path="/admin/order" element={<Order />} />
              <Route path="/admin/customer" element={<Customer />} />
              <Route path="/admin/dashboard" element={<Dashboard />} />
            </Routes>
          </Layout.Content>
        </Layout>
      );
    }
    return <div />;
  }
}

export default Main;