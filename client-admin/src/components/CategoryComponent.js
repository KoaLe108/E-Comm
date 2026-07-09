import axios from 'axios';
import React, { Component } from 'react';
import { Table, Button, Modal, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';

class Category extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
      showDetail: false,
      loading: false
    };
  }

  render() {
    const columns = [
      {
        title: 'ID',
        dataIndex: '_id',
        key: '_id',
        width: '50%',
        ellipsis: true,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '30%',
      },
      {
        title: 'Action',
        key: 'action',
        width: '20%',
        render: (_, record) => (
          <Button type="link" onClick={() => this.trItemClick(record)}>
            Edit
          </Button>
        ),
      },
    ];

    return (
      <div>
        <Card
          title="Cửa hàng xe máy KTK"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => this.handleAddNew()}
            >
              ADD NEW CATEGORY
            </Button>
          }
        >
          <Table
            columns={columns}
            dataSource={this.state.categories.map((item) => ({
              ...item,
              key: item._id,
            }))}
            loading={this.state.loading}
            pagination={false}
          />
        </Card>

        {this.state.showDetail && (
          <Modal
            title="Category Detail"
            open={this.state.showDetail}
            onCancel={() => this.closeDetail()}
            footer={null}
            width={600}
          >
            <CategoryDetail
              item={this.state.itemSelected}
              updateCategories={this.updateCategories}
              onClose={() => this.closeDetail()}
            />
          </Modal>
        )}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  // event-handlers
  handleAddNew() {
    this.setState({
      itemSelected: { _id: '', name: '' },
      showDetail: true,
    });
  }

  trItemClick(item) {
    this.setState({ itemSelected: item, showDetail: true });
  }

  closeDetail() {
    this.setState({ showDetail: false, itemSelected: null });
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };

  // apis
  apiGetCategories() {
    this.setState({ loading: true });
    const config = { headers: { 'x-access-token': this.context.token } };
    axios
      .get('/api/admin/categories', config)
      .then((res) => {
        this.setState({ categories: res.data, loading: false });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  }
}

export default Category;