import axios from 'axios';
import React, { Component } from 'react';
import { Layout, Menu, Input, Button, Dropdown } from 'antd';
import { HomeOutlined, SearchOutlined, LogoutOutlined, UserOutlined, FileProtectOutlined } from '@ant-design/icons';
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
                    background: '#001529',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    minHeight: 'auto',
                    flexWrap: 'wrap',
                    rowGap: '8px',
                }}
            >
                <Menu
                    mode="horizontal"
                    items={menuItems}
                    style={{
                        flex: '1 1 100px',
                        minWidth: '100px',
                        background: 'transparent',
                        border: 'none',
                        overflow: 'visible',
                    }}
                    theme="dark"
                />

                {/* Auth Section - moved to Home component */}
                {this.context.token ? (
                    <Dropdown
                        menu={{ items: userMenuItems }}
                        placement="bottomRight"
                        trigger={['click']}
                    >
                        <Button type="primary" icon={<UserOutlined />} style={{ whiteSpace: 'nowrap' }}>
                            {this.context.customer?.name || 'User'}
                        </Button>
                    </Dropdown>
                ) : null}

                <form
                    className="header-search"
                    style={{
                        display: 'flex',
                        gap: '4px',
                        marginRight: '0',
                        flexWrap: 'wrap',
                        width: 'auto',
                        minWidth: '0',
                        order: 2,
                        zIndex: 1
                    }}
                    onSubmit={(e) => this.btnSearchClick(e)}
                >
                    <Input
                        placeholder="Enter keyword"
                        value={this.state.txtKeyword}
                        onChange={(e) => this.setState({ txtKeyword: e.target.value })}
                        style={{ width: '150px', minWidth: '100px' }}
                    />
                    <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        htmlType="submit"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        SEARCH
                    </Button>
                </form>
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
