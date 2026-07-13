import axios from 'axios';
import React, { Component } from 'react';
import { Layout, Menu, Input, Button, Dropdown, Avatar, Space, Badge } from 'antd';
import { HomeOutlined, SearchOutlined, LogoutOutlined, UserOutlined, FileProtectOutlined, LoginOutlined, UserAddOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import withRouter from '../utils/withRouter';
import MyContext from '../contexts/MyContext';

class MenuComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: [],
            txtKeyword: ''
        };
    }

    static contextType = MyContext;

    render() {
        const menuItems = [
            {
                key: 'home',
                icon: <HomeOutlined />,
                label: 'Home',
                onClick: () => this.props.navigate('/'),
            },
            ...this.state.categories.map((cat) => ({
                key: cat._id,
                label: cat.name,
                onClick: () => this.props.navigate('/product/category/' + cat._id),
            })),
        ];

        // Menu items cho khách chưa login
        const guestMenuItems = [
            {
                key: 'login',
                icon: <LoginOutlined />,
                label: 'Login',
                onClick: () => this.props.navigate('/login'),
            },
            {
                key: 'signup',
                icon: <UserAddOutlined />,
                label: 'Sign Up',
                onClick: () => this.props.navigate('/signup'),
            },
            {
                key: 'active',
                icon: <FileProtectOutlined />,
                label: 'Activate Account',
                onClick: () => this.props.navigate('/active'),
            },
        ];

        // Menu items cho user đã login
        const userMenuItems = [
            ...(this.context.customer?.active === 0 ? [{
                key: 'active',
                icon: <FileProtectOutlined />,
                label: 'Activate Account',
                onClick: () => this.props.navigate('/active'),
            }] : []),
            {
                key: 'profile',
                icon: <UserOutlined />,
                label: 'My Profile',
                onClick: () => this.props.navigate('/myprofile'),
            },
            {
                key: 'myorders',
                label: 'My Orders',
                onClick: () => this.props.navigate('/myorders'),
            },
            {
                key: 'mycart',
                label: 'My Cart',
                onClick: () => this.props.navigate('/mycart'),
            },
            {
                type: 'divider',
            },
            {
                key: 'logout',
                danger: true,
                icon: <LogoutOutlined />,
                label: 'Logout',
                onClick: () => this.btnLogoutClick(),
            },
        ];

        return (
            <Layout.Header
                className="customer-header"
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#ffffff',
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    height: '70px',
                    lineHeight: '70px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderBottom: '1px solid #f0f0f0',
                    flexWrap: 'wrap',
                    rowGap: '8px',
                    position: 'sticky',
                    top: 0,
                    zIndex: 1000
                }}
            >
                {/* Logo Section */}
                <div 
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginRight: '24px',
                        cursor: 'pointer' 
                    }}
                    onClick={() => this.props.navigate('/')}
                >
                    <span style={{ 
                        fontSize: '22px', 
                        fontWeight: '800', 
                        color: '#1890ff', 
                        letterSpacing: '1.5px',
                        fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }}>
                        KTK MOTOR
                    </span>
                </div>

                {/* Categories Menu */}
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    style={{
                        flex: '1 1 auto',
                        background: 'transparent',
                        border: 'none',
                        lineHeight: '70px',
                        fontSize: '15px',
                        fontWeight: '500',
                    }}
                    theme="light"
                />

                {/* Right Side Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', height: '70px' }}>
                    {/* Search Bar */}
                    <form
                        onSubmit={(e) => this.btnSearchClick(e)}
                        style={{ display: 'flex', alignItems: 'center' }}
                    >
                        <Input
                            placeholder="Search motorbikes..."
                            value={this.state.txtKeyword}
                            onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                            style={{ 
                                width: '200px', 
                                borderRadius: '20px',
                                background: '#f5f5f5',
                                border: 'none',
                                padding: '6px 12px'
                            }}
                        />
                    </form>

                    {/* Cart Icon with Badge */}
                    <Badge count={this.context.mycart ? this.context.mycart.length : 0} showZero={false} offset={[5, -5]}>
                        <Button
                            type="text"
                            icon={<ShoppingCartOutlined style={{ fontSize: '22px', color: '#333' }} />}
                            onClick={() => this.props.navigate('/mycart')}
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                padding: '8px',
                                height: 'auto',
                                width: 'auto',
                                borderRadius: '50%',
                                background: '#f5f5f5'
                            }}
                        />
                    </Badge>

                    {/* User Profile */}
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {this.context.token ? (
                            <Dropdown
                                menu={{ items: userMenuItems }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Button 
                                    type="text" 
                                    style={{ 
                                        color: '#333', 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '8px',
                                        height: 'auto',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        background: '#f5f5f5'
                                    }}
                                >
                                    <Avatar 
                                        style={{ backgroundColor: '#1890ff' }} 
                                        icon={<UserOutlined />} 
                                    />
                                    <span className="user-name" style={{ maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: '500' }}>
                                        {this.context.customer?.name || 'User'}
                                    </span>
                                </Button>
                            </Dropdown>
                        ) : (
                            <Dropdown
                                menu={{ items: guestMenuItems }}
                                placement="bottomRight"
                                trigger={['click']}
                            >
                                <Button 
                                    type="text" 
                                    style={{ 
                                        padding: '4px',
                                        height: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        borderRadius: '50%',
                                        background: '#f5f5f5'
                                    }}
                                >
                                    <Avatar 
                                        style={{ backgroundColor: '#87d068' }} 
                                        icon={<UserOutlined />} 
                                    />
                                </Button>
                            </Dropdown>
                        )}
                    </div>
                </div>
            </Layout.Header>
        );
    }

    componentDidMount() {
        this.apiGetCategories();
    }

    // event-handlers
    btnSearchClick(e) {
        e.preventDefault();
        if (this.state.txtKeyword.trim()) {
            this.props.navigate('/product/search/' + this.state.txtKeyword);
        }
    }

    btnLogoutClick() {
        this.context.setToken('');
        this.context.setCustomer(null);
        this.context.setMycart([]);
        this.props.navigate('/');
    }

    // apis
    apiGetCategories() {
        axios.get('/api/customer/categories').then((res) => {
            this.setState({ categories: res.data });
        });
    }
}

export default withRouter(MenuComponent);
