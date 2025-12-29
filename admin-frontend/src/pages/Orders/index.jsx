import React from "react";
import OrderDetail from "./OrderDetail";
import { Table, Tag } from "antd";
import { getOrders } from "../../shared/api/api";


const Orders = () => {
    const [orders, setOrders] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [page, setPage] = React.useState(1);
    const [openDetail, setOpenDetail] = React.useState(false);
    const [selectedOrder, setSelectedOrder] = React.useState(null);
    const [total, setTotal] = React.useState(0);


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

    const columns = [
        {
            title: "Mã đơn",
            dataIndex: "_id",
            key: "_id",
            render: (id) => id.slice(-6).toUpperCase(),
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
            ellipsis: true,
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
                onRow={(record) => ({
                    onClick: () => handleView(record),
                })}
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

