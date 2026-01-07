import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { useEffect, useState } from "react";
import { getMyOrders } from "../../../services/Api";

const Sidebar = () => {
    const navigate = useNavigate();
    const items = useSelector(({ cart }) => cart.items || []);
    const { isLoggedIn } = useAuth();
    const [ordersCount, setOrdersCount] = useState(null);
    const location = useLocation();
    useEffect(() => {
        if (!isLoggedIn) return;
        const path = location.pathname || '';
        if (path === '/success' || path === '/payment-success') {
            getMyOrders().then(({ data }) => {
                if (data.status === 'success') setOrdersCount((data.data || []).length);
                console.log(data.data);
                
            }).catch(() => setOrdersCount(null));
        }
    }, [location.pathname, isLoggedIn]);

    return (
        <>
            <div id="sidebar" className="col-lg-4 d-none d-lg-block">
                <div className="sidebar-top card p-3" style={{ marginBottom: 12, cursor: 'default' }}>
                    {/* Stacked large container for Cart + Orders */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div className="p-3" style={{ background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: 'pointer' }} onClick={() => navigate('/cart')}>
                            <div style={{ fontWeight: 500, fontSize: 18 }}>Giỏ hàng</div>
                            <div style={{ color: '#666', marginTop: 6 }}>{items.length} sản phẩm</div>
                        </div>
                        <div className="p-3" style={{ background: '#fff', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', cursor: isLoggedIn ? 'pointer' : 'default' }} onClick={() => isLoggedIn && navigate('/orders')}>
                            <div style={{ fontWeight: 500, fontSize: 18 }}>Đơn hàng</div>
                        </div>
                    </div>
                </div>

                <div id="banner">
                    <div className="banner-item">
                        <a href="#"><img className="img-fluid" src="images/banner-1.png" /></a>
                    </div>
                    <div className="banner-item">
                        <a href="#"><img className="img-fluid" src="images/banner-2.png" /></a>
                    </div>
                    <div className="banner-item">
                        <a href="#"><img className="img-fluid" src="images/banner-3.png" /></a>
                    </div>
                    <div className="banner-item">
                        <a href="#"><img className="img-fluid" src="images/banner-4.png" /></a>
                    </div>
                    <div className="banner-item">
                        <a href="#"><img className="img-fluid" src="images/banner-5.png" /></a>
                    </div>
                    <div className="banner-item">
                        <a href="#"><img className="img-fluid" src="images/banner-6.png" /></a>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Sidebar;