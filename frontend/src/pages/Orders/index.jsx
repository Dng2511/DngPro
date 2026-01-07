import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyOrders } from "../../services/Api";
import { currencyType } from "../../shared/constants/currency-type";
import { getImgProduct } from "../../shared/ultils";
import { useAuth } from "../../hooks/useAuth";
import "./orders.css";

const Orders = () => {
    const navigate = useNavigate();
    const { isLoggedIn, isLoading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const STATUS_OPTIONS = [
        { value: 0, label: "Chờ xác nhận", color: "default" },
        { value: 1, label: "Đang chuẩn bị hàng", color: "processing" },
        { value: 2, label: "Đang giao hàng", color: "warning" },
        { value: 3, label: "Thành công", color: "success" },
        { value: 4, label: "Hủy đơn", color: "error" },
    ];

    useEffect(() => {
        if (authLoading) return;
        
        if (!isLoggedIn) {
            setLoading(false);
            return;
        }

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
    }, [authLoading, isLoggedIn]);

    if (authLoading) return <div>Đang tải...</div>;

    if (!isLoggedIn) {
        return (
            <div className="orders-page">
                <h3>Đơn hàng của tôi</h3>
                <div className="login-required-container">
                    <div className="login-required-content">
                        <div className="login-icon">📦</div>
                        <h2>Theo dõi đơn hàng của bạn</h2>
                        <p className="login-message">Bạn cần đăng nhập để xem và theo dõi các đơn hàng của mình</p>
                        <button 
                            onClick={() => navigate('/login')} 
                            className="login-btn"
                        >
                            Đăng nhập ngay
                        </button>
                        <div className="register-prompt">
                            Chưa có tài khoản? 
                            <button 
                                onClick={() => navigate('/register')} 
                                className="register-link"
                            >
                                Đăng ký tại đây
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) return (
        <div className="orders-page">
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Đang tải đơn hàng...</p>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="orders-page">
            <div className="error-container">
                <div className="error-icon">⚠️</div>
                <h3>Lỗi</h3>
                <p>{error}</p>
            </div>
        </div>
    );

    return (
        <div className="orders-page">
            <div className="orders-header">
                <h1>Đơn hàng của tôi</h1>
                <p className="orders-subtitle">Theo dõi trạng thái các đơn hàng của bạn</p>
            </div>

            {orders.length === 0 ? (
                <div className="empty-orders-container">
                    <div className="empty-icon">🛒</div>
                    <h3>Chưa có đơn hàng</h3>
                    <p>Bạn chưa có đơn hàng nào. Hãy tiếp tục mua sắm!</p>
                    <button onClick={() => navigate('/')} className="continue-shopping-btn">
                        Tiếp tục mua sắm
                    </button>
                </div>
            ) : (
                <div className="orders-container">
                    {orders.map(order => (
                        <div key={order._id} className="orders-card">
                            <div className="order-header">
                                <div className="order-info-left">
                                    <div className="order-id-badge">
                                        <span className="badge-label">Mã đơn</span>
                                        <span className="badge-value">{order._id.slice(-8).toUpperCase()}</span>
                                    </div>
                                    <div className="order-date">
                                        <span className="date-icon">📅</span>
                                        {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </div>
                                </div>

                                <div className="order-status-badge" data-status={order.status}>
                                    <span className="status-icon">
                                        {order.status === 0 && '⏳'}
                                        {order.status === 1 && '📦'}
                                        {order.status === 2 && '🚚'}
                                        {order.status === 3 && '✅'}
                                        {order.status === 4 && '❌'}
                                    </span>
                                    <span className="status-text">{STATUS_OPTIONS[order.status].label}</span>
                                </div>
                            </div>

                            <div className="order-body">
                                <div className="order-items-section">
                                    <h4 className="section-title">Sản phẩm</h4>
                                    <div className="order-items">
                                        {order.items.map(it => (
                                            <div key={it._id} className="order-item">
                                                <div className="order-img-wrap">
                                                    <img src={getImgProduct(it.prd_id?.thumbnail)} alt={it.prd_id?.name || 'Sản phẩm'} />
                                                </div>

                                                <div className="order-item-content">
                                                    <div className="item-name">{it.prd_id?.name || 'Sản phẩm'}</div>
                                                    <div className="item-details">
                                                        <span className="qty">x{it.qty}</span>
                                                        <span className="price">{currencyType(it.price)}</span>
                                                    </div>
                                                </div>

                                                <div className="item-total">{currencyType(it.qty * it.price)}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="order-summary-section">
                                    <div className="summary-item">
                                        <span className="summary-label">Phương thức:</span>
                                        <span className="summary-value">
                                            {order.method === 1 ? '💳 Thanh toán online' : '💰 Thanh toán khi nhận'}
                                        </span>
                                    </div>
                                    <div className="summary-item total-row">
                                        <span className="summary-label">Tổng cộng:</span>
                                        <span className="summary-value total-amount">{currencyType(order.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders;
