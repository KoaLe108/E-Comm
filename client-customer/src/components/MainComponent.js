import React, { Component } from 'react';
import { Layout } from 'antd';
import { Routes, Route, Navigate } from 'react-router-dom';
import Menu from './MenuComponent';
import Home from './HomeComponent';
import Product from './ProductComponent';
import ProductDetail from './ProductDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mycart from './MycartComponent';
import Myorders from './MyordersComponent';
import Checkout from './CheckoutComponent';

class Main extends Component {
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Menu />
                <Layout.Content
                    style={{
                        padding: '24px',
                        background: '#f0f2f5',
                        paddingLeft: '12px',
                        paddingRight: '12px',
                    }}
                >
                    <Routes>
                        <Route path='/' element={<Navigate replace to='/home' />} />
                        <Route path='/home' element={<Home />} />
                        <Route path='/product/category/:cid' element={<Product />} />
                        <Route path='/product/search/:keyword' element={<Product />} />
                        <Route path='/product/:id' element={<ProductDetail />} />
                        <Route path='/signup' element={<Signup />} />
                        <Route path='/active' element={<Active />} />
                        <Route path='/login' element={<Login />} />
                        <Route path='/myprofile' element={<Myprofile />} />
                        <Route path='/mycart' element={<Mycart />} />
                        <Route path='/myorders' element={<Myorders />} />
                        <Route path='/checkout' element={<Checkout />} />
                    </Routes>
                </Layout.Content>
            </Layout>
        );
    }
}
export default Main;
