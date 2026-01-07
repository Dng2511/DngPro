import React from "react";
import OrderDetail from "./OrderDetail";
import { Table, Tag, Select, Button } from "antd";
import { getOrders, updateOrderStatus } from "../../shared/api/api";
import { EditOutlined } from "@ant-design/icons";


const Orders = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [openDetail, setOpenDetail] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [total, setTotal] = React.useState(0);

    const STATUS_OPTIONS = [
        { value: 0, label: "Chờ xác nhận", color: "default" },
        { value: 1, label: "Đang chuẩn bị hàng", color: "processing" },
        { value: 2, label: "Đang giao hàng", color: "warning" },
        { value: 3, label: "Thành công", color: "success" },
        { value: 4, label: "Hủy đơn", color: "error" },
    ];


    React.useEffect(() => {
        setLoading(true);
        getOrders({ params: { page: page, limit: 10 } }).then(({ data }) => {
            if (data.status === 'success') {
                setOrders(data.data || []);
                setTotal(data.pages.totalRows || 0);
            } else {
                setError('Không thể lấy danh sách đơn hàng');
            }
        }).catch(err => {
            console.error(err);
            setError('Lỗi khi lấy đơn hàng');
        }).finally(() => setLoading(false));
    }, [page]);

    if (loading) return <div>Đang tải đơn hàng...</div>;
    if (error) return <div className="message-error">{error}</div>;

    const handleChangePage = (pagination) => {
        setPage(pagination.current);
    };

    const handleView = (order) => {
        setSelectedOrder(order);

        setOpenDetail(true);
    };

    const handleChangeStatus = async (id, newStatus) => {
        try {
            await updateOrderStatus(id, { status: newStatus });

            setOrders(prev =>
                prev.map(order =>
                    order._id === id
                        ? { ...order, status: newStatus }
                        : order
                )
            );
        } catch (error) {
            console.error(error);
        }
    };

    const columns = [
        {
            title: "ID",
            width: 60,
            render: (_, __, index) =>
                (page - 1) * 10 + index + 1,
        },
        {
            title: "Khách hàng",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "SĐT",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "Địa chỉ",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Tổng tiền",
            dataIndex: "totalPrice",
            key: "totalPrice",
            align: "right",
            render: (price) =>
                price.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }),
        },
        {
            title: "Thanh toán",
            dataIndex: "method",
            key: "method",
            render: (method) =>
                method === 1 ? (
                    <Tag color="blue">VNPay</Tag>
                ) : (
                    <Tag color="green">COD</Tag>
                ),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 200,
            render: (status, record) => (
                <Select
                    value={status}
                    style={{ width: 180 }}
                    onChange={(value) => handleChangeStatus(record._id, value)}
                    options={STATUS_OPTIONS}
                />
            )
        },
        {
            title: "Hành động",
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleView(record)}
                />
            )
        }
    ];

    return (
        <div>
            <h2>Orders</h2>
            <Table
                dataSource={orders}
                columns={columns}
                rowKey={(record) => record._id}
                pagination={{
                    current: page,
                    pageSize: 10,
                    total: total,
                }}
                onChange={handleChangePage}
            />
            <OrderDetail
                open={openDetail}
                onCancel={() => setOpenDetail(false)}
                data={selectedOrder}
            />
        </div>
    );
}

export default Orders;

