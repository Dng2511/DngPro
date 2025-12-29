import React from "react";
import { useEffect, useState } from "react";
import { getMyOrders } from "../../services/Api";
import { currencyType } from "../../shared/constants/currency-type";
import { getImgProduct } from "../../shared/ultils";
import "./orders.css";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        getMyOrders().then(({ data }) => {
            if (data.status === 'success') {
                console.log(data);
                setOrders(data.data || []);
            } else {
                setError('Không thể lấy danh sách đơn hàng');
            }
        }).catch(err => {
            console.error(err);
            setError('Lỗi khi lấy đơn hàng');
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <div>Đang tải đơn hàng...</div>;
    if (error) return <div className="message-error">{error}</div>;

    return (
        <div className="orders-page">
            <h3>Đơn hàng của tôi</h3>
            {orders.length === 0 && <div>Chưa có đơn hàng nào</div>}
            {orders.map(order => (
                <div key={order._id} className="orders-card">
                    <div className="order-header">
                        <div className="order-meta">
                            <div className="order-id"><strong>Đơn:</strong> {order._id}</div>
                            <div style={{ fontSize: 12, color: '#666' }}><strong>Ngày:</strong> {new Date(order.createdAt).toLocaleString()}</div>
                        </div>

                        <div className="order-summary">
                            <div className="order-total">{currencyType(order.totalPrice)}</div>
                            <div style={{ fontSize: 12, color: '#666' }}>{order.method === 1 ? 'Thanh toán online' : 'Thanh toán khi nhận hàng'}</div>
                            <div style={{ fontSize: 13, marginTop: 6 }}>{order.status || '—'}</div>
                        </div>
                    </div>

                    <div className="order-items">
                        <strong>Sản phẩm:</strong>
                        {order.items.map(it => (
                            <div key={it._id} className="order-item">
                                <div className="order-img-wrap">
                                    <img src={getImgProduct(it.prd_id?.thumbnail)} alt={it.prd_id?.name || 'Sản phẩm'} />
                                </div>

                                <div className="order-item-info">
                                    <div className="product-name">{it.prd_id?.name || (it.prd_id || 'Sản phẩm')}</div>
                                    <div className="product-qty-price">Số lượng: {it.qty} — {currencyType(it.price)}</div>
                                </div>

                                <div className="product-line-total">{currencyType(it.qty * it.price)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Orders;
