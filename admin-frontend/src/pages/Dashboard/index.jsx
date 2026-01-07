import React, { useEffect, useMemo, useState } from 'react';
import { Row, Col, Card, Statistic, Spin, Select } from 'antd';
import { Line } from '@ant-design/plots';
import { getDashboard } from '../../shared/api/api';



const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [dashboard, setDashboard] = useState(null);
    const [range, setRange] = useState(3); // 3 | 6 | 12 tháng
    const { Option } = Select;

    useEffect(() => {
        getDashboard().then((response) => {
            setDashboard(response.data.data);
            setLoading(false);
        });
    }, []);

    const revenueData = useMemo(() => {
        if (!dashboard?.revenue?.byMonth) return [];

        return dashboard.revenue.byMonth
            .slice(-range) // lấy N tháng cuối
            .map(item => ({
                month: item.month,
                total: item.total,
            }));
    }, [dashboard, range]);

    const chartConfig = {
        data: revenueData,
        xField: 'month',
        yField: 'total',
        smooth: true,
        point: { size: 5 },

        axis: {
            y: {
                labelFormatter: (v) => `${Number(v).toLocaleString('vi-VN')} ₫`,
            },
        },
        tooltip: {
            title: 'month',
            items: ['total'],
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin />
            </div>
        );
    }

    return (
        <div>
            <h2>Dashboard</h2>

            {/* Thống kê tổng */}
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Products" value={dashboard.products} />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic title="Categories" value={dashboard.categories} />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card>
                        <Statistic title="Users" value={dashboard.users} />
                    </Card>
                </Col>


            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Revenue (This Month)"
                            value={dashboard.revenue.thisMonth}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')} ₫`}
                        />
                    </Card>
                </Col>

                <Col span={12}>
                    <Card>
                        <Statistic
                            title="Revenue (This Year)"
                            value={dashboard.revenue.thisYear}
                            formatter={(v) => `${Number(v).toLocaleString('vi-VN')} ₫`}
                        />
                    </Card>
                </Col>
            </Row>


            {/* Biểu đồ doanh thu */}
            <Card
                title="Revenue by Month"
                style={{ marginTop: 24 }}
                extra={
                    <Select
                        value={range}
                        onChange={setRange}
                        style={{ width: 160 }}
                    >
                        <Option value={3}>Last 3 months</Option>
                        <Option value={6}>Last 6 months</Option>
                        <Option value={12}>Last 12 months</Option>
                    </Select>
                }
            >
                <Line {...chartConfig} />
            </Card>

            {/* Quick actions */}
            <div style={{ marginTop: 24 }}>
                <Card title="Quick actions">
                    <p>Use the side menu to manage categories, products and users.</p>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
