import React, { Component } from 'react';
import axios from 'axios';
import { Card, Row, Col, Button, Spin, Table, message } from 'antd';
import { FilePdfOutlined } from '@ant-design/icons';
import MyContext from '../contexts/MyContext';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

class Dashboard extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.dashboardRef = React.createRef();
    this.state = {
      revenue: { month: [], quarter: [], year: [] },
      newestProducts: [],
      topProducts: [],
      loading: true,
      error: null
    };
  }

  componentDidMount() {
    this.apiGetDashboard();
  }

  apiGetDashboard() {
    const config = { headers: { 'x-access-token': this.context.token } };

    Promise.all([
      axios.get('/api/admin/dashboard/revenue', config),
      axios.get('/api/admin/dashboard/products/newest?limit=5', config),
      axios.get('/api/admin/dashboard/products/top?limit=5', config)
    ])
      .then(([revenueRes, newestRes, topRes]) => {
        this.setState({
          revenue: revenueRes.data,
          newestProducts: newestRes.data,
          topProducts: topRes.data,
          loading: false,
          error: null
        });
      })
      .catch((err) => {
        console.error('Dashboard API error:', err);
        this.setState({ loading: false, error: 'Không thể lấy dữ liệu dashboard' });
      });
  }

  async exportToPdf() {
    if (!this.dashboardRef.current) {
      message.error('Dashboard not ready for export');
      return;
    }

    try {
      const element = this.dashboardRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      let position = 10;

      pdf.setFontSize(20);
      pdf.text('KTK Motor - Báo cáo Dashboard', 10, 20);
      pdf.setFontSize(12);
      const currentDate = new Date().toLocaleDateString('vi-VN');
      pdf.text(`Ngày xuất: ${currentDate}`, 10, 30);
      position = 40;

      if (imgHeight < pageHeight - position) {
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      } else {
        const ratio = (pageWidth - 20) / imgProps.width;
        const totalPages = Math.ceil((imgProps.height * ratio) / (pageHeight - position));
        for (let page = 0; page < totalPages; page += 1) {
          const sourceY = page * (pageHeight - position) / ratio;
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = canvas.width;
          pageCanvas.height = Math.min(canvas.height - sourceY, (pageHeight - position) / ratio);
          const ctx = pageCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, -sourceY, canvas.width, canvas.height);
          const pageImgData = pageCanvas.toDataURL('image/png');
          if (page > 0) pdf.addPage();
          pdf.addImage(pageImgData, 'PNG', 10, page === 0 ? position : 10, imgWidth, Math.min(imgHeight, pageHeight - (page === 0 ? position : 10)));
        }
      }

      pdf.save('dashboard-report.pdf');
      message.success('Dashboard exported successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      message.error('Failed to export PDF');
    }
  }

  buildChartData(revenue, label, color) {
    return {
      labels: revenue.map(item => item.period),
      datasets: [
        {
          label,
          data: revenue.map(item => item.total),
          backgroundColor: color,
          borderColor: color,
          borderWidth: 2,
          tension: 0.3,
          fill: false
        }
      ]
    };
  }

  render() {
    const { revenue, newestProducts, topProducts, loading, error } = this.state;
    const monthData = this.buildChartData(revenue.month, 'Monthly Revenue', 'rgba(54, 162, 235, 0.7)');
    const quarterData = this.buildChartData(revenue.quarter, 'Quarterly Revenue', 'rgba(75, 192, 192, 0.7)');
    const yearData = this.buildChartData(revenue.year, 'Yearly Revenue', 'rgba(255, 159, 64, 0.7)');

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'top' },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: value => value.toLocaleString('vi-VN') + ' vnđ'
          }
        }
      }
    };

    const productColumns = [
      {
        title: 'Product Name',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render: (price) => <span>{Number(price).toLocaleString('vi-VN')} vnđ</span>,
      },
    ];

    return (
      <Spin spinning={loading}>
        <div ref={this.dashboardRef}>
          <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={24} md={24} lg={24}>
              <Card
                title="Admin Dashboard"
                extra={
                  <Button
                    type="primary"
                    icon={<FilePdfOutlined />}
                    onClick={() => this.exportToPdf()}
                  >
                    Export PDF
                  </Button>
                }
              >
                {error && <div style={{ color: 'red' }}>{error}</div>}
              </Card>
            </Col>
          </Row>

          {!loading && !error && (
            <>
              {/* Revenue Charts */}
              <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={24} md={8}>
                  <Card title="Monthly Revenue">
                    <Line data={monthData} options={chartOptions} />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Card title="Quarterly Revenue">
                    <Bar data={quarterData} options={chartOptions} />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={8}>
                  <Card title="Yearly Revenue">
                    <Bar data={yearData} options={chartOptions} />
                  </Card>
                </Col>
              </Row>

              {/* Product Lists */}
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={24} md={12}>
                  <Card title="Newest Products">
                    <Table
                      columns={productColumns}
                      dataSource={newestProducts.map((item) => ({
                        ...item,
                        key: item._id,
                      }))}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Card title="Top Selling Products">
                    <Table
                      columns={productColumns}
                      dataSource={topProducts.map((item) => ({
                        ...item,
                        key: item._id,
                      }))}
                      pagination={false}
                      size="small"
                    />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Spin>
    );
  }
}

export default Dashboard;
